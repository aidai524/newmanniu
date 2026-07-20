const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const realCases = require("../template-real-cases.js");

assert.equal(realCases.products.length, 10, "18 个模板应复用 10 组真实商品母素材");
assert.equal(realCases.cases.length, 18, "每个模板都必须有一个真实商品案例");
assert.equal(new Set(realCases.cases.map((item) => item.id)).size, 18, "真实案例 ID 必须唯一");
assert.equal(new Set(realCases.cases.map((item) => item.output)).size, 18, "真实案例输出路径必须唯一");

for (const product of realCases.products) {
  assert.ok(product.sourceId, `${product.id} 缺少素材来源 ID`);
  assert.match(product.sourceUrl, /^https:\/\/www\.pexels\.com\//, `${product.id} 缺少 Pexels 来源链接`);
  assert.ok(fs.existsSync(path.join(__dirname, "..", product.asset)), `${product.id} 缺少本地高清商品图`);
}

for (const item of realCases.cases) {
  assert.ok(item.prompt.length >= 600, `${item.id} 的真实案例提示词不够完整`);
  assert.ok(item.prompt.includes("reference"), `${item.id} 缺少参考商品约束`);
  assert.ok(["strict", "structure"].includes(item.fidelity), `${item.id} 的商品一致性模式无效`);
  assert.ok(fs.existsSync(path.join(__dirname, "..", item.productAsset)), `${item.id} 对应的商品素材不存在`);
}

assert.equal(realCases.cases.filter((item) => item.fidelity === "structure").length, 3, "仅 3 个品牌规范案例允许重做品牌层");

console.log(`template real-case tests passed: ${realCases.cases.length} cases using ${realCases.products.length} products`);
