(function registerManniuTeamCollaboration(root, factory) {
  const catalog = factory();
  if (typeof module === "object" && module.exports) module.exports = catalog;
  if (root) root.ManniuTeamCollaboration = catalog;
})(typeof window !== "undefined" ? window : globalThis, function createTeamCollaborationCatalog() {
  const currentUserId = "member-owner";

  const team = Object.freeze({
    id: "team-mn-35873",
    name: "蛮牛创意科技",
    plan: "企业专业版",
    ownerId: "member-owner",
    seatLimit: 10,
    createdAt: "2026 年 3 月",
  });

  const members = Object.freeze([
    Object.freeze({
      id: "member-owner",
      name: "用户昵称",
      initials: "我",
      role: "owner",
      roleLabel: "团队所有者",
      status: "active",
      statusLabel: "当前账号",
      color: "dark",
      phone: "189****8685",
    }),
    Object.freeze({
      id: "member-lin",
      name: "林晓",
      initials: "林",
      role: "member",
      roleLabel: "团队成员",
      status: "active",
      statusLabel: "今天 09:42 在线",
      color: "mint",
      phone: "138****2716",
    }),
    Object.freeze({
      id: "member-chen",
      name: "陈屿",
      initials: "陈",
      role: "member",
      roleLabel: "团队成员",
      status: "pending",
      statusLabel: "等待首次登录",
      color: "lime",
      phone: "186****5038",
    }),
  ]);

  const visibilityOptions = Object.freeze([
    Object.freeze({
      key: "private",
      label: "仅自己可见",
      shortLabel: "私有",
      description: "只有任务创建者可以查看和编辑",
    }),
    Object.freeze({
      key: "selected_members",
      label: "指定成员可见",
      shortLabel: "指定成员",
      description: "选择成员，并分别设置查看、评论或编辑权限",
    }),
    Object.freeze({
      key: "team",
      label: "全团队可见",
      shortLabel: "全团队",
      description: "所有正常状态的团队成员均可访问",
    }),
  ]);

  const permissionLevels = Object.freeze([
    Object.freeze({ key: "viewer", label: "仅查看", description: "查看任务、素材和生成结果" }),
    Object.freeze({ key: "commenter", label: "可评论", description: "查看并参与任务留言" }),
    Object.freeze({ key: "editor", label: "可编辑", description: "修改任务设置并发起重新生成" }),
  ]);

  const tasks = Object.freeze([
    Object.freeze({
      id: "team-task-serum",
      title: "夏日精华液主图",
      description: "护肤品夏季主图与详情素材",
      type: "图片任务",
      scope: "mine",
      ownerId: "member-owner",
      visibility: "selected_members",
      memberAccess: Object.freeze([Object.freeze({ memberId: "member-lin", permission: "editor" })]),
      teamPermission: "viewer",
      thumbnail: "assets/dashboard/work-1-hd.jpg",
      updatedAt: "8 分钟前更新",
      outputMeta: "4 张图片 · 2K",
      activity: "林晓刚刚完成一次版式调整",
      destinationPage: "detail",
    }),
    Object.freeze({
      id: "team-task-coffee",
      title: "便携咖啡机生活短片",
      description: "通勤场景 15 秒产品视频",
      type: "视频任务",
      scope: "mine",
      ownerId: "member-owner",
      visibility: "private",
      memberAccess: Object.freeze([]),
      teamPermission: "viewer",
      thumbnail: "assets/dashboard/work-5-hd.jpg",
      updatedAt: "今天 10:42",
      outputMeta: "视频草案 · 9:16",
      activity: "等待调整商品遮挡问题",
      destinationPage: "videoAgent",
    }),
    Object.freeze({
      id: "team-task-headphones",
      title: "降噪耳机发布视觉",
      description: "品牌 KV、商品主图与社媒封面",
      type: "图片任务",
      scope: "mine",
      ownerId: "member-owner",
      visibility: "team",
      memberAccess: Object.freeze([]),
      teamPermission: "commenter",
      thumbnail: "assets/dashboard/work-3-hd.jpg",
      updatedAt: "昨天 19:20",
      outputMeta: "6 张图片 · 2K",
      activity: "已向全团队开放评论",
      destinationPage: "detail",
    }),
    Object.freeze({
      id: "team-task-autumn",
      title: "秋季上新视觉提案",
      description: "服装上新主视觉与平台适配图",
      type: "图片任务",
      scope: "shared",
      ownerId: "member-lin",
      visibility: "selected_members",
      memberAccess: Object.freeze([Object.freeze({ memberId: "member-owner", permission: "editor" })]),
      teamPermission: "viewer",
      thumbnail: "assets/dashboard/work-2-hd.jpg",
      updatedAt: "今天 09:58",
      outputMeta: "5 张图片 · 2K",
      activity: "林晓授予你编辑权限",
      destinationPage: "detail",
    }),
    Object.freeze({
      id: "team-task-handbag",
      title: "通勤手袋卖点视频",
      description: "材质细节与容量展示短片",
      type: "视频任务",
      scope: "shared",
      ownerId: "member-lin",
      visibility: "selected_members",
      memberAccess: Object.freeze([Object.freeze({ memberId: "member-owner", permission: "commenter" })]),
      teamPermission: "viewer",
      thumbnail: "assets/dashboard/work-6-hd.jpg",
      updatedAt: "7 月 19 日",
      outputMeta: "20 秒视频 · 16:9",
      activity: "你有 1 条未处理的协作留言",
      destinationPage: "videoAgent",
    }),
    Object.freeze({
      id: "team-task-snack",
      title: "每日坚果办公室分享",
      description: "团队公共素材与社媒内容卡片",
      type: "团队任务",
      scope: "team",
      ownerId: "member-lin",
      visibility: "team",
      memberAccess: Object.freeze([]),
      teamPermission: "viewer",
      thumbnail: "assets/dashboard/work-4-hd.jpg",
      updatedAt: "7 月 18 日",
      outputMeta: "4 张图片 · 4:5",
      activity: "所有成员均可查看",
      destinationPage: "detail",
    }),
  ]);

  return Object.freeze({
    version: "2026.07.21-1",
    currentUserId,
    team,
    members,
    visibilityOptions,
    permissionLevels,
    tasks,
  });
});
