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
  account: "账户安全",
  orders: "我的订单",
  points: "积分明细",
  rights: "我的权益",
  invite: "邀请码",
};

const studioSelects = [...document.querySelectorAll('[data-page-panel="home"] select, [data-page-panel="video"] select')];
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
referenceInput?.addEventListener("change", () => {
  applyReferenceImage(referenceInput.files?.[0]);
});
agentReferenceInput?.addEventListener("change", () => {
  applyReferenceImage(agentReferenceInput.files?.[0]);
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
