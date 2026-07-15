# 蛮牛 AI 创作模板与后端接口规格

> 版本：v1.0
> 状态：可进入后端接口设计与原型联调
> 范围：SKU 图、商品卖点图、白底与场景图、营销海报、社媒营销、品牌 Kit 注入

## 1. 文档目标

本文档用于统一产品、前端、后端和 AI 工程对创作任务的理解，明确：

1. 用户需要提交哪些事实和素材。
2. 后端如何保存模板、组装 Prompt、创建异步任务。
3. 大语言模型需要返回什么结构化数据。
4. 图片生成、图片编辑和前端文字排版如何分工。
5. SKU、卖点图、场景图、海报和社媒内容的模板目录。
6. 品牌 Kit 如何成为所有创作任务的强制约束。
7. 接口、状态机、错误码、版本和验收标准。

本文档不绑定某一家模型服务。后端应通过 Provider Adapter 适配不同文本、图片编辑、图片生成和视频模型。

## 2. 核心产品原则

### 2.1 用户选择模板，不直接编写 Prompt

前端展示“新品发布”“小红书新品种草”“SKU 颜色图”等业务语言。后端根据模板 ID、用户表单和品牌 Kit 组装 Prompt。

### 2.2 AI 只使用已确认事实

以下信息不得由 AI 猜测：

- 产品材质、尺寸、容量、成分、功效和认证。
- 价格、折扣、库存、销量和活动时间。
- 品牌历史、荣誉、用户评价和市场排名。
- SKU 真实颜色、规格差异和包装差异。
- 用户案例中的人物身份、使用结果和数据。

缺失事实必须返回 `missingFields` 或 `questions`，不能补写成看似合理的内容。

### 2.3 图片生成与中文排版分离

默认流程：

1. 文案模型返回标题、正文、标签和版式建议。
2. 图片模型只生成商品构图、背景、装饰和光影。
3. 图片 Prompt 默认包含“不要生成文字、数字、价格、Logo 或水印”。
4. 后端或前端渲染器根据 `textLayers` 绘制中文、价格、CTA 和品牌标识。

只有明确验证过中文排版能力的模型，才允许通过模板开关 `allowModelTextRendering=true` 直接生成文字。

### 2.4 商品真实性优先

对上传商品图进行编辑时，默认锁定：

- 商品轮廓和比例。
- 包装结构和标签位置。
- Logo 形状和品牌名称。
- 未被用户授权修改的颜色与材质。
- SKU 之间的视角、光线和商品大小一致性。

### 2.5 Prompt 必须可版本化和审计

每次任务保存：

- `templateId`
- `templateVersion`
- `brandKitSnapshotId`
- `compiledPromptHash`
- `modelProvider`
- `modelName`
- 输入素材 ID
- 结构化计划和最终结果
- 审核、失败和重试记录

## 3. 总体生成架构

```text
用户表单与素材
  -> 参数校验
  -> 获取模板版本
  -> 注入品牌 Kit 快照
  -> AI 规划器生成 CreativePlan JSON
  -> JSON Schema 校验
  -> 事实与合规检查
  -> 图片生成或图片编辑任务
  -> 中文与品牌元素排版渲染
  -> 视觉 QA 与文本 QA
  -> 结果入库和资产保存
```

推荐拆分为以下服务：

| 服务 | 职责 |
|---|---|
| Template Service | 模板列表、版本、字段定义、Prompt 片段 |
| Brand Kit Service | 品牌规范、资产、版本和快照 |
| Creative Planner | 将事实、模板和品牌约束转换为结构化计划 |
| Generation Orchestrator | 拆分子任务、调用模型、重试、取消、计费 |
| Provider Adapter | 对接文本、图片编辑、图片生成和视频模型 |
| Render Service | 中文文字、价格、Logo、二维码和版式渲染 |
| QA Service | 主体一致性、文字、尺寸、品牌和内容安全检查 |
| Asset Service | 上传、派生文件、预览、下载和生命周期管理 |

## 4. 统一数据模型

以下 TypeScript 接口用于描述 API 数据结构，具体实现可以转换为 Java、Go、Python 或数据库模型。

### 4.1 基础枚举

```ts
type CreativeDomain =
  | "sku"
  | "selling_point"
  | "background_scene"
  | "poster"
  | "social";

type JobStatus =
  | "draft"
  | "validating"
  | "planning"
  | "awaiting_confirmation"
  | "queued"
  | "generating"
  | "rendering"
  | "reviewing"
  | "succeeded"
  | "partially_succeeded"
  | "failed"
  | "cancelled";

type AssetRole =
  | "product_reference"
  | "sku_reference"
  | "logo"
  | "brand_graphic"
  | "background_reference"
  | "style_reference"
  | "generated_base"
  | "rendered_result";

type AspectRatio = "1:1" | "3:4" | "4:5" | "9:16" | "16:9" | "custom";
```

### 4.2 素材引用

```ts
interface AssetRef {
  assetId: string;
  role: AssetRole;
  url?: string;
  mimeType: string;
  width?: number;
  height?: number;
  checksum?: string;
  note?: string;
}
```

生产接口优先传 `assetId`，不要长期依赖公开 URL。模型调用时由后端签发短期地址。

### 4.3 产品事实

```ts
interface ProductFacts {
  productId?: string;
  name: string;
  category: string;
  brandName?: string;
  shortDescription?: string;
  targetAudience?: string[];
  sellingPoints: Array<{
    id: string;
    title: string;
    evidence?: string;
    source: "user" | "catalog" | "brand_kit";
  }>;
  specifications?: Record<string, string | number | boolean>;
  materials?: string[];
  usageScenarios?: string[];
  fixedCopy?: string[];
  prohibitedClaims?: string[];
}
```

### 4.4 品牌 Kit 快照

```ts
interface BrandKitSnapshot {
  snapshotId: string;
  brandId: string;
  version: number;
  brandName: string;
  logoAssets: AssetRef[];
  colors: {
    primary: Array<{ name: string; hex: string; usage: string }>;
    secondary: Array<{ name: string; hex: string; usage: string }>;
    neutral: Array<{ name: string; hex: string; usage: string }>;
  };
  typography: {
    display?: { family: string; weights: number[] };
    body?: { family: string; weights: number[] };
    fallback: string[];
  };
  voice: {
    traits: string[];
    preferredExpressions: string[];
    forbiddenExpressions: string[];
    fixedCopy: string[];
  };
  visualStyle: {
    keywords: string[];
    imageStyle?: string;
    iconStyle?: string;
    cornerRadius?: string;
    layoutStyle?: string;
  };
  hardConstraints: string[];
  softPreferences: string[];
}
```

### 4.5 通用创作请求

```ts
interface CreateGenerationJobRequest<TPayload> {
  domain: CreativeDomain;
  templateId: string;
  templateVersion?: number;
  brandKitId?: string;
  product: ProductFacts;
  assets: AssetRef[];
  output: {
    ratio: AspectRatio;
    width?: number;
    height?: number;
    format: "png" | "jpg" | "webp" | "json";
    count: number;
    locale: "zh-CN" | "zh-TW" | "en-US";
  };
  payload: TPayload;
  userInstruction?: string;
  idempotencyKey: string;
}
```

### 4.6 通用 AI 规划结果

```ts
interface CreativePlan {
  planVersion: "1.0";
  templateId: string;
  summary: string;
  assumptions: string[];
  missingFields: string[];
  questions: Array<{
    id: string;
    question: string;
    required: boolean;
    options?: string[];
  }>;
  outputs: PlannedOutput[];
  warnings: string[];
}

interface PlannedOutput {
  outputId: string;
  title: string;
  purpose: string;
  imageMode: "compose" | "edit" | "generate" | "outpaint" | "render_only";
  sourceAssetIds: string[];
  visualPrompt: string;
  negativePrompt: string;
  layout: LayoutPlan;
  textLayers: TextLayer[];
  qualityChecks: QualityCheck[];
}

interface LayoutPlan {
  ratio: AspectRatio;
  productPosition: "center" | "left" | "right" | "bottom_center" | "custom";
  productScalePercent: number;
  safeAreas: Array<{
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  backgroundStyle: string;
  hierarchy: string[];
}

interface TextLayer {
  id: string;
  role: "headline" | "subheadline" | "badge" | "price" | "cta" | "body" | "caption";
  text: string;
  editable: boolean;
  maxCharacters?: number;
  fontToken?: "brand_display" | "brand_body" | "fallback";
  colorToken?: string;
  align?: "left" | "center" | "right";
  safeAreaName?: string;
}

interface QualityCheck {
  code: string;
  description: string;
  severity: "error" | "warning";
}
```

### 4.7 模板定义

```ts
interface PromptTemplateDefinition {
  templateId: string;
  domain: CreativeDomain;
  version: number;
  name: string;
  description: string;
  enabled: boolean;
  requiredFields: string[];
  optionalFields: string[];
  supportedRatios: AspectRatio[];
  defaults: Record<string, unknown>;
  systemPromptKey: string;
  businessPromptFragment: string;
  negativePromptFragment: string;
  outputSchemaKey: string;
  modelPolicy: {
    plannerModel: string;
    imageMode: "compose" | "edit" | "generate" | "outpaint" | "mixed";
    allowModelTextRendering: boolean;
  };
}
```

## 5. Prompt 组装规则

### 5.1 约束优先级

从高到低：

1. 法律、安全和平台强制规则。
2. 用户确认的产品事实。
3. 品牌 Kit 的 `hardConstraints`。
4. 当前任务明确要求。
5. 业务模板约束。
6. 品牌 Kit 的 `softPreferences`。
7. 模型自由创意。

出现冲突时，规划器必须返回 `warnings` 或 `questions`，不得默默忽略高优先级规则。

### 5.2 通用系统 Prompt

```text
你是蛮牛 AI 电商创作系统的结构化创意规划器。

你的职责是根据已确认的产品事实、用户素材、业务模板和品牌规范，输出可执行的创作计划。

强制规则：
1. 不得虚构产品参数、材质、功效、认证、价格、折扣、销量、评价和品牌历史。
2. 不得修改未被授权修改的商品结构、包装、Logo、品牌名称和 SKU 差异。
3. 将缺失的关键事实写入 missingFields，不要自行补齐。
4. 将需要用户决定的问题写入 questions，最多 5 个，按重要性排序。
5. 图片模型默认不负责生成中文文字、数字、价格、Logo 或二维码。
6. 所有可见文字放入 textLayers，由排版渲染器处理。
7. 视觉 Prompt 必须说明主体、环境、构图、光线、色彩、镜头和禁止项。
8. 每个输出都必须包含质量检查要求。
9. 严格遵守品牌 Kit 的 hardConstraints。
10. 只返回符合 CreativePlan JSON Schema 的 JSON，不要输出 Markdown 或解释文字。
```

### 5.3 通用图片负向 Prompt

```text
不要生成文字、乱码、价格、数字、Logo、水印、二维码、额外商品、错误包装、变形商品、重复主体、缺失部件、悬浮物、错误透视、低清晰度、过度锐化、强烈外发光、低对比度主体或与品牌规范冲突的颜色。
```

## 6. SKU 颜色或规格图

### 6.1 产品目标

针对每个真实 SKU 输出可区分、可比较且视觉一致的商品图片。颜色变化只能发生在用户指定区域；结构或容量变化必须有真实参考图或明确规格依据。

### 6.2 SKU 模板目录

| 模板 ID | 名称 | 适用场景 | 输出 |
|---|---|---|---|
| `sku.color.clean` | 纯色 SKU 单图 | 服装、家居、数码配色 | 每个颜色一张统一背景图 |
| `sku.color.scene` | 场景颜色 SKU | 同一商品多色场景展示 | 每色一张统一场景图 |
| `sku.color.swatch` | 商品加色卡 | 强调颜色名称和色值 | 商品图加可编辑色卡 |
| `sku.spec.label` | 规格标签图 | 容量、尺寸、型号 | 每规格一张标签图 |
| `sku.spec.dimension` | 尺寸标注图 | 家居、箱包、设备 | 商品图加尺寸线与参数层 |
| `sku.size.lineup` | 尺寸排列图 | S/M/L、多容量产品 | 多规格并排比较图 |
| `sku.material.detail` | 材质 SKU 图 | 面料、表面、工艺差异 | 商品加材质局部特写 |
| `sku.bundle.pack` | 套装规格图 | 单件、双件、礼盒装 | 套装数量与内容图 |
| `sku.angle.consistent` | 多角度 SKU 图 | 正面、侧面、背面 | 统一相机与光线的角度图 |
| `sku.compare.grid` | SKU 对比总览 | 多颜色、多规格快速选择 | 一张 SKU 对比矩阵 |

### 6.3 请求数据结构

```ts
interface SkuGenerationPayload {
  skuMode: "color" | "specification" | "size" | "material" | "bundle" | "angle";
  baseSkuId?: string;
  variants: Array<{
    skuId: string;
    skuName: string;
    attributes: Record<string, string | number>;
    color?: { name: string; hex?: string };
    referenceAssetIds: string[];
    editableRegions?: string[];
    fixedRegions?: string[];
  }>;
  consistency: {
    lockCamera: boolean;
    lockComposition: boolean;
    lockLighting: boolean;
    lockProductScale: boolean;
    backgroundMode: "same" | "per_variant";
  };
  labels: {
    showSkuName: boolean;
    showAttributes: string[];
    showColorSwatch: boolean;
  };
}
```

### 6.4 SKU 规划 Prompt

```text
任务：为同一商品的多个真实 SKU 规划一致的 SKU 图片。

商品事实：
{{productFacts}}

SKU 列表：
{{variants}}

一致性规则：
{{consistency}}

品牌规范：
{{brandKitSnapshot}}

模板要求：
{{templateFragment}}

执行规则：
1. 每个 variants 元素对应至少一个 PlannedOutput。
2. 所有 SKU 保持相同相机角度、商品占比、光线方向和背景层级，除非 backgroundMode 为 per_variant。
3. 只允许修改 editableRegions，fixedRegions 必须保持不变。
4. 如果 SKU 涉及结构、包装或数量变化但没有参考图，必须写入 missingFields。
5. 颜色名称不是精确色值；缺少 HEX 时需提示用户确认，不得自行承诺颜色准确。
6. 尺寸线、规格、颜色名和 SKU 名称全部放入 textLayers。
7. 对每张图加入包装一致性、颜色一致性和主体完整性 QA。

只返回 CreativePlan JSON。
```

### 6.5 SKU 输出扩展结构

```ts
interface SkuPlannedOutput extends PlannedOutput {
  sku: {
    skuId: string;
    skuName: string;
    attributes: Record<string, string | number>;
  };
  transformation: {
    allowedChanges: string[];
    lockedFeatures: string[];
    targetColorHex?: string;
  };
}
```

### 6.6 SKU QA

- 每张输出能够唯一映射到一个 `skuId`。
- 不得出现 SKU 名称与画面颜色不一致。
- 同组图片商品大小误差建议不超过 3%。
- 同组图片相机角度和投影方向一致。
- 包装文字、Logo 和结构不被重绘。
- 规格或尺寸文本必须来自请求数据。

## 7. 商品卖点图

### 7.1 模板目录

| 模板 ID | 名称 | 适用场景 |
|---|---|---|
| `selling.feature.hero` | 单一核心卖点 | 一张图只讲一个核心优势 |
| `selling.feature.multi` | 三卖点概览 | 商品加 3 个短卖点标签 |
| `selling.material.closeup` | 材质细节 | 面料、纹理、结构和工艺 |
| `selling.dimension.spec` | 参数尺寸 | 尺寸、容量、重量等确认参数 |
| `selling.scene.benefit` | 使用场景收益 | 商品在真实场景中的价值 |
| `selling.problem.solution` | 问题解决 | 用户问题与商品解决方式 |
| `selling.before.after` | 前后对比 | 仅适用于有真实对比证据的产品 |
| `selling.structure.explode` | 结构拆解 | 多层结构或组件说明 |
| `selling.steps.usage` | 使用步骤 | 2-5 步操作说明 |
| `selling.trust.proof` | 信任与认证 | 仅展示用户提供的认证和保障 |
| `selling.compatibility` | 兼容范围 | 尺寸、设备或使用对象兼容性 |
| `selling.care.guide` | 保养说明 | 清洁、维护和存放方式 |

### 7.2 请求数据结构

```ts
interface SellingPointGenerationPayload {
  points: Array<{
    pointId: string;
    title: string;
    explanation?: string;
    evidence?: string;
    evidenceAssetIds?: string[];
    iconHint?: string;
    priority: number;
  }>;
  outputMode: "one_per_point" | "overview" | "detail_sequence";
  scene?: {
    environment: string;
    audience?: string;
    action?: string;
  };
  copyStyle: "short" | "explanatory" | "technical";
  showEvidence: boolean;
}
```

### 7.3 卖点图规划 Prompt

```text
任务：将用户确认的商品卖点转换为清晰、可验证的电商卖点图计划。

商品事实：
{{productFacts}}

卖点列表：
{{points}}

场景要求：
{{scene}}

品牌规范：
{{brandKitSnapshot}}

模板要求：
{{templateFragment}}

规则：
1. one_per_point 模式下一张图只表达一个主要卖点。
2. 标题必须短、具体，不使用行业第一、极致、永久、百分百等无证据词语。
3. 解释内容只能来自 explanation、evidence 和产品事实。
4. 没有真实数据时不得生成参数、图表、百分比或前后对比。
5. 商品主体必须清晰，装饰元素不能遮挡关键结构。
6. 标题、参数、步骤和证据全部放入 textLayers。
7. visualPrompt 说明画面如何证明卖点，而不是只写抽象氛围词。
8. 为每张图加入事实来源检查和卖点可读性 QA。

只返回 CreativePlan JSON。
```

### 7.4 卖点图输出结构

```ts
interface SellingPointPlannedOutput extends PlannedOutput {
  sellingPoint: {
    pointId: string;
    title: string;
    evidence?: string;
    evidenceSource?: "user" | "catalog" | "brand_kit";
  };
  visualProof: {
    method: "scene" | "closeup" | "diagram" | "comparison" | "steps" | "annotation";
    description: string;
  };
}
```

## 8. 白底图和场景图

### 8.1 模板目录

| 模板 ID | 名称 | 图像模式 |
|---|---|---|
| `scene.white.pure` | 纯白电商图 | 抠图加合成 |
| `scene.white.soft_shadow` | 白底柔和阴影 | 抠图加合成 |
| `scene.studio.light_gray` | 浅灰棚拍 | 抠图加合成 |
| `scene.studio.gradient` | 品牌渐变棚拍 | 抠图加合成 |
| `scene.pedestal.minimal` | 极简展台 | 合成或图片编辑 |
| `scene.lifestyle.desk` | 桌面办公场景 | 图片编辑或生成 |
| `scene.lifestyle.home` | 居家生活场景 | 图片编辑或生成 |
| `scene.lifestyle.kitchen` | 厨房场景 | 图片编辑或生成 |
| `scene.lifestyle.bathroom` | 卫浴场景 | 图片编辑或生成 |
| `scene.lifestyle.outdoor` | 户外场景 | 图片编辑或生成 |
| `scene.seasonal` | 季节主题场景 | 图片编辑或生成 |
| `scene.custom.reference` | 自定义背景参考 | 抠图加用户背景 |
| `scene.brand.color_block` | 品牌色块背景 | 抠图加渲染 |
| `scene.transparent` | 透明 PNG | 本地抠图 |

### 8.2 请求数据结构

```ts
interface BackgroundScenePayload {
  sceneType:
    | "transparent"
    | "pure_white"
    | "studio"
    | "pedestal"
    | "lifestyle"
    | "seasonal"
    | "custom_reference"
    | "brand_color";
  sceneDescription?: string;
  backgroundAssetId?: string;
  productPlacement: {
    anchor: "center" | "bottom_center" | "left" | "right";
    scalePercent: number;
    rotationDegree?: number;
  };
  shadow: {
    enabled: boolean;
    type: "contact" | "soft" | "directional";
    strength: number;
    blur: number;
  };
  lighting: {
    direction: "front" | "left" | "right" | "top";
    softness: number;
    temperature: "cool" | "neutral" | "warm";
  };
  preservePackaging: boolean;
}
```

### 8.3 场景图 Prompt

```text
任务：为上传的真实商品创建指定背景，不改变商品本身。

商品事实：
{{productFacts}}

场景设置：
{{backgroundScenePayload}}

品牌规范：
{{brandKitSnapshot}}

规则：
1. 完整保留商品轮廓、包装结构、Logo、标签位置、材质和原始比例。
2. 透明、纯白、浅灰、品牌色块优先使用抠图与合成，不调用生成模型重绘商品。
3. 生活场景只生成环境，不生成额外同类商品。
4. 商品落地关系必须自然，阴影方向与场景光线一致。
5. 商品边缘不得出现白边、锯齿、背景残留或半透明缺口。
6. 不生成文字、价格、水印和额外 Logo。
7. 如果场景与商品用途明显冲突，写入 warnings。

输出 CreativePlan JSON。每个 PlannedOutput 必须说明 compose、edit 或 generate 模式。
```

### 8.4 实现策略

| 类型 | 推荐实现 |
|---|---|
| 透明 PNG | 本地抠图模型 |
| 纯白、浅灰、品牌色 | 抠图 + Canvas 合成 |
| 自定义背景 | 抠图 + 用户背景合成 |
| 极简展台 | 抠图 + 预生成场景或图片编辑模型 |
| 生活、季节场景 | 图片编辑模型，仅扩展或替换背景 |

## 9. 海报设计

### 9.1 海报通用请求

```ts
interface PosterGenerationPayload {
  posterType:
    | "product_launch"
    | "limited_promotion"
    | "festival_event"
    | "brand_campaign"
    | "single_feature"
    | "store_live_announcement";
  campaign: {
    name?: string;
    objective: string;
    startAt?: string;
    endAt?: string;
    location?: string;
    liveAt?: string;
  };
  offer?: {
    price?: string;
    originalPrice?: string;
    discountText?: string;
    couponText?: string;
    bundleText?: string;
    stockText?: string;
  };
  copyInput: {
    headline?: string;
    subheadline?: string;
    mandatoryCopy?: string[];
    cta?: string;
  };
  visual: {
    style: string;
    ratio: AspectRatio;
    productCount: number;
    backgroundPreference?: string;
  };
  qrCodeAssetId?: string;
}
```

### 9.2 海报模板目录

#### 新品发布

| 模板 ID | 名称 | 视觉重点 |
|---|---|---|
| `poster.launch.minimal` | 极简新品首发 | 单商品、留白、大标题 |
| `poster.launch.reveal` | 悬念揭晓 | 局部到完整、发布日期 |
| `poster.launch.tech` | 科技新品 | 结构光、参数区、冷静视觉 |
| `poster.launch.lifestyle` | 生活方式上新 | 使用场景、目标人群 |
| `poster.launch.collection` | 系列新品 | 多商品统一陈列 |

#### 限时促销

| 模板 ID | 名称 | 视觉重点 |
|---|---|---|
| `poster.promo.price` | 价格主导 | 现价、原价、商品 |
| `poster.promo.countdown` | 限时倒计时 | 截止时间和紧迫感 |
| `poster.promo.coupon` | 优惠券促销 | 券额和领取入口 |
| `poster.promo.bundle` | 套装优惠 | 套装内容和节省金额 |
| `poster.promo.member` | 会员专享 | 会员权益和专享价 |

#### 节日活动

| 模板 ID | 名称 | 视觉重点 |
|---|---|---|
| `poster.festival.spring` | 春季主题 | 清新、焕新、轻盈 |
| `poster.festival.summer` | 夏日主题 | 清凉、阳光、户外 |
| `poster.festival.autumn` | 秋日主题 | 温暖、质感、收获 |
| `poster.festival.winter` | 冬日主题 | 礼赠、温度、节日氛围 |
| `poster.festival.shopping` | 电商大促 | 活动利益点和平台安全区 |
| `poster.festival.custom` | 自定义节日 | 用户提供节日名称和元素 |

#### 品牌宣传

| 模板 ID | 名称 | 视觉重点 |
|---|---|---|
| `poster.brand.manifesto` | 品牌主张 | Slogan、品牌视觉资产 |
| `poster.brand.story` | 品牌故事 | 时间、人物或起源素材 |
| `poster.brand.ecosystem` | 产品矩阵 | 多产品和品牌统一性 |
| `poster.brand.trust` | 品牌信任 | 真实认证、服务和保障 |
| `poster.brand.recruitment` | 品牌招募 | 合作对象、权益和入口 |

#### 单品卖点

| 模板 ID | 名称 | 视觉重点 |
|---|---|---|
| `poster.feature.hero` | 核心卖点大字 | 一个卖点、一个视觉证据 |
| `poster.feature.closeup` | 材质与细节 | 微距特写、结构说明 |
| `poster.feature.scene` | 场景价值 | 商品在真实使用场景中 |
| `poster.feature.spec` | 参数卖点 | 用户确认的参数和尺寸 |
| `poster.feature.problem_solution` | 问题解决 | 用户问题与产品解决方式 |

#### 门店或直播预告

| 模板 ID | 名称 | 视觉重点 |
|---|---|---|
| `poster.store.opening` | 新店开业 | 地址、时间、开业权益 |
| `poster.store.event` | 到店活动 | 活动内容、地点和报名 |
| `poster.live.preview` | 直播预告 | 主播、时间、核心商品 |
| `poster.live.countdown` | 直播倒计时 | 开播时间和福利 |
| `poster.live.schedule` | 直播日程 | 多场次、多商品安排 |
| `poster.live.recap` | 直播返场 | 返场时间和保留权益 |

### 9.3 海报文案规划 Prompt

```text
你是电商营销海报文案规划器。

海报类型：{{posterType}}
模板：{{templateDefinition}}
商品事实：{{productFacts}}
活动事实：{{campaign}}
优惠事实：{{offer}}
用户指定文案：{{copyInput}}
品牌语气：{{brandKit.voice}}

规则：
1. 标题优先使用用户输入；未提供时根据已确认事实生成 3 个候选。
2. 不得虚构价格、折扣、库存、结束时间、门店地址、直播时间和赠品。
3. 不得使用无法证明的绝对化词语。
4. 主标题建议短而具体，副标题解释利益点，CTA 使用明确动作。
5. 固定文案和活动规则不得被改写。
6. 返回 headlineCandidates、selectedHeadline、subheadline、badge、priceBlock、cta、disclaimer 和 missingFields。
7. 只返回 JSON。
```

文案输出：

```ts
interface PosterCopyPlan {
  headlineCandidates: string[];
  selectedHeadline: string;
  subheadline?: string;
  badge?: string;
  priceBlock?: {
    current?: string;
    original?: string;
    discount?: string;
  };
  cta?: string;
  disclaimer?: string[];
  missingFields: string[];
}
```

### 9.4 海报视觉规划通用 Prompt

```text
任务：为营销海报生成商品构图、背景和可编辑文字层计划。

海报模板：{{templateDefinition}}
商品事实：{{productFacts}}
商品素材：{{assets}}
活动事实：{{campaign}}
文案计划：{{posterCopyPlan}}
品牌规范：{{brandKitSnapshot}}
输出规格：{{output}}

规则：
1. 商品必须保持真实外观，活动装饰不能遮挡商品和品牌标识。
2. 图片模型只生成商品构图、背景、光线和装饰，不直接生成中文文字。
3. headline、subheadline、badge、price、cta、disclaimer 分别输出为 textLayers。
4. 必须为标题、价格、CTA 和 Logo 定义 safeAreas。
5. 价格优先级仅用于用户提供了真实价格的促销模板。
6. 节日元素服务于商品，不得喧宾夺主。
7. 门店和直播模板缺少时间、地点或入口时必须暂停并提问。
8. 返回 CreativePlan JSON。
```

### 9.5 六类海报业务片段

#### 新品发布片段

```text
突出“第一次公开”和商品核心识别，不使用虚构倒计时或售罄信息。画面建立产品记忆，最多表达一个主卖点。发布日期只使用用户提供值。
```

#### 限时促销片段

```text
利益点优先级为优惠事实、商品、活动时间、CTA。任何价格、折扣、赠品、库存和截止时间缺失时不得生成对应内容。
```

#### 节日活动片段

```text
节日名称、日期和活动规则来自用户输入。节日装饰遵守品牌色，避免改变商品颜色。未提供活动利益时只做品牌祝福或主题宣传，不虚构优惠。
```

#### 品牌宣传片段

```text
优先使用品牌 Kit 中的固定文案、Logo 和品牌视觉资产。不得创造品牌历史、创始人故事、认证或客户数量。画面突出品牌一致性而非短期促销。
```

#### 单品卖点片段

```text
一张海报只表达一个核心卖点。画面必须提供与卖点相关的场景、细节或结构证据；没有证据时使用中性描述，不做结果承诺。
```

#### 门店或直播预告片段

```text
必须明确活动类型、时间、地点或直播入口。主视觉突出活动主题和核心商品，时间信息可读性高。二维码由渲染器使用真实素材添加，不由图片模型生成。
```

### 9.6 海报输出结构

```ts
interface PosterCreativePlan extends CreativePlan {
  poster: {
    type: PosterGenerationPayload["posterType"];
    campaignName?: string;
    copy: PosterCopyPlan;
    logoPlacement?: LayoutPlan["safeAreas"][number];
    qrCodePlacement?: LayoutPlan["safeAreas"][number];
    renderTokens: {
      backgroundColor?: string;
      headlineColor?: string;
      accentColor?: string;
      displayFont?: string;
      bodyFont?: string;
    };
  };
}
```

## 10. 社媒营销

### 10.1 设计原则

社媒模板由两部分组合：

```text
平台适配器 + 营销目标模板 + 品牌 Kit + 商品事实
```

后端不要为 42 个组合复制 42 段完整 Prompt。使用可组合片段，同时给每个组合分配稳定模板 ID，方便前端选择、统计和版本管理。

### 10.2 平台代码

| 代码 | 平台 | 主要输出 |
|---|---|---|
| `xiaohongshu` | 小红书 | 标题、正文、标签、封面、多图卡片 |
| `douyin` | 抖音 | 钩子、口播、分镜、字幕、封面、发布文案 |
| `wechat_article` | 微信公众号 | 标题、摘要、大纲、正文段落、封面和配图 |
| `wechat_channels` | 视频号 | 视频脚本、镜头、口播、字幕、封面、发布文案 |
| `weibo` | 微博 | 短文案、长文案、话题和九宫格建议 |
| `generic_graphic` | 通用图文 | 标题、正文、封面和多图卡片 |

### 10.3 营销目标代码

| 代码 | 目标 | 必需事实 |
|---|---|---|
| `new_product_seeding` | 新品种草 | 产品特点、目标用户、使用场景 |
| `product_review` | 商品测评 | 测试维度、真实体验或测试数据 |
| `selling_point_intro` | 卖点介绍 | 已确认卖点和证据 |
| `campaign_promotion` | 活动促销 | 优惠、时间和规则 |
| `usage_tutorial` | 使用教程 | 真实步骤、注意事项 |
| `brand_story` | 品牌故事 | 已确认品牌事实和素材 |
| `user_case` | 用户案例 | 获授权的真实案例事实 |

### 10.4 42 个组合模板 ID

| 平台 | 新品种草 | 商品测评 | 卖点介绍 | 活动促销 | 使用教程 | 品牌故事 | 用户案例 |
|---|---|---|---|---|---|---|---|
| 小红书 | `social.xhs.seeding` | `social.xhs.review` | `social.xhs.feature` | `social.xhs.promo` | `social.xhs.tutorial` | `social.xhs.brand_story` | `social.xhs.user_case` |
| 抖音 | `social.douyin.seeding` | `social.douyin.review` | `social.douyin.feature` | `social.douyin.promo` | `social.douyin.tutorial` | `social.douyin.brand_story` | `social.douyin.user_case` |
| 公众号 | `social.wechat_article.seeding` | `social.wechat_article.review` | `social.wechat_article.feature` | `social.wechat_article.promo` | `social.wechat_article.tutorial` | `social.wechat_article.brand_story` | `social.wechat_article.user_case` |
| 视频号 | `social.wechat_channels.seeding` | `social.wechat_channels.review` | `social.wechat_channels.feature` | `social.wechat_channels.promo` | `social.wechat_channels.tutorial` | `social.wechat_channels.brand_story` | `social.wechat_channels.user_case` |
| 微博 | `social.weibo.seeding` | `social.weibo.review` | `social.weibo.feature` | `social.weibo.promo` | `social.weibo.tutorial` | `social.weibo.brand_story` | `social.weibo.user_case` |
| 通用图文 | `social.generic.seeding` | `social.generic.review` | `social.generic.feature` | `social.generic.promo` | `social.generic.tutorial` | `social.generic.brand_story` | `social.generic.user_case` |

### 10.5 社媒请求结构

```ts
interface SocialGenerationPayload {
  platform:
    | "xiaohongshu"
    | "douyin"
    | "wechat_article"
    | "wechat_channels"
    | "weibo"
    | "generic_graphic";
  objective:
    | "new_product_seeding"
    | "product_review"
    | "selling_point_intro"
    | "campaign_promotion"
    | "usage_tutorial"
    | "brand_story"
    | "user_case";
  audience: {
    description: string;
    painPoints?: string[];
    interests?: string[];
  };
  tone: string[];
  contentLength: "short" | "medium" | "long";
  imageCount: number;
  videoDurationSeconds?: number;
  callToAction?: string;
  campaignFacts?: PosterGenerationPayload["campaign"];
  offer?: PosterGenerationPayload["offer"];
  tutorialSteps?: Array<{ order: number; title: string; description: string }>;
  reviewFacts?: Array<{ dimension: string; observation: string; evidence?: string }>;
  userCase?: {
    authorized: boolean;
    personDescription?: string;
    situation: string;
    action: string;
    result?: string;
    evidenceAssetIds?: string[];
  };
}
```

### 10.6 社媒统一输出结构

```ts
interface SocialContentPlan {
  platform: SocialGenerationPayload["platform"];
  objective: SocialGenerationPayload["objective"];
  titleCandidates: string[];
  selectedTitle: string;
  summary?: string;
  body: string;
  hashtags: string[];
  callToAction?: string;
  cover: {
    headline: string;
    subheadline?: string;
    visualPrompt: string;
    negativePrompt: string;
    textLayers: TextLayer[];
  };
  cards: Array<{
    order: number;
    purpose: string;
    title: string;
    copy: string;
    visualPrompt: string;
    sourceFactIds: string[];
    textLayers: TextLayer[];
  }>;
  video?: {
    hook: string;
    voiceover: string;
    shots: Array<{
      order: number;
      durationSeconds: number;
      visual: string;
      voiceover?: string;
      subtitle?: string;
      sourceFactIds: string[];
    }>;
  };
  article?: {
    abstract: string;
    sections: Array<{
      heading: string;
      body: string;
      imagePrompt?: string;
      sourceFactIds: string[];
    }>;
  };
  compliance: {
    unsupportedClaims: string[];
    missingFields: string[];
    requiredDisclaimers: string[];
  };
}
```

### 10.7 社媒统一系统 Prompt

```text
你是蛮牛社媒内容规划器。

请将用户确认的商品事实、品牌规范、平台规则和营销目标转换为可发布的结构化内容计划。

规则：
1. 不得虚构产品体验、测评过程、用户案例、销量、评论、价格和活动规则。
2. 商品测评必须区分事实、观察和主观感受；缺少真实测评数据时返回 missingFields。
3. 用户案例必须 authorized=true 才能生成；不得创造姓名、职业或结果。
4. 标题可以有吸引力，但不得承诺无法证明的结果。
5. 保持品牌语气，不模仿具体个人或竞争品牌。
6. 每个段落、卡片和镜头都要记录 sourceFactIds。
7. 图片 Prompt 不生成文字，封面和卡片文字放入 textLayers。
8. 内容必须适配指定平台，而不是把同一篇文案机械改短。
9. 返回 SocialContentPlan JSON，不要输出 Markdown。
```

### 10.8 平台 Prompt 片段

#### 小红书

```text
输出适合小红书图文阅读的内容：
1. 提供 5 个不同角度的标题候选，避免标题党和虚假结果承诺。
2. 正文使用自然、具体、可验证的表达，段落短，允许第一人称仅在用户提供真实体验时使用。
3. 输出 3-10 个相关话题标签，不蹭无关热点。
4. 生成 1 张封面和 3-9 张图文卡片计划。
5. 第一张卡片建立问题或使用场景，中间卡片解释产品，最后一张总结和 CTA。
```

#### 抖音

```text
输出短视频内容计划：
1. 前 2-3 秒使用真实问题、场景或商品动作建立注意力。
2. 根据 videoDurationSeconds 拆分镜头，镜头时长总和必须一致。
3. 每个镜头包含画面、口播、字幕和事实来源。
4. 口播自然，避免堆砌形容词。
5. 输出封面标题、发布文案和相关标签。
```

#### 微信公众号

```text
输出完整文章结构：
1. 提供 3 个标题候选、摘要和清晰大纲。
2. 正文包含开场、主体段落、总结和 CTA。
3. 每个主体段落提供 sourceFactIds，可选配图 Prompt。
4. 不虚构采访、研究、引用和品牌历史。
5. 优先解释背景、价值和方法，不使用短视频式口号堆叠。
```

#### 视频号

```text
输出适合视频号的可信视频脚本：
1. 开场直接说明场景或价值，不使用夸张悬念。
2. 镜头、口播、字幕和商品动作一一对应。
3. 适合品牌官方或主理人口吻，保持克制和可信。
4. 输出封面标题、视频描述和 CTA。
5. 直播或活动信息只能使用用户提供事实。
```

#### 微博

```text
输出适合快速阅读和转发的内容：
1. 提供短版正文和可选长版正文。
2. 核心信息放在前两句。
3. 输出相关话题和 1 图、4 图或 9 图的内容建议。
4. 不虚构热搜、转发数量、明星使用或社会事件关联。
```

#### 通用图文

```text
输出平台中性的标题、正文、封面和 3-6 张内容卡片。文字清楚、结构完整，不使用特定平台黑话。保留足够信息，方便后续平台适配器二次转换。
```

### 10.9 营销目标 Prompt 片段

#### 新品种草

```text
围绕目标用户、真实使用场景和已确认特点建立内容。不得假装亲自使用过产品。内容结构建议为场景问题、产品出现、具体特点、适合谁、行动建议。
```

#### 商品测评

```text
只使用 reviewFacts 中的真实测试维度、观察和证据。明确区分客观参数与主观感受。没有真实体验时使用“功能解析”而不是“亲测”。
```

#### 卖点介绍

```text
按重要性选择 1-3 个已确认卖点，每个卖点说明对用户有什么具体意义，并关联来源事实。避免只重复产品说明书。
```

#### 活动促销

```text
优先呈现活动利益、参与条件、时间和 CTA。价格、折扣、赠品和库存缺一不可时必须提问，不得自动填充。必要时生成活动免责声明。
```

#### 使用教程

```text
严格按照 tutorialSteps 生成内容，不能省略安全注意事项。步骤顺序、用量、等待时间和适用范围必须来自用户数据。
```

#### 品牌故事

```text
只使用品牌 Kit 和用户提供的真实品牌资料。可以组织叙事，但不能创造年份、创始人经历、里程碑、客户和奖项。
```

#### 用户案例

```text
仅在 userCase.authorized=true 时生成。保持人物匿名或使用用户明确提供的公开名称。结果必须来自用户事实，不得扩大效果或创造数据。
```

### 10.10 Prompt 组合示例

选择“小红书 + 新品种草”时，后端编译：

```text
通用社媒系统 Prompt
+ 小红书平台片段
+ 新品种草目标片段
+ 商品事实 JSON
+ 品牌 Kit 快照 JSON
+ 用户受众、语气和图片数量
+ SocialContentPlan JSON Schema
```

选择“抖音 + 使用教程”时，替换为：

```text
通用社媒系统 Prompt
+ 抖音平台片段
+ 使用教程目标片段
+ tutorialSteps
+ 商品事实和注意事项
+ 品牌 Kit 快照
+ SocialContentPlan JSON Schema
```

## 11. 品牌 Kit 注入要求

所有任务创建时获取不可变的品牌快照：

```ts
interface BrandInjectionResult {
  snapshotId: string;
  hardConstraints: Array<{
    code: string;
    rule: string;
    source: string;
  }>;
  softPreferences: Array<{
    code: string;
    preference: string;
    weight: number;
  }>;
  renderTokens: Record<string, string>;
  assetIds: string[];
}
```

推荐约束代码：

| 代码 | 含义 |
|---|---|
| `BRAND_NAME_LOCK` | 品牌名称不可改写 |
| `LOGO_GEOMETRY_LOCK` | Logo 不得变形或重绘 |
| `PRIMARY_COLOR_REQUIRED` | 必须使用指定主色 |
| `FONT_WHITELIST` | 只能使用批准字体 |
| `FIXED_COPY_LOCK` | 固定文案不可改写 |
| `FORBIDDEN_EXPRESSION` | 禁止使用指定表达 |
| `IMAGE_STYLE_PREFERENCE` | 图片风格软偏好 |
| `LAYOUT_STYLE_PREFERENCE` | 版式风格软偏好 |

## 12. 后端 API

### 12.1 接口目录

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/v1/templates` | 按 domain、platform、objective 查询模板 |
| `GET` | `/api/v1/templates/{templateId}` | 获取模板字段和当前版本 |
| `POST` | `/api/v1/assets/upload-url` | 获取素材上传地址 |
| `POST` | `/api/v1/assets/complete` | 完成上传并登记素材 |
| `POST` | `/api/v1/generation-jobs/plan` | 只生成计划，不开始图片任务 |
| `POST` | `/api/v1/generation-jobs` | 创建异步生成任务 |
| `POST` | `/api/v1/generation-jobs/{id}/confirm` | 确认计划并开始生成 |
| `GET` | `/api/v1/generation-jobs/{id}` | 查询任务和结果 |
| `GET` | `/api/v1/generation-jobs/{id}/events` | SSE 任务进度 |
| `POST` | `/api/v1/generation-jobs/{id}/cancel` | 取消任务 |
| `POST` | `/api/v1/generation-jobs/{id}/retry` | 重试失败子任务 |
| `POST` | `/api/v1/generation-jobs/{id}/outputs/{outputId}/redo` | 重做单个输出 |
| `GET` | `/api/v1/brand-kits/{id}` | 获取品牌 Kit |
| `POST` | `/api/v1/brand-kits/{id}/snapshots` | 创建品牌快照 |

### 12.2 创建计划示例

```http
POST /api/v1/generation-jobs/plan
Content-Type: application/json
Idempotency-Key: sku-plan-product-1001-20260715
```

```json
{
  "domain": "sku",
  "templateId": "sku.color.clean",
  "brandKitId": "brand_kit_manniu",
  "product": {
    "productId": "product_1001",
    "name": "轻量通勤手袋",
    "category": "箱包",
    "sellingPoints": [
      {
        "id": "sp_1",
        "title": "轻便",
        "source": "user"
      }
    ]
  },
  "assets": [
    {
      "assetId": "asset_black_bag",
      "role": "product_reference",
      "mimeType": "image/jpeg"
    }
  ],
  "output": {
    "ratio": "1:1",
    "format": "png",
    "count": 3,
    "locale": "zh-CN"
  },
  "payload": {
    "skuMode": "color",
    "variants": [
      {
        "skuId": "sku_black",
        "skuName": "曜石黑",
        "attributes": { "颜色": "曜石黑" },
        "color": { "name": "曜石黑", "hex": "#1F2022" },
        "referenceAssetIds": ["asset_black_bag"],
        "editableRegions": ["包身面料"],
        "fixedRegions": ["五金", "Logo", "肩带结构"]
      }
    ],
    "consistency": {
      "lockCamera": true,
      "lockComposition": true,
      "lockLighting": true,
      "lockProductScale": true,
      "backgroundMode": "same"
    },
    "labels": {
      "showSkuName": true,
      "showAttributes": ["颜色"],
      "showColorSwatch": true
    }
  },
  "idempotencyKey": "sku-plan-product-1001-20260715"
}
```

### 12.3 任务响应

```ts
interface GenerationJobResponse {
  jobId: string;
  status: JobStatus;
  domain: CreativeDomain;
  templateId: string;
  templateVersion: number;
  brandKitSnapshotId?: string;
  progress: number;
  stage?: string;
  plan?: CreativePlan | SocialContentPlan;
  outputs: Array<{
    outputId: string;
    status: JobStatus;
    previewAssetId?: string;
    resultAssetId?: string;
    error?: ApiError;
  }>;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}
```

### 12.4 SSE 事件

```ts
type GenerationJobEvent =
  | { type: "job.status"; status: JobStatus; progress: number }
  | { type: "job.question"; questions: CreativePlan["questions"] }
  | { type: "output.started"; outputId: string }
  | { type: "output.progress"; outputId: string; progress: number }
  | { type: "output.completed"; outputId: string; assetId: string }
  | { type: "output.failed"; outputId: string; error: ApiError }
  | { type: "job.completed"; status: "succeeded" | "partially_succeeded" }
  | { type: "job.failed"; error: ApiError };
```

## 13. 数据库建议

### 13.1 `prompt_templates`

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 稳定模板 ID |
| `domain` | string | 业务域 |
| `name` | string | 展示名称 |
| `enabled` | boolean | 是否可用 |
| `current_version` | integer | 当前版本 |
| `created_at` | datetime | 创建时间 |

### 13.2 `prompt_template_versions`

| 字段 | 类型 | 说明 |
|---|---|---|
| `template_id` | string | 模板 ID |
| `version` | integer | 版本号 |
| `field_schema` | json | 前端字段定义 |
| `prompt_fragments` | json | Prompt 片段 |
| `output_schema` | json | 输出 JSON Schema |
| `model_policy` | json | 模型与生成策略 |
| `published_at` | datetime | 发布时间 |

### 13.3 `generation_jobs`

至少包含：

- `id`
- `user_id`
- `workspace_id`
- `domain`
- `template_id`
- `template_version`
- `brand_kit_snapshot_id`
- `status`
- `progress`
- `request_payload`
- `creative_plan`
- `compiled_prompt_hash`
- `provider`
- `model`
- `estimated_cost`
- `actual_cost`
- `created_at`
- `updated_at`
- `completed_at`

### 13.4 `generation_outputs`

每个 SKU、海报方案、社媒卡片或视频镜头对应一条记录，支持局部重做，不必重跑整个任务。

## 14. 错误码

```ts
interface ApiError {
  code: string;
  message: string;
  retryable: boolean;
  field?: string;
  details?: Record<string, unknown>;
}
```

| 错误码 | 含义 |
|---|---|
| `INVALID_REQUEST` | 请求结构错误 |
| `MISSING_PRODUCT_FACT` | 缺少必要产品事实 |
| `MISSING_ASSET` | 缺少必要素材 |
| `SKU_REFERENCE_REQUIRED` | SKU 结构变化但无参考图 |
| `UNCONFIRMED_COLOR` | SKU 颜色未确认 |
| `MISSING_PROMOTION_FACT` | 缺少价格、时间或活动规则 |
| `UNAUTHORIZED_USER_CASE` | 用户案例未确认授权 |
| `BRAND_CONSTRAINT_CONFLICT` | 用户要求与品牌硬约束冲突 |
| `PROMPT_SCHEMA_INVALID` | AI 返回结构不符合 Schema |
| `CONTENT_POLICY_BLOCKED` | 内容安全规则阻止生成 |
| `MODEL_PROVIDER_ERROR` | 模型服务失败 |
| `RENDER_FAILED` | 文字或品牌排版失败 |
| `QUALITY_CHECK_FAILED` | 结果未通过质量检查 |
| `JOB_CANCELLED` | 用户取消任务 |

## 15. 重试与幂等

1. 创建任务必须携带 `Idempotency-Key`。
2. 相同工作区、相同 key 和相同请求哈希返回原任务。
3. Planner 返回非法 JSON 时允许自动修复 1 次，再失败则返回 `PROMPT_SCHEMA_INVALID`。
4. 图片子任务独立重试，默认最多 2 次。
5. `redo` 创建新的 output revision，保留历史结果。
6. 取消任务后不得继续计费；已经完成的子结果可以保留。

## 16. 内容与安全校验

### 16.1 生成前

- 必填字段和素材存在。
- 产品事实来源明确。
- 品牌 Kit 无冲突。
- 优惠、案例和测评事实完整。
- 素材格式、尺寸、版权声明和用户授权有效。

### 16.2 生成后

- OCR 检查生成底图是否意外出现乱码。
- Logo 和包装相似度检查。
- 商品主体完整性检查。
- SKU 颜色与标签一致性检查。
- 文案事实回溯检查。
- 排版溢出、低对比度和安全区检查。
- 输出比例、尺寸和文件格式检查。

## 17. 前端字段生成

模板接口建议返回 JSON Schema 或自定义字段结构，让前端动态生成表单：

```json
{
  "templateId": "poster.promo.price",
  "version": 1,
  "fields": [
    {
      "key": "campaign.name",
      "label": "活动名称",
      "type": "text",
      "required": true
    },
    {
      "key": "offer.price",
      "label": "活动价格",
      "type": "currency",
      "required": true
    },
    {
      "key": "campaign.endAt",
      "label": "结束时间",
      "type": "datetime",
      "required": false
    },
    {
      "key": "visual.style",
      "label": "视觉风格",
      "type": "select",
      "options": ["清爽", "高级", "活力", "极简"]
    }
  ]
}
```

## 18. 推荐实施顺序

### 第一阶段：数据和模板基础

1. 建立模板表、版本表和品牌 Kit 快照。
2. 完成 Asset API 和异步 Job 状态机。
3. 接入 Planner LLM，强制 JSON Schema 输出。
4. 实现通用图片负向 Prompt 和事实校验。

### 第二阶段：复用现有能力

1. `scene.transparent`
2. `scene.white.pure`
3. `scene.white.soft_shadow`
4. `scene.custom.reference`
5. `sku.color.clean`
6. `selling.feature.hero`

这些任务可以最大程度复用现有抠图、背景替换和 Canvas 渲染。

### 第三阶段：海报

1. 新品发布。
2. 限时促销。
3. 单品卖点。
4. 门店或直播预告。
5. 节日活动。
6. 品牌宣传。

先实现文案规划、底图生成和文字渲染分离，再增加在线编辑。

### 第四阶段：社媒

1. 通用图文。
2. 小红书。
3. 微博。
4. 微信公众号。
5. 抖音。
6. 视频号。

先完成文字和图文卡片；抖音、视频号的真实视频生成可以继续复用现有视频工作流。

## 19. 验收标准

### 19.1 通用

- 同一个请求能够稳定解析为相同结构的计划。
- AI 输出 100% 通过 JSON Schema 或进入明确修复流程。
- 任务支持查询、取消、局部重试和单结果重做。
- 所有结果记录模板版本和品牌 Kit 快照。
- 用户素材不通过公开永久 URL 暴露。

### 19.2 SKU

- 每个 SKU 都有唯一结果映射。
- 同组商品角度、尺寸和光线一致。
- 未提供参考的结构变化不会被 AI 猜测。

### 19.3 卖点图

- 每个卖点能够追溯到产品事实。
- 不生成没有证据的参数、对比和功效。
- 一张图只存在一个主要信息层级。

### 19.4 场景图

- 商品轮廓、包装和 Logo 不被重绘。
- 阴影与光线合理，边缘无明显残留。
- 纯色背景任务不调用高成本生成模型。

### 19.5 海报

- 中文、价格、CTA 和 Logo 均由渲染器准确输出。
- 缺少活动事实时不会生成虚假优惠。
- 文字安全区和对比度通过自动检查。

### 19.6 社媒

- 同一商品在不同平台得到不同结构，而非机械缩写。
- 测评和用户案例必须有真实来源。
- 每个卡片、段落和镜头可追溯到 `sourceFactIds`。

## 20. 交付清单

后端进入开发前需要确认：

- 模板 ID 是否冻结。
- Brand Kit v1 数据结构。
- 支持的模型 Provider 和成本策略。
- Asset 存储和签名 URL 方案。
- 异步队列、SSE 和取消能力。
- JSON Schema 校验技术选型。
- 中文文字渲染技术和字体授权。
- 图片内容安全与商品一致性 QA 方案。
- 用户素材授权、保留周期和删除机制。
