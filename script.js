const panels = [...document.querySelectorAll("[data-panel]")];
const viewButtons = [...document.querySelectorAll("[data-view]")];

function setView(viewName) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === viewName);
  });

  viewButtons.forEach((button) => {
    const isSelected = button.dataset.view === viewName;
    if (button.classList.contains("tab")) {
      button.classList.toggle("is-active", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
    }
  });
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setView(form.closest("[data-panel]")?.dataset.panel === "bind" ? "success" : "success");
  });
});

const accountStrip = document.querySelector(".account-strip");
const userTrigger = document.querySelector(".user-trigger");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const topbarCrumb = document.querySelector(".topbar-crumb");
const accountTabsBar = document.querySelector(".workspace-account-tabs");
const homePrompt = document.querySelector(".prompt-main textarea");
const startDetailButton = document.querySelector("[data-start-detail]");
const uploadTile = document.querySelector(".upload-tile");
const referenceInput = document.querySelector("[data-reference-input]");
const uploadPreview = document.querySelector("[data-upload-preview]");
const agentPrompt = document.querySelector("[data-agent-prompt]");
const agentType = document.querySelector("[data-agent-type]");
const agentResolution = document.querySelector("[data-agent-resolution]");
const agentPlatform = document.querySelector("[data-agent-platform]");
const agentLanguage = document.querySelector("[data-agent-language]");
const agentInclude = document.querySelector("[data-agent-include]");
const agentCount = document.querySelector("[data-agent-count]");
const agentUserMessage = document.querySelector("[data-agent-user-message]");
const agentChatType = document.querySelector("[data-agent-chat-type]");
const agentChatResolution = document.querySelector("[data-agent-chat-resolution]");
const agentChatPlatform = document.querySelector("[data-agent-chat-platform]");
const agentChatCount = document.querySelector("[data-agent-chat-count]");
const agentReference = document.querySelector("[data-agent-reference]");
const agentReferencePreview = document.querySelector("[data-agent-reference-preview]");
const agentReferenceName = document.querySelector("[data-agent-reference-name]");
const agentReferenceNote = document.querySelector("[data-agent-reference-note]");
const agentReferenceStatus = document.querySelector("[data-agent-reference-status]");
const agentReferenceUpload = document.querySelector("[data-agent-reference-upload]");
const videoPrompt = document.querySelector("[data-video-prompt]");
const videoReferenceInput = document.querySelector("[data-video-reference-input]");
const videoUploadTile = document.querySelector("[data-video-upload-trigger]");
const videoReferencePreview = document.querySelector("[data-video-reference-preview]");
const videoTypeSelect = document.querySelector("[data-video-type]");
const videoRatioSelect = document.querySelector("[data-video-ratio]");
const videoDurationSelect = document.querySelector("[data-video-duration]");
const videoPlatformSelect = document.querySelector("[data-video-platform]");
const videoAdvancedToggle = document.querySelector("[data-video-advanced-toggle]");
const videoAdvancedPanel = document.querySelector("[data-video-advanced-panel]");
const videoSubtitleSelect = document.querySelector("[data-video-subtitle]");
const videoSceneCountInput = document.querySelector("[data-video-scene-count]");
const videoStyleSelect = document.querySelector("[data-video-style]");
const startVideoAgentButton = document.querySelector("[data-start-video-agent]");
const videoAgentPrompt = document.querySelector("[data-video-agent-prompt]");
const videoAgentType = document.querySelector("[data-video-agent-type]");
const videoAgentRatio = document.querySelector("[data-video-agent-ratio]");
const videoAgentDuration = document.querySelector("[data-video-agent-duration]");
const videoAgentPlatform = document.querySelector("[data-video-agent-platform]");
const videoAgentSubtitle = document.querySelector("[data-video-agent-subtitle]");
const videoAgentScenes = document.querySelector("[data-video-agent-scenes]");
const videoAgentStyle = document.querySelector("[data-video-agent-style]");
const videoAgentUserMessage = document.querySelector("[data-video-agent-user-message]");
const videoAgentChatType = document.querySelector("[data-video-agent-chat-type]");
const videoAgentChatRatio = document.querySelector("[data-video-agent-chat-ratio]");
const videoAgentChatDuration = document.querySelector("[data-video-agent-chat-duration]");
const videoAgentChatPlatform = document.querySelector("[data-video-agent-chat-platform]");
const videoAgentReference = document.querySelector("[data-video-agent-reference]");
const videoAgentReferencePreview = document.querySelector("[data-video-agent-reference-preview]");
const videoAgentReferenceName = document.querySelector("[data-video-agent-reference-name]");
const videoAgentReferenceNote = document.querySelector("[data-video-agent-reference-note]");
const videoAgentReferenceStatus = document.querySelector("[data-video-agent-reference-status]");
const videoAgentUpload = document.querySelector("[data-video-agent-upload]");
const outputTypeSelect = document.querySelector("[data-output-type]");
const resolutionSelect = document.querySelector("[data-resolution]");
const platformSelect = document.querySelector("[data-platform]");
const languageControl = document.querySelector("[data-amazon-language]");
const languageSelect = document.querySelector("[data-language]");
const advancedToggle = document.querySelector("[data-advanced-toggle]");
const advancedPanel = document.querySelector("[data-advanced-panel]");
const includeTextSelect = document.querySelector("[data-include-text]");
const generateCountInput = document.querySelector("[data-generate-count]");
const pagePanels = [...document.querySelectorAll("[data-page-panel]")];
const pageButtons = [...document.querySelectorAll("[data-page]")];
const accountTabs = [...document.querySelectorAll(".account-tab")];
const accountPages = new Set(["account", "orders", "points", "rights", "invite"]);
const accountSettingsPages = new Set(["account", "orders", "points", "invite"]);
const pageLabels = {
  home: "工作台",
  video: "视频生成",
  videoAgent: "视频生成 Agent",
  detail: "详情图 Agent",
  account: "账户安全",
  orders: "我的订单",
  points: "积分明细",
  rights: "我的权益",
  invite: "邀请码",
};

function setPage(pageName) {
  if (!pagePanels.length) return;

  pagePanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.pagePanel === pageName);
  });

  pageButtons.forEach((button) => {
    if (button.classList.contains("side-item")) {
      const targetPage = button.dataset.page;
      const isAccountSettingsPage = targetPage === "account" && accountSettingsPages.has(pageName);
      const isCreationFlow = targetPage === "home" && pageName === "detail";
      const isVideoFlow = targetPage === "video" && pageName === "videoAgent";
      button.classList.toggle("is-active", targetPage === pageName || isAccountSettingsPage || isCreationFlow || isVideoFlow);
    }
  });

  accountTabsBar?.classList.toggle("is-visible", accountPages.has(pageName));
  accountTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.page === pageName);
  });

  if (topbarCrumb) {
    topbarCrumb.textContent = `首页 / ${pageLabels[pageName] || "工作台"}`;
  }

  accountStrip?.classList.remove("is-menu-open");
  userTrigger?.setAttribute("aria-expanded", "false");
}

function updateLanguageControl() {
  if (!languageControl || !platformSelect) return;
  languageControl.hidden = platformSelect.value !== "amazon";
}

platformSelect?.addEventListener("change", updateLanguageControl);
updateLanguageControl();

function applyReferenceImage(file) {
  if (!file) return;
  const imageUrl = URL.createObjectURL(file);
  if (uploadPreview) {
    uploadPreview.src = imageUrl;
    uploadPreview.hidden = false;
  }
  uploadTile?.classList.add("has-image");
  if (agentReferencePreview) {
    agentReferencePreview.src = imageUrl;
    agentReferencePreview.hidden = false;
  }
  agentReference?.classList.add("has-image");
  if (agentReferenceName) agentReferenceName.textContent = file.name;
  if (agentReferenceNote) agentReferenceNote.textContent = "已上传参考图，Agent 将优先分析构图、色调、主体位置和文字布局。";
  if (agentReferenceStatus) agentReferenceStatus.textContent = "已上传";
}

uploadTile?.addEventListener("click", () => referenceInput?.click());
agentReferenceUpload?.addEventListener("click", () => referenceInput?.click());
referenceInput?.addEventListener("change", () => {
  applyReferenceImage(referenceInput.files?.[0]);
});

function applyVideoReference(file) {
  if (!file) return;
  const mediaUrl = URL.createObjectURL(file);
  if (videoReferencePreview) {
    videoReferencePreview.src = mediaUrl;
    videoReferencePreview.hidden = false;
  }
  videoUploadTile?.classList.add("has-media");
  if (videoAgentReferencePreview) {
    videoAgentReferencePreview.src = mediaUrl;
    videoAgentReferencePreview.hidden = false;
  }
  videoAgentReference?.classList.add("has-image");
  if (videoAgentReferenceName) videoAgentReferenceName.textContent = file.name;
  if (videoAgentReferenceNote) videoAgentReferenceNote.textContent = "已上传参考素材，Agent 将分析主体、镜头节奏、色调和字幕空间。";
  if (videoAgentReferenceStatus) videoAgentReferenceStatus.textContent = "已上传";
}

videoUploadTile?.addEventListener("click", () => videoReferenceInput?.click());
videoAgentUpload?.addEventListener("click", () => videoReferenceInput?.click());
videoReferenceInput?.addEventListener("change", () => {
  applyVideoReference(videoReferenceInput.files?.[0]);
});

advancedToggle?.addEventListener("click", () => {
  if (!advancedPanel) return;
  const shouldOpen = advancedPanel.hidden;
  advancedPanel.hidden = !shouldOpen;
  advancedToggle.classList.toggle("is-open", shouldOpen);
  advancedToggle.setAttribute("aria-expanded", String(shouldOpen));
});

videoAdvancedToggle?.addEventListener("click", () => {
  if (!videoAdvancedPanel) return;
  const shouldOpen = videoAdvancedPanel.hidden;
  videoAdvancedPanel.hidden = !shouldOpen;
  videoAdvancedToggle.classList.toggle("is-open", shouldOpen);
  videoAdvancedToggle.setAttribute("aria-expanded", String(shouldOpen));
});

startDetailButton?.addEventListener("click", () => {
  const promptValue = homePrompt?.value.trim() || "输入你的即兴灵感，例如：生成一张「蛋牛」品牌的营销广告";
  const typeText = outputTypeSelect?.selectedOptions[0]?.textContent?.trim() || "详情图";
  const resolutionText = resolutionSelect?.selectedOptions[0]?.textContent?.trim() || "2K";
  const platformText = platformSelect?.selectedOptions[0]?.textContent?.trim() || "亚马逊";
  const languageText = platformSelect?.value === "amazon"
    ? languageSelect?.selectedOptions[0]?.textContent?.trim() || "中文"
    : "不适用";
  const includeText = includeTextSelect?.selectedOptions[0]?.textContent?.trim() || "包含";
  const generateCount = generateCountInput?.value || "5";
  const platformSummary = platformSelect?.value === "amazon" ? `${platformText} / ${languageText}` : platformText;

  if (agentPrompt) agentPrompt.textContent = promptValue;
  if (agentType) agentType.textContent = typeText;
  if (agentResolution) agentResolution.textContent = resolutionText;
  if (agentPlatform) agentPlatform.textContent = platformText;
  if (agentLanguage) agentLanguage.textContent = languageText;
  if (agentInclude) agentInclude.textContent = includeText;
  if (agentCount) agentCount.textContent = generateCount;
  if (agentUserMessage) agentUserMessage.textContent = promptValue;
  if (agentChatType) agentChatType.textContent = typeText;
  if (agentChatResolution) agentChatResolution.textContent = resolutionText;
  if (agentChatPlatform) agentChatPlatform.textContent = platformSummary;
  if (agentChatCount) agentChatCount.textContent = `${generateCount}张`;

  setPage("detail");
});

startVideoAgentButton?.addEventListener("click", () => {
  const promptValue = videoPrompt?.value.trim() || "做一条 15 秒的产品展示视频";
  const typeText = videoTypeSelect?.selectedOptions[0]?.textContent?.trim() || "产品展示";
  const ratioText = videoRatioSelect?.selectedOptions[0]?.textContent?.trim() || "9:16 竖版";
  const durationText = videoDurationSelect?.selectedOptions[0]?.textContent?.trim() || "15秒";
  const platformText = videoPlatformSelect?.selectedOptions[0]?.textContent?.trim() || "亚马逊";
  const subtitleText = videoSubtitleSelect?.selectedOptions[0]?.textContent?.trim() || "配字幕";
  const sceneCount = videoSceneCountInput?.value || "4";
  const styleText = videoStyleSelect?.selectedOptions[0]?.textContent?.trim() || "清爽电商";

  if (videoAgentPrompt) videoAgentPrompt.textContent = promptValue;
  if (videoAgentType) videoAgentType.textContent = typeText;
  if (videoAgentRatio) videoAgentRatio.textContent = ratioText;
  if (videoAgentDuration) videoAgentDuration.textContent = durationText;
  if (videoAgentPlatform) videoAgentPlatform.textContent = platformText;
  if (videoAgentSubtitle) videoAgentSubtitle.textContent = subtitleText;
  if (videoAgentScenes) videoAgentScenes.textContent = sceneCount;
  if (videoAgentStyle) videoAgentStyle.textContent = styleText;
  if (videoAgentUserMessage) videoAgentUserMessage.textContent = promptValue;
  if (videoAgentChatType) videoAgentChatType.textContent = typeText;
  if (videoAgentChatRatio) videoAgentChatRatio.textContent = ratioText;
  if (videoAgentChatDuration) videoAgentChatDuration.textContent = durationText;
  if (videoAgentChatPlatform) videoAgentChatPlatform.textContent = platformText;

  setPage("videoAgent");
});

userTrigger?.addEventListener("click", (event) => {
  event.stopPropagation();
  const isOpen = accountStrip.classList.toggle("is-menu-open");
  userTrigger.setAttribute("aria-expanded", String(isOpen));
});

sidebarToggle?.addEventListener("click", () => {
  const isCollapsed = document.body.classList.toggle("is-sidebar-collapsed");
  sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
  sidebarToggle.setAttribute("aria-label", isCollapsed ? "展开侧边栏" : "折叠侧边栏");
});

pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.page) setPage(button.dataset.page);
  });
});

document.addEventListener("click", (event) => {
  if (!accountStrip?.contains(event.target)) {
    accountStrip?.classList.remove("is-menu-open");
    userTrigger?.setAttribute("aria-expanded", "false");
  }
});
