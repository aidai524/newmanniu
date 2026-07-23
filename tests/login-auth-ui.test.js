const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const loginSource = fs.readFileSync(path.join(root, "login.html"), "utf8");
const scriptSource = fs.readFileSync(path.join(root, "script.js"), "utf8");

assert.ok(loginSource.includes('aria-label="手机号登录表单"'), "登录页必须保留手机号验证码登录");
assert.ok(loginSource.includes('data-view="wechat"'), "登录页必须保留微信扫码登录");
assert.ok(loginSource.includes('data-panel="phone"'), "手机号登录必须是可切换的默认视图");
assert.ok(!loginSource.includes('data-panel="account"'), "登录页不应保留账号密码登录视图");
assert.ok(!loginSource.includes("账号密码登录"), "登录页不应展示账号密码登录入口");
assert.ok(!loginSource.includes('autocomplete="current-password"'), "登录页不应包含密码输入框");
assert.ok(!loginSource.includes('role="tablist"'), "单一手机号登录方式不需要登录方式切换标签");
assert.ok(!scriptSource.includes('classList.contains("tab")'), "登录脚本不应保留已移除登录标签的状态同步逻辑");

console.log("login auth UI tests passed: phone verification and WeChat only");
