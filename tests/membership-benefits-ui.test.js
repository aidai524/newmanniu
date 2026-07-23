const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const baseStyles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const themeStyles = fs.readFileSync(path.join(root, "designkit-theme.css"), "utf8");

const membershipStart = indexSource.indexOf('data-page-panel="rights"');
const membershipEnd = indexSource.indexOf('data-page-panel="invite"');
const membershipSource = indexSource.slice(membershipStart, membershipEnd);

assert.ok(membershipStart >= 0 && membershipEnd > membershipStart, "必须保留会员与积分页面");
assert.match(membershipSource, /<h2>会员权益对比<\/h2>/, "必须保留会员权益对比");
assert.match(membershipSource, /<td>资产空间<\/td>/, "必须保留资产空间权益文字");
assert.doesNotMatch(membershipSource, /benefit-icon/, "权益对比左侧不应再显示空复选框装饰");
assert.doesNotMatch(baseStyles, /\.price-card\s+li::before/, "套餐权益列表不应再生成勾选框");
assert.doesNotMatch(themeStyles, /\.membership-layout\s+\.price-card(?:\.[\w-]+)?\s+li::before/, "主题样式不应恢复套餐勾选框");
assert.match(baseStyles, /\.price-card\s+li\s*\{\s*padding-left:\s*0;/, "移除勾选框后列表文字应恢复左对齐");
assert.ok((membershipSource.match(/class="yes/g) || []).length > 0, "对比表内的实际支持状态必须保留");
assert.ok((membershipSource.match(/class="no/g) || []).length > 0, "对比表内的实际不支持状态必须保留");

console.log("membership benefits UI tests passed: decorative checkboxes removed, entitlement states preserved");
