const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const catalog = require("../notification-catalog.js");
const expectedCategories = ["task", "asset", "account", "billing", "system"];
const allowedPages = new Set(["assets", "quickCreate", "account", "rights", "points", "orders", "templates", "help"]);
const indexSource = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const scriptSource = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
const documentationSource = fs.readFileSync(path.join(__dirname, "..", "docs", "notification-content-templates-2026-07-21.md"), "utf8");

assert.deepEqual(catalog.categories.map((category) => category.key), expectedCategories);
assert.equal(new Set(catalog.templates.map((template) => template.id)).size, catalog.templates.length, "通知模板 ID 必须唯一");
assert.equal(new Set(catalog.notifications.map((notification) => notification.id)).size, catalog.notifications.length, "通知实例 ID 必须唯一");

for (const category of catalog.categories) {
  assert.ok(category.label.length >= 4, `${category.key} 缺少清晰分类名称`);
  assert.ok(category.description.length >= 8, `${category.key} 缺少分类说明`);
  assert.ok(catalog.templates.filter((template) => template.category === category.key).length >= 2, `${category.key} 至少需要 2 个内容模板`);
}

for (const template of catalog.templates) {
  assert.ok(expectedCategories.includes(template.category), `${template.id} 使用了未知分类`);
  assert.ok(template.title.length >= 8, `${template.id} 缺少标题模板`);
  assert.ok(template.body.length >= 18, `${template.id} 缺少正文模板`);
  assert.ok(template.eventLabel.length >= 4, `${template.id} 缺少事件标签`);
  assert.ok(allowedPages.has(template.action.page), `${template.id} 使用了无效跳转页面`);
}

for (const notification of catalog.notifications) {
  const resolved = catalog.resolveNotification(notification);
  assert.doesNotMatch(resolved.title, /\{\{.+?\}\}/, `${notification.id} 标题仍有未替换变量`);
  assert.doesNotMatch(resolved.body, /\{\{.+?\}\}/, `${notification.id} 正文仍有未替换变量`);
  assert.equal(resolved.category.key, resolved.template.category, `${notification.id} 分类映射错误`);
}

assert.ok(indexSource.includes("notification-catalog.js"), "页面必须加载通知模板目录");
assert.ok(indexSource.includes("data-message-categories"), "页面缺少通知分类容器");
assert.ok(scriptSource.includes("ManniuNotificationCatalog"), "通知界面必须由模板目录驱动");
for (const category of catalog.categories) {
  assert.ok(documentationSource.includes(category.label), `通知文档缺少 ${category.label} 分类`);
}
for (const template of catalog.templates) {
  assert.ok(documentationSource.includes(`\`${template.id}\``), `通知文档缺少 ${template.id} 模板`);
}

console.log(`notification catalog tests passed: ${catalog.templates.length} templates across ${catalog.categories.length} categories`);
