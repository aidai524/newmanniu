const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const landingSource = read("landing.html");
const landingStyles = read("landing.css");
const landingScript = read("landing.js");
const serverSource = read("server.js");
const loginSource = read("login.html");
const termsSource = read("service-terms.html");
const privacySource = read("privacy-policy.html");

assert.equal((landingSource.match(/<h1\b/g) || []).length, 1, "官网必须且只能有一个一级标题");
assert.ok(landingSource.includes("南京牛派智能科技有限公司"), "官网必须展示公司主体");
assert.ok(landingSource.includes('type="application/ld+json"'), "官网必须包含结构化数据");
assert.ok(landingSource.includes('"@type": "SoftwareApplication"'), "结构化数据必须说明产品类型");
assert.match(landingSource, /<meta\s+name="description"/, "官网必须包含 SEO 描述");
assert.match(landingSource, /<meta\s+property="og:title"/, "官网必须包含 Open Graph 标题");

for (const id of ["main-content", "capabilities", "cases", "difference"]) {
  assert.ok(landingSource.includes(`id="${id}"`), `官网缺少 #${id} 内容区`);
}

assert.ok(landingSource.includes('href="service-terms.html"'), "官网必须链接服务条款");
assert.ok(landingSource.includes('href="privacy-policy.html"'), "官网必须链接隐私政策");
assert.ok((landingSource.match(/href="login\.html"/g) || []).length >= 5, "官网主要入口必须进入登录流程");
assert.doesNotMatch(landingSource, /href="index\.html"/, "公开官网不应绕过登录直接进入工作台");
assert.doesNotMatch(landingSource, /styles\.css|designkit-theme\.css/, "官网样式必须与工作台样式隔离");
assert.doesNotMatch(landingSource, /TODO|待补充|example\.com|href="#"/i, "官网不应包含占位内容或空链接");
assert.equal((landingSource.match(/<section\b/g) || []).length, 5, "官网正文应保持五段式精简叙事");
assert.match(landingSource, /你负责好产品/, "官网首屏应先表达用户价值");
assert.match(landingSource, /先看作品，再决定要不要开始/, "官网应让作品承担主要说服力");
assert.doesNotMatch(
  landingSource,
  /data-demo-mode|data-demo-panel|data-case-filter|data-case-category|workflow-steps|plan-card/,
  "精简官网不应保留产品演示、案例筛选、流程或套餐说明组件",
);
assert.doesNotMatch(
  landingSource,
  /Agent 创作|目标平台|输出数量|三级权限|会员权益/,
  "品牌官网不应继续呈现产品说明书式细节",
);

const ids = [...landingSource.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "官网不应包含重复 ID");

const imageTags = [...landingSource.matchAll(/<img\b[^>]*>/gs)].map((match) => match[0]);
assert.ok(imageTags.length >= 6, "官网应展示少量精选的真实作品");
for (const tag of imageTags) {
  assert.match(tag, /\balt="[^"]*"/, `图片缺少替代文本：${tag}`);
  assert.match(tag, /\bwidth="\d+"/, `图片缺少宽度：${tag}`);
  assert.match(tag, /\bheight="\d+"/, `图片缺少高度：${tag}`);
  assert.match(tag, /\b(?:loading="lazy"|fetchpriority="high")/, `图片缺少加载策略：${tag}`);

  const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
  assert.ok(src, `图片缺少 src：${tag}`);
  assert.ok(fs.existsSync(path.join(root, src)), `官网图片不存在：${src}`);
}

assert.equal(
  (landingSource.match(/fetchpriority="high"/g) || []).length,
  1,
  "首屏只能有一张高优先级图片",
);
assert.ok(landingSource.includes("assets/landing/"), "官网应使用优化后的专用 WebP 素材");
assert.ok(landingSource.includes("浏览器本地处理"), "官网必须说明本地素材工具的数据边界");
assert.ok(landingSource.includes("创建后默认只有自己可见") || landingSource.includes("创作默认私有"), "官网必须说明任务默认私有");

assert.match(serverSource, /pathname === "\/" \? "\/landing\.html"/, "根路径必须展示官网");
assert.match(loginSource, /class="login-brand" href="landing\.html"/, "登录页品牌标识必须返回官网");
assert.match(termsSource, /class="legal-brand" href="landing\.html"/, "服务条款品牌标识必须返回官网");
assert.match(privacySource, /class="legal-brand" href="landing\.html"/, "隐私政策品牌标识必须返回官网");

assert.ok(landingStyles.includes("@media (max-width: 430px)"), "官网必须覆盖 390px 移动端");
assert.ok(landingStyles.includes("prefers-reduced-motion"), "官网必须尊重减少动态效果设置");
assert.ok(landingScript.includes('event.key === "Escape"'), "移动导航必须支持 Escape 关闭");
assert.ok(landingScript.includes("IntersectionObserver"), "官网应使用按需渐入并提供兼容回退");
assert.doesNotMatch(
  landingScript,
  /demoRotationTimer|selectDemoMode|caseButtons|activeFilter/,
  "官网脚本不应保留已移除模块的死代码",
);

console.log("landing page tests passed: concise narrative, selected work, routing, SEO and responsive hooks");
