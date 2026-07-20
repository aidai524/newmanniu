const catalog = require("./template-catalog.js");

const products = Object.freeze([
  {
    id: "linen-dress",
    title: "米杏色无袖中长连衣裙",
    asset: "assets/template-products/selected/linen-dress.jpg",
    source: "Pexels",
    sourceId: 20661810,
    photographer: "Quan TRAN",
    sourceUrl: "https://www.pexels.com/photo/model-in-a-beige-dress-20661810/",
  },
  {
    id: "headphones",
    title: "无标黑色头戴式耳机",
    asset: "assets/template-products/selected/headphones.jpg",
    source: "Pexels",
    sourceId: 33174697,
    photographer: "Andrey Matveev",
    sourceUrl: "https://www.pexels.com/photo/black-over-ear-headphones-on-wooden-background-33174697/",
  },
  {
    id: "snack-pouch",
    title: "透明分装坚果籽仁零食袋",
    asset: "assets/template-products/selected/snack-pouch.jpg",
    source: "Pexels",
    sourceId: 9528310,
    photographer: "Rathaphon Nanthapreecha",
    sourceUrl: "https://www.pexels.com/photo/a-snack-with-nuts-9528310/",
  },
  {
    id: "coffee-pouches",
    title: "无标牛皮纸咖啡豆自立袋",
    asset: "assets/template-products/selected/coffee-pouches.jpg",
    source: "Pexels",
    sourceId: 12039675,
    photographer: "mockupbee",
    sourceUrl: "https://www.pexels.com/photo/paper-bag-on-white-background-12039675/",
  },
  {
    id: "fragrance-set",
    title: "透明扩香瓶与白色香薰蜡烛",
    asset: "assets/template-products/selected/fragrance-set.jpg",
    source: "Pexels",
    sourceId: 20390718,
    photographer: "Paul Seling",
    sourceUrl: "https://www.pexels.com/photo/wax-candles-and-flowers-20390718/",
  },
  {
    id: "sunscreen-tube",
    title: "无标白色防晒软管",
    asset: "assets/template-products/selected/sunscreen-tube.png",
    source: "Pexels",
    sourceId: 19080517,
    photographer: "Volker Thimm",
    sourceUrl: "https://www.pexels.com/photo/white-cosmetic-tube-19080517/",
  },
  {
    id: "running-shoes",
    title: "浅灰白针织跑鞋",
    asset: "assets/template-products/selected/running-shoes.jpg",
    source: "Pexels",
    sourceId: 1456733,
    photographer: "Ray Piedra",
    sourceUrl: "https://www.pexels.com/photo/sneakers-with-dense-surface-against-gray-background-1456733/",
  },
  {
    id: "serum-bottle",
    title: "琥珀精华液滴管瓶",
    asset: "assets/template-products/selected/serum-bottle.jpg",
    source: "Pexels",
    sourceId: 6801176,
    photographer: "Artem Podrez",
    sourceUrl: "https://www.pexels.com/photo/a-dropper-bottle-on-a-tray-6801176/",
  },
  {
    id: "coffee-maker",
    title: "黑色八角摩卡壶",
    asset: "assets/template-products/selected/coffee-maker.jpg",
    source: "Pexels",
    sourceId: 9167440,
    photographer: "Zakhar Vozhdaienko",
    sourceUrl: "https://www.pexels.com/photo/black-kettle-over-a-portable-gas-burner-9167440/",
  },
  {
    id: "lounge-chair",
    title: "绿色软包旋转休闲椅",
    asset: "assets/template-products/selected/lounge-chair.jpg",
    source: "Pexels",
    sourceId: 4172379,
    photographer: "Engin Akyurt",
    sourceUrl: "https://www.pexels.com/photo/green-padded-armchair-in-close-up-shot-4172379/",
  },
]);

const productById = new Map(products.map((product) => [product.id, product]));

const strictIdentity = `Use the attached reference photo as the single source of truth for the product. Preserve the exact product silhouette, proportions, construction, color, material, pattern, seams, controls, package geometry and all visible physical details. Do not redesign, substitute, merge, duplicate or invent a different product. The background, lighting, camera and surrounding props may change. Preserve only labels that already exist on the reference product. Do not add promotional copy, captions, badges, prices, feature icons, interface text or any other typography. If an existing product label cannot be copied accurately, keep that label area small and photographically undistorted; never invent replacement letters. If any later art-direction phrase conflicts with the reference product, the reference product wins.`;

const structureOnly = `Use the attached reference photo as the source of truth for product shape, proportions, materials and product-family structure. This is a brand-redesign case: remove the original third-party name and marks, but do not change the physical product. Replace branding only with a simple abstract symbol and blank geometric layout bars. Do not draw readable letters, words, numbers or pseudo-typography.`;

const caseSpecs = Object.freeze({
  "commerce.fashion.linen-dress": {
    productId: "linen-dress",
    fidelity: "strict",
    note: "可以更换模特和场景，但必须保持裙装版型、米杏色、褶皱与下摆结构。",
    direction: "Keep the sleeveless beige midi dress from the reference, including its gathered bodice, loose A-line volume and hem. A different model and pose are allowed, but the garment itself must remain recognizable.",
  },
  "commerce.audio.noise-cancelling-headphones": {
    productId: "headphones",
    fidelity: "strict",
    note: "保持无标黑色耳机的宽头梁、椭圆耳罩、侧面网孔与完整正视轮廓。",
    direction: "Use the exact unbranded black over-ear headphones from the reference. Preserve the wide padded headband, oval ear cushions, side perforations and symmetrical front-facing geometry. Do not add a logo, wordmark, cable, microphone or buttons that are not visible in the source.",
  },
  "commerce.snack.daily-nuts-detail": {
    productId: "snack-pouch",
    fidelity: "strict",
    note: "以参考图中的透明独立分装坚果籽仁袋为商品，真实呈现可见配料。",
    direction: "The real products are the small transparent heat-sealed portion pouches in the reference, filled with the same visible almond, seed and dried-fruit mix. Build the vertical detail composition around one clear hero pouch and a few matching portion pouches. Do not invent a gift box, opaque wrapper, colored label, brand name or different nut mix.",
  },
  "poster.coffee.product-launch": {
    productId: "coffee-pouches",
    fidelity: "strict",
    note: "保留无标牛皮纸自立袋的封口、褶皱、材质与空白包装面。",
    direction: "Use the exact blank light-kraft stand-up pouch from the reference as the coffee product. Preserve its heat-sealed top, side seams, soft paper creases, proportions and completely blank front. Coffee beans and a glass pour-over server may establish category context, but do not print or apply any mark to the pouch.",
  },
  "poster.fragrance.limited-promotion": {
    productId: "fragrance-set",
    fidelity: "strict",
    note: "商品改为参考图中的透明扩香瓶和两支白色柱状蜡烛。",
    direction: "The product set is the clear square reed diffuser plus the two white pillar candles from the reference. Do not replace them with amber vessels.",
  },
  "poster.sunscreen.summer-campaign": {
    productId: "sunscreen-tube",
    fidelity: "strict",
    note: "锁定无标白色软管与玫瑰金瓶盖，只更换夏日水感场景。",
    direction: "The single blank white squeeze tube with a rose-gold cap is the only product. Preserve its tapered body, crimped top seam, cap height, blank front and exact white-and-rose-gold color relationship. Do not add a spray bottle, second package, logo, SPF number or label.",
  },
  "video.running-shoes.dynamic-15s": {
    productId: "running-shoes",
    fidelity: "strict",
    note: "先生成真实商品短片首帧，后续再交给 Seedance。",
    direction: "Use the exact light grey and white knit running shoes from the reference. Preserve the ribbed side panels, laces, soles and black tongue marks in the keyframe.",
  },
  "video.skincare.serum-demo": {
    productId: "serum-bottle",
    fidelity: "strict",
    note: "先生成精华演示首帧，瓶型、黑色滴管和琥珀液体必须一致。",
    direction: "Use the exact small amber serum bottle with black dropper and blank white label from the reference as the video keyframe product.",
  },
  "video.coffee-maker.lifestyle": {
    productId: "coffee-maker",
    fidelity: "strict",
    note: "先生成真实可执行的生活方式首帧，摩卡壶必须有合理支撑和使用关系。",
    direction: "Use the exact black octagonal stovetop moka pot from the reference, preserving its faceted body, lid knob, spout and curved handle. Create a believable warm-morning kitchen keyframe: the pot stands securely on a small gas burner or stove with a cup nearby. Never float the pot, balance it on a cup, place it on a train table, or show unsupported pouring. If pouring is shown, a real hand must hold the handle naturally.",
  },
  "social.fashion.xhs-seeding": {
    productId: "linen-dress",
    fidelity: "strict",
    note: "同一条裙子用于验证主图与社媒内容的一致性。",
    direction: "Keep the sleeveless beige midi dress identical across the main lifestyle image and every inset detail. A different model is allowed.",
  },
  "social.audio.review-cards": {
    productId: "headphones",
    fidelity: "strict",
    note: "同一副耳机用于验证主图、测评卡与品牌视觉的一致性。",
    direction: "Use the exact unbranded black over-ear headphones and truthful close-up crops of their wide headband, oval cushions and side perforations. Do not invent hinges, ports, controls, logos or buttons not visible in the source.",
  },
  "social.snack.office-sharing": {
    productId: "snack-pouch",
    fidelity: "strict",
    note: "同一批透明分装坚果袋进入办公室分享场景，配料和包装不能换。",
    direction: "Keep the transparent heat-sealed portion pouches recognizable in the office scene and show only the same almond, seed and dried-fruit mixture visible in the source. Do not invent a branded retail bag or different ingredients.",
  },
  "brand.coffee.modern-kit": {
    productId: "coffee-pouches",
    fidelity: "structure",
    note: "保留牛皮纸自立袋结构，以无文字抽象图形建立新的咖啡品牌系统。",
    direction: "Preserve the exact light-kraft stand-up pouch form, heat-sealed top, soft creases and physical seams. Create a second consistent pouch only as a product-family size variant. Apply the abstract bean-symbol system only as a new identity layer; no readable words or pseudo-letters.",
  },
  "brand.skincare.natural-kit": {
    productId: "serum-bottle",
    fidelity: "structure",
    note: "保留精华瓶结构，建立无文字的自然护肤品牌系统。",
    direction: "Preserve the amber liquid, small cylindrical glass bottle and black dropper. Build the new natural brand system around this exact pack form.",
  },
  "brand.audio.technology-kit": {
    productId: "headphones",
    fidelity: "structure",
    note: "保留耳机硬件外形，建立无文字的科技音频品牌系统。",
    direction: "Preserve the exact unbranded black headphone hardware, wide headband, oval cushions and proportions. Apply the new waveform visual system only to surrounding touchpoints; keep the headset free of logos, words and invented controls.",
  },
  "expand.sneaker.vertical-scene": {
    productId: "running-shoes",
    fidelity: "strict",
    note: "锁定跑鞋主体，只在主体上下左右扩展真实湿地跑道与城市环境。",
    direction: "This must visibly read as true outpainting, not a new marble studio render. Keep the exact pair of light-grey knit running shoes unchanged and crisp inside the central square-safe region, occupying about 42 percent of the full vertical canvas. Extend a clearly wet dark urban running track beneath and far below the shoes, with realistic puddle reflections, subtle spray and a blue-hour city environment extending far above. Preserve the original shoe pixels visually; no pedestal, marble floor, white cyclorama, duplicated shoe or product redesign.",
  },
  "expand.chair.landscape-room": {
    productId: "lounge-chair",
    fidelity: "strict",
    note: "锁定绿色休闲椅，只补全横版室内空间。",
    direction: "Lock the exact green padded swivel chair and chrome base from the reference on the right third; extend a room only around it. Do not recolor it oatmeal.",
  },
  "expand.snack.square-campaign": {
    productId: "snack-pouch",
    fidelity: "strict",
    note: "锁定透明分装坚果袋，只补全方图桌面和同款真实配料。",
    direction: "Lock one transparent heat-sealed portion pouch from the reference at center and outpaint only the surrounding warm tabletop with the same visible almond, seed and dried-fruit mix. Keep the clear pouch material and heat-sealed edges; do not invent a printed retail package.",
  },
});

function normalizePreviewPrompt(prompt) {
  return prompt
    .replace("no real-world trademark, no copied brand identity, ", "")
    .replace("no garbled or readable text.", "no newly invented or garbled text.");
}

function outputName(template) {
  return `${template.id.replaceAll(".", "-")}.png`;
}

const cases = Object.freeze(catalog.templates.map((template) => {
  const spec = caseSpecs[template.id];
  if (!spec) throw new Error(`Missing real-case specification: ${template.id}`);
  const product = productById.get(spec.productId);
  if (!product) throw new Error(`Missing product: ${spec.productId}`);
  const fidelityInstruction = spec.fidelity === "structure" ? structureOnly : strictIdentity;
  return Object.freeze({
    id: template.id,
    title: template.title,
    category: template.category,
    ratio: template.ratio,
    resolution: template.resolution,
    productId: product.id,
    productAsset: product.asset,
    fidelity: spec.fidelity,
    note: spec.note,
    output: `assets/template-real-cases/${outputName(template)}`,
    prompt: `${fidelityInstruction}\n\n${normalizePreviewPrompt(template.examplePrompt)}\n\nFINAL REFERENCE DIRECTIVE — this overrides any conflicting generic art-direction detail above:\n${spec.direction}`,
  });
}));

module.exports = Object.freeze({
  version: "2026.07.20-real-3",
  model: "gpt-image-2",
  products,
  cases,
});
