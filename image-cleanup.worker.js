import * as ort from "onnxruntime-web/wasm";

const MODEL_URL = "https://huggingface.co/Carve/LaMa-ONNX/resolve/main/lama_fp32.onnx";
const MODEL_CACHE = "manniu-ai-models-v1";
const MODEL_SIZE = 208 * 1024 * 1024;
const INPUT_SIZE = 512;
let sessionPromise;

ort.env.wasm.proxy = false;
ort.env.wasm.numThreads = 1;
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/";

async function fetchWithProgress(url) {
  const cache = "caches" in self ? await caches.open(MODEL_CACHE) : null;
  const cached = cache ? await cache.match(url) : null;
  if (cached) {
    self.postMessage({ type: "model-progress", progress: 100, cached: true });
    return cached.arrayBuffer();
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`模型下载失败 (${response.status})`);
  const total = Number(response.headers.get("content-length")) || MODEL_SIZE;
  if (!response.body) {
    const buffer = await response.arrayBuffer();
    if (cache) await cache.put(url, new Response(buffer, { headers: { "content-type": "application/octet-stream" } }));
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let loaded = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    self.postMessage({ type: "model-progress", progress: Math.min(99, (loaded / total) * 100), loaded, total });
  }
  const buffer = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  if (cache) {
    await cache.put(url, new Response(buffer.slice().buffer, { headers: { "content-type": "application/octet-stream" } }));
  }
  return buffer.buffer;
}

function loadSession() {
  if (!sessionPromise) {
    sessionPromise = fetchWithProgress(MODEL_URL)
      .then((model) => ort.InferenceSession.create(model, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      }))
      .catch((error) => {
        sessionPromise = undefined;
        throw error;
      });
  }
  return sessionPromise;
}

async function decodeBlob(buffer, mimeType) {
  const blob = new Blob([buffer], { type: mimeType || "image/png" });
  return createImageBitmap(blob);
}

function tensorInputs(imageData, maskData) {
  const pixels = INPUT_SIZE * INPUT_SIZE;
  const image = new Float32Array(pixels * 3);
  const mask = new Float32Array(pixels);
  for (let index = 0; index < pixels; index += 1) {
    const source = index * 4;
    image[index] = imageData.data[source] / 255;
    image[pixels + index] = imageData.data[source + 1] / 255;
    image[(pixels * 2) + index] = imageData.data[source + 2] / 255;
    mask[index] = maskData.data[source + 3] > 12 ? 1 : 0;
  }
  return {
    image: new ort.Tensor("float32", image, [1, 3, INPUT_SIZE, INPUT_SIZE]),
    mask: new ort.Tensor("float32", mask, [1, 1, INPUT_SIZE, INPUT_SIZE]),
  };
}

function outputToCanvas(output) {
  const pixels = INPUT_SIZE * INPUT_SIZE;
  const rgba = new Uint8ClampedArray(pixels * 4);
  const data = output.data;
  for (let index = 0; index < pixels; index += 1) {
    const target = index * 4;
    rgba[target] = Math.max(0, Math.min(255, Math.round(data[index])));
    rgba[target + 1] = Math.max(0, Math.min(255, Math.round(data[pixels + index])));
    rgba[target + 2] = Math.max(0, Math.min(255, Math.round(data[(pixels * 2) + index])));
    rgba[target + 3] = 255;
  }
  const canvas = new OffscreenCanvas(INPUT_SIZE, INPUT_SIZE);
  canvas.getContext("2d").putImageData(new ImageData(rgba, INPUT_SIZE, INPUT_SIZE), 0, 0);
  return canvas;
}

async function compositeResult(original, mask, generated, feather) {
  const width = original.width;
  const height = original.height;
  const finalCanvas = new OffscreenCanvas(width, height);
  const finalContext = finalCanvas.getContext("2d");
  finalContext.drawImage(original, 0, 0, width, height);

  const patchCanvas = new OffscreenCanvas(width, height);
  const patchContext = patchCanvas.getContext("2d");
  patchContext.drawImage(generated, 0, 0, width, height);
  patchContext.globalCompositeOperation = "destination-in";
  if (feather > 0 && "filter" in patchContext) patchContext.filter = `blur(${feather}px)`;
  patchContext.drawImage(mask, 0, 0, width, height);
  patchContext.filter = "none";
  patchContext.globalCompositeOperation = "source-over";

  finalContext.drawImage(patchCanvas, 0, 0);
  return finalCanvas.convertToBlob({ type: "image/png" });
}

self.addEventListener("message", async (event) => {
  const payload = event.data || {};
  if (payload.type !== "cleanup-image") return;

  try {
    self.postMessage({ type: "stage", stage: "model", progress: 3 });
    const session = await loadSession();
    self.postMessage({ type: "stage", stage: "decode", progress: 70 });
    const [original, mask] = await Promise.all([
      decodeBlob(payload.buffer, payload.mimeType),
      decodeBlob(payload.maskBuffer, "image/png"),
    ]);

    const inputCanvas = new OffscreenCanvas(INPUT_SIZE, INPUT_SIZE);
    const inputContext = inputCanvas.getContext("2d");
    inputContext.drawImage(original, 0, 0, INPUT_SIZE, INPUT_SIZE);
    const maskCanvas = new OffscreenCanvas(INPUT_SIZE, INPUT_SIZE);
    const maskContext = maskCanvas.getContext("2d");
    maskContext.drawImage(mask, 0, 0, INPUT_SIZE, INPUT_SIZE);
    const inputs = tensorInputs(
      inputContext.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE),
      maskContext.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE),
    );

    self.postMessage({ type: "stage", stage: "inference", progress: 78 });
    const results = await session.run(inputs);
    const output = results.output || results[session.outputNames[0]];
    if (!output) throw new Error("模型没有返回可用的修复图像");
    const generated = outputToCanvas(output);

    self.postMessage({ type: "stage", stage: "encode", progress: 94 });
    const resultBlob = await compositeResult(original, mask, generated, Math.max(0, Number(payload.feather) || 0));
    const width = original.width;
    const height = original.height;
    const outputBuffer = await resultBlob.arrayBuffer();
    original.close?.();
    mask.close?.();
    self.postMessage({
      type: "result",
      id: payload.id,
      buffer: outputBuffer,
      width,
      height,
      model: "Carve/LaMa-ONNX",
    }, [outputBuffer]);
  } catch (error) {
    self.postMessage({
      type: "error",
      id: payload.id,
      message: error instanceof Error ? error.message : "本地画面清理失败",
    });
  }
});
