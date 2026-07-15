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

document.querySelectorAll("[data-login-send-code]").forEach((button) => {
  button.addEventListener("click", () => {
    const form = button.closest("form");
    const phoneInput = form?.querySelector('input[type="tel"]');
    if (phoneInput && !phoneInput.checkValidity()) {
      phoneInput.reportValidity();
      phoneInput.focus();
      return;
    }

    let remaining = 60;
    button.disabled = true;
    button.textContent = `重新获取 ${remaining}s`;
    const timer = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(timer);
        button.disabled = false;
        button.textContent = "重新获取";
        return;
      }
      button.textContent = `重新获取 ${remaining}s`;
    }, 1000);
  });
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
const agentReferenceInput = document.querySelector("[data-agent-reference-input]");
const creationModeButtons = [...document.querySelectorAll("[data-creation-mode]")];
const creationModePanels = [...document.querySelectorAll("[data-creation-mode-panel]")];
const creationModeHelper = document.querySelector("[data-mode-helper]");
const quickHomeTypeSelect = document.querySelector("[data-quick-home-type-select]");
const quickHomeTitle = document.querySelector("[data-quick-home-title]");
const quickHomeSellingLabel = document.querySelector("[data-quick-home-selling-label]");
const quickHomeMainField = document.querySelector("[data-quick-home-main-field]");
const quickHomeDetailField = document.querySelector("[data-quick-home-detail-field]");
const quickHomeStatus = document.querySelector("[data-quick-home-status]");
const quickHomeUpload = document.querySelector("[data-quick-home-upload]");
const quickHomeFileInput = document.querySelector("[data-quick-home-file]");
const quickHomeAddButtons = [...document.querySelectorAll("[data-quick-home-add]")];
const quickHomeGallery = document.querySelector("[data-quick-home-gallery]");
const quickHomeThumbnails = document.querySelector("[data-quick-home-thumbnails]");
const quickHomeFileCount = document.querySelector("[data-quick-home-file-count]");
const agentHomeUpload = document.querySelector("[data-agent-home-upload]");
const agentHomeFileInput = document.querySelector("[data-agent-home-file]");
const agentHomeAddButtons = [...document.querySelectorAll("[data-agent-home-add]")];
const agentHomeGallery = document.querySelector("[data-agent-home-gallery]");
const agentHomeThumbnails = document.querySelector("[data-agent-home-thumbnails]");
const agentHomeFileCount = document.querySelector("[data-agent-home-file-count]");
const quickHomePlatform = document.querySelector("[data-quick-home-platform]");
const quickHomeTemplate = document.querySelector("[data-quick-home-template]");
const quickHomeSellingPoint = document.querySelector("[data-quick-home-selling-point]");
const quickHomeCount = document.querySelector("[data-quick-home-count]");
const quickHomeCountUnit = document.querySelector("[data-quick-home-count-unit]");
const openQuickButton = document.querySelector("[data-open-quick]");
const quickPlatform = document.querySelector("[data-quick-platform]");
const quickTemplate = document.querySelector("[data-quick-template]");
const quickInclude = document.querySelector("[data-quick-include]");
const quickCount = document.querySelector("[data-quick-count]");
const quickResolution = document.querySelector("[data-quick-resolution]");
const quickRatio = document.querySelector("[data-quick-ratio]");
const quickLanguage = document.querySelector("[data-quick-language]");
const quickCanvasTitle = document.querySelector("[data-quick-canvas-title]");
const quickCountLabel = document.querySelector("[data-quick-count-label]");
const quickGenerateButton = document.querySelector("[data-quick-generate]");
const quickGenerateLabel = document.querySelector("[data-quick-generate-label]");
const quickEmptyState = document.querySelector("[data-quick-empty]");
const quickAnalyzing = document.querySelector("[data-quick-analyzing]");
const quickResults = document.querySelector("[data-quick-results]");
const quickResultTitle = document.querySelector("[data-quick-result-title]");
const quickResultGrid = document.querySelector("[data-quick-result-grid]");
const quickTextButtons = [...document.querySelectorAll("[data-quick-text]")];
const quickConfirmNote = document.querySelector("[data-quick-confirm-note]");
const quickAnalyzedPreview = document.querySelector("[data-quick-analyzed-preview]");
const quickAnalyzedName = document.querySelector("[data-quick-analyzed-name]");
const quickAnalysisPreview = document.querySelector("[data-quick-analysis-preview]");
const quickAnalysisType = document.querySelector("[data-quick-analysis-type]");
const quickAnalysisPlatform = document.querySelector("[data-quick-analysis-platform]");
const quickAnalysisTemplate = document.querySelector("[data-quick-analysis-template]");
const quickAnalysisSummary = document.querySelector("[data-quick-analysis-summary]");
const quickAnalysisRule = document.querySelector("[data-quick-analysis-rule]");
const quickAnalyzingLabel = document.querySelector("[data-quick-analyzing-label]");
const quickAnalyzingTitle = document.querySelector("[data-quick-analyzing-title]");
const quickAnalyzingNote = document.querySelector("[data-quick-analyzing-note]");
const returnEditButton = document.querySelector("[data-return-edit]");
const focusQuickButtons = [...document.querySelectorAll("[data-focus-quick]")];
const quickProgressSteps = [...document.querySelectorAll("[data-quick-step]")];
const quickToAgentButtons = [...document.querySelectorAll("[data-quick-to-agent], [data-quick-edit-agent]")];
const agentToQuickButton = document.querySelector("[data-agent-to-quick]");
const agentPageTitle = document.querySelector("[data-agent-page-title]");
const agentPageDescription = document.querySelector("[data-agent-page-description]");
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
const accountActionTriggers = [...document.querySelectorAll("[data-account-action]")];
const accountDialogs = [...document.querySelectorAll("[data-account-dialog]")];
const accountAvatar = document.querySelector("[data-account-avatar]");
const topbarAvatar = document.querySelector("[data-topbar-avatar]");
const accountNickname = document.querySelector("[data-account-nickname]");
const topbarNickname = document.querySelector("[data-topbar-nickname]");
const accountPhone = document.querySelector("[data-account-phone]");
const wechatStatus = document.querySelector("[data-wechat-status]");
const accountToast = document.querySelector("[data-account-toast]");
const avatarInput = document.querySelector("[data-avatar-input]");
const avatarDialogPreview = document.querySelector("[data-avatar-dialog-preview]");
const accountTabs = [...document.querySelectorAll(".account-tab")];
const accountPages = new Set(["account", "orders", "points", "rights", "invite"]);
const accountSettingsPages = new Set(["account", "orders", "points", "invite"]);
const pageLabels = {
  home: "工作台",
  video: "视频生成",
  videoAgent: "视频生成 Agent",
  detail: "详情图 Agent",
  quickCreate: "快速生成",
  assets: "我的资产",
  templates: "模板中心",
  toolbox: "AI 工具箱",
  backgroundRemove: "智能抠图",
  backgroundReplace: "AI 背景替换",
  imageCleanup: "画面清理",
  imageEnhance: "图片增强",
  imageCompress: "图片压缩与转换",
  imageResize: "图片尺寸与裁剪",
  videoFrames: "视频抽帧",
  help: "反馈帮助",
  messages: "消息中心",
  account: "账户安全",
  orders: "我的订单",
  points: "积分明细",
  rights: "我的权益",
  invite: "邀请码",
};

const studioSelects = [...document.querySelectorAll('[data-page-panel="home"] select, [data-page-panel="video"] select, [data-page-panel="quickCreate"] select')]
  .filter((select) => !select.classList.contains("skip-custom-select"));
let activeCustomSelect = null;

function closeCustomSelect(control = activeCustomSelect, returnFocus = false) {
  if (!control) return;
  const trigger = control.querySelector(".custom-select-trigger");
  const menu = control.querySelector(".custom-select-menu");
  control.classList.remove("is-open");
  trigger?.setAttribute("aria-expanded", "false");
  if (menu) menu.hidden = true;
  if (returnFocus) trigger?.focus();
  if (activeCustomSelect === control) activeCustomSelect = null;
}

function openCustomSelect(control, focusSelected = false) {
  if (activeCustomSelect && activeCustomSelect !== control) {
    closeCustomSelect(activeCustomSelect);
  }
  const trigger = control.querySelector(".custom-select-trigger");
  const menu = control.querySelector(".custom-select-menu");
  if (!trigger || !menu) return;
  menu.hidden = false;
  control.classList.add("is-open");
  trigger.setAttribute("aria-expanded", "true");
  activeCustomSelect = control;
  if (focusSelected) {
    requestAnimationFrame(() => control.querySelector('.custom-select-option[aria-selected="true"]')?.focus());
  }
}

function enhanceStudioSelect(select, index) {
  if (select.dataset.customSelectReady === "true") return;
  select.dataset.customSelectReady = "true";
  select.classList.add("native-select-hidden");
  select.hidden = true;
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");

  const control = document.createElement("div");
  control.className = "custom-select-control";

  const trigger = document.createElement("button");
  trigger.className = "custom-select-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-label", select.getAttribute("aria-label") || "选择选项");

  const value = document.createElement("span");
  value.className = "custom-select-value";
  const chevron = document.createElement("span");
  chevron.className = "custom-select-chevron";
  chevron.setAttribute("aria-hidden", "true");
  trigger.append(value, chevron);

  const menu = document.createElement("div");
  menu.className = "custom-select-menu";
  menu.id = `studio-select-menu-${index + 1}`;
  menu.setAttribute("role", "listbox");
  menu.setAttribute("aria-label", select.getAttribute("aria-label") || "选择选项");
  menu.hidden = true;
  trigger.setAttribute("aria-controls", menu.id);

  const optionButtons = [...select.options].map((option) => {
    const button = document.createElement("button");
    button.className = "custom-select-option";
    button.type = "button";
    button.dataset.value = option.value;
    button.setAttribute("role", "option");
    const label = document.createElement("span");
    label.textContent = option.textContent?.trim() || option.value;
    button.append(label);
    menu.append(button);
    return button;
  });

  function syncCustomSelect() {
    const selected = select.selectedOptions[0];
    value.textContent = selected?.textContent?.trim() || "请选择";
    optionButtons.forEach((button) => {
      const isSelected = button.dataset.value === select.value;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
    });
  }

  optionButtons.forEach((button, optionIndex) => {
    button.addEventListener("click", () => {
      select.value = button.dataset.value || "";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      syncCustomSelect();
      closeCustomSelect(control, true);
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCustomSelect(control, true);
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = optionIndex;
      if (event.key === "ArrowDown") nextIndex = (optionIndex + 1) % optionButtons.length;
      if (event.key === "ArrowUp") nextIndex = (optionIndex - 1 + optionButtons.length) % optionButtons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = optionButtons.length - 1;
      optionButtons[nextIndex]?.focus();
    });
  });

  trigger.addEventListener("click", () => {
    if (control.classList.contains("is-open")) closeCustomSelect(control);
    else openCustomSelect(control);
  });
  trigger.addEventListener("keydown", (event) => {
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      openCustomSelect(control, true);
    }
    if (event.key === "Escape") closeCustomSelect(control);
  });

  select.addEventListener("change", syncCustomSelect);
  select.insertAdjacentElement("afterend", control);
  control.append(trigger, menu);
  select.parentElement?.classList.add("has-custom-select");
  syncCustomSelect();
}

studioSelects.forEach(enhanceStudioSelect);

document.addEventListener("click", (event) => {
  if (activeCustomSelect && !activeCustomSelect.contains(event.target)) {
    closeCustomSelect(activeCustomSelect);
  }
});

function setPage(pageName) {
  if (!pagePanels.length) return;

  if (pageName !== "videoFrames") document.querySelector("[data-frame-video]")?.pause();

  pagePanels.forEach((panel) => {
    const isActivePanel = panel.dataset.pagePanel === pageName;
    panel.classList.toggle("is-active", isActivePanel);
    if (isActivePanel) panel.scrollTop = 0;
  });

  pageButtons.forEach((button) => {
    if (button.classList.contains("side-item")) {
      const targetPage = button.dataset.page;
      const isAccountSettingsPage = targetPage === "account" && accountSettingsPages.has(pageName);
      const isCreationFlow = targetPage === "home" && ["detail", "quickCreate"].includes(pageName);
      const isVideoFlow = targetPage === "video" && pageName === "videoAgent";
      const isToolFlow = targetPage === "toolbox" && ["backgroundRemove", "backgroundReplace", "imageCleanup", "imageEnhance", "imageCompress", "imageResize", "videoFrames"].includes(pageName);
      button.classList.toggle("is-active", targetPage === pageName || isAccountSettingsPage || isCreationFlow || isVideoFlow || isToolFlow);
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

let activeQuickType = "main";
let sharedReferenceUrl = "";
let sharedReferenceFiles = [];
let sharedReferenceUrls = [];
const quickReferenceLimit = 6;

function setSelectValue(select, value) {
  if (!select || !value) return;
  const hasOption = [...select.options].some((option) => option.value === value);
  if (!hasOption) return;
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function setCreationMode(mode) {
  creationModeButtons.forEach((button) => {
    const isActive = button.dataset.creationMode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  creationModePanels.forEach((panel) => {
    const isActive = panel.dataset.creationModePanel === mode;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
  if (creationModeHelper) {
    creationModeHelper.textContent = mode === "agent"
      ? "适合复杂要求、多轮沟通，以及逐屏或局部精细调整。"
      : "上传商品图，选择用途和模板，快速获得可用结果。";
  }
}

creationModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.creationMode || "quick";
    if (mode === "agent") {
      setSelectValue(outputTypeSelect, activeQuickType);
      setSelectValue(platformSelect, quickHomePlatform?.value || "amazon");
      const sellingPoint = quickHomeSellingPoint?.value.trim();
      if (sellingPoint && homePrompt) homePrompt.value = sellingPoint;
    } else {
      setQuickType(outputTypeSelect?.value || activeQuickType, { keepCount: true, resetResult: false });
      setSelectValue(quickHomePlatform, platformSelect?.value || "amazon");
      if (quickHomeCount && generateCountInput) quickHomeCount.value = generateCountInput.value || quickHomeCount.value;
      if (quickHomeSellingPoint && homePrompt?.value.trim()) quickHomeSellingPoint.value = homePrompt.value.trim();
    }
    setCreationMode(mode);
  });
});

function updateQuickGenerateLabel() {
  const count = Math.max(1, Math.min(10, Number.parseInt(quickCount?.value || "4", 10) || 4));
  if (quickGenerateLabel) {
    quickGenerateLabel.textContent = activeQuickType === "detail"
      ? `确认并生成 ${count} 屏详情图`
      : `确认并生成 ${count} 张主图`;
  }
  if (quickConfirmNote) {
    quickConfirmNote.textContent = activeQuickType === "detail"
      ? `AI 建议生成 ${count} 屏详情图，按照首屏、卖点、场景和转化信息依次展开。`
      : `AI 建议生成 ${count} 张不同构图的主图，并保留带文案与无文案的版本。`;
  }
}

function setQuickType(type, { keepCount = false, resetResult = true } = {}) {
  activeQuickType = type === "detail" ? "detail" : "main";
  const isDetail = activeQuickType === "detail";
  if (quickHomeTypeSelect && quickHomeTypeSelect.value !== activeQuickType) {
    setSelectValue(quickHomeTypeSelect, activeQuickType);
  }
  if (quickHomeTitle) quickHomeTitle.textContent = isDetail ? "详情图生成设置" : "商品主图生成设置";
  if (quickHomeSellingLabel) quickHomeSellingLabel.textContent = isDetail ? "详情页核心卖点" : "主图核心卖点";
  if (quickHomeSellingPoint) {
    quickHomeSellingPoint.placeholder = isDetail
      ? "例如：轻便、防滑、缓震，适合户外通勤人群"
      : "例如：轻便、防滑，适合户外通勤";
  }
  if (quickHomeMainField) quickHomeMainField.hidden = isDetail;
  if (quickHomeDetailField) quickHomeDetailField.hidden = !isDetail;
  if (quickCanvasTitle) quickCanvasTitle.textContent = "素材分析与生成预览";
  if (quickCountLabel) quickCountLabel.textContent = isDetail ? "详情屏数" : "生成数量";
  if (quickHomeCountUnit) quickHomeCountUnit.textContent = isDetail ? "屏" : "张";
  if (!keepCount) {
    const defaultCount = isDetail ? "5" : "4";
    if (quickHomeCount) quickHomeCount.value = defaultCount;
    if (quickCount) quickCount.value = defaultCount;
  }
  setSelectValue(quickRatio, isDetail ? "3:4" : "1:1");
  quickResults?.classList.toggle("is-detail", isDetail);
  syncQuickAnalysisSummary();
  updateQuickGenerateLabel();

  if (resetResult && quickResults && !quickResults.hidden) {
    quickResults.hidden = true;
    if (quickEmptyState) quickEmptyState.hidden = false;
    setQuickStage(1);
  }
}

quickHomeTypeSelect?.addEventListener("change", () => setQuickType(quickHomeTypeSelect.value));

quickTextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.quickText === "exclude" ? "exclude" : "include";
    if (quickInclude) quickInclude.value = value;
    quickTextButtons.forEach((item) => {
      const isActive = item.dataset.quickText === value;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    updateQuickGenerateLabel();
  });
});

function syncQuickAnalysisSummary() {
  const platformText = quickPlatform?.selectedOptions[0]?.textContent?.trim()
    || quickHomePlatform?.selectedOptions[0]?.textContent?.trim()
    || "亚马逊";
  const templateText = quickTemplate?.selectedOptions[0]?.textContent?.trim()
    || quickHomeTemplate?.selectedOptions[0]?.textContent?.trim()
    || "AI 智能推荐";
  const typeText = activeQuickType === "detail" ? "详情图" : "商品主图";
  const ratioText = activeQuickType === "detail" ? "3:4" : "1:1";
  const referenceCount = Math.max(1, sharedReferenceFiles.length);
  if (quickAnalysisType) quickAnalysisType.textContent = typeText;
  if (quickAnalysisPlatform) quickAnalysisPlatform.textContent = platformText;
  if (quickAnalysisTemplate) quickAnalysisTemplate.textContent = templateText;
  if (quickAnalysisSummary) {
    quickAnalysisSummary.textContent = activeQuickType === "detail"
      ? `已综合 ${referenceCount} 张商品素材中的主体、角度与细节，适合按照 ${platformText} 详情页结构规划多屏卖点。`
      : `已综合 ${referenceCount} 张商品素材，主体完整、背景干净，适合按照 ${platformText} 主图规范继续生成。`;
  }
  if (quickAnalysisRule) quickAnalysisRule.textContent = `已匹配 ${platformText} · ${ratioText} 规范`;
}

[quickPlatform, quickTemplate].forEach((select) => {
  select?.addEventListener("change", syncQuickAnalysisSummary);
});

setQuickType(quickHomeTypeSelect?.value || "main", { keepCount: false, resetResult: false });

function syncHomeQuickToWorkbench() {
  setQuickType(quickHomeTypeSelect?.value || activeQuickType, { keepCount: true, resetResult: false });
  if (quickCount && quickHomeCount) quickCount.value = quickHomeCount.value;
  setSelectValue(quickPlatform, quickHomePlatform?.value || "amazon");
  setSelectValue(quickTemplate, quickHomeTemplate?.value || "auto");
  syncQuickAnalysisSummary();
}

function beginQuickAnalysis() {
  syncHomeQuickToWorkbench();
  setPage("quickCreate");
  if (quickEmptyState) quickEmptyState.hidden = true;
  if (quickResults) quickResults.hidden = true;
  if (quickAnalyzing) quickAnalyzing.hidden = false;
  const requestedCount = Math.max(1, Math.min(10, Number.parseInt(quickCount?.value || "4", 10) || 4));
  if (quickAnalyzingLabel) quickAnalyzingLabel.textContent = `正在分析 ${sharedReferenceFiles.length} 张商品素材`;
  if (quickAnalyzingTitle) {
    quickAnalyzingTitle.textContent = activeQuickType === "detail"
      ? `正在规划 ${requestedCount} 屏详情图的内容结构…`
      : `正在规划 ${requestedCount} 张主图的构图方向…`;
  }
  if (quickAnalyzingNote) quickAnalyzingNote.textContent = "分析完成后只需要确认生成数量和画面文字。";
  if (quickGenerateButton) quickGenerateButton.disabled = true;
  if (quickGenerateLabel) quickGenerateLabel.textContent = "素材分析中…";
  setQuickStage(2);
  window.setTimeout(() => {
    if (quickAnalyzing) quickAnalyzing.hidden = true;
    if (quickEmptyState) quickEmptyState.hidden = false;
    if (quickGenerateButton) quickGenerateButton.disabled = false;
    syncQuickAnalysisSummary();
    updateQuickGenerateLabel();
    setQuickStage(3);
  }, 900);
}

openQuickButton?.addEventListener("click", () => {
  if (!sharedReferenceUrl) {
    if (quickHomeStatus) {
      quickHomeStatus.classList.add("is-error");
      quickHomeStatus.innerHTML = '<i aria-hidden="true">!</i>请先上传商品素材，再开始分析';
    }
    quickHomeUpload?.focus();
    return;
  }
  beginQuickAnalysis();
});

focusQuickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCreationMode("quick");
    document.querySelector(".quick-home-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => quickHomeTypeSelect?.parentElement?.querySelector(".custom-select-trigger")?.focus(), 260);
  });
});

returnEditButton?.addEventListener("click", () => {
  setPage("home");
  setCreationMode("quick");
  document.querySelector(".quick-home-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
});

function setQuickStage(activeStage) {
  quickProgressSteps.forEach((step, index) => {
    const stepNumber = index + 1;
    step.classList.toggle("is-active", stepNumber === activeStage);
    step.classList.toggle("is-complete", stepNumber < activeStage || activeStage > 3);
  });
}

function renderQuickResults() {
  if (!quickResultGrid) return;
  const requestedCount = Math.max(1, Math.min(10, Number.parseInt(quickCount?.value || "4", 10) || 4));
  const imageSources = [
    "assets/dashboard/work-1-hd.jpg",
    "assets/dashboard/work-2-hd.jpg",
    "assets/dashboard/work-3-hd.jpg",
    "assets/dashboard/work-6-hd.jpg",
    "assets/dashboard/work-4-hd.jpg",
    "assets/dashboard/work-5-hd.jpg",
  ];
  quickResultGrid.replaceChildren();
  for (let index = 0; index < requestedCount; index += 1) {
    const card = document.createElement("article");
    card.className = "quick-result-card";
    const image = document.createElement("img");
    image.src = imageSources[index % imageSources.length];
    image.alt = `${activeQuickType === "detail" ? "详情图" : "主图"}快速生成结果 ${index + 1}`;
    const footer = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = activeQuickType === "detail"
      ? `详情屏 ${String(index + 1).padStart(2, "0")}`
      : `方案 ${String(index + 1).padStart(2, "0")}`;
    const download = document.createElement("button");
    download.type = "button";
    download.textContent = "下载";
    footer.append(label, download);
    card.append(image, footer);
    quickResultGrid.append(card);
  }
  if (quickResultTitle) {
    quickResultTitle.textContent = activeQuickType === "detail"
      ? `已完成 ${requestedCount} 屏详情图`
      : `已完成 ${requestedCount} 张商品主图`;
  }
}

quickGenerateButton?.addEventListener("click", () => {
  if (!sharedReferenceUrl) {
    setPage("home");
    setCreationMode("quick");
    if (quickHomeStatus) {
      quickHomeStatus.classList.add("is-error");
      quickHomeStatus.innerHTML = '<i aria-hidden="true">!</i>商品素材已失效，请重新上传后分析';
    }
    window.setTimeout(() => quickHomeUpload?.focus(), 0);
    return;
  }
  if (quickEmptyState) quickEmptyState.hidden = true;
  if (quickResults) quickResults.hidden = true;
  if (quickAnalyzing) quickAnalyzing.hidden = false;
  quickGenerateButton.disabled = true;
  if (quickAnalyzingLabel) quickAnalyzingLabel.textContent = "正在生成你的电商视觉";
  if (quickAnalyzingTitle) {
    quickAnalyzingTitle.textContent = activeQuickType === "detail"
      ? "组织卖点层级并生成详情图…"
      : "匹配构图与文案并生成商品主图…";
  }
  if (quickAnalyzingNote) quickAnalyzingNote.textContent = "已采用刚刚确认的数量与画面文字设置。";
  if (quickGenerateLabel) quickGenerateLabel.textContent = "正在生成…";
  setQuickStage(3);

  window.setTimeout(() => {
    renderQuickResults();
    if (quickAnalyzing) quickAnalyzing.hidden = true;
    if (quickResults) quickResults.hidden = false;
    quickGenerateButton.disabled = false;
    updateQuickGenerateLabel();
    setQuickStage(4);
  }, 1200);
});

document.querySelectorAll("[data-count-step]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!quickCount) return;
    const step = Number.parseInt(button.dataset.countStep || "0", 10);
    const nextValue = Math.max(1, Math.min(10, (Number.parseInt(quickCount.value || "1", 10) || 1) + step));
    quickCount.value = String(nextValue);
    updateQuickGenerateLabel();
  });
});

quickCount?.addEventListener("input", updateQuickGenerateLabel);

document.querySelectorAll("[data-home-count-step]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!quickHomeCount) return;
    const step = Number.parseInt(button.dataset.homeCountStep || "0", 10);
    const current = Number.parseInt(quickHomeCount.value || "1", 10) || 1;
    quickHomeCount.value = String(Math.max(1, Math.min(10, current + step)));
  });
});

quickHomeCount?.addEventListener("change", () => {
  const nextValue = Math.max(1, Math.min(10, Number.parseInt(quickHomeCount.value || "1", 10) || 1));
  quickHomeCount.value = String(nextValue);
});

function syncReferencePreview(image, imageUrl) {
  if (!image) return;
  image.hidden = !imageUrl;
  if (imageUrl) image.src = imageUrl;
  else image.removeAttribute("src");
}

function renderReferenceGallery({ upload, gallery, thumbnails, countLabel }) {
  const count = sharedReferenceFiles.length;
  const emptyState = upload?.querySelector(".quick-upload-empty");
  if (emptyState) emptyState.hidden = count > 0;
  if (gallery) gallery.hidden = count === 0;
  if (countLabel) countLabel.textContent = String(count);
  upload?.classList.toggle("has-images", count > 0);
  if (!thumbnails) return;

  thumbnails.replaceChildren();
  sharedReferenceFiles.forEach((file, index) => {
    const item = document.createElement("figure");
    item.className = "quick-upload-thumbnail";
    const image = document.createElement("img");
    image.src = sharedReferenceUrls[index];
    image.alt = `商品素材 ${index + 1}`;
    image.title = file.name;
    const badge = document.createElement("span");
    badge.textContent = index === 0 ? "主素材" : String(index + 1).padStart(2, "0");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("aria-label", `移除商品素材 ${index + 1}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      setSharedReferenceFiles(sharedReferenceFiles.filter((_, fileIndex) => fileIndex !== index));
    });
    item.append(image, badge, remove);
    thumbnails.append(item);
  });
}

function renderSharedReferenceGalleries() {
  renderReferenceGallery({
    upload: quickHomeUpload,
    gallery: quickHomeGallery,
    thumbnails: quickHomeThumbnails,
    countLabel: quickHomeFileCount,
  });
  renderReferenceGallery({
    upload: agentHomeUpload,
    gallery: agentHomeGallery,
    thumbnails: agentHomeThumbnails,
    countLabel: agentHomeFileCount,
  });
}

function syncSharedReferencePresentation({ limitReached = false } = {}) {
  const imageUrl = sharedReferenceUrls[0] || "";
  const count = sharedReferenceFiles.length;
  sharedReferenceUrl = imageUrl;

  syncReferencePreview(quickAnalyzedPreview, imageUrl);
  syncReferencePreview(quickAnalysisPreview, imageUrl);
  syncReferencePreview(agentReferencePreview, imageUrl);
  agentReference?.classList.toggle("has-image", count > 0);
  renderSharedReferenceGalleries();

  if (quickHomeStatus) {
    quickHomeStatus.classList.remove("is-error", "is-warning", "is-ready");
    if (count > 0) {
      quickHomeStatus.classList.add(limitReached ? "is-warning" : "is-ready");
      quickHomeStatus.innerHTML = limitReached
        ? `<i aria-hidden="true">!</i>最多支持 ${quickReferenceLimit} 张，已保留前 ${quickReferenceLimit} 张素材`
        : `<i aria-hidden="true"></i>已添加 ${count} 张素材，可以开始智能分析`;
    } else {
      quickHomeStatus.innerHTML = '<i aria-hidden="true"></i>上传商品图后，AI 会先完成素材分析';
    }
  }

  if (quickAnalyzedName) {
    quickAnalyzedName.textContent = count > 0 ? `${count} 张商品素材已通过检查` : "商品素材已通过检查";
  }
  if (agentReferenceName) agentReferenceName.textContent = count > 0 ? `${count} 张商品素材` : "暂无参考图";
  if (agentReferenceNote) {
    agentReferenceNote.textContent = count > 0
      ? "首张作为主素材，其余图片用于补充细节、角度、构图和色调参考。"
      : "在对话输入区点击“添加参考图”补充素材";
  }
  if (agentReferenceStatus) agentReferenceStatus.textContent = count > 0 ? `已上传 ${count} 张` : "未上传";
}

function setSharedReferenceFiles(files, { append = false } = {}) {
  const incomingFiles = [...files].filter((file) => (
    file?.type?.startsWith("image/") || /\.(avif|gif|jpe?g|png|webp)$/i.test(file?.name || "")
  ));
  if (!incomingFiles.length && append) return;
  const combinedFiles = append ? [...sharedReferenceFiles, ...incomingFiles] : incomingFiles;
  const uniqueFiles = combinedFiles.filter((file, index, list) => {
    const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
    return list.findIndex((item) => `${item.name}-${item.size}-${item.lastModified}` === fileKey) === index;
  });
  const limitReached = uniqueFiles.length > quickReferenceLimit;
  sharedReferenceFiles = uniqueFiles.slice(0, quickReferenceLimit);
  sharedReferenceUrls.forEach((url) => URL.revokeObjectURL(url));
  sharedReferenceUrls = sharedReferenceFiles.map((file) => URL.createObjectURL(file));
  syncSharedReferencePresentation({ limitReached });
}

function applyReferenceImage(file) {
  if (!file) return;
  setSharedReferenceFiles([file]);
}

function addQuickHomeReferenceImages(files) {
  setSharedReferenceFiles(files, { append: true });
}

quickHomeAddButtons.forEach((button) => {
  button.addEventListener("click", () => quickHomeFileInput?.click());
});
agentHomeAddButtons.forEach((button) => {
  button.addEventListener("click", () => agentHomeFileInput?.click());
});
quickHomeFileInput?.addEventListener("change", () => {
  addQuickHomeReferenceImages(quickHomeFileInput.files || []);
  quickHomeFileInput.value = "";
});
agentHomeFileInput?.addEventListener("change", () => {
  addQuickHomeReferenceImages(agentHomeFileInput.files || []);
  agentHomeFileInput.value = "";
});
agentReferenceInput?.addEventListener("change", () => {
  applyReferenceImage(agentReferenceInput.files?.[0]);
});

function enableReferenceDropzone(dropzone) {
  if (!dropzone) return;
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove("is-dragging");
    });
  });
  dropzone.addEventListener("drop", (event) => {
    addQuickHomeReferenceImages(event.dataTransfer?.files || []);
  });
}

enableReferenceDropzone(quickHomeUpload);
enableReferenceDropzone(agentHomeUpload);

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

function openImageAgentTask({
  promptValue,
  typeValue,
  typeText,
  resolutionText,
  platformText,
  languageText,
  includeText,
  generateCount,
}) {
  const platformSummary = platformText === "亚马逊" ? `${platformText} / ${languageText}` : platformText;
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

  const isMain = typeValue === "main";
  if (agentPageTitle) agentPageTitle.textContent = isMain ? "主图 Agent" : "详情图 Agent";
  if (agentPageDescription) {
    agentPageDescription.textContent = isMain
      ? "我会分析商品主体、构图和投放场景，再通过对话细化背景与文案方向"
      : "我会理解商品、参考图和平台规则，再与你确认分屏卖点和页面节奏";
  }
  const flowSteps = [...document.querySelectorAll("[data-agent-flow-step]")];
  const flowCopy = isMain
    ? ["理解商品与投放目标", "分析主体、构图和背景", "确认卖点、文案和方向", "生成主图并输出变体"]
    : ["理解需求与平台规则", "分析参考图风格和构图", "确认分屏卖点和页面节奏", "生成详情图并输出结果"];
  flowSteps.forEach((step, index) => {
    if (flowCopy[index]) step.textContent = flowCopy[index];
  });
  const intro = document.querySelector("[data-agent-intro]");
  const checklist = document.querySelector("[data-agent-checklist]");
  const resultTitle = document.querySelector("[data-agent-result-title]");
  const resultNote = document.querySelector("[data-agent-result-note]");
  if (intro) {
    intro.textContent = isMain
      ? "我已读取快速生成中的素材和参数。接下来可以继续指定构图、背景、商品摆放或文案位置，也可以让我直接给出多套主图方向。"
      : "我已读取你的商品素材和基础设置。接下来会先规划每一屏的任务与卖点，再按确认后的顺序生成完整详情页。";
  }
  if (checklist) {
    checklist.textContent = isMain
      ? "核心卖点、投放平台、背景倾向，以及是否需要固定品牌文案。"
      : "产品名称、核心卖点、目标用户、详情页屏数和必须出现的品牌信息。";
  }
  if (resultTitle) resultTitle.textContent = `已生成 ${generateCount} 张${isMain ? "主图" : "详情图"}`;
  if (resultNote) {
    resultNote.textContent = isMain
      ? "已生成多套构图与背景方向，可下载、继续生成变体或用对话精细调整。"
      : "已按照当前分屏方案完成生成，可逐屏预览、调整或批量下载。";
  }
  document.querySelectorAll("[data-agent-result-label]").forEach((label, index) => {
    label.textContent = `${isMain ? "主图方案" : "详情图"} ${String(index + 1).padStart(2, "0")}`;
  });

  setPage("detail");
  if (topbarCrumb) topbarCrumb.textContent = `首页 / ${isMain ? "主图 Agent" : "详情图 Agent"}`;
}

startDetailButton?.addEventListener("click", () => {
  const promptValue = homePrompt?.value.trim() || "输入你的即兴灵感，例如：生成一张「蛋牛」品牌的营销广告";
  const typeValue = outputTypeSelect?.value || "detail";
  const typeText = outputTypeSelect?.selectedOptions[0]?.textContent?.trim() || "详情图";
  const resolutionText = resolutionSelect?.selectedOptions[0]?.textContent?.trim() || "2K";
  const platformText = platformSelect?.selectedOptions[0]?.textContent?.trim() || "亚马逊";
  const languageText = platformSelect?.value === "amazon"
    ? languageSelect?.selectedOptions[0]?.textContent?.trim() || "中文"
    : "不适用";
  const includeText = includeTextSelect?.selectedOptions[0]?.textContent?.trim() || "包含";
  const generateCount = generateCountInput?.value || "5";
  openImageAgentTask({ promptValue, typeValue, typeText, resolutionText, platformText, languageText, includeText, generateCount });
});

function openAgentFromQuick() {
  const typeText = activeQuickType === "detail" ? "详情图" : "主图";
  const promptValue = quickHomeSellingPoint?.value.trim()
    || (activeQuickType === "detail" ? "请根据商品素材规划完整详情页" : "请根据商品素材生成高转化电商主图");
  const resolutionText = quickResolution?.selectedOptions[0]?.textContent?.split("·")[0]?.trim() || "2K";
  const platformText = quickPlatform?.selectedOptions[0]?.textContent?.trim() || "亚马逊";
  const languageText = quickLanguage?.selectedOptions[0]?.textContent?.trim() || "中文";
  const includeText = quickInclude?.selectedOptions[0]?.textContent?.trim() || "包含文字";
  const generateCount = quickCount?.value || (activeQuickType === "detail" ? "5" : "4");

  setSelectValue(outputTypeSelect, activeQuickType);
  setSelectValue(resolutionSelect, quickResolution?.value || "2k");
  setSelectValue(platformSelect, quickPlatform?.value || "amazon");
  setSelectValue(languageSelect, quickLanguage?.value || "zh");
  setSelectValue(includeTextSelect, quickInclude?.value || "include");
  if (generateCountInput) generateCountInput.value = generateCount;
  if (homePrompt) homePrompt.value = promptValue;

  openImageAgentTask({
    promptValue,
    typeValue: activeQuickType,
    typeText,
    resolutionText,
    platformText,
    languageText,
    includeText,
    generateCount,
  });
}

quickToAgentButtons.forEach((button) => button.addEventListener("click", openAgentFromQuick));

agentToQuickButton?.addEventListener("click", () => {
  const typeValue = outputTypeSelect?.value || (agentType?.textContent?.includes("主图") ? "main" : "detail");
  setQuickType(typeValue, { keepCount: true, resetResult: false });
  setSelectValue(quickPlatform, platformSelect?.value || "amazon");
  setSelectValue(quickResolution, resolutionSelect?.value || "2k");
  setSelectValue(quickLanguage, languageSelect?.value || "zh");
  setSelectValue(quickInclude, includeTextSelect?.value || "include");
  if (quickCount && generateCountInput) quickCount.value = generateCountInput.value || quickCount.value;
  if (quickHomeSellingPoint && homePrompt) quickHomeSellingPoint.value = homePrompt.value.trim();
  quickTextButtons.forEach((item) => {
    const isActive = item.dataset.quickText === quickInclude?.value;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  if (quickAnalyzing) quickAnalyzing.hidden = true;
  if (quickResults) quickResults.hidden = true;
  if (quickEmptyState) quickEmptyState.hidden = false;
  syncQuickAnalysisSummary();
  updateQuickGenerateLabel();
  setQuickStage(3);
  setPage("quickCreate");
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
    if (button.dataset.page === "quickCreate") syncHomeQuickToWorkbench();
    if (button.dataset.page) setPage(button.dataset.page);
  });
});

let accountToastTimer;

function showAccountToast(message) {
  if (!accountToast) return;
  window.clearTimeout(accountToastTimer);
  accountToast.textContent = message;
  accountToast.hidden = false;
  accountToast.classList.add("is-visible");
  accountToastTimer = window.setTimeout(() => {
    accountToast.classList.remove("is-visible");
    accountToast.hidden = true;
  }, 2200);
}

function prepareAccountDialog(action) {
  const dialog = accountDialogs.find((item) => item.dataset.accountDialog === action);
  if (!dialog) return null;

  if (action === "avatar") {
    if (avatarDialogPreview && accountAvatar) avatarDialogPreview.src = accountAvatar.src;
    if (avatarInput) avatarInput.value = "";
  }

  if (action === "nickname") {
    const nicknameInput = dialog.querySelector("[data-nickname-input]");
    if (nicknameInput && accountNickname) nicknameInput.value = accountNickname.textContent.trim();
  }

  if (action === "phone" || action === "password") {
    dialog.querySelector("form")?.reset();
  }

  const passwordError = dialog.querySelector("[data-password-error]");
  if (passwordError) passwordError.hidden = true;
  return dialog;
}

accountActionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dialog = prepareAccountDialog(trigger.dataset.accountAction);
    if (dialog && !dialog.open) dialog.showModal();
  });
});

accountDialogs.forEach((dialog) => {
  dialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => dialog.close("cancel"));
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close("cancel");
  });
});

avatarInput?.addEventListener("change", () => {
  const file = avatarInput.files?.[0];
  if (!file || !avatarDialogPreview) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    if (typeof reader.result === "string") avatarDialogPreview.src = reader.result;
  });
  reader.readAsDataURL(file);
});

document.querySelector("[data-account-form=\"avatar\"]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const dialog = event.currentTarget.closest("dialog");
  if (avatarDialogPreview && accountAvatar) accountAvatar.src = avatarDialogPreview.src;
  if (avatarDialogPreview && topbarAvatar) topbarAvatar.src = avatarDialogPreview.src;
  dialog?.close("saved");
  showAccountToast("头像已更新");
});

document.querySelector("[data-account-form=\"nickname\"]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const nicknameInput = form.querySelector("[data-nickname-input]");
  const nextNickname = nicknameInput?.value.trim();
  if (!nextNickname) return;
  if (accountNickname) accountNickname.textContent = nextNickname;
  if (topbarNickname) topbarNickname.textContent = nextNickname;
  form.closest("dialog")?.close("saved");
  showAccountToast("昵称已更新");
});

document.querySelector("[data-account-form=\"phone\"]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const phoneInput = form.querySelector("[data-phone-input]");
  const phoneDigits = phoneInput?.value.replace(/\D/g, "") || "";
  if (phoneDigits.length !== 11) return;
  if (accountPhone) accountPhone.textContent = `+86 ${phoneDigits.slice(0, 3)}****${phoneDigits.slice(-4)}`;
  form.closest("dialog")?.close("saved");
  showAccountToast("手机号已更新");
});

document.querySelector("[data-account-form=\"password\"]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const nextPassword = form.querySelector("[data-new-password]")?.value || "";
  const confirmPassword = form.querySelector("[data-confirm-password]")?.value || "";
  const error = form.querySelector("[data-password-error]");
  if (nextPassword !== confirmPassword) {
    if (error) error.hidden = false;
    form.querySelector("[data-confirm-password]")?.focus();
    return;
  }
  if (error) error.hidden = true;
  form.closest("dialog")?.close("saved");
  form.reset();
  showAccountToast("登录密码已更新");
});

document.querySelector("[data-account-form=\"wechat-unbind\"]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const unbindButton = document.querySelector("[data-account-action=\"wechat-unbind\"]");
  if (wechatStatus) wechatStatus.textContent = "未绑定";
  if (unbindButton) {
    unbindButton.textContent = "已解绑";
    unbindButton.disabled = true;
  }
  form.closest("dialog")?.close("confirmed");
  showAccountToast("微信账号已解除绑定");
});

document.querySelector("[data-send-code]")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = "验证码已发送";
  window.setTimeout(() => {
    button.disabled = false;
    button.textContent = "重新获取";
  }, 2000);
});

async function copyInviteText(copyText) {
  const helper = document.createElement("textarea");
  helper.value = copyText;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();
  const didCopy = document.execCommand("copy");
  helper.remove();
  if (didCopy) return;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(copyText);
    return;
  }

  throw new Error("Copy failed");
}

document.addEventListener("click", async (event) => {
  const button = event.target instanceof Element ? event.target.closest("[data-copy-text]") : null;
  if (!button) return;

  const label = button.querySelector("[data-copy-label]");
  const copyText = button.dataset.copyText || "";
  if (label) label.textContent = "复制中…";

  try {
    await copyInviteText(copyText);
    if (label) label.textContent = "已复制";
    button.classList.add("is-copied");
  } catch {
    if (label) label.textContent = "复制失败";
  }

  window.setTimeout(() => {
    if (label) label.textContent = "复制";
    button.classList.remove("is-copied");
  }, 1600);
});

document.addEventListener("click", (event) => {
  if (!accountStrip?.contains(event.target)) {
    accountStrip?.classList.remove("is-menu-open");
    userTrigger?.setAttribute("aria-expanded", "false");
  }
});

const workspaceToast = document.querySelector("[data-workspace-toast]");
let workspaceToastTimer;

function showWorkspaceToast(message) {
  if (!workspaceToast) return;
  window.clearTimeout(workspaceToastTimer);
  workspaceToast.textContent = message;
  workspaceToast.hidden = false;
  requestAnimationFrame(() => workspaceToast.classList.add("is-visible"));
  workspaceToastTimer = window.setTimeout(() => {
    workspaceToast.classList.remove("is-visible");
    window.setTimeout(() => {
      workspaceToast.hidden = true;
    }, 180);
  }, 2200);
}

function setupCardFilter({ groupName, cardSelector, categoryKey, searchSelector, emptySelector, matchCategory }) {
  const group = document.querySelector(`[data-filter-group="${groupName}"]`);
  const cards = [...document.querySelectorAll(cardSelector)];
  const search = document.querySelector(searchSelector);
  const empty = document.querySelector(emptySelector);
  if (!group || !cards.length) return;

  let activeFilter = "all";

  function refresh() {
    const query = search?.value.trim().toLocaleLowerCase("zh-CN") || "";
    let visibleCount = 0;
    cards.forEach((card) => {
      const category = card.dataset[categoryKey] || "";
      const searchText = card.dataset.searchText?.toLocaleLowerCase("zh-CN") || "";
      const categoryMatches = activeFilter === "all" || (matchCategory ? matchCategory(card, activeFilter) : category.split(" ").includes(activeFilter));
      const searchMatches = !query || searchText.includes(query);
      const shouldShow = categoryMatches && searchMatches;
      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });
    if (empty) empty.hidden = visibleCount > 0;
  }

  group.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      group.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
      refresh();
    });
  });

  search?.addEventListener("input", refresh);
  refresh();
}

setupCardFilter({
  groupName: "assets",
  cardSelector: "[data-asset-grid] .asset-card",
  categoryKey: "assetType",
  searchSelector: "[data-asset-search]",
  emptySelector: "[data-asset-empty]",
});

setupCardFilter({
  groupName: "templates",
  cardSelector: "[data-template-grid] .template-card",
  categoryKey: "templateCategory",
  searchSelector: "[data-template-search]",
  emptySelector: "[data-template-empty]",
});

setupCardFilter({
  groupName: "tools",
  cardSelector: "[data-tool-grid] .toolbox-card",
  categoryKey: "toolCategory",
  searchSelector: "[data-tool-search]",
  emptySelector: "[data-tool-empty]",
});

const templateDialog = document.querySelector("[data-template-dialog]");
const templateReferenceInput = document.querySelector("[data-template-reference]");
const templateUploadTrigger = document.querySelector("[data-template-upload-trigger]");
const templateUploadPreview = document.querySelector("[data-template-upload-preview]");
const templateUploadLabel = document.querySelector("[data-template-upload-label]");
let selectedTemplateMode = "商品主图";

function openTemplateDialog(trigger) {
  if (!templateDialog || !trigger) return;
  const templateName = trigger.dataset.templateName || "清透夏日护肤主图";
  selectedTemplateMode = trigger.dataset.templateMode || "商品主图";
  const platform = trigger.dataset.templatePlatform || "亚马逊 · 1:1 · 2K";
  const nameTarget = templateDialog.querySelector("[data-template-dialog-name]");
  const modeTarget = templateDialog.querySelector("[data-template-dialog-mode]");
  const platformTarget = templateDialog.querySelector("[data-template-dialog-platform]");
  if (nameTarget) nameTarget.textContent = templateName;
  if (modeTarget) modeTarget.textContent = selectedTemplateMode;
  if (platformTarget) platformTarget.textContent = platform;
  if (templateReferenceInput) templateReferenceInput.value = "";
  if (templateUploadPreview) {
    templateUploadPreview.hidden = true;
    templateUploadPreview.removeAttribute("src");
  }
  templateUploadTrigger?.classList.remove("has-image");
  if (templateUploadLabel) templateUploadLabel.textContent = "上传你的商品参考图";
  if (!templateDialog.open) templateDialog.showModal();
}

document.querySelectorAll("[data-template-use]").forEach((button) => {
  button.addEventListener("click", () => openTemplateDialog(button));
});

document.querySelector("[data-template-featured]")?.addEventListener("click", () => {
  openTemplateDialog(document.querySelector("[data-template-use]"));
});

document.querySelector("[data-template-close]")?.addEventListener("click", () => templateDialog?.close("cancel"));
templateDialog?.addEventListener("click", (event) => {
  if (event.target === templateDialog) templateDialog.close("cancel");
});

templateUploadTrigger?.addEventListener("click", () => templateReferenceInput?.click());
templateReferenceInput?.addEventListener("change", () => {
  const file = templateReferenceInput.files?.[0];
  if (!file || !templateUploadPreview) return;
  templateUploadPreview.src = URL.createObjectURL(file);
  templateUploadPreview.hidden = false;
  templateUploadTrigger?.classList.add("has-image");
  if (templateUploadLabel) templateUploadLabel.textContent = file.name;
});

document.querySelector("[data-template-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const file = templateReferenceInput?.files?.[0];
  if (!file) {
    showWorkspaceToast("请先上传商品参考图");
    templateUploadTrigger?.focus();
    return;
  }
  if (selectedTemplateMode === "短视频") {
    applyVideoReference(file);
    setPage("video");
  } else {
    applyReferenceImage(file);
    setPage("home");
  }
  templateDialog?.close("confirmed");
  showWorkspaceToast("模板参数已应用，可直接开始生成");
});

const helpArticles = [...document.querySelectorAll("[data-help-category]")];
const helpNavButtons = [...document.querySelectorAll("[data-help-filter]")];
const helpSearch = document.querySelector("[data-help-search]");
const helpEmpty = document.querySelector("[data-help-empty]");
let activeHelpFilter = "all";

function refreshHelpArticles() {
  const query = helpSearch?.value.trim().toLocaleLowerCase("zh-CN") || "";
  let visibleCount = 0;
  helpArticles.forEach((article) => {
    const filterMatches = activeHelpFilter === "all" || article.dataset.helpCategory === activeHelpFilter;
    const searchMatches = !query || (article.dataset.searchText || "").toLocaleLowerCase("zh-CN").includes(query);
    article.hidden = !(filterMatches && searchMatches);
    if (!article.hidden) visibleCount += 1;
  });
  if (helpEmpty) helpEmpty.hidden = visibleCount > 0;
}

helpNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeHelpFilter = button.dataset.helpFilter || "all";
    helpNavButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    refreshHelpArticles();
  });
});
helpSearch?.addEventListener("input", refreshHelpArticles);

document.querySelectorAll("[data-help-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.closest(".help-article")?.querySelector(".help-answer");
    if (!answer) return;
    const shouldOpen = answer.hidden;
    answer.hidden = !shouldOpen;
    button.setAttribute("aria-expanded", String(shouldOpen));
    const indicator = button.querySelector(":scope > b");
    if (indicator) indicator.textContent = shouldOpen ? "−" : "+";
  });
});

document.querySelector("[data-contact-support]")?.addEventListener("click", () => {
  showWorkspaceToast("客服入口已唤起，我们会尽快回应");
});
document.querySelector(".support-float")?.addEventListener("click", () => {
  showWorkspaceToast("客服入口已唤起，我们会尽快回应");
});

const messageItems = [...document.querySelectorAll("[data-message-kind]")];
const messageFilterGroup = document.querySelector('[data-filter-group="messages"]');
const messageBadge = document.querySelector("[data-message-badge]");
const messageUnreadCount = document.querySelector("[data-message-unread-count]");
const messageFilterCount = document.querySelector("[data-message-filter-count]");
const messageEmpty = document.querySelector("[data-message-empty]");
let activeMessageFilter = "all";

function unreadMessageCount() {
  return messageItems.filter((item) => item.classList.contains("is-unread")).length;
}

function syncMessageCounts() {
  const count = unreadMessageCount();
  if (messageBadge) {
    messageBadge.textContent = String(count);
    messageBadge.hidden = count === 0;
  }
  if (messageUnreadCount) messageUnreadCount.textContent = count ? `${count} 条未读` : "全部已读";
  if (messageFilterCount) messageFilterCount.textContent = String(count);
}

function refreshMessages() {
  let visibleCount = 0;
  messageItems.forEach((item) => {
    const shouldShow = activeMessageFilter === "all"
      || (activeMessageFilter === "unread" && item.classList.contains("is-unread"))
      || item.dataset.messageKind === activeMessageFilter;
    item.hidden = !shouldShow;
    if (shouldShow) visibleCount += 1;
  });
  if (messageEmpty) messageEmpty.hidden = visibleCount > 0;
}

messageFilterGroup?.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeMessageFilter = button.dataset.filter || "all";
    messageFilterGroup.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    refreshMessages();
  });
});

messageItems.forEach((item) => {
  const markRead = () => {
    if (!item.classList.contains("is-unread")) return;
    item.classList.remove("is-unread");
    item.querySelector(".message-unread-dot")?.remove();
    syncMessageCounts();
    if (activeMessageFilter === "unread") refreshMessages();
  };
  item.addEventListener("click", markRead);
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") markRead();
  });
});

document.querySelector("[data-mark-all-read]")?.addEventListener("click", () => {
  messageItems.forEach((item) => {
    item.classList.remove("is-unread");
    item.querySelector(".message-unread-dot")?.remove();
  });
  syncMessageCounts();
  refreshMessages();
  showWorkspaceToast("所有消息已标为已读");
});

syncMessageCounts();

/* Local utility tools */
function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 1 : 2)} MB`;
}

function mimeExtension(mimeType) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  return "webp";
}

function outputFileName(originalName, suffix, mimeType) {
  const baseName = originalName.replace(/\.[^.]+$/, "") || "manniu-output";
  return `${baseName}${suffix}.${mimeExtension(mimeType)}`;
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("图片编码失败"));
    }, mimeType, quality);
  });
}

async function decodeImageFile(file) {
  if (typeof window.createImageBitmap === "function") return window.createImageBitmap(file);
  const imageUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise((resolve, reject) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", () => reject(new Error("图片读取失败")), { once: true });
      image.src = imageUrl;
    });
    return image;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function imageSourceSize(source) {
  return {
    width: source.naturalWidth || source.width,
    height: source.naturalHeight || source.height,
  };
}

function releaseImageSource(source) {
  if (typeof source?.close === "function") source.close();
}

function triggerBlobDownload(blob, fileName) {
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1200);
}

function bindLocalFileDrop(dropzone, input, onFiles) {
  if (!dropzone || !input) return;
  dropzone.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    onFiles([...(input.files || [])]);
    input.value = "";
  });
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove("is-dragging");
    });
  });
  dropzone.addEventListener("drop", (event) => onFiles([...(event.dataTransfer?.files || [])]));
}

const supportedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

/* Browser-local background removal */
const backgroundInput = document.querySelector("[data-bg-input]");
const backgroundDropzone = document.querySelector("[data-bg-drop]");
const backgroundEdge = document.querySelector("[data-bg-edge]");
const backgroundPreview = document.querySelector("[data-bg-preview]");
const backgroundRunButton = document.querySelector("[data-bg-run]");
const backgroundDownloadButton = document.querySelector("[data-bg-download]");
const backgroundClearButton = document.querySelector("[data-bg-clear]");
const backgroundFileName = document.querySelector("[data-bg-file-name]");
const backgroundFileMeta = document.querySelector("[data-bg-file-meta]");
const backgroundExampleButton = document.querySelector("[data-bg-example]");
const backgroundStatus = document.querySelector("[data-bg-status]");
const backgroundProgress = document.querySelector("[data-bg-progress]");
const backgroundProgressBar = document.querySelector("[data-bg-progress-bar]");
const backgroundEmpty = document.querySelector("[data-bg-empty]");
const backgroundEditor = document.querySelector("[data-bg-editor]");
const backgroundOriginal = document.querySelector("[data-bg-original]");
const backgroundResult = document.querySelector("[data-bg-result]");
const backgroundResultFrame = document.querySelector("[data-bg-result-frame]");
const backgroundResultPlaceholder = document.querySelector("[data-bg-result-placeholder]");
const backgroundTip = document.querySelector("[data-bg-tip]");
let backgroundFile = null;
let backgroundSourceUrl = "";
let backgroundResultUrl = "";
let backgroundResultBlob = null;
let backgroundWorker = null;
let backgroundWorkerRequest = null;
let backgroundRequestId = 0;
let backgroundBusy = false;

function setBackgroundProgress(progress, statusText) {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));
  if (backgroundProgress) backgroundProgress.hidden = clampedProgress <= 0 || clampedProgress >= 100;
  if (backgroundProgressBar) backgroundProgressBar.style.transform = `scaleX(${clampedProgress / 100})`;
  if (backgroundStatus && statusText) backgroundStatus.textContent = statusText;
}

function updateBackgroundPreviewSurface() {
  if (!backgroundResultFrame) return;
  backgroundResultFrame.classList.remove("checker", "preview-white", "preview-dark", "preview-mint");
  const previewMode = backgroundPreview?.value || "checker";
  backgroundResultFrame.classList.add(previewMode === "checker" ? "checker" : `preview-${previewMode}`);
}

function updateBackgroundControls() {
  const hasFile = Boolean(backgroundFile);
  const hasResult = Boolean(backgroundResultBlob);
  if (backgroundRunButton) {
    backgroundRunButton.disabled = !hasFile || backgroundBusy;
    backgroundRunButton.textContent = backgroundBusy ? "正在智能抠图" : hasResult ? "重新智能抠图" : "开始智能抠图";
  }
  if (backgroundDownloadButton) backgroundDownloadButton.disabled = !hasResult || backgroundBusy;
  if (backgroundClearButton) backgroundClearButton.disabled = !hasFile || backgroundBusy;
  if (backgroundInput) backgroundInput.disabled = backgroundBusy;
  if (backgroundDropzone) backgroundDropzone.disabled = backgroundBusy;
  if (backgroundEdge) backgroundEdge.disabled = backgroundBusy;
  if (backgroundExampleButton) backgroundExampleButton.disabled = backgroundBusy;
}

function releaseBackgroundUrls() {
  if (backgroundSourceUrl) URL.revokeObjectURL(backgroundSourceUrl);
  if (backgroundResultUrl) URL.revokeObjectURL(backgroundResultUrl);
  backgroundSourceUrl = "";
  backgroundResultUrl = "";
}

function resetBackgroundResult() {
  if (backgroundResultUrl) URL.revokeObjectURL(backgroundResultUrl);
  backgroundResultUrl = "";
  backgroundResultBlob = null;
  if (backgroundResult) {
    backgroundResult.removeAttribute("src");
    backgroundResult.hidden = true;
  }
  if (backgroundResultPlaceholder) {
    backgroundResultPlaceholder.hidden = false;
    backgroundResultPlaceholder.classList.remove("is-processing", "is-error");
    backgroundResultPlaceholder.innerHTML = "<strong>等待处理</strong><span>点击“开始智能抠图”生成结果</span>";
  }
  if (backgroundTip) backgroundTip.textContent = "边缘复杂或主体与背景颜色接近时，可切换边缘处理方式后重新生成。";
}

function clearBackgroundTask() {
  if (backgroundBusy) return;
  releaseBackgroundUrls();
  backgroundFile = null;
  backgroundResultBlob = null;
  if (backgroundOriginal) backgroundOriginal.removeAttribute("src");
  resetBackgroundResult();
  if (backgroundFileName) backgroundFileName.textContent = "尚未添加图片";
  if (backgroundFileMeta) backgroundFileMeta.textContent = "等待选择素材";
  if (backgroundStatus) backgroundStatus.textContent = "添加图片后可开始抠图";
  if (backgroundEmpty) backgroundEmpty.hidden = false;
  if (backgroundEditor) backgroundEditor.hidden = true;
  setBackgroundProgress(0);
  updateBackgroundControls();
}

async function selectBackgroundFile(files) {
  if (backgroundBusy) {
    showWorkspaceToast("当前图片正在处理，请稍候");
    return;
  }
  const file = files.find((item) => supportedImageTypes.has(item.type));
  if (!file) {
    showWorkspaceToast("请选择 JPG、PNG 或 WebP 图片");
    return;
  }
  if (file.size > 25 * 1024 * 1024) {
    showWorkspaceToast("图片不能超过 25MB");
    return;
  }

  releaseBackgroundUrls();
  backgroundFile = file;
  backgroundSourceUrl = URL.createObjectURL(file);
  resetBackgroundResult();
  if (backgroundOriginal) backgroundOriginal.src = backgroundSourceUrl;
  if (backgroundFileName) backgroundFileName.textContent = file.name;
  if (backgroundFileMeta) backgroundFileMeta.textContent = `${formatFileSize(file.size)} · 正在读取尺寸`;
  if (backgroundEmpty) backgroundEmpty.hidden = true;
  if (backgroundEditor) backgroundEditor.hidden = false;
  if (backgroundStatus) backgroundStatus.textContent = "图片已就绪，可开始智能抠图";

  try {
    const source = await decodeImageFile(file);
    const size = imageSourceSize(source);
    if (backgroundFileMeta) backgroundFileMeta.textContent = `${size.width} × ${size.height} · ${formatFileSize(file.size)}`;
    releaseImageSource(source);
  } catch {
    if (backgroundFileMeta) backgroundFileMeta.textContent = formatFileSize(file.size);
  }
  updateBackgroundControls();
}

function getBackgroundWorker() {
  if (backgroundWorker) return backgroundWorker;
  if (typeof Worker !== "function") throw new Error("当前浏览器不支持本地模型处理");

  backgroundWorker = new Worker("dist/background-removal.worker.js?v=20260715", { name: "manniu-background-removal" });
  backgroundWorker.addEventListener("message", (event) => {
    const message = event.data || {};
    if (message.type === "model-progress") {
      const modelProgress = Number.isFinite(message.progress) ? message.progress : 0;
      setBackgroundProgress(8 + (modelProgress * 0.62), modelProgress > 0 ? `首次加载本地模型 ${Math.round(modelProgress)}%` : "正在加载本地模型");
      return;
    }
    if (message.type === "stage") {
      const stageCopy = {
        model: "正在准备本地模型",
        decode: "正在读取图片",
        inference: "正在识别并分离主体",
        encode: "正在生成透明 PNG",
      };
      setBackgroundProgress(message.progress || 0, stageCopy[message.stage] || "正在处理图片");
      return;
    }
    if (!backgroundWorkerRequest || message.id !== backgroundWorkerRequest.id) return;
    if (message.type === "result") {
      backgroundWorkerRequest.resolve(message);
      backgroundWorkerRequest = null;
    } else if (message.type === "error") {
      backgroundWorkerRequest.reject(new Error(message.message || "本地模型处理失败"));
      backgroundWorkerRequest = null;
    }
  });
  backgroundWorker.addEventListener("error", () => {
    if (backgroundWorkerRequest) {
      backgroundWorkerRequest.reject(new Error("本地模型加载失败，请检查网络后重试"));
      backgroundWorkerRequest = null;
    }
    backgroundWorker?.terminate();
    backgroundWorker = null;
  });
  return backgroundWorker;
}

function runBackgroundWorker(file, edgeMode) {
  return new Promise(async (resolve, reject) => {
    try {
      const worker = getBackgroundWorker();
      const buffer = await file.arrayBuffer();
      const id = ++backgroundRequestId;
      backgroundWorkerRequest = { id, resolve, reject };
      worker.postMessage({
        type: "remove-background",
        id,
        buffer,
        mimeType: file.type,
        edgeMode,
      }, [buffer]);
    } catch (error) {
      reject(error);
    }
  });
}

bindLocalFileDrop(backgroundDropzone, backgroundInput, selectBackgroundFile);
backgroundExampleButton?.addEventListener("click", async () => {
  if (backgroundBusy) return;
  try {
    const response = await fetch("assets/dashboard/work-4-hd.jpg");
    if (!response.ok) throw new Error("示例图片读取失败");
    const blob = await response.blob();
    await selectBackgroundFile([new File([blob], "示例相机.jpg", { type: blob.type || "image/jpeg" })]);
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "示例图片读取失败");
  }
});
backgroundPreview?.addEventListener("change", updateBackgroundPreviewSurface);
backgroundEdge?.addEventListener("change", () => {
  if (!backgroundResultBlob || !backgroundStatus) return;
  backgroundStatus.textContent = "边缘设置已更改，重新处理后生效";
});
backgroundClearButton?.addEventListener("click", clearBackgroundTask);
backgroundDownloadButton?.addEventListener("click", () => {
  if (!backgroundResultBlob || !backgroundFile) return;
  triggerBlobDownload(backgroundResultBlob, outputFileName(backgroundFile.name, "-透明背景", "image/png"));
  showWorkspaceToast("透明 PNG 已开始下载");
});
backgroundRunButton?.addEventListener("click", async () => {
  if (!backgroundFile || backgroundBusy) return;
  backgroundBusy = true;
  resetBackgroundResult();
  if (backgroundResultPlaceholder) {
    backgroundResultPlaceholder.classList.add("is-processing");
    backgroundResultPlaceholder.innerHTML = "<span class=\"background-remove-loader\" aria-hidden=\"true\"></span><strong>正在识别主体</strong><span>首次使用会先加载本地模型</span>";
  }
  setBackgroundProgress(4, "正在准备本地抠图模型");
  updateBackgroundControls();

  try {
    const output = await runBackgroundWorker(backgroundFile, backgroundEdge?.value || "natural");
    backgroundResultBlob = new Blob([output.buffer], { type: "image/png" });
    backgroundResultUrl = URL.createObjectURL(backgroundResultBlob);
    if (backgroundResult) {
      backgroundResult.src = backgroundResultUrl;
      backgroundResult.hidden = false;
    }
    if (backgroundResultPlaceholder) backgroundResultPlaceholder.hidden = true;
    if (backgroundTip) backgroundTip.textContent = `${output.width} × ${output.height} · ${formatFileSize(backgroundResultBlob.size)} · 透明 PNG`;
    setBackgroundProgress(100, "抠图已完成，可预览并下载透明 PNG");
    showWorkspaceToast("智能抠图已完成");
  } catch (error) {
    resetBackgroundResult();
    if (backgroundResultPlaceholder) {
      backgroundResultPlaceholder.classList.add("is-error");
      backgroundResultPlaceholder.innerHTML = "<strong>处理没有完成</strong><span>请检查网络或更换图片后重试</span>";
    }
    setBackgroundProgress(0, error instanceof Error ? error.message : "智能抠图失败，请重试");
    showWorkspaceToast(error instanceof Error ? error.message : "智能抠图失败，请重试");
  } finally {
    backgroundBusy = false;
    updateBackgroundControls();
  }
});
updateBackgroundPreviewSurface();
updateBackgroundControls();

/* Image compression and conversion */
const compressInput = document.querySelector("[data-compress-input]");
const compressDropzone = document.querySelector("[data-compress-drop]");
const compressFormat = document.querySelector("[data-compress-format]");
const compressMaxEdge = document.querySelector("[data-compress-max-edge]");
const compressQuality = document.querySelector("[data-compress-quality]");
const compressQualityValue = document.querySelector("[data-compress-quality-value]");
const compressQualityNote = document.querySelector("[data-compress-quality-note]");
const compressRunButton = document.querySelector("[data-compress-run]");
const compressClearButton = document.querySelector("[data-compress-clear]");
const compressDownloadAll = document.querySelector("[data-compress-download-all]");
const compressCount = document.querySelector("[data-compress-count]");
const compressTotalSize = document.querySelector("[data-compress-total-size]");
const compressResultSummary = document.querySelector("[data-compress-result-summary]");
const compressList = document.querySelector("[data-compress-list]");
let compressFiles = [];
let compressPreviewUrls = [];
let compressResults = [];
let compressBusy = false;

function releaseCompressUrls() {
  compressPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
  compressResults.forEach((result) => {
    if (result.url) URL.revokeObjectURL(result.url);
  });
  compressPreviewUrls = [];
  compressResults = [];
}

function createCompressRow(file, index, result) {
  const row = document.createElement("article");
  row.className = `utility-file-row${result?.blob ? " is-complete" : ""}${result?.error ? " is-error" : ""}`;
  const image = document.createElement("img");
  image.src = result?.url || compressPreviewUrls[index];
  image.alt = `${file.name} 预览`;

  const copy = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = file.name;
  const metadata = document.createElement("span");
  if (result?.blob) {
    const delta = file.size > 0 ? 1 - result.blob.size / file.size : 0;
    const changeText = file.size <= 0
      ? "已完成"
      : delta >= 0
        ? `减小 ${Math.round(delta * 100)}%`
        : `增加 ${Math.round(Math.abs(delta) * 100)}%`;
    metadata.textContent = `${formatFileSize(file.size)} → ${formatFileSize(result.blob.size)} · ${result.width} × ${result.height} · ${changeText}`;
  } else if (result?.error) {
    metadata.textContent = result.error;
  } else {
    metadata.textContent = `${formatFileSize(file.size)} · 等待处理`;
  }
  copy.append(title, metadata);

  const action = document.createElement(result?.blob ? "button" : "span");
  if (result?.blob) {
    action.type = "button";
    action.textContent = "下载";
    action.addEventListener("click", () => triggerBlobDownload(result.blob, result.fileName));
  } else {
    action.textContent = result?.error ? "失败" : "待处理";
  }
  row.append(image, copy, action);
  return row;
}

function renderCompressList() {
  if (!compressList) return;
  compressList.replaceChildren();
  if (!compressFiles.length) {
    const empty = document.createElement("div");
    empty.className = "utility-empty-state";
    empty.innerHTML = '<span aria-hidden="true">IMG</span><strong>还没有待处理图片</strong><p>添加图片后，可以统一设置格式、尺寸与输出质量。</p>';
    compressList.append(empty);
    return;
  }
  compressFiles.forEach((file, index) => compressList.append(createCompressRow(file, index, compressResults[index])));
}

function updateCompressControls() {
  const hasFiles = compressFiles.length > 0;
  if (compressCount) compressCount.textContent = hasFiles ? `已添加 ${compressFiles.length} 张图片` : "尚未添加图片";
  if (compressTotalSize) {
    const totalSize = compressFiles.reduce((total, file) => total + file.size, 0);
    compressTotalSize.textContent = hasFiles ? `原始文件共 ${formatFileSize(totalSize)}` : "等待选择素材";
  }
  if (compressRunButton) compressRunButton.disabled = !hasFiles || compressBusy;
  if (compressClearButton) compressClearButton.disabled = !hasFiles || compressBusy;
  if (compressDownloadAll) compressDownloadAll.disabled = !compressResults.some((result) => result?.blob) || compressBusy;
}

function setCompressFiles(files) {
  if (compressBusy) return;
  const validFiles = files.filter((file) => supportedImageTypes.has(file.type)).slice(0, 10);
  if (!validFiles.length) {
    showWorkspaceToast("请选择 JPG、PNG 或 WebP 图片");
    return;
  }
  const exceededLimit = files.filter((file) => supportedImageTypes.has(file.type)).length > 10;
  releaseCompressUrls();
  compressFiles = validFiles;
  compressPreviewUrls = compressFiles.map((file) => URL.createObjectURL(file));
  if (compressResultSummary) compressResultSummary.textContent = "参数将应用到列表中的全部图片";
  renderCompressList();
  updateCompressControls();
  if (exceededLimit) showWorkspaceToast("最多处理 10 张图片，已保留前 10 张");
}

function syncCompressQuality() {
  if (!compressQuality || !compressFormat) return;
  const isPng = compressFormat.value === "image/png";
  compressQuality.disabled = isPng;
  if (compressQualityValue) compressQualityValue.textContent = isPng ? "无损" : `${compressQuality.value}%`;
  if (compressQualityNote) {
    compressQualityNote.textContent = isPng ? "PNG 使用无损编码，不应用质量参数" : "适合电商上传与网页展示";
  }
}

function invalidateCompressResults() {
  if (!compressResults.length || compressBusy) return;
  compressResults.forEach((result) => {
    if (result.url) URL.revokeObjectURL(result.url);
  });
  compressResults = [];
  if (compressResultSummary) compressResultSummary.textContent = "参数已更改，请重新处理";
  renderCompressList();
  updateCompressControls();
}

async function compressOneImage(file, mimeType, quality, maxEdge) {
  const source = await decodeImageFile(file);
  try {
    const sourceSize = imageSourceSize(source);
    const scale = maxEdge > 0 && Math.max(sourceSize.width, sourceSize.height) > maxEdge
      ? maxEdge / Math.max(sourceSize.width, sourceSize.height)
      : 1;
    const width = Math.max(1, Math.round(sourceSize.width * scale));
    const height = Math.max(1, Math.round(sourceSize.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("当前浏览器不支持图片处理");
    if (mimeType === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(source, 0, 0, width, height);
    const blob = await canvasToBlob(canvas, mimeType, quality);
    return { blob, width, height, actualType: blob.type || mimeType };
  } finally {
    releaseImageSource(source);
  }
}

bindLocalFileDrop(compressDropzone, compressInput, setCompressFiles);
compressQuality?.addEventListener("input", () => {
  syncCompressQuality();
  invalidateCompressResults();
});
compressFormat?.addEventListener("change", () => {
  syncCompressQuality();
  invalidateCompressResults();
});
compressMaxEdge?.addEventListener("change", invalidateCompressResults);
syncCompressQuality();

compressClearButton?.addEventListener("click", () => {
  if (compressBusy) return;
  releaseCompressUrls();
  compressFiles = [];
  if (compressResultSummary) compressResultSummary.textContent = "添加图片后可开始处理";
  renderCompressList();
  updateCompressControls();
});

compressDownloadAll?.addEventListener("click", () => {
  const downloadableResults = compressResults.filter((result) => result?.blob);
  downloadableResults.forEach((result) => triggerBlobDownload(result.blob, result.fileName));
  if (downloadableResults.length) showWorkspaceToast(`已开始下载 ${downloadableResults.length} 张图片`);
});

compressRunButton?.addEventListener("click", async () => {
  if (!compressFiles.length || !compressFormat || !compressQuality || !compressMaxEdge) return;
  compressBusy = true;
  updateCompressControls();
  compressRunButton.textContent = "正在处理 0%";
  compressResults.forEach((result) => {
    if (result.url) URL.revokeObjectURL(result.url);
  });
  compressResults = [];
  const mimeType = compressFormat.value;
  const quality = Number(compressQuality.value) / 100;
  const maxEdge = Number(compressMaxEdge.value) || 0;

  for (let index = 0; index < compressFiles.length; index += 1) {
    const file = compressFiles[index];
    try {
      const processed = await compressOneImage(file, mimeType, quality, maxEdge);
      compressResults[index] = {
        ...processed,
        url: URL.createObjectURL(processed.blob),
        fileName: outputFileName(file.name, "-optimized", processed.actualType),
      };
    } catch (error) {
      compressResults[index] = { error: error instanceof Error ? error.message : "处理失败" };
    }
    compressRunButton.textContent = `正在处理 ${Math.round(((index + 1) / compressFiles.length) * 100)}%`;
  }

  compressBusy = false;
  compressRunButton.textContent = "重新批量处理";
  const completed = compressResults.filter((result) => result?.blob).length;
  if (compressResultSummary) compressResultSummary.textContent = `已完成 ${completed} 张，结果可逐张下载`;
  renderCompressList();
  updateCompressControls();
  showWorkspaceToast(`已完成 ${completed} 张图片处理`);
});

/* Image resize and center crop */
const resizeInput = document.querySelector("[data-resize-input]");
const resizeDropzone = document.querySelector("[data-resize-drop]");
const resizeEditor = document.querySelector("[data-resize-editor]");
const resizeReplace = document.querySelector("[data-resize-replace]");
const resizeSourceImage = document.querySelector("[data-resize-source]");
const resizeCanvas = document.querySelector("[data-resize-canvas]");
const resizeWidth = document.querySelector("[data-resize-width]");
const resizeHeight = document.querySelector("[data-resize-height]");
const resizeRatio = document.querySelector("[data-resize-ratio]");
const resizeMode = document.querySelector("[data-resize-mode]");
const resizeBackground = document.querySelector("[data-resize-background]");
const resizeFormat = document.querySelector("[data-resize-format]");
const resizeQuality = document.querySelector("[data-resize-quality]");
const resizeQualityValue = document.querySelector("[data-resize-quality-value]");
const resizeRunButton = document.querySelector("[data-resize-run]");
const resizeDownloadButton = document.querySelector("[data-resize-download]");
const resizeFileName = document.querySelector("[data-resize-file-name]");
const resizeSourceInfo = document.querySelector("[data-resize-source-info]");
const resizeOutputInfo = document.querySelector("[data-resize-output-info]");
let resizeFile = null;
let resizeSource = null;
let resizeSourceUrl = "";
let resizeOutputBlob = null;
let resizeOutputName = "";

function clampDimension(value) {
  return Math.max(64, Math.min(4096, Number.parseInt(value || "1200", 10) || 1200));
}

function selectedRatioValue() {
  if (!resizeRatio || resizeRatio.value === "custom") return null;
  if (resizeRatio.value === "original") {
    if (!resizeSource) return 1;
    const size = imageSourceSize(resizeSource);
    return size.width / size.height;
  }
  const [widthPart, heightPart] = resizeRatio.value.split(":").map(Number);
  return widthPart / heightPart;
}

function syncResizeDimensions(changedSide = "width") {
  if (!resizeWidth || !resizeHeight) return;
  const ratio = selectedRatioValue();
  if (!ratio) return;
  if (changedSide === "height") {
    let height = clampDimension(resizeHeight.value);
    let width = Math.round(height * ratio);
    if (width > 4096) {
      width = 4096;
      height = Math.round(width / ratio);
    }
    if (width < 64) {
      width = 64;
      height = Math.round(width / ratio);
    }
    resizeHeight.value = String(clampDimension(height));
    resizeWidth.value = String(clampDimension(width));
  } else {
    let width = clampDimension(resizeWidth.value);
    let height = Math.round(width / ratio);
    if (height > 4096) {
      height = 4096;
      width = Math.round(height * ratio);
    }
    if (height < 64) {
      height = 64;
      width = Math.round(height * ratio);
    }
    resizeWidth.value = String(clampDimension(width));
    resizeHeight.value = String(clampDimension(height));
  }
}

function invalidateResizeResult() {
  resizeOutputBlob = null;
  resizeOutputName = "";
  if (resizeDownloadButton) resizeDownloadButton.disabled = true;
  if (resizeOutputInfo && resizeFile) resizeOutputInfo.textContent = "参数已更改，请重新生成预览";
}

function syncResizeQuality() {
  if (!resizeQuality || !resizeFormat) return;
  const isPng = resizeFormat.value === "image/png";
  resizeQuality.disabled = isPng;
  if (resizeQualityValue) resizeQualityValue.textContent = isPng ? "无损" : `${resizeQuality.value}%`;
}

async function renderResizeOutput() {
  if (!resizeSource || !resizeCanvas || !resizeWidth || !resizeHeight || !resizeMode || !resizeBackground || !resizeFormat || !resizeQuality) return;
  const width = clampDimension(resizeWidth.value);
  const height = clampDimension(resizeHeight.value);
  resizeWidth.value = String(width);
  resizeHeight.value = String(height);
  resizeCanvas.width = width;
  resizeCanvas.height = height;
  const context = resizeCanvas.getContext("2d");
  if (!context) throw new Error("当前浏览器不支持图片处理");
  context.clearRect(0, 0, width, height);
  const backgroundMap = { white: "#ffffff", soft: "#f1f2f4", transparent: "transparent" };
  let fillColor = backgroundMap[resizeBackground.value] || "#ffffff";
  if (resizeFormat.value === "image/jpeg" && fillColor === "transparent") fillColor = "#ffffff";
  if (fillColor !== "transparent") {
    context.fillStyle = fillColor;
    context.fillRect(0, 0, width, height);
  }

  const sourceSize = imageSourceSize(resizeSource);
  const sourceRatio = sourceSize.width / sourceSize.height;
  const targetRatio = width / height;
  if (resizeMode.value === "cover") {
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = sourceSize.width;
    let sourceHeight = sourceSize.height;
    if (sourceRatio > targetRatio) {
      sourceWidth = sourceSize.height * targetRatio;
      sourceX = (sourceSize.width - sourceWidth) / 2;
    } else {
      sourceHeight = sourceSize.width / targetRatio;
      sourceY = (sourceSize.height - sourceHeight) / 2;
    }
    context.drawImage(resizeSource, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
  } else {
    const scale = Math.min(width / sourceSize.width, height / sourceSize.height);
    const drawWidth = sourceSize.width * scale;
    const drawHeight = sourceSize.height * scale;
    context.drawImage(resizeSource, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  }

  const requestedType = resizeFormat.value;
  const blob = await canvasToBlob(resizeCanvas, requestedType, Number(resizeQuality.value) / 100);
  resizeOutputBlob = blob;
  resizeOutputName = outputFileName(resizeFile?.name || "manniu-image", `-${width}x${height}`, blob.type || requestedType);
  if (resizeOutputInfo) resizeOutputInfo.textContent = `${width} × ${height} · ${formatFileSize(blob.size)}`;
  if (resizeDownloadButton) resizeDownloadButton.disabled = false;
}

async function setResizeFile(files) {
  const file = files.find((item) => supportedImageTypes.has(item.type));
  if (!file) {
    showWorkspaceToast("请选择 JPG、PNG 或 WebP 图片");
    return;
  }
  try {
    const nextSource = await decodeImageFile(file);
    releaseImageSource(resizeSource);
    if (resizeSourceUrl) URL.revokeObjectURL(resizeSourceUrl);
    resizeFile = file;
    resizeSource = nextSource;
    resizeSourceUrl = URL.createObjectURL(file);
    const size = imageSourceSize(nextSource);
    if (resizeSourceImage) resizeSourceImage.src = resizeSourceUrl;
    if (resizeFileName) resizeFileName.textContent = file.name;
    if (resizeSourceInfo) resizeSourceInfo.textContent = `${size.width} × ${size.height} · ${formatFileSize(file.size)}`;
    if (resizeDropzone) resizeDropzone.hidden = true;
    if (resizeEditor) resizeEditor.hidden = false;
    if (resizeRunButton) resizeRunButton.disabled = false;
    const preferredWidth = Math.min(4096, resizeRatio?.value === "1:1" ? Math.min(size.width, size.height) : size.width);
    if (resizeWidth) resizeWidth.value = String(preferredWidth);
    if (resizeHeight && resizeRatio?.value === "custom") resizeHeight.value = String(Math.min(4096, size.height));
    syncResizeDimensions("width");
    await renderResizeOutput();
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "图片读取失败");
  }
}

bindLocalFileDrop(resizeDropzone, resizeInput, setResizeFile);
resizeReplace?.addEventListener("click", () => resizeInput?.click());
resizeRatio?.addEventListener("change", () => {
  syncResizeDimensions("width");
  invalidateResizeResult();
});
resizeWidth?.addEventListener("change", () => {
  syncResizeDimensions("width");
  invalidateResizeResult();
});
resizeHeight?.addEventListener("change", () => {
  syncResizeDimensions("height");
  invalidateResizeResult();
});
[resizeMode, resizeBackground].forEach((control) => control?.addEventListener("change", invalidateResizeResult));
resizeFormat?.addEventListener("change", () => {
  syncResizeQuality();
  invalidateResizeResult();
});
resizeQuality?.addEventListener("input", () => {
  syncResizeQuality();
  invalidateResizeResult();
});
syncResizeQuality();
resizeRunButton?.addEventListener("click", async () => {
  if (!resizeSource || !resizeRunButton) return;
  resizeRunButton.disabled = true;
  resizeRunButton.textContent = "正在生成预览";
  try {
    await renderResizeOutput();
    showWorkspaceToast("图片预览已更新");
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "图片处理失败");
  } finally {
    resizeRunButton.disabled = false;
    resizeRunButton.textContent = "重新生成预览";
  }
});
resizeDownloadButton?.addEventListener("click", () => {
  if (resizeOutputBlob) triggerBlobDownload(resizeOutputBlob, resizeOutputName);
});

/* Video frame extraction */
const frameInput = document.querySelector("[data-frame-input]");
const frameDropzone = document.querySelector("[data-frame-drop]");
const frameEditor = document.querySelector("[data-frame-editor]");
const frameReplace = document.querySelector("[data-frame-replace]");
const frameVideo = document.querySelector("[data-frame-video]");
const frameCount = document.querySelector("[data-frame-count]");
const frameFormat = document.querySelector("[data-frame-format]");
const frameMaxWidth = document.querySelector("[data-frame-max-width]");
const frameQuality = document.querySelector("[data-frame-quality]");
const frameQualityValue = document.querySelector("[data-frame-quality-value]");
const frameRunButton = document.querySelector("[data-frame-run]");
const frameDownloadAll = document.querySelector("[data-frame-download-all]");
const frameFileName = document.querySelector("[data-frame-file-name]");
const frameVideoName = document.querySelector("[data-frame-video-name]");
const frameVideoInfo = document.querySelector("[data-frame-video-info]");
const frameStatus = document.querySelector("[data-frame-status]");
const frameResultsContainer = document.querySelector("[data-frame-results]");
let frameFile = null;
let frameVideoUrl = "";
let extractedFrames = [];
let frameBusy = false;

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = Math.floor(safeSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function clearExtractedFrames() {
  extractedFrames.forEach((frame) => URL.revokeObjectURL(frame.url));
  extractedFrames = [];
  if (frameDownloadAll) frameDownloadAll.disabled = true;
}

function renderFrameResults() {
  if (!frameResultsContainer) return;
  frameResultsContainer.replaceChildren();
  if (!extractedFrames.length) {
    const empty = document.createElement("div");
    empty.className = "utility-empty-state compact";
    empty.innerHTML = '<span aria-hidden="true">FRAME</span><strong>尚未提取画面</strong><p>将按视频时长均匀选择关键时间点。</p>';
    frameResultsContainer.append(empty);
    return;
  }
  extractedFrames.forEach((frame, index) => {
    const card = document.createElement("figure");
    card.className = "frame-result-card";
    const image = document.createElement("img");
    image.src = frame.url;
    image.alt = `视频画面 ${index + 1}，时间 ${formatTime(frame.time)}`;
    const caption = document.createElement("figcaption");
    const copy = document.createElement("span");
    copy.innerHTML = `<strong>画面 ${String(index + 1).padStart(2, "0")}</strong><small>${formatTime(frame.time)} · ${formatFileSize(frame.blob.size)}</small>`;
    const download = document.createElement("button");
    download.type = "button";
    download.textContent = "下载";
    download.addEventListener("click", () => triggerBlobDownload(frame.blob, frame.fileName));
    caption.append(copy, download);
    card.append(image, caption);
    frameResultsContainer.append(card);
  });
}

function waitForVideoMetadata(video) {
  return new Promise((resolve, reject) => {
    if (video.readyState >= 1 && Number.isFinite(video.duration)) {
      resolve();
      return;
    }
    const onLoaded = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("当前浏览器无法读取这个视频"));
    };
    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
    };
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);
  });
}

function seekVideo(video, time) {
  return new Promise((resolve, reject) => {
    const targetTime = Math.max(0, Math.min(time, Math.max(0, video.duration - 0.04)));
    if (Math.abs(video.currentTime - targetTime) < 0.01 && video.readyState >= 2) {
      resolve();
      return;
    }
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("读取视频画面超时"));
    }, 10000);
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("无法读取当前视频画面"));
    };
    const cleanup = () => {
      window.clearTimeout(timeout);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = targetTime;
  });
}

async function setFrameFile(files) {
  const file = files.find((item) => item.type.startsWith("video/") || /\.(m4v|mov|mp4|webm)$/i.test(item.name));
  if (!file || !frameVideo) {
    showWorkspaceToast("请选择浏览器支持的视频文件");
    return;
  }
  if (frameBusy) return;
  clearExtractedFrames();
  if (frameVideoUrl) URL.revokeObjectURL(frameVideoUrl);
  frameFile = file;
  frameVideoUrl = URL.createObjectURL(file);
  frameVideo.src = frameVideoUrl;
  frameVideo.load();
  if (frameFileName) frameFileName.textContent = file.name;
  if (frameVideoName) frameVideoName.textContent = file.name;
  if (frameStatus) frameStatus.textContent = "正在读取视频信息";
  try {
    await waitForVideoMetadata(frameVideo);
    const duration = frameVideo.duration;
    if (!Number.isFinite(duration) || duration <= 0) throw new Error("无法识别视频时长");
    if (frameVideoInfo) frameVideoInfo.textContent = `${formatTime(duration)} · ${frameVideo.videoWidth} × ${frameVideo.videoHeight} · ${formatFileSize(file.size)}`;
    if (frameDropzone) frameDropzone.hidden = true;
    if (frameEditor) frameEditor.hidden = false;
    if (frameRunButton) frameRunButton.disabled = false;
    if (frameStatus) frameStatus.textContent = "设置数量后开始提取";
    renderFrameResults();
    if (file.size > 200 * 1024 * 1024) showWorkspaceToast("视频超过 200MB，处理时可能占用较多内存");
  } catch (error) {
    showWorkspaceToast(error instanceof Error ? error.message : "视频读取失败");
  }
}

bindLocalFileDrop(frameDropzone, frameInput, setFrameFile);
frameReplace?.addEventListener("click", () => frameInput?.click());
function invalidateFrameResults() {
  if (!extractedFrames.length || frameBusy) return;
  clearExtractedFrames();
  renderFrameResults();
  if (frameStatus) frameStatus.textContent = "参数已更改，请重新提取";
}

function syncFrameQuality() {
  if (!frameQuality || !frameFormat) return;
  const isPng = frameFormat.value === "image/png";
  frameQuality.disabled = isPng;
  if (frameQualityValue) frameQualityValue.textContent = isPng ? "无损" : `${frameQuality.value}%`;
}

[frameCount, frameMaxWidth].forEach((control) => control?.addEventListener("change", invalidateFrameResults));
frameFormat?.addEventListener("change", () => {
  syncFrameQuality();
  invalidateFrameResults();
});
frameQuality?.addEventListener("input", () => {
  syncFrameQuality();
  invalidateFrameResults();
});
syncFrameQuality();

frameRunButton?.addEventListener("click", async () => {
  if (!frameVideo || !frameFile || !frameCount || !frameFormat || !frameMaxWidth || !frameQuality || frameBusy) return;
  frameBusy = true;
  frameRunButton.disabled = true;
  frameRunButton.textContent = "正在提取 0%";
  clearExtractedFrames();
  if (frameResultsContainer) {
    frameResultsContainer.innerHTML = '<div class="utility-processing-state"><span></span><strong>正在读取视频画面</strong><p>处理过程中请不要关闭当前页面。</p></div>';
  }

  const requestedCount = Math.max(1, Math.min(12, Number.parseInt(frameCount.value || "6", 10) || 6));
  frameCount.value = String(requestedCount);
  const maxWidth = Number(frameMaxWidth.value) || 1280;
  const scale = Math.min(1, maxWidth / frameVideo.videoWidth);
  const width = Math.max(1, Math.round(frameVideo.videoWidth * scale));
  const height = Math.max(1, Math.round(frameVideo.videoHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  try {
    if (!context) throw new Error("当前浏览器不支持视频画面提取");
    for (let index = 0; index < requestedCount; index += 1) {
      const time = frameVideo.duration * ((index + 1) / (requestedCount + 1));
      await seekVideo(frameVideo, time);
      context.drawImage(frameVideo, 0, 0, width, height);
      const blob = await canvasToBlob(canvas, frameFormat.value, Number(frameQuality.value) / 100);
      extractedFrames.push({
        blob,
        time,
        url: URL.createObjectURL(blob),
        fileName: outputFileName(frameFile.name, `-frame-${String(index + 1).padStart(2, "0")}`, blob.type || frameFormat.value),
      });
      const progress = Math.round(((index + 1) / requestedCount) * 100);
      frameRunButton.textContent = `正在提取 ${progress}%`;
      if (frameStatus) frameStatus.textContent = `已读取 ${index + 1} / ${requestedCount} 个画面`;
    }
    renderFrameResults();
    if (frameDownloadAll) frameDownloadAll.disabled = false;
    if (frameStatus) frameStatus.textContent = `已提取 ${requestedCount} 张画面，可逐张或批量下载`;
    showWorkspaceToast(`已完成 ${requestedCount} 张视频画面提取`);
  } catch (error) {
    renderFrameResults();
    if (frameStatus) frameStatus.textContent = error instanceof Error ? error.message : "视频抽帧失败";
    showWorkspaceToast(error instanceof Error ? error.message : "视频抽帧失败");
  } finally {
    frameBusy = false;
    frameRunButton.disabled = false;
    frameRunButton.textContent = "重新提取画面";
  }
});

frameDownloadAll?.addEventListener("click", () => {
  extractedFrames.forEach((frame) => triggerBlobDownload(frame.blob, frame.fileName));
  if (extractedFrames.length) showWorkspaceToast(`已开始下载 ${extractedFrames.length} 张画面`);
});
