import { pipeline, RawImage } from "@huggingface/transformers";

const MODEL_ID = "Xenova/swin2SR-lightweight-x2-64";
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
    runtimePromise = pipeline("image-to-image", MODEL_ID, {
      dtype: "q8",
      progress_callback: reportProgress,
    }).catch((error) => {
      runtimePromise = undefined;
      throw error;
    });
  }
  return runtimePromise;
}

self.addEventListener("message", async (event) => {
  const payload = event.data || {};
  if (payload.type !== "enhance-image") return;

  try {
    self.postMessage({ type: "stage", stage: "model", progress: 5 });
    const enhanceImage = await loadRuntime();
    self.postMessage({ type: "stage", stage: "decode", progress: 68 });

    const imageBlob = new Blob([payload.buffer], { type: payload.mimeType || "image/png" });
    let image = await RawImage.fromBlob(imageBlob);
    const sourceWidth = image.width;
    const sourceHeight = image.height;
    const maxInputEdge = Math.max(320, Math.min(1280, Number(payload.maxInputEdge) || 1024));
    const longestEdge = Math.max(image.width, image.height);
    if (longestEdge > maxInputEdge) {
      const ratio = maxInputEdge / longestEdge;
      image = await image.resize(Math.max(8, Math.round(image.width * ratio)), Math.max(8, Math.round(image.height * ratio)));
    }

    self.postMessage({ type: "stage", stage: "inference", progress: 76 });
    const result = await enhanceImage(image);
    if (!result) throw new Error("模型没有返回可用的增强图像");

    self.postMessage({ type: "stage", stage: "encode", progress: 94 });
    const outputBlob = await result.toBlob();
    const outputBuffer = await outputBlob.arrayBuffer();
    self.postMessage({
      type: "result",
      id: payload.id,
      buffer: outputBuffer,
      width: result.width,
      height: result.height,
      sourceWidth,
      sourceHeight,
      model: MODEL_ID,
    }, [outputBuffer]);
  } catch (error) {
    self.postMessage({
      type: "error",
      id: payload.id,
      message: error instanceof Error ? error.message : "本地增强模型处理失败",
    });
  }
});
