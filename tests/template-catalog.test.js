const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const catalog = require("../template-catalog.js");
const expectedCategories = ["commerce", "poster", "video", "social", "brand", "expand"];
const indexSource = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const scriptSource = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");

assert.equal(catalog.templates.length, 18, "首批模板应包含 18 个真实案例");
assert.deepEqual(catalog.categories.map((category) => category.key), expectedCategories);
assert.equal(new Set(catalog.templates.map((template) => template.id)).size, 18, "模板 ID 必须唯一");
assert.equal(new Set(catalog.templates.map((template) => template.asset)).size, 18, "模板预览图路径必须唯一");

for (const category of expectedCategories) {
  assert.equal(catalog.templates.filter((template) => template.category === category).length, 3, `${category} 应包含 3 个案例`);
}

for (const template of catalog.templates) {
  assert.ok(template.title.length >= 6, `${template.id} 缺少清晰标题`);
  assert.ok(template.description.length >= 8, `${template.id} 缺少用户可理解的说明`);
  assert.ok(template.examplePrompt.length >= 300, `${template.id} 的案例验证提示词不够完整`);
  assert.ok(template.examplePrompt.includes("no watermark"), `${template.id} 的案例提示词缺少水印约束`);
  assert.ok(template.runtimePrompt.length >= 1500, `${template.id} 的用户运行时提示词不够完整`);
  assert.equal(template.prompt, template.runtimePrompt, `${template.id} 的兼容 prompt 必须指向运行时提示词`);
  assert.ok(template.runtimePrompt.includes("no watermark"), `${template.id} 的运行时提示词缺少水印约束`);
  assert.ok(template.runtimePrompt.includes("only source of truth"), `${template.id} 缺少用户商品唯一来源约束`);
  assert.ok(template.runtimePrompt.includes("demonstration only"), `${template.id} 缺少案例商品隔离约束`);
  for (const variable of Object.keys(catalog.runtimeVariableDefaults)) {
    assert.ok(template.runtimePrompt.includes(`{{${variable}}}`), `${template.id} 缺少运行时变量 ${variable}`);
  }
  assert.equal(template.productSlot.required, true, `${template.id} 应要求用户提供商品素材`);
  assert.equal(template.productSlot.variable, "{{productReference}}", `${template.id} 商品变量定义错误`);
  assert.ok(template.productSlot.exampleLabel.length >= 2, `${template.id} 缺少案例商品说明`);
  assert.ok(template.productSlot.replacementHint.includes("可替换"), `${template.id} 缺少替换商品提示`);
  assert.ok(template.preset && Object.keys(template.preset).length >= 4, `${template.id} 缺少可应用的参数预设`);
  assert.ok(fs.existsSync(path.join(__dirname, "..", template.asset)), `${template.id} 缺少本地高清预览图`);
}

assert.ok(
  catalog.templates.every((template) => template.asset.startsWith("assets/template-real-cases/")),
  "模板中心必须展示通过真实商品验证的案例图",
);

assert.equal(catalog.templates.filter((template) => template.quickType === "video" && template.editorPrompt).length, 3, "视频模板应带入可编辑的创作描述");
assert.ok(
  catalog.templates.filter((template) => template.quickType === "video").every((template) => template.editorPrompt.includes("我上传的商品")),
  "视频模板带入创作中心的描述必须指向用户上传商品",
);

const phonePrompt = catalog.compileRuntimePrompt("commerce.audio.noise-cancelling-headphones", {
  productReference: "asset://user-phone-front-and-back",
  productCategory: "智能手机",
  productFacts: { material: "磨砂玻璃背板", color: "深蓝色" },
  brandAssets: { logo: "asset://user-logo" },
  textLayers: [{ role: "headline", value: "轻薄旗舰" }],
  textSafeAreas: ["top-left", "bottom-right"],
});
assert.ok(phonePrompt.includes("智能手机"), "运行时提示词应带入用户的新商品品类");
assert.ok(phonePrompt.includes("asset://user-phone-front-and-back"), "运行时提示词应带入用户商品素材");
assert.ok(phonePrompt.includes("磨砂玻璃背板"), "运行时提示词应带入已验证商品事实");
assert.doesNotMatch(phonePrompt, /headphone|earphone|headset/i, "耳机案例模板替换为手机后不应残留案例商品");
assert.doesNotMatch(phonePrompt, /\{\{[a-zA-Z]+\}\}/, "编译后的运行时提示词不应残留变量占位符");

assert.ok(!indexSource.includes("data-template-dialog"), "模板使用流程不应再包含二次弹框");
assert.ok(scriptSource.includes("openTemplateInCreationCenter"), "模板按钮应直接进入创作中心");
assert.ok(scriptSource.includes("ManniuActiveTemplateContext"), "创作中心应保留当前模板的运行时提示词上下文");

console.log(`template catalog tests passed: ${catalog.templates.length} templates across ${catalog.categories.length} categories`);
