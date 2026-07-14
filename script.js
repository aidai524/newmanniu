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
const agentReferenceInput = document.querySelector("[data-agent-reference-input]");
const uploadPreview = document.querySelector("[data-upload-preview]");
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

  pagePanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.pagePanel === pageName);
  });

  pageButtons.forEach((button) => {
    if (button.classList.contains("side-item")) {
      const targetPage = button.dataset.page;
      const isAccountSettingsPage = targetPage === "account" && accountSettingsPages.has(pageName);
      const isCreationFlow = targetPage === "home" && ["detail", "quickCreate"].includes(pageName);
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

function renderQuickReferenceGallery() {
  const count = sharedReferenceFiles.length;
  const emptyState = quickHomeUpload?.querySelector(".quick-upload-empty");
  if (emptyState) emptyState.hidden = count > 0;
  if (quickHomeGallery) quickHomeGallery.hidden = count === 0;
  if (quickHomeFileCount) quickHomeFileCount.textContent = String(count);
  quickHomeUpload?.classList.toggle("has-images", count > 0);
  if (!quickHomeThumbnails) return;

  quickHomeThumbnails.replaceChildren();
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
    quickHomeThumbnails.append(item);
  });
}

function syncSharedReferencePresentation({ limitReached = false } = {}) {
  const imageUrl = sharedReferenceUrls[0] || "";
  const count = sharedReferenceFiles.length;
  sharedReferenceUrl = imageUrl;

  syncReferencePreview(uploadPreview, imageUrl);
  syncReferencePreview(quickAnalyzedPreview, imageUrl);
  syncReferencePreview(quickAnalysisPreview, imageUrl);
  syncReferencePreview(agentReferencePreview, imageUrl);
  uploadTile?.classList.toggle("has-image", count > 0);
  agentReference?.classList.toggle("has-image", count > 0);
  renderQuickReferenceGallery();

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

uploadTile?.addEventListener("click", () => referenceInput?.click());
quickHomeAddButtons.forEach((button) => {
  button.addEventListener("click", () => quickHomeFileInput?.click());
});
referenceInput?.addEventListener("change", () => {
  applyReferenceImage(referenceInput.files?.[0]);
});
quickHomeFileInput?.addEventListener("change", () => {
  addQuickHomeReferenceImages(quickHomeFileInput.files || []);
  quickHomeFileInput.value = "";
});
agentReferenceInput?.addEventListener("change", () => {
  applyReferenceImage(agentReferenceInput.files?.[0]);
});

if (quickHomeUpload) {
  ["dragenter", "dragover"].forEach((eventName) => {
    quickHomeUpload.addEventListener(eventName, (event) => {
      event.preventDefault();
      quickHomeUpload.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    quickHomeUpload.addEventListener(eventName, (event) => {
      event.preventDefault();
      quickHomeUpload.classList.remove("is-dragging");
    });
  });
  quickHomeUpload.addEventListener("drop", (event) => {
    addQuickHomeReferenceImages(event.dataTransfer?.files || []);
  });
}

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
