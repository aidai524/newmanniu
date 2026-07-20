const realCases = require("../template-real-cases.js");

for (const [index, item] of realCases.cases.entries()) {
  const product = realCases.products.find((candidate) => candidate.id === item.productId);
  console.log(`## ${String(index + 1).padStart(2, "0")} · ${item.title}`);
  console.log("");
  console.log(`- 模板 ID：\`${item.id}\``);
  console.log(`- 实际商品：${product.title}`);
  console.log(`- 商品母图：\`${product.asset}\``);
  console.log(`- 来源：${product.sourceUrl}`);
  console.log(`- 输出比例：${item.ratio} · ${item.resolution}`);
  console.log(`- 商品约束：${item.fidelity === "structure" ? "保留商品结构，允许重做品牌层" : "严格保留商品本体"}`);
  console.log(`- 验证重点：${item.note}`);
  console.log("");
  console.log("```text");
  console.log(item.prompt);
  console.log("```");
  console.log("");
}
