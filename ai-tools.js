const aiSupportedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function setAiProgress(container, bar, progress, status, text) {
  const value = Math.max(0, Math.min(100, Math.round(progress)));
  if (container) container.hidden = value <= 0 || value >= 100;
  if (bar) bar.style.transform = `scaleX(${value / 100})`;
  if (status && text) status.textContent = text;
}

function pickAiImage(files, maxSizeMb = 25) {
  const file = files.find((item) => aiSupportedImageTypes.has(item.type));
  if (!file) throw new Error("请选择 JPG、PNG 或 WebP 图片");
  if (file.size > maxSizeMb * 1024 * 1024) throw new Error(`图片不能超过 ${maxSizeMb}MB`);
  return file;
}

function coverRect(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  return { x: (targetWidth - width) / 2, y: (targetHeight - height) / 2, width, height };
}

/* AI background replacement */
const sceneInput = document.querySelector("[data-scene-input]");
const sceneDropzone = document.querySelector("[data-scene-drop]");
const sceneBackgroundInput = document.querySelector("[data-scene-bg-input]");
const sceneBackgroundTrigger = document.querySelector("[data-scene-bg-trigger]");
const sceneBackgroundName = document.querySelector("[data-scene-bg-name]");
const scenePresetButtons = [...document.querySelectorAll("[data-scene-preset]")];
const sceneScale = document.querySelector("[data-scene-scale]");
const sceneScaleValue = document.querySelector("[data-scene-scale-value]");
const sceneShadow = document.querySelector("[data-scene-shadow]");
const sceneShadowValue = document.querySelector("[data-scene-shadow-value]");
const sceneRunButton = document.querySelector("[data-scene-run]");
const sceneDownloadButton = document.querySelector("[data-scene-download]");
const sceneClearButton = document.querySelector("[data-scene-clear]");
const sceneExampleButton = document.querySelector("[data-scene-example]");
const sceneFileName = document.querySelector("[data-scene-file-name]");
const sceneFileMeta = document.querySelector("[data-scene-file-meta]");
const sceneStatus = document.querySelector("[data-scene-status]");
const sceneProgress = document.querySelector("[data-scene-progress]");
const sceneProgressBar = document.querySelector("[data-scene-progress-bar]");
const sceneEmpty = document.querySelector("[data-scene-empty]");
const sceneEditor = document.querySelector("[data-scene-editor]");
const sceneOriginal = document.querySelector("[data-scene-original]");
const sceneResult = document.querySelector("[data-scene-result]");
const scenePlaceholder = document.querySelector("[data-scene-placeholder]");
const sceneCaption = document.querySelector("[data-scene-caption]");
const sceneTip = document.querySelector("[data-scene-tip]");
let sceneFile = null;
let sceneBackgroundFile = null;
let sceneMode = "white";
let sceneSourceUrl = "";
let sceneResultUrl = "";
let sceneResultBlob = null;
let sceneSubjectBlob = null;
let sceneWorker = null;
let sceneWorkerRequest = null;
let sceneRequestId = 0;
let sceneBusy = false;

const sceneLabels = {
  white: "纯净白底",
  studio: "柔灰棚拍",
  mint: "薄荷影棚",
  living: "暖调生活",
  custom: "自定义背景",
};

function resetSceneResult(keepSubject = false) {
  if (sceneResultUrl) URL.revokeObjectURL(sceneResultUrl);
  sceneResultUrl = "";
  sceneResultBlob = null;
  if (!keepSubject) sceneSubjectBlob = null;
  if (sceneResult) {
    sceneResult.hidden = true;
    sceneResult.removeAttribute("src");
  }
  if (scenePlaceholder) {
    scenePlaceholder.hidden = false;
    scenePlaceholder.classList.remove("is-processing", "is-error");
    scenePlaceholder.innerHTML = "<strong>等待处理</strong><span>选择场景后点击“开始替换背景”</span>";
  }
}

function updateSceneControls() {
  const hasFile = Boolean(sceneFile);
  const hasResult = Boolean(sceneResultBlob);
  if (sceneRunButton) {
    sceneRunButton.disabled = !hasFile || sceneBusy;
    sceneRunButton.textContent = sceneBusy ? "正在替换背景" : sceneSubjectBlob ? "更新场景" : "开始替换背景";
  }
  if (sceneDownloadButton) sceneDownloadButton.disabled = !hasResult || sceneBusy;
  if (sceneClearButton) sceneClearButton.disabled = !hasFile || sceneBusy;
  [sceneInput, sceneBackgroundInput, sceneScale, sceneShadow].forEach((control) => {
    if (control) control.disabled = sceneBusy;
  });
  scenePresetButtons.forEach((button) => { button.disabled = sceneBusy; });
  if (sceneExampleButton) sceneExampleButton.disabled = sceneBusy;
}

function getSceneWorker() {
  if (sceneWorker) return sceneWorker;
  if (typeof Worker !== "function") throw new Error("当前浏览器不支持本地模型处理");
  sceneWorker = new Worker("dist/background-removal.worker.js?v=20260715-batch-two", { name: "manniu-background-replace" });
  sceneWorker.addEventListener("message", (event) => {
    const message = event.data || {};
    if (message.type === "model-progress") {
      const progress = Number.isFinite(message.progress) ? message.progress : 0;
      setAiProgress(sceneProgress, sceneProgressBar, 7 + (progress * 0.62), sceneStatus, progress ? `首次加载本地模型 ${Math.round(progress)}%` : "正在加载本地模型");
      return;
    }
    if (message.type === "stage") {
      const copy = { model: "正在准备抠图模型", decode: "正在读取商品图", inference: "正在识别商品主体", encode: "正在生成透明主体" };
      setAiProgress(sceneProgress, sceneProgressBar, message.progress || 0, sceneStatus, copy[message.stage] || "正在处理图片");
      return;
    }
    if (!sceneWorkerRequest || message.id !== sceneWorkerRequest.id) return;
    if (message.type === "result") sceneWorkerRequest.resolve(message);
    else sceneWorkerRequest.reject(new Error(message.message || "本地主体识别失败"));
    sceneWorkerRequest = null;
  });
  sceneWorker.addEventListener("error", () => {
    sceneWorkerRequest?.reject(new Error("本地模型加载失败，请检查网络后重试"));
    sceneWorkerRequest = null;
    sceneWorker?.terminate();
    sceneWorker = null;
  });
  return sceneWorker;
}

async function removeSceneBackground(file) {
  const worker = getSceneWorker();
  const buffer = await file.arrayBuffer();
  const id = ++sceneRequestId;
  return new Promise((resolve, reject) => {
    sceneWorkerRequest = { id, resolve, reject };
    worker.postMessage({ type: "remove-background", id, buffer, mimeType: file.type, edgeMode: "natural" }, [buffer]);
  });
}

function drawSceneBackground(context, width, height, mode) {
  if (mode === "white") {
    context.fillStyle = "#f8f8f7";
    context.fillRect(0, 0, width, height);
    return;
  }
  const wallHeight = height * 0.72;
  if (mode === "studio") {
    const wall = context.createLinearGradient(0, 0, width, wallHeight);
    wall.addColorStop(0, "#f5f6f7");
    wall.addColorStop(0.52, "#e5e7e9");
    wall.addColorStop(1, "#cdd1d5");
    context.fillStyle = wall;
    context.fillRect(0, 0, width, wallHeight);
    context.fillStyle = "#c7cbd0";
    context.fillRect(0, wallHeight, width, height - wallHeight);
    const light = context.createRadialGradient(width * 0.34, height * 0.28, 0, width * 0.34, height * 0.28, width * 0.52);
    light.addColorStop(0, "rgba(255,255,255,.72)");
    light.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = light;
    context.fillRect(0, 0, width, height);
    return;
  }
  if (mode === "mint") {
    const wall = context.createLinearGradient(0, 0, width, height);
    wall.addColorStop(0, "#edf7f4");
    wall.addColorStop(0.58, "#c9e3dd");
    wall.addColorStop(1, "#9fc8bf");
    context.fillStyle = wall;
    context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(255,255,255,.28)";
    context.beginPath();
    context.arc(width * 0.18, height * 0.2, Math.min(width, height) * 0.17, 0, Math.PI * 2);
    context.fill();
    return;
  }
  const wall = context.createLinearGradient(0, 0, width, wallHeight);
  wall.addColorStop(0, "#f0ece5");
  wall.addColorStop(1, "#d9d0c4");
  context.fillStyle = wall;
  context.fillRect(0, 0, width, wallHeight);
  context.fillStyle = "#c2aa91";
  context.fillRect(0, wallHeight, width, height - wallHeight);
  context.fillStyle = "rgba(103,126,104,.68)";
  context.beginPath();
  context.ellipse(width * 0.12, height * 0.28, width * 0.055, height * 0.2, -0.25, 0, Math.PI * 2);
  context.ellipse(width * 0.19, height * 0.24, width * 0.05, height * 0.17, 0.22, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "rgba(255,255,255,.42)";
  context.fillRect(width * 0.74, height * 0.13, width * 0.18, height * 0.3);
}

async function alphaBounds(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let left = canvas.width;
  let top = canvas.height;
  let right = 0;
  let bottom = 0;
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      if (data[((y * canvas.width) + x) * 4 + 3] < 12) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  if (right <= left || bottom <= top) return { x: 0, y: 0, width: canvas.width, height: canvas.height };
  return { x: left, y: top, width: right - left + 2, height: bottom - top + 2 };
}

async function composeSceneResult() {
  if (!sceneSubjectBlob || !sceneFile) throw new Error("请先识别商品主体");
  const [subject, original] = await Promise.all([decodeImageFile(sceneSubjectBlob), decodeImageFile(sceneFile)]);
  const size = imageSourceSize(original);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d");

  if (sceneMode === "custom" && sceneBackgroundFile) {
    const background = await decodeImageFile(sceneBackgroundFile);
    const backgroundSize = imageSourceSize(background);
    const rect = coverRect(backgroundSize.width, backgroundSize.height, canvas.width, canvas.height);
    context.drawImage(background, rect.x, rect.y, rect.width, rect.height);
    releaseImageSource(background);
  } else {
    drawSceneBackground(context, canvas.width, canvas.height, sceneMode);
  }

  const bounds = await alphaBounds(subject);
  const scale = Number(sceneScale?.value || 86) / 100;
  const maxWidth = canvas.width * Math.min(0.9, scale);
  const maxHeight = canvas.height * scale;
  const ratio = Math.min(maxWidth / bounds.width, maxHeight / bounds.height);
  const drawWidth = bounds.width * ratio;
  const drawHeight = bounds.height * ratio;
  const drawX = (canvas.width - drawWidth) / 2;
  const drawY = (canvas.height * 0.91) - drawHeight;
  const shadowStrength = Number(sceneShadow?.value || 0) / 100;
  if (shadowStrength > 0) {
    context.save();
    context.filter = `blur(${Math.max(3, canvas.width * 0.012)}px)`;
    context.fillStyle = `rgba(30,34,36,${shadowStrength * 0.34})`;
    context.beginPath();
    context.ellipse(canvas.width / 2, drawY + drawHeight * 0.985, drawWidth * 0.34, Math.max(4, drawHeight * 0.035), 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
  context.drawImage(subject, bounds.x, bounds.y, bounds.width, bounds.height, drawX, drawY, drawWidth, drawHeight);
  releaseImageSource(subject);
  releaseImageSource(original);
  return canvasToBlob(canvas, "image/jpeg", 0.94);
}

async function renderSceneResult() {
  const blob = await composeSceneResult();
  if (sceneResultUrl) URL.revokeObjectURL(sceneResultUrl);
  sceneResultBlob = blob;
  sceneResultUrl = URL.createObjectURL(blob);
  if (sceneResult) {
    sceneResult.src = sceneResultUrl;
    sceneResult.hidden = false;
  }
  if (scenePlaceholder) scenePlaceholder.hidden = true;
  if (sceneCaption) sceneCaption.textContent = sceneLabels[sceneMode] || "场景结果";
  if (sceneTip) sceneTip.textContent = `${sceneLabels[sceneMode] || "场景"} · ${formatFileSize(blob.size)} · JPG`;
}

function clearSceneTask() {
  if (sceneBusy) return;
  if (sceneSourceUrl) URL.revokeObjectURL(sceneSourceUrl);
  sceneSourceUrl = "";
  sceneFile = null;
  resetSceneResult();
  sceneOriginal?.removeAttribute("src");
  if (sceneFileName) sceneFileName.textContent = "尚未添加图片";
  if (sceneFileMeta) sceneFileMeta.textContent = "等待选择素材";
  if (sceneStatus) sceneStatus.textContent = "添加图片后可开始替换背景";
  if (sceneEmpty) sceneEmpty.hidden = false;
  if (sceneEditor) sceneEditor.hidden = true;
  setAiProgress(sceneProgress, sceneProgressBar, 0, sceneStatus);
  updateSceneControls();
}

async function selectSceneFile(files) {
  if (sceneBusy) return;
  try {
    const file = pickAiImage(files);
    if (sceneSourceUrl) URL.revokeObjectURL(sceneSourceUrl);
    sceneFile = file;
    sceneSourceUrl = URL.createObjectURL(file);
    resetSceneResult();
    if (sceneOriginal) sceneOriginal.src = sceneSourceUrl;
    if (sceneFileName) sceneFileName.textContent = file.name;
    if (sceneFileMeta) sceneFileMeta.textContent = `${formatFileSize(file.size)} · 正在读取尺寸`;
    if (sceneEmpty) sceneEmpty.hidden = true;
    if (sceneEditor) sceneEditor.hidden = false;
    if (sceneStatus) sceneStatus.textContent = "商品图已就绪，可开始替换背景";
    const source = await decodeImageFile(file);
    const size = imageSourceSize(source);
    if (sceneFileMeta) sceneFileMeta.textContent = `${size.width} × ${size.height} · ${formatFileSize(file.size)}`;
    releaseImageSource(source);
    updateSceneControls();
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "图片读取失败");
  }
}

bindLocalFileDrop(sceneDropzone, sceneInput, selectSceneFile);
sceneBackgroundTrigger?.addEventListener("click", () => sceneBackgroundInput?.click());
sceneBackgroundInput?.addEventListener("change", () => {
  try {
    sceneBackgroundFile = pickAiImage([...(sceneBackgroundInput.files || [])]);
    sceneMode = "custom";
    scenePresetButtons.forEach((button) => button.classList.remove("is-active"));
    if (sceneBackgroundName) sceneBackgroundName.textContent = sceneBackgroundFile.name;
    if (sceneCaption) sceneCaption.textContent = sceneLabels.custom;
    resetSceneResult(true);
    if (sceneStatus && sceneSubjectBlob) sceneStatus.textContent = "自定义背景已就绪，点击“更新场景”";
    updateSceneControls();
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "背景图片读取失败");
  } finally {
    if (sceneBackgroundInput) sceneBackgroundInput.value = "";
  }
});
scenePresetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sceneMode = button.dataset.scenePreset || "white";
    scenePresetButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    if (sceneCaption) sceneCaption.textContent = sceneLabels[sceneMode] || "场景结果";
    resetSceneResult(true);
    if (sceneStatus && sceneSubjectBlob) sceneStatus.textContent = "场景已更改，点击“更新场景”";
    updateSceneControls();
  });
});
sceneScale?.addEventListener("input", () => { if (sceneScaleValue) sceneScaleValue.textContent = `${sceneScale.value}%`; });
sceneShadow?.addEventListener("input", () => { if (sceneShadowValue) sceneShadowValue.textContent = `${sceneShadow.value}%`; });
[sceneScale, sceneShadow].forEach((control) => control?.addEventListener("change", () => {
  if (!sceneSubjectBlob) return;
  resetSceneResult(true);
  if (sceneStatus) sceneStatus.textContent = "构图参数已更改，点击“更新场景”";
  updateSceneControls();
}));
sceneExampleButton?.addEventListener("click", async () => {
  try {
    const response = await fetch("assets/dashboard/work-4-hd.jpg");
    if (!response.ok) throw new Error("示例图片读取失败");
    const blob = await response.blob();
    await selectSceneFile([new File([blob], "示例商品图.jpg", { type: blob.type || "image/jpeg" })]);
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "示例图片读取失败");
  }
});
sceneClearButton?.addEventListener("click", clearSceneTask);
sceneDownloadButton?.addEventListener("click", () => {
  if (!sceneResultBlob || !sceneFile) return;
  triggerBlobDownload(sceneResultBlob, outputFileName(sceneFile.name, "-场景替换", "image/jpeg"));
  showWorkspaceToast("场景图已开始下载");
});
sceneRunButton?.addEventListener("click", async () => {
  if (!sceneFile || sceneBusy) return;
  sceneBusy = true;
  resetSceneResult(true);
  if (scenePlaceholder) {
    scenePlaceholder.classList.add("is-processing");
    scenePlaceholder.innerHTML = "<span class=\"background-remove-loader\" aria-hidden=\"true\"></span><strong>正在合成场景</strong><span>先识别商品主体，再生成背景结果</span>";
  }
  updateSceneControls();
  try {
    if (!sceneSubjectBlob) {
      const output = await removeSceneBackground(sceneFile);
      sceneSubjectBlob = new Blob([output.buffer], { type: "image/png" });
    }
    setAiProgress(sceneProgress, sceneProgressBar, 96, sceneStatus, "正在合成场景与自然阴影");
    await renderSceneResult();
    setAiProgress(sceneProgress, sceneProgressBar, 100, sceneStatus, "背景替换已完成，可调整参数或下载");
    showWorkspaceToast("AI 背景替换已完成");
  } catch (error) {
    resetSceneResult(true);
    if (scenePlaceholder) {
      scenePlaceholder.classList.add("is-error");
      scenePlaceholder.innerHTML = "<strong>处理没有完成</strong><span>请检查网络或更换图片后重试</span>";
    }
    setAiProgress(sceneProgress, sceneProgressBar, 0, sceneStatus, error instanceof Error ? error.message : "背景替换失败");
    showWorkspaceToast(error instanceof Error ? error.message : "背景替换失败");
  } finally {
    sceneBusy = false;
    updateSceneControls();
  }
});
updateSceneControls();

/* AI image cleanup */
const cleanupInput = document.querySelector("[data-cleanup-input]");
const cleanupDropzone = document.querySelector("[data-cleanup-drop]");
const cleanupModeButtons = [...document.querySelectorAll("[data-cleanup-mode]")];
const cleanupBrush = document.querySelector("[data-cleanup-brush]");
const cleanupBrushValue = document.querySelector("[data-cleanup-brush-value]");
const cleanupFeather = document.querySelector("[data-cleanup-feather]");
const cleanupFeatherValue = document.querySelector("[data-cleanup-feather-value]");
const cleanupUndoButton = document.querySelector("[data-cleanup-undo]");
const cleanupClearMaskButton = document.querySelector("[data-cleanup-clear-mask]");
const cleanupRunButton = document.querySelector("[data-cleanup-run]");
const cleanupDownloadButton = document.querySelector("[data-cleanup-download]");
const cleanupClearButton = document.querySelector("[data-cleanup-clear]");
const cleanupExampleButton = document.querySelector("[data-cleanup-example]");
const cleanupFileName = document.querySelector("[data-cleanup-file-name]");
const cleanupFileMeta = document.querySelector("[data-cleanup-file-meta]");
const cleanupStatus = document.querySelector("[data-cleanup-status]");
const cleanupProgress = document.querySelector("[data-cleanup-progress]");
const cleanupProgressBar = document.querySelector("[data-cleanup-progress-bar]");
const cleanupEmpty = document.querySelector("[data-cleanup-empty]");
const cleanupEditor = document.querySelector("[data-cleanup-editor]");
const cleanupSourceCanvas = document.querySelector("[data-cleanup-source]");
const cleanupMaskCanvas = document.querySelector("[data-cleanup-mask]");
const cleanupCanvasFrame = document.querySelector("[data-cleanup-canvas-frame]");
const cleanupCursor = document.querySelector("[data-cleanup-cursor]");
const cleanupResult = document.querySelector("[data-cleanup-result]");
const cleanupPlaceholder = document.querySelector("[data-cleanup-placeholder]");
const cleanupTip = document.querySelector("[data-cleanup-tip]");
let cleanupFile = null;
let cleanupMode = "brush";
let cleanupStrokes = [];
let cleanupActiveStroke = null;
let cleanupDrawing = false;
let cleanupResultBlob = null;
let cleanupResultUrl = "";
let cleanupWorker = null;
let cleanupWorkerRequest = null;
let cleanupRequestId = 0;
let cleanupBusy = false;

function resetCleanupResult() {
  if (cleanupResultUrl) URL.revokeObjectURL(cleanupResultUrl);
  cleanupResultUrl = "";
  cleanupResultBlob = null;
  if (cleanupResult) {
    cleanupResult.hidden = true;
    cleanupResult.removeAttribute("src");
  }
  if (cleanupPlaceholder) {
    cleanupPlaceholder.hidden = false;
    cleanupPlaceholder.classList.remove("is-processing", "is-error");
    cleanupPlaceholder.innerHTML = "<strong>等待补全</strong><span>涂抹目标后点击“开始 AI 补全”</span>";
  }
}

function updateCleanupControls() {
  const hasFile = Boolean(cleanupFile);
  const hasMask = cleanupStrokes.length > 0;
  if (cleanupRunButton) {
    cleanupRunButton.disabled = !hasFile || !hasMask || cleanupBusy;
    cleanupRunButton.textContent = cleanupBusy ? "正在 AI 补全" : cleanupResultBlob ? "重新 AI 补全" : "开始 AI 补全";
  }
  if (cleanupDownloadButton) cleanupDownloadButton.disabled = !cleanupResultBlob || cleanupBusy;
  if (cleanupClearButton) cleanupClearButton.disabled = !hasFile || cleanupBusy;
  if (cleanupUndoButton) cleanupUndoButton.disabled = !hasMask || cleanupBusy;
  if (cleanupClearMaskButton) cleanupClearMaskButton.disabled = !hasMask || cleanupBusy;
  if (cleanupInput) cleanupInput.disabled = cleanupBusy;
  if (cleanupBrush) cleanupBrush.disabled = cleanupBusy;
  if (cleanupFeather) cleanupFeather.disabled = cleanupBusy;
  cleanupModeButtons.forEach((button) => { button.disabled = cleanupBusy; });
  if (cleanupExampleButton) cleanupExampleButton.disabled = cleanupBusy;
}

function cleanupCanvasPoint(event) {
  const rect = cleanupMaskCanvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (cleanupMaskCanvas.width / rect.width),
    y: (event.clientY - rect.top) * (cleanupMaskCanvas.height / rect.height),
  };
}

function drawCleanupStroke(context, stroke) {
  if (!stroke.points.length) return;
  context.save();
  context.globalCompositeOperation = stroke.mode === "eraser" ? "destination-out" : "source-over";
  context.strokeStyle = "rgba(255, 74, 82, .72)";
  context.fillStyle = "rgba(255, 74, 82, .72)";
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = stroke.size;
  if (stroke.points.length === 1) {
    context.beginPath();
    context.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
    context.fill();
  } else {
    context.beginPath();
    context.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let index = 1; index < stroke.points.length; index += 1) context.lineTo(stroke.points[index].x, stroke.points[index].y);
    context.stroke();
  }
  context.restore();
}

function redrawCleanupMask() {
  if (!cleanupMaskCanvas) return;
  const context = cleanupMaskCanvas.getContext("2d");
  context.clearRect(0, 0, cleanupMaskCanvas.width, cleanupMaskCanvas.height);
  cleanupStrokes.forEach((stroke) => drawCleanupStroke(context, stroke));
}

function markCleanupChanged() {
  resetCleanupResult();
  if (cleanupStatus) cleanupStatus.textContent = cleanupStrokes.length ? "涂抹已记录，可开始 AI 补全" : "在图片上涂抹需要移除的区域";
  updateCleanupControls();
}

async function renderCleanupSource(file) {
  const source = await decodeImageFile(file);
  const size = imageSourceSize(source);
  const maxEdge = 2400;
  const ratio = Math.min(1, maxEdge / Math.max(size.width, size.height));
  const width = Math.max(1, Math.round(size.width * ratio));
  const height = Math.max(1, Math.round(size.height * ratio));
  cleanupSourceCanvas.width = width;
  cleanupSourceCanvas.height = height;
  cleanupMaskCanvas.width = width;
  cleanupMaskCanvas.height = height;
  cleanupCanvasFrame.style.aspectRatio = `${width} / ${height}`;
  cleanupSourceCanvas.getContext("2d").drawImage(source, 0, 0, width, height);
  releaseImageSource(source);
  return size;
}

async function selectCleanupFile(files) {
  if (cleanupBusy) return;
  try {
    const file = pickAiImage(files);
    cleanupFile = file;
    cleanupStrokes = [];
    resetCleanupResult();
    const size = await renderCleanupSource(file);
    redrawCleanupMask();
    if (cleanupFileName) cleanupFileName.textContent = file.name;
    if (cleanupFileMeta) cleanupFileMeta.textContent = `${size.width} × ${size.height} · ${formatFileSize(file.size)}`;
    if (cleanupEmpty) cleanupEmpty.hidden = true;
    if (cleanupEditor) cleanupEditor.hidden = false;
    if (cleanupStatus) cleanupStatus.textContent = "在图片上涂抹需要移除的区域";
    updateCleanupControls();
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "图片读取失败");
  }
}

function clearCleanupTask() {
  if (cleanupBusy) return;
  cleanupFile = null;
  cleanupStrokes = [];
  cleanupSourceCanvas?.getContext("2d").clearRect(0, 0, cleanupSourceCanvas.width, cleanupSourceCanvas.height);
  cleanupMaskCanvas?.getContext("2d").clearRect(0, 0, cleanupMaskCanvas.width, cleanupMaskCanvas.height);
  resetCleanupResult();
  if (cleanupFileName) cleanupFileName.textContent = "尚未添加图片";
  if (cleanupFileMeta) cleanupFileMeta.textContent = "等待选择素材";
  if (cleanupStatus) cleanupStatus.textContent = "添加图片后可开始涂抹";
  if (cleanupEmpty) cleanupEmpty.hidden = false;
  if (cleanupEditor) cleanupEditor.hidden = true;
  setAiProgress(cleanupProgress, cleanupProgressBar, 0, cleanupStatus);
  updateCleanupControls();
}

function getCleanupWorker() {
  if (cleanupWorker) return cleanupWorker;
  if (typeof Worker !== "function" || typeof OffscreenCanvas !== "function") throw new Error("当前浏览器不支持本地 AI 补全");
  cleanupWorker = new Worker("dist/image-cleanup.worker.js?v=20260715-batch-two", { name: "manniu-image-cleanup" });
  cleanupWorker.addEventListener("message", (event) => {
    const message = event.data || {};
    if (message.type === "model-progress") {
      const progress = Number.isFinite(message.progress) ? message.progress : 0;
      const detail = message.cached ? "本地模型缓存已就绪" : `首次下载 LaMa 模型 ${Math.round(progress)}%`;
      setAiProgress(cleanupProgress, cleanupProgressBar, 4 + (progress * 0.64), cleanupStatus, detail);
      return;
    }
    if (message.type === "stage") {
      const copy = { model: "正在准备 LaMa 补全模型", decode: "正在读取图片与涂抹区域", inference: "AI 正在补全背景纹理", encode: "正在融合修复区域" };
      setAiProgress(cleanupProgress, cleanupProgressBar, message.progress || 0, cleanupStatus, copy[message.stage] || "正在清理画面");
      return;
    }
    if (!cleanupWorkerRequest || message.id !== cleanupWorkerRequest.id) return;
    if (message.type === "result") cleanupWorkerRequest.resolve(message);
    else cleanupWorkerRequest.reject(new Error(message.message || "AI 补全失败"));
    cleanupWorkerRequest = null;
  });
  cleanupWorker.addEventListener("error", () => {
    cleanupWorkerRequest?.reject(new Error("本地补全模型加载失败，请检查网络和浏览器内存"));
    cleanupWorkerRequest = null;
    cleanupWorker?.terminate();
    cleanupWorker = null;
  });
  return cleanupWorker;
}

async function runCleanupWorker(file, maskBlob) {
  const worker = getCleanupWorker();
  const [buffer, maskBuffer] = await Promise.all([file.arrayBuffer(), maskBlob.arrayBuffer()]);
  const id = ++cleanupRequestId;
  return new Promise((resolve, reject) => {
    cleanupWorkerRequest = { id, resolve, reject };
    worker.postMessage({
      type: "cleanup-image",
      id,
      buffer,
      maskBuffer,
      mimeType: file.type,
      feather: Number(cleanupFeather?.value || 8),
    }, [buffer, maskBuffer]);
  });
}

bindLocalFileDrop(cleanupDropzone, cleanupInput, selectCleanupFile);
cleanupModeButtons.forEach((button) => button.addEventListener("click", () => {
  cleanupMode = button.dataset.cleanupMode || "brush";
  cleanupModeButtons.forEach((item) => item.classList.toggle("is-active", item === button));
}));
cleanupBrush?.addEventListener("input", () => {
  if (cleanupBrushValue) cleanupBrushValue.textContent = `${cleanupBrush.value} px`;
  if (cleanupCursor) {
    cleanupCursor.style.width = `${cleanupBrush.value}px`;
    cleanupCursor.style.height = `${cleanupBrush.value}px`;
  }
});
cleanupFeather?.addEventListener("input", () => { if (cleanupFeatherValue) cleanupFeatherValue.textContent = `${cleanupFeather.value} px`; });
cleanupUndoButton?.addEventListener("click", () => {
  cleanupStrokes.pop();
  redrawCleanupMask();
  markCleanupChanged();
});
cleanupClearMaskButton?.addEventListener("click", () => {
  cleanupStrokes = [];
  redrawCleanupMask();
  markCleanupChanged();
});
cleanupCanvasFrame?.addEventListener("pointerenter", () => { if (cleanupCursor && !cleanupBusy) cleanupCursor.hidden = false; });
cleanupCanvasFrame?.addEventListener("pointerleave", () => { if (cleanupCursor && !cleanupDrawing) cleanupCursor.hidden = true; });
cleanupCanvasFrame?.addEventListener("pointermove", (event) => {
  const rect = cleanupCanvasFrame.getBoundingClientRect();
  if (cleanupCursor) {
    cleanupCursor.style.left = `${event.clientX - rect.left}px`;
    cleanupCursor.style.top = `${event.clientY - rect.top}px`;
  }
  if (!cleanupDrawing || !cleanupActiveStroke) return;
  cleanupActiveStroke.points.push(cleanupCanvasPoint(event));
  redrawCleanupMask();
});
cleanupCanvasFrame?.addEventListener("pointerdown", (event) => {
  if (!cleanupFile || cleanupBusy || event.button !== 0) return;
  event.preventDefault();
  cleanupCanvasFrame.setPointerCapture(event.pointerId);
  const rect = cleanupMaskCanvas.getBoundingClientRect();
  cleanupActiveStroke = {
    mode: cleanupMode,
    size: Number(cleanupBrush?.value || 42) * (cleanupMaskCanvas.width / rect.width),
    points: [cleanupCanvasPoint(event)],
  };
  cleanupStrokes.push(cleanupActiveStroke);
  cleanupDrawing = true;
  redrawCleanupMask();
});
function finishCleanupStroke(event) {
  if (!cleanupDrawing) return;
  cleanupDrawing = false;
  cleanupActiveStroke = null;
  if (event?.pointerId != null && cleanupCanvasFrame?.hasPointerCapture(event.pointerId)) cleanupCanvasFrame.releasePointerCapture(event.pointerId);
  markCleanupChanged();
}
cleanupCanvasFrame?.addEventListener("pointerup", finishCleanupStroke);
cleanupCanvasFrame?.addEventListener("pointercancel", finishCleanupStroke);
cleanupExampleButton?.addEventListener("click", async () => {
  try {
    const response = await fetch("assets/dashboard/work-2-hd.jpg");
    if (!response.ok) throw new Error("示例图片读取失败");
    const blob = await response.blob();
    await selectCleanupFile([new File([blob], "示例清理图.jpg", { type: blob.type || "image/jpeg" })]);
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "示例图片读取失败");
  }
});
cleanupClearButton?.addEventListener("click", clearCleanupTask);
cleanupDownloadButton?.addEventListener("click", () => {
  if (!cleanupResultBlob || !cleanupFile) return;
  triggerBlobDownload(cleanupResultBlob, outputFileName(cleanupFile.name, "-画面清理", "image/png"));
  showWorkspaceToast("清理结果已开始下载");
});
cleanupRunButton?.addEventListener("click", async () => {
  if (!cleanupFile || !cleanupStrokes.length || cleanupBusy) return;
  cleanupBusy = true;
  resetCleanupResult();
  if (cleanupPlaceholder) {
    cleanupPlaceholder.classList.add("is-processing");
    cleanupPlaceholder.innerHTML = "<span class=\"background-remove-loader\" aria-hidden=\"true\"></span><strong>AI 正在补全背景</strong><span>首次使用需先下载本地模型</span>";
  }
  setAiProgress(cleanupProgress, cleanupProgressBar, 2, cleanupStatus, "正在准备本地 AI 补全");
  updateCleanupControls();
  try {
    const maskBlob = await canvasToBlob(cleanupMaskCanvas, "image/png");
    const output = await runCleanupWorker(cleanupFile, maskBlob);
    cleanupResultBlob = new Blob([output.buffer], { type: "image/png" });
    cleanupResultUrl = URL.createObjectURL(cleanupResultBlob);
    if (cleanupResult) {
      cleanupResult.src = cleanupResultUrl;
      cleanupResult.hidden = false;
    }
    if (cleanupPlaceholder) cleanupPlaceholder.hidden = true;
    if (cleanupTip) cleanupTip.textContent = `${output.width} × ${output.height} · ${formatFileSize(cleanupResultBlob.size)} · PNG`;
    setAiProgress(cleanupProgress, cleanupProgressBar, 100, cleanupStatus, "画面清理已完成，可预览并下载");
    showWorkspaceToast("画面清理已完成");
  } catch (error) {
    resetCleanupResult();
    if (cleanupPlaceholder) {
      cleanupPlaceholder.classList.add("is-error");
      cleanupPlaceholder.innerHTML = "<strong>补全没有完成</strong><span>请检查网络、浏览器内存或缩小涂抹范围</span>";
    }
    setAiProgress(cleanupProgress, cleanupProgressBar, 0, cleanupStatus, error instanceof Error ? error.message : "AI 补全失败");
    showWorkspaceToast(error instanceof Error ? error.message : "AI 补全失败");
  } finally {
    cleanupBusy = false;
    updateCleanupControls();
  }
});
updateCleanupControls();

/* AI image enhancement */
const enhanceInput = document.querySelector("[data-enhance-input]");
const enhanceDropzone = document.querySelector("[data-enhance-drop]");
const enhanceEdge = document.querySelector("[data-enhance-edge]");
const enhanceDenoise = document.querySelector("[data-enhance-denoise]");
const enhanceDenoiseValue = document.querySelector("[data-enhance-denoise-value]");
const enhanceSharpen = document.querySelector("[data-enhance-sharpen]");
const enhanceSharpenValue = document.querySelector("[data-enhance-sharpen-value]");
const enhanceFormat = document.querySelector("[data-enhance-format]");
const enhanceRunButton = document.querySelector("[data-enhance-run]");
const enhanceDownloadButton = document.querySelector("[data-enhance-download]");
const enhanceClearButton = document.querySelector("[data-enhance-clear]");
const enhanceExampleButton = document.querySelector("[data-enhance-example]");
const enhanceFileName = document.querySelector("[data-enhance-file-name]");
const enhanceFileMeta = document.querySelector("[data-enhance-file-meta]");
const enhanceStatus = document.querySelector("[data-enhance-status]");
const enhanceProgress = document.querySelector("[data-enhance-progress]");
const enhanceProgressBar = document.querySelector("[data-enhance-progress-bar]");
const enhanceEmpty = document.querySelector("[data-enhance-empty]");
const enhanceEditor = document.querySelector("[data-enhance-editor]");
const enhanceOriginal = document.querySelector("[data-enhance-original]");
const enhanceResult = document.querySelector("[data-enhance-result]");
const enhancePlaceholder = document.querySelector("[data-enhance-placeholder]");
const enhanceTip = document.querySelector("[data-enhance-tip]");
let enhanceFile = null;
let enhanceSourceUrl = "";
let enhanceResultUrl = "";
let enhanceAiBlob = null;
let enhanceResultBlob = null;
let enhanceWorker = null;
let enhanceWorkerRequest = null;
let enhanceRequestId = 0;
let enhanceBusy = false;

function resetEnhanceResult(keepAi = false) {
  if (enhanceResultUrl) URL.revokeObjectURL(enhanceResultUrl);
  enhanceResultUrl = "";
  enhanceResultBlob = null;
  if (!keepAi) enhanceAiBlob = null;
  if (enhanceResult) {
    enhanceResult.hidden = true;
    enhanceResult.removeAttribute("src");
  }
  if (enhancePlaceholder) {
    enhancePlaceholder.hidden = false;
    enhancePlaceholder.classList.remove("is-processing", "is-error");
    enhancePlaceholder.innerHTML = "<strong>等待增强</strong><span>点击“开始 AI 增强”恢复细节</span>";
  }
}

function updateEnhanceControls() {
  const hasFile = Boolean(enhanceFile);
  if (enhanceRunButton) {
    enhanceRunButton.disabled = !hasFile || enhanceBusy;
    enhanceRunButton.textContent = enhanceBusy ? "正在 AI 增强" : enhanceAiBlob ? "重新 AI 增强" : "开始 AI 增强";
  }
  if (enhanceDownloadButton) enhanceDownloadButton.disabled = !enhanceResultBlob || enhanceBusy;
  if (enhanceClearButton) enhanceClearButton.disabled = !hasFile || enhanceBusy;
  [enhanceInput, enhanceEdge, enhanceDenoise, enhanceSharpen, enhanceFormat].forEach((control) => {
    if (control) control.disabled = enhanceBusy;
  });
  if (enhanceExampleButton) enhanceExampleButton.disabled = enhanceBusy;
}

function getEnhanceWorker() {
  if (enhanceWorker) return enhanceWorker;
  if (typeof Worker !== "function") throw new Error("当前浏览器不支持本地模型处理");
  enhanceWorker = new Worker("dist/image-enhance.worker.js?v=20260715-batch-two", { name: "manniu-image-enhance" });
  enhanceWorker.addEventListener("message", (event) => {
    const message = event.data || {};
    if (message.type === "model-progress") {
      const progress = Number.isFinite(message.progress) ? message.progress : 0;
      setAiProgress(enhanceProgress, enhanceProgressBar, 6 + (progress * 0.6), enhanceStatus, progress ? `首次加载增强模型 ${Math.round(progress)}%` : "正在加载增强模型");
      return;
    }
    if (message.type === "stage") {
      const copy = { model: "正在准备图片增强模型", decode: "正在读取并缩放图片", inference: "AI 正在重建画面细节", encode: "正在生成 2 倍增强图" };
      setAiProgress(enhanceProgress, enhanceProgressBar, message.progress || 0, enhanceStatus, copy[message.stage] || "正在增强图片");
      return;
    }
    if (!enhanceWorkerRequest || message.id !== enhanceWorkerRequest.id) return;
    if (message.type === "result") enhanceWorkerRequest.resolve(message);
    else enhanceWorkerRequest.reject(new Error(message.message || "AI 增强失败"));
    enhanceWorkerRequest = null;
  });
  enhanceWorker.addEventListener("error", () => {
    enhanceWorkerRequest?.reject(new Error("本地增强模型加载失败，请检查网络后重试"));
    enhanceWorkerRequest = null;
    enhanceWorker?.terminate();
    enhanceWorker = null;
  });
  return enhanceWorker;
}

async function runEnhanceWorker(file) {
  const worker = getEnhanceWorker();
  const buffer = await file.arrayBuffer();
  const id = ++enhanceRequestId;
  return new Promise((resolve, reject) => {
    enhanceWorkerRequest = { id, resolve, reject };
    worker.postMessage({
      type: "enhance-image",
      id,
      buffer,
      mimeType: file.type,
      maxInputEdge: Number(enhanceEdge?.value || 1024),
    }, [buffer]);
  });
}

async function postprocessEnhancedBlob(blob) {
  const image = await decodeImageFile(blob);
  const size = imageSourceSize(image);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const original = context.getImageData(0, 0, canvas.width, canvas.height);

  const blurCanvas = document.createElement("canvas");
  blurCanvas.width = canvas.width;
  blurCanvas.height = canvas.height;
  const blurContext = blurCanvas.getContext("2d", { willReadFrequently: true });
  const denoiseAmount = Number(enhanceDenoise?.value || 0) / 100;
  blurContext.filter = `blur(${0.45 + (denoiseAmount * 1.15)}px)`;
  blurContext.drawImage(image, 0, 0);
  blurContext.filter = "none";
  const blurred = blurContext.getImageData(0, 0, canvas.width, canvas.height);
  const sharpenAmount = (Number(enhanceSharpen?.value || 0) / 100) * 1.35;
  const denoiseMix = denoiseAmount * 0.58;
  for (let index = 0; index < original.data.length; index += 4) {
    for (let channel = 0; channel < 3; channel += 1) {
      const position = index + channel;
      const softened = original.data[position] + ((blurred.data[position] - original.data[position]) * denoiseMix);
      original.data[position] = Math.max(0, Math.min(255, Math.round(softened + ((softened - blurred.data[position]) * sharpenAmount))));
    }
  }
  context.putImageData(original, 0, 0);
  releaseImageSource(image);
  const mimeType = enhanceFormat?.value || "image/png";
  return canvasToBlob(canvas, mimeType, mimeType === "image/png" ? undefined : 0.94);
}

async function refreshEnhanceOutput() {
  if (!enhanceAiBlob) return;
  const blob = await postprocessEnhancedBlob(enhanceAiBlob);
  if (enhanceResultUrl) URL.revokeObjectURL(enhanceResultUrl);
  enhanceResultBlob = blob;
  enhanceResultUrl = URL.createObjectURL(blob);
  if (enhanceResult) {
    enhanceResult.src = enhanceResultUrl;
    enhanceResult.hidden = false;
  }
  if (enhancePlaceholder) enhancePlaceholder.hidden = true;
  if (enhanceTip) {
    const source = await decodeImageFile(blob);
    const size = imageSourceSize(source);
    enhanceTip.textContent = `${size.width} × ${size.height} · ${formatFileSize(blob.size)} · ${mimeExtension(enhanceFormat?.value || "image/png").toUpperCase()}`;
    releaseImageSource(source);
  }
}

async function selectEnhanceFile(files) {
  if (enhanceBusy) return;
  try {
    const file = pickAiImage(files);
    if (enhanceSourceUrl) URL.revokeObjectURL(enhanceSourceUrl);
    enhanceFile = file;
    enhanceSourceUrl = URL.createObjectURL(file);
    resetEnhanceResult();
    if (enhanceOriginal) enhanceOriginal.src = enhanceSourceUrl;
    const source = await decodeImageFile(file);
    const size = imageSourceSize(source);
    if (enhanceFileName) enhanceFileName.textContent = file.name;
    if (enhanceFileMeta) enhanceFileMeta.textContent = `${size.width} × ${size.height} · ${formatFileSize(file.size)}`;
    releaseImageSource(source);
    if (enhanceEmpty) enhanceEmpty.hidden = true;
    if (enhanceEditor) enhanceEditor.hidden = false;
    if (enhanceStatus) enhanceStatus.textContent = "图片已就绪，可开始 AI 增强";
    updateEnhanceControls();
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "图片读取失败");
  }
}

function clearEnhanceTask() {
  if (enhanceBusy) return;
  if (enhanceSourceUrl) URL.revokeObjectURL(enhanceSourceUrl);
  enhanceSourceUrl = "";
  enhanceFile = null;
  resetEnhanceResult();
  enhanceOriginal?.removeAttribute("src");
  if (enhanceFileName) enhanceFileName.textContent = "尚未添加图片";
  if (enhanceFileMeta) enhanceFileMeta.textContent = "等待选择素材";
  if (enhanceStatus) enhanceStatus.textContent = "添加图片后可开始增强";
  if (enhanceEmpty) enhanceEmpty.hidden = false;
  if (enhanceEditor) enhanceEditor.hidden = true;
  setAiProgress(enhanceProgress, enhanceProgressBar, 0, enhanceStatus);
  updateEnhanceControls();
}

bindLocalFileDrop(enhanceDropzone, enhanceInput, selectEnhanceFile);
enhanceDenoise?.addEventListener("input", () => { if (enhanceDenoiseValue) enhanceDenoiseValue.textContent = `${enhanceDenoise.value}%`; });
enhanceSharpen?.addEventListener("input", () => { if (enhanceSharpenValue) enhanceSharpenValue.textContent = `${enhanceSharpen.value}%`; });
[enhanceDenoise, enhanceSharpen, enhanceFormat].forEach((control) => control?.addEventListener("change", async () => {
  if (!enhanceAiBlob || enhanceBusy) return;
  enhanceBusy = true;
  updateEnhanceControls();
  try {
    if (enhanceStatus) enhanceStatus.textContent = "正在应用去噪与锐化参数";
    await refreshEnhanceOutput();
    if (enhanceStatus) enhanceStatus.textContent = "参数已更新，可预览并下载";
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "增强参数应用失败");
  } finally {
    enhanceBusy = false;
    updateEnhanceControls();
  }
}));
enhanceEdge?.addEventListener("change", () => {
  if (!enhanceAiBlob) return;
  resetEnhanceResult();
  if (enhanceStatus) enhanceStatus.textContent = "输出尺寸已更改，请重新 AI 增强";
  updateEnhanceControls();
});
enhanceExampleButton?.addEventListener("click", async () => {
  try {
    const response = await fetch("assets/dashboard/work-4.png");
    if (!response.ok) throw new Error("示例图片读取失败");
    const blob = await response.blob();
    await selectEnhanceFile([new File([blob], "示例小图.jpg", { type: blob.type || "image/jpeg" })]);
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "示例图片读取失败");
  }
});
enhanceClearButton?.addEventListener("click", clearEnhanceTask);
enhanceDownloadButton?.addEventListener("click", () => {
  if (!enhanceResultBlob || !enhanceFile) return;
  const mimeType = enhanceFormat?.value || "image/png";
  triggerBlobDownload(enhanceResultBlob, outputFileName(enhanceFile.name, "-AI增强", mimeType));
  showWorkspaceToast("增强图片已开始下载");
});
enhanceRunButton?.addEventListener("click", async () => {
  if (!enhanceFile || enhanceBusy) return;
  enhanceBusy = true;
  resetEnhanceResult();
  if (enhancePlaceholder) {
    enhancePlaceholder.classList.add("is-processing");
    enhancePlaceholder.innerHTML = "<span class=\"background-remove-loader\" aria-hidden=\"true\"></span><strong>AI 正在重建细节</strong><span>处理时长取决于图片尺寸与设备性能</span>";
  }
  setAiProgress(enhanceProgress, enhanceProgressBar, 3, enhanceStatus, "正在准备图片增强模型");
  updateEnhanceControls();
  try {
    const output = await runEnhanceWorker(enhanceFile);
    enhanceAiBlob = new Blob([output.buffer], { type: "image/png" });
    setAiProgress(enhanceProgress, enhanceProgressBar, 97, enhanceStatus, "正在应用去噪与细节锐化");
    await refreshEnhanceOutput();
    setAiProgress(enhanceProgress, enhanceProgressBar, 100, enhanceStatus, "图片增强已完成，可预览并下载");
    showWorkspaceToast("图片增强已完成");
  } catch (error) {
    resetEnhanceResult();
    if (enhancePlaceholder) {
      enhancePlaceholder.classList.add("is-error");
      enhancePlaceholder.innerHTML = "<strong>增强没有完成</strong><span>请检查网络或改用更小的图片</span>";
    }
    setAiProgress(enhanceProgress, enhanceProgressBar, 0, enhanceStatus, error instanceof Error ? error.message : "图片增强失败");
    showWorkspaceToast(error instanceof Error ? error.message : "图片增强失败");
  } finally {
    enhanceBusy = false;
    updateEnhanceControls();
  }
});
updateEnhanceControls();
