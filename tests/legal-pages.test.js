const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const loginSource = fs.readFileSync(path.join(root, "login.html"), "utf8");
const termsSource = fs.readFileSync(path.join(root, "service-terms.html"), "utf8");
const privacySource = fs.readFileSync(path.join(root, "privacy-policy.html"), "utf8");

const companyName = "南京牛派智能科技有限公司";
const effectiveDate = "2026 年 7 月 23 日";

assert.match(
  loginSource,
  /href="service-terms\.html" target="_blank" rel="noopener">《服务条款》/,
  "登录页必须链接到服务条款正式页面",
);
assert.match(
  loginSource,
  /href="privacy-policy\.html" target="_blank" rel="noopener">《隐私政策》/,
  "登录页必须链接到隐私政策正式页面",
);

for (const [pageName, source] of [
  ["服务条款", termsSource],
  ["隐私政策", privacySource],
]) {
  assert.ok(source.includes(companyName), `${pageName}必须展示公司主体`);
  assert.ok(source.includes(effectiveDate), `${pageName}必须展示正式生效日期`);
  assert.equal((source.match(/<h1\b/g) || []).length, 1, `${pageName}必须且只能有一个一级标题`);
  assert.ok(source.includes('class="legal-topbar"'), `${pageName}必须使用统一法律页面头部`);
  assert.ok(source.includes('class="legal-toc"'), `${pageName}必须提供章节目录`);
  assert.ok(source.includes('href="login.html"'), `${pageName}必须可以返回登录页`);
  assert.doesNotMatch(source, /TODO|待补充|example\.com/i, `${pageName}不应包含占位内容`);
}

assert.ok(termsSource.includes('href="privacy-policy.html"'), "服务条款必须链接隐私政策");
assert.ok(privacySource.includes('href="service-terms.html"'), "隐私政策必须链接服务条款");
assert.ok(termsSource.includes("显式标识") && termsSource.includes("隐式标识"), "服务条款必须说明 AI 标识");
assert.ok(termsSource.includes("会员、积分、付费与发票"), "服务条款必须覆盖会员、积分、付费与发票");
assert.ok(termsSource.includes("团队协作与企业账号"), "服务条款必须覆盖团队权限");
assert.ok(privacySource.includes("我们不会出售你的个人信息"), "隐私政策必须明确不出售个人信息");
assert.ok(privacySource.includes("浏览器本地处理"), "隐私政策必须区分浏览器本地处理");
assert.ok(privacySource.includes("云端生成与协作"), "隐私政策必须说明云端处理边界");
assert.ok(privacySource.includes("你的个人信息权利"), "隐私政策必须提供个人信息权利说明");
assert.ok(privacySource.includes("不满十四周岁的儿童不得自行注册"), "隐私政策必须包含儿童保护规则");

console.log("legal pages tests passed: terms, privacy, company identity, AI and data rules");
