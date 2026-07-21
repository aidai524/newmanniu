const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scriptSource = fs.readFileSync(path.join(root, "script.js"), "utf8");
const themeSource = fs.readFileSync(path.join(root, "designkit-theme.css"), "utf8");

const triggerCount = (indexSource.match(/data-task-access-trigger/g) || []).length;
const creationBindings = (scriptSource.match(/applyTaskAccessToCreation\(/g) || []).length - 1;

assert.equal(triggerCount, 7, "图片、视频的开始入口与最终生成入口都应提供任务可见范围设置");
assert.equal(creationBindings, 4, "四类实际任务生成流程都必须写入可见范围");
const quickHeadingStart = indexSource.indexOf('<div class="quick-home-heading">');
const quickFooterStart = indexSource.indexOf('<div class="quick-home-footer">', quickHeadingStart);
assert.ok(indexSource.slice(quickHeadingStart, quickFooterStart).includes("task-access-trigger is-heading"), "首页任务权限入口应位于设置标题区");
assert.ok(!indexSource.slice(quickFooterStart, quickFooterStart + 520).includes("data-task-access-trigger"), "首页底部操作区不应夹入任务权限入口");
assert.ok(indexSource.includes("data-task-access-dialog"), "页面缺少新任务可见范围弹框");
assert.ok(indexSource.includes("新任务将仅自己可见"), "新任务必须明确展示默认私有状态");
assert.ok(`${indexSource}\n${scriptSource}`.includes("创建后仍可随时共享"), "设置界面必须说明创建后仍可修改权限");
assert.ok(scriptSource.includes('draftAccess = { visibility: "private"'), "新任务必须默认仅自己可见");
assert.ok(scriptSource.includes('new CustomEvent("manniu:task-created"'), "任务创建时必须发布包含访问设置的事件");
assert.ok(scriptSource.includes("createdTaskStorageKey"), "前端原型必须持久化新建任务和访问范围");
assert.ok(themeSource.includes(".task-access-trigger.is-shared"), "共享状态必须有明确的视觉反馈");

console.log(`task access UI tests passed: ${triggerCount} synchronized controls, ${creationBindings} creation bindings`);
