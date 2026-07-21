(function registerManniuNotificationCatalog(root, factory) {
  const catalog = factory();
  if (typeof module === "object" && module.exports) module.exports = catalog;
  if (root) root.ManniuNotificationCatalog = catalog;
})(typeof window !== "undefined" ? window : globalThis, function createNotificationCatalog() {
  const categories = Object.freeze([
    {
      key: "task",
      code: "TASK",
      label: "创作任务",
      description: "生成、处理与导出结果",
      accent: "mint",
    },
    {
      key: "asset",
      code: "ASSET",
      label: "资产与协作",
      description: "保存、分享与团队协作",
      accent: "violet",
    },
    {
      key: "account",
      code: "ACCOUNT",
      label: "账户设置",
      description: "头像、密码与基础资料变更",
      accent: "peach",
    },
    {
      key: "billing",
      code: "PLAN",
      label: "会员与额度",
      description: "套餐、积分、账单与空间",
      accent: "lime",
    },
    {
      key: "system",
      code: "SYSTEM",
      label: "产品与系统",
      description: "功能更新、维护与规则变更",
      accent: "blue",
    },
  ]);

  const templates = Object.freeze([
    {
      id: "task.completed",
      category: "task",
      eventLabel: "任务完成",
      tone: "success",
      title: "你的「{{workName}}」已生成完成",
      body: "共生成{{count}}{{assetUnit}}，已自动保存至「我的资产」，现在可以预览或下载。",
      action: { label: "查看结果", page: "assets" },
    },
    {
      id: "task.failed",
      category: "task",
      eventLabel: "需要处理",
      tone: "critical",
      title: "「{{workName}}」生成未完成",
      body: "{{reason}}。本次未扣除生成额度，你可以调整素材后重新尝试。",
      action: { label: "返回调整", page: "quickCreate" },
    },
    {
      id: "task.exported",
      category: "task",
      eventLabel: "导出完成",
      tone: "info",
      title: "「{{workName}}」已完成导出",
      body: "{{format}}文件已经生成，并保留在「我的资产」中供你再次下载。",
      action: { label: "查看文件", page: "assets" },
    },
    {
      id: "asset.shared",
      category: "asset",
      eventLabel: "收到分享",
      tone: "info",
      title: "{{sender}}向你分享了「{{assetName}}」",
      body: "你已获得“{{permission}}”权限，可以打开资产查看内容和相关版本。",
      action: { label: "打开资产", page: "assets" },
    },
    {
      id: "asset.commented",
      category: "asset",
      eventLabel: "协作动态",
      tone: "info",
      title: "{{sender}}在「{{assetName}}」中留言",
      body: "“{{comment}}”打开资产可查看完整上下文并继续处理。",
      action: { label: "查看留言", page: "assets" },
    },
    {
      id: "account.avatar_changed",
      category: "account",
      eventLabel: "头像变更",
      tone: "info",
      title: "你的账户头像已更新",
      body: "账户头像已于{{changedAt}}更新。若非本人操作，请检查账户设置并及时修改密码。",
      action: { label: "查看账户设置", page: "account" },
    },
    {
      id: "account.password_changed",
      category: "account",
      eventLabel: "密码变更",
      tone: "warning",
      title: "你的登录密码已修改",
      body: "登录密码已于{{changedAt}}修改。为了账户安全，其他已登录设备可能需要重新验证。",
      action: { label: "查看账户设置", page: "account" },
    },
    {
      id: "account.profile_changed",
      category: "account",
      eventLabel: "资料变更",
      tone: "info",
      title: "你的账户基础资料已更新",
      body: "{{fields}}已于{{changedAt}}更新。你可以进入账户设置查看最新资料。",
      action: { label: "查看账户设置", page: "account" },
    },
    {
      id: "billing.plan_expiring",
      category: "billing",
      eventLabel: "会员到期",
      tone: "warning",
      title: "{{planName}}将在{{days}}天后到期",
      body: "续费后可继续使用当前积分、{{storage}} 资产空间与无水印导出能力。",
      action: { label: "查看会员", page: "rights" },
    },
    {
      id: "billing.credits_low",
      category: "billing",
      eventLabel: "额度提醒",
      tone: "warning",
      title: "本周期生成积分仅剩{{credits}}",
      body: "积分将在{{resetDate}}重置。你可以查看明细或按需补充积分。",
      action: { label: "查看积分", page: "points" },
    },
    {
      id: "billing.payment_succeeded",
      category: "billing",
      eventLabel: "支付成功",
      tone: "success",
      title: "{{orderName}}支付成功",
      body: "实付{{amount}}，相关会员权益或积分已经到账。",
      action: { label: "查看订单", page: "orders" },
    },
    {
      id: "system.feature_release",
      category: "system",
      eventLabel: "功能上新",
      tone: "info",
      title: "{{featureName}}现已上线",
      body: "{{summary}}你可以立即打开相关功能查看完整内容。",
      action: { label: "立即体验", page: "templates" },
    },
    {
      id: "system.maintenance",
      category: "system",
      eventLabel: "服务维护",
      tone: "warning",
      title: "{{date}}将进行系统维护",
      body: "预计维护{{duration}}，期间{{impact}}，已经开始的任务不会丢失。",
      action: { label: "查看帮助", page: "help" },
    },
    {
      id: "system.policy_updated",
      category: "system",
      eventLabel: "规则更新",
      tone: "info",
      title: "{{policyName}}已更新",
      body: "新版本将于 {{effectiveDate}} 生效，请在使用相关功能前了解主要变化。",
      action: { label: "查看说明", page: "help" },
    },
  ]);

  const notifications = Object.freeze([
    {
      id: "notice-001",
      templateId: "task.completed",
      read: false,
      time: "2 分钟前",
      group: "今天",
      data: { workName: "夏日精华液主图", count: 4, assetUnit: "张图片" },
    },
    {
      id: "notice-002",
      templateId: "task.failed",
      read: false,
      time: "今天 10:42",
      group: "今天",
      data: { workName: "咖啡机生活方式短片", reason: "商品主体在参考素材中被大面积遮挡" },
    },
    {
      id: "notice-003",
      templateId: "asset.shared",
      read: false,
      time: "今天 09:58",
      group: "今天",
      data: { sender: "林小满", assetName: "秋季上新视觉提案", permission: "查看与评论" },
    },
    {
      id: "notice-004",
      templateId: "account.avatar_changed",
      read: false,
      time: "今天 09:26",
      group: "今天",
      data: { changedAt: "今天 09:26" },
    },
    {
      id: "notice-005",
      templateId: "billing.plan_expiring",
      read: true,
      time: "昨天 18:40",
      group: "昨天",
      data: { planName: "专业版", days: 12, storage: "50GB" },
    },
    {
      id: "notice-006",
      templateId: "system.feature_release",
      read: true,
      time: "昨天 15:20",
      group: "昨天",
      data: { featureName: "模板真实案例详情", summary: "现在可以查看完整案例、输出规格和案例商品说明，再决定是否使用模板。" },
    },
    {
      id: "notice-007",
      templateId: "asset.commented",
      read: true,
      time: "7 月 19 日",
      group: "更早",
      data: { sender: "周予安", assetName: "通勤手袋卖点视频", comment: "第二镜的材质特写可以再停留半秒" },
    },
    {
      id: "notice-008",
      templateId: "billing.credits_low",
      read: true,
      time: "7 月 18 日",
      group: "更早",
      data: { credits: 180, resetDate: "8 月 1 日" },
    },
    {
      id: "notice-009",
      templateId: "system.maintenance",
      read: true,
      time: "7 月 15 日",
      group: "更早",
      data: { date: "7 月 24 日 02:00", duration: "约30分钟", impact: "部分生成任务可能延迟进入队列" },
    },
  ]);

  function interpolate(copy, values = {}) {
    return String(copy).replace(/\{\{([a-zA-Z][a-zA-Z0-9]*)\}\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match
    ));
  }

  function resolveNotification(notification) {
    const template = templates.find((item) => item.id === notification.templateId);
    if (!template) throw new Error(`Unknown notification template: ${notification.templateId}`);
    const category = categories.find((item) => item.key === template.category);
    if (!category) throw new Error(`Unknown notification category: ${template.category}`);
    return Object.freeze({
      ...notification,
      category,
      template,
      title: interpolate(template.title, notification.data),
      body: interpolate(template.body, notification.data),
      action: template.action,
    });
  }

  return Object.freeze({
    version: "2026.07.21-2",
    categories,
    templates,
    notifications,
    interpolate,
    resolveNotification,
  });
});
