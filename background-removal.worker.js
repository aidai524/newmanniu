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

function adjustAlpha(image, mode) {
  if (mode === "natural" || image.channels !== 4) return image;
  const data = image.data;
  for (let index = 3; index < data.length; index += 4) {
    const value = data[index] / 255;
    if (mode === "crisp") {
      data[index] = Math.round(Math.max(0, Math.min(1, (value - 0.28) / 0.44)) * 255);
    } else {
      data[index] = Math.round(Math.sqrt(value) * 255);
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
