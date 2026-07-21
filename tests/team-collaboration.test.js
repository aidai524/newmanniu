const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const catalog = require("../team-collaboration.js");
const indexSource = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const scriptSource = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
const memberIds = new Set(catalog.members.map((member) => member.id));
const visibilityKeys = new Set(catalog.visibilityOptions.map((option) => option.key));
const permissionKeys = new Set(catalog.permissionLevels.map((permission) => permission.key));
const taskIds = new Set(catalog.tasks.map((task) => task.id));

assert.equal(catalog.version, "2026.07.21-1");
assert.equal(taskIds.size, catalog.tasks.length, "团队任务 ID 必须唯一");
assert.equal(memberIds.size, catalog.members.length, "团队成员 ID 必须唯一");
assert.ok(memberIds.has(catalog.currentUserId), "当前用户必须属于团队");
assert.ok(memberIds.has(catalog.team.ownerId), "团队所有者必须属于团队");
assert.equal(catalog.members.filter((member) => member.role === "owner").length, 1, "团队必须且只能有一位所有者");
assert.equal(catalog.team.ownerId, catalog.members.find((member) => member.role === "owner").id, "所有者身份映射错误");
assert.ok(catalog.team.seatLimit >= catalog.members.length, "当前成员数不能超过席位上限");

for (const task of catalog.tasks) {
  assert.ok(memberIds.has(task.ownerId), `${task.id} 的创建者不在团队中`);
  assert.ok(["mine", "shared", "team"].includes(task.scope), `${task.id} 使用了未知任务分类`);
  assert.ok(visibilityKeys.has(task.visibility), `${task.id} 使用了未知可见范围`);
  assert.ok(permissionKeys.has(task.teamPermission), `${task.id} 使用了未知团队默认权限`);
  assert.ok(fs.existsSync(path.join(__dirname, "..", task.thumbnail)), `${task.id} 缺少任务预览图`);
  assert.ok(task.title.length >= 6, `${task.id} 缺少清晰任务名称`);
  assert.ok(task.activity.length >= 6, `${task.id} 缺少协作动态`);

  if (task.scope === "mine") assert.equal(task.ownerId, catalog.currentUserId, `${task.id} 应由当前用户创建`);
  if (task.scope === "shared") {
    assert.notEqual(task.ownerId, catalog.currentUserId, `${task.id} 不能同时属于分享给我和我创建的任务`);
    assert.ok(task.memberAccess.some((access) => access.memberId === catalog.currentUserId), `${task.id} 没有授予当前用户权限`);
  }
  if (task.scope === "team") assert.equal(task.visibility, "team", `${task.id} 团队任务必须全团队可见`);
  if (task.visibility === "private") assert.equal(task.memberAccess.length, 0, `${task.id} 私有任务不能包含成员授权`);
  if (task.visibility !== "selected_members") assert.equal(task.memberAccess.length, 0, `${task.id} 非指定成员模式不应保留单独授权`);

  for (const access of task.memberAccess) {
    const member = catalog.members.find((item) => item.id === access.memberId);
    assert.ok(member, `${task.id} 授权了未知成员`);
    assert.equal(member.status, "active", `${task.id} 不能授权给待激活或停用成员`);
    assert.ok(permissionKeys.has(access.permission), `${task.id} 使用了未知成员权限`);
  }
}

assert.ok(indexSource.includes('data-page-panel="team"'), "页面缺少团队协作主视图");
assert.ok(indexSource.includes('workspace-library-page team-collaboration-page'), "团队协作页必须复用工作区页面容器");
assert.ok(indexSource.includes('library-page-head team-page-head'), "团队协作页必须复用公共页头布局");
assert.ok(indexSource.includes('class="library-eyebrow">COLLABORATION HUB'), "团队协作页眉题必须复用公共页头样式");
assert.ok(indexSource.includes("data-team-share-dialog"), "页面缺少共享权限弹框");
assert.ok(indexSource.includes("team-collaboration.js"), "页面必须加载团队协作数据目录");
assert.ok(scriptSource.includes("ManniuTeamCollaboration"), "团队协作界面必须由数据目录驱动");
assert.ok(scriptSource.includes("setupTeamCollaboration"), "团队协作界面缺少初始化逻辑");

console.log(`team collaboration tests passed: ${catalog.tasks.length} tasks, ${catalog.members.length} members`);
