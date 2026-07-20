import { pipeline, RawImage } from "@huggingface/transformers";

const MODEL_ID = "onnx-community/ormbg-ONNX";
let runtimePromise;

function reportProgress(event) {
  self.postMessage({
    type: "model-progress",
    status: event?.status || "loading",
    file: event?.file || "",
    progress: Number.isFinite(event?.progress) ? event.progress : null,
  });
}

function loadRuntime() {
  if (!runtimePromise) {
    runtimePromise = pipeline("background-removal", MODEL_ID, {
      dtype: "q8",
      progress_callback: reportProgress,
    }).catch((error) => {
      runtimePromise = undefined;
      throw error;
    });
  }
  return runtimePromise;
}

const EDGE_PROFILES = Object.freeze({
  natural: { transparent: 0.12, opaque: 0.88, cutoff: 6 },
  crisp: { transparent: 0.24, opaque: 0.72, cutoff: 10 },
  soft: { transparent: 0.07, opaque: 0.94, cutoff: 4 },
});

function smoothstep(value) {
  return value * value * (3 - (2 * value));
}

function adjustAlpha(image, mode) {
  if (image.channels !== 4) return image;
  const profile = EDGE_PROFILES[mode] || EDGE_PROFILES.natural;
  const data = image.data;
  for (let index = 3; index < data.length; index += 4) {
    const value = data[index] / 255;
    const normalized = Math.max(0, Math.min(1, (value - profile.transparent) / (profile.opaque - profile.transparent)));
    const nextAlpha = Math.round(smoothstep(normalized) * 255);
    data[index] = nextAlpha <= profile.cutoff ? 0 : nextAlpha;

    if (data[index] === 0) {
      data[index - 3] = 0;
      data[index - 2] = 0;
      data[index - 1] = 0;
    }
  }
  return image;
}

self.addEventListener("message", async (event) => {
  const payload = event.data || {};
  if (payload.type !== "remove-background") return;

  try {
    self.postMessage({ type: "stage", stage: "model", progress: 5 });
    const removeBackground = await loadRuntime();
    self.postMessage({ type: "stage", stage: "decode", progress: 72 });

    const imageBlob = new Blob([payload.buffer], { type: payload.mimeType || "image/png" });
    const image = await RawImage.fromBlob(imageBlob);

    self.postMessage({ type: "stage", stage: "inference", progress: 80 });
    const output = await removeBackground([image]);
    if (!output?.[0]) throw new Error("模型没有返回可用的前景图像");
    const result = adjustAlpha(output[0], payload.edgeMode || "natural");

    self.postMessage({ type: "stage", stage: "encode", progress: 94 });
    const outputBlob = await result.toBlob();
    const outputBuffer = await outputBlob.arrayBuffer();
    self.postMessage({
      type: "result",
      id: payload.id,
      buffer: outputBuffer,
      width: result.width,
      height: result.height,
      model: MODEL_ID,
    }, [outputBuffer]);
  } catch (error) {
    self.postMessage({
      type: "error",
      id: payload.id,
      message: error instanceof Error ? error.message : "本地模型处理失败",
    });
  }
});
