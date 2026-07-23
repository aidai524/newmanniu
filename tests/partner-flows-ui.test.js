const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scriptSource = fs.readFileSync(path.join(root, "script.js"), "utf8");
const styleSource = fs.readFileSync(path.join(root, "designkit-theme.css"), "utf8");

function sourceBetween(source, startMarker, endMarker, description) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0, `缺少${description}起始结构：${startMarker}`);
  assert.ok(end > start, `缺少${description}结束结构：${endMarker}`);
  return source.slice(start, end);
}

function assertWorkspaceState(source, pairs, initialPanel, description) {
  pairs.forEach(({ name, tabId, panelId }) => {
    assert.match(
      source,
      new RegExp(
        `id="${tabId}"[^>]*aria-controls="${panelId}"[^>]*data-partner-tab="${name}"`,
      ),
      `${description}的 ${name} 标签必须关联对应面板`,
    );
    assert.match(
      source,
      new RegExp(
        `id="${panelId}"[^>]*aria-labelledby="${tabId}"[^>]*data-partner-panel="${name}"`,
      ),
      `${description}的 ${name} 面板必须反向关联对应标签`,
    );
  });

  assert.equal(
    (source.match(/aria-selected="true"/g) || []).length,
    1,
    `${description}只能有一个初始选中标签`,
  );
  assert.equal(
    (source.match(/class="partner-panel is-active"/g) || []).length,
    1,
    `${description}只能有一个初始可见面板`,
  );

  const openings = [
    ...source.matchAll(/<section class="partner-panel[^"]*"[^>]*data-partner-panel="[^"]+"[^>]*>/g),
  ].map((match) => match[0]);
  assert.equal(openings.length, 3, `${description}必须包含三个流程面板`);
  assert.equal(
    openings.filter((opening) => /\shidden(?:\s|>)/.test(opening)).length,
    2,
    `${description}除初始面板外，其余两个面板必须隐藏`,
  );
  assert.match(
    openings.find((opening) => !/\shidden(?:\s|>)/.test(opening)) || "",
    new RegExp(`data-partner-panel="${initialPanel}"`),
    `${description}初始可见面板不正确`,
  );
}

const referralPageMarker =
  '<section class="page-view settings-layout invite-page partner-page" data-page-panel="invite"';
const resellerPageMarker =
  '<section class="page-view settings-layout invite-page partner-page reseller-page" data-page-panel="reseller"';
const dialogMarker = '<dialog class="template-detail-dialog"';

const referralPageSource = sourceBetween(
  indexSource,
  referralPageMarker,
  resellerPageMarker,
  "推广返佣页面",
);
const resellerPageSource = sourceBetween(
  indexSource,
  resellerPageMarker,
  dialogMarker,
  "经销商伙伴页面",
);
const combinedPartnerSource = sourceBetween(
  indexSource,
  referralPageMarker,
  dialogMarker,
  "合作中心页面",
);

assert.match(referralPageSource, /data-partner-workspace/, "推广返佣页面应有独立标签作用域");
assert.match(resellerPageSource, /data-partner-workspace/, "经销商页面应有独立标签作用域");

assertWorkspaceState(
  referralPageSource,
  [
    { name: "referral", tabId: "partner-tab-referral", panelId: "partner-panel-referral" },
    { name: "commissions", tabId: "partner-tab-commissions", panelId: "partner-panel-commissions" },
    { name: "referral-rules", tabId: "partner-tab-referral-rules", panelId: "partner-panel-referral-rules" },
  ],
  "referral",
  "推广返佣页面",
);

assertWorkspaceState(
  resellerPageSource,
  [
    { name: "procurement", tabId: "reseller-tab-procurement", panelId: "reseller-panel-procurement" },
    { name: "purchases", tabId: "reseller-tab-purchases", panelId: "reseller-panel-purchases" },
    { name: "reseller-rules", tabId: "reseller-tab-rules", panelId: "reseller-panel-rules" },
  ],
  "procurement",
  "经销商伙伴页面",
);

assert.match(referralPageSource, /<h1>推广返佣<\/h1>/, "默认页面标题应为推广返佣");
assert.match(referralPageSource, /所有用户可用[\s\S]*?<h3>推广返佣<\/h3>/, "默认身份应命名为推广返佣");
assert.match(referralPageSource, /无需申请，注册后直接开始/, "推广返佣应明确无需申请");
assert.match(
  referralPageSource,
  /<a class="partner-tier-card partner-tier-card-advanced partner-tier-card-link"[^>]*href="#reseller"[^>]*data-page="reseller"[^>]*>[\s\S]*?经销商伙伴/,
  "经销商伙伴卡片应作为独立页面入口",
);
assert.match(
  referralPageSource,
  /data-partner-tab-target="referral"[^>]*>创建推广链接/,
  "默认页面主操作应进入推广链接",
);
assert.doesNotMatch(referralPageSource, /data-account-action="partner-apply"/, "推广返佣页面不得放置经销商申请");
assert.doesNotMatch(referralPageSource, /data-partner-purchase/, "推广返佣页面不得混入采购交互");
assert.doesNotMatch(referralPageSource, /data-partner-panel="(?:procurement|purchases)"/, "推广返佣页面不得混入采购面板");
assert.doesNotMatch(referralPageSource, /partner-model-strip/, "默认页面不应继续展示混合业务比较区");

const referralPanelSource = sourceBetween(
  referralPageSource,
  'data-partner-panel="referral"',
  'data-partner-panel="commissions"',
  "推广返佣面板",
);
assert.match(referralPanelSource, /data-referral-channel/, "返佣面板应有独立渠道钩子");
assert.match(referralPanelSource, /data-referral-generate/, "返佣面板应有独立链接生成操作");
assert.match(referralPanelSource, /客户向平台付款/, "返佣流程应明确客户付款对象");

const commissionSource = sourceBetween(
  referralPageSource,
  'data-partner-panel="commissions"',
  'data-partner-panel="referral-rules"',
  "返佣明细面板",
);
assert.match(commissionSource, /data-referral-settlement/, "返佣明细应使用独立结算钩子");
assert.match(
  commissionSource,
  /实付基数[\s\S]*?示例比例[\s\S]*?返佣金额[\s\S]*?状态/,
  "返佣明细应展示计算与状态字段",
);
assert.match(referralPageSource, /禁止本人多账号互邀/, "推广规则必须包含关联账号风控限制");

assert.match(resellerPageSource, /<h1>经销商伙伴<\/h1>/, "经销商页面应使用独立标题");
assert.match(resellerPageSource, /data-page="invite"[^>]*data-title="推广返佣"/, "经销商页面应提供返回推广返佣入口");
assert.match(
  resellerPageSource,
  /data-account-action="partner-apply"[^>]*data-partner-apply-mode="standard"[^>]*>申请成为经销商/,
  "经销商页面应提供标准申请入口",
);
assert.match(
  resellerPageSource,
  /data-account-action="partner-apply"[^>]*data-partner-apply-mode="more"[^>]*>其他合作需求/,
  "经销商页面应保留其他合作表单入口",
);
assert.match(resellerPageSource, /data-partner-purchase-plan/, "经销商页面应提供服务包选择");
assert.match(resellerPageSource, /data-partner-purchase/, "经销商页面应提供采购操作");
assert.match(resellerPageSource, /标准价[\s\S]*?当前折扣[\s\S]*?当前应付/, "采购面板应解释采购价格");
assert.match(resellerPageSource, /伙伴价[\s\S]*?节省金额[\s\S]*?状态/, "采购记录应展示价格差与订单状态");
assert.match(resellerPageSource, /一笔订单只适用一种激励/, "经销商规则必须明确权益不可叠加");
assert.match(resellerPageSource, /不开放用户间自由转售/, "经销商规则必须禁止额度自由转售");
assert.match(resellerPageSource, /折扣采购订单不产生推广返佣/, "经销商规则必须禁止采购折扣与返佣叠加");
assert.doesNotMatch(resellerPageSource, /data-referral-/, "经销商页面不得混入推广返佣交互钩子");
assert.doesNotMatch(resellerPageSource, /data-partner-panel="(?:referral|commissions)"/, "经销商页面不得混入返佣面板");

assert.doesNotMatch(combinedPartnerSource, /普通推广者/, "合作中心不应继续使用普通推广者命名");
assert.doesNotMatch(combinedPartnerSource, /金牌经销商/, "公开身份层级不应出现第三档");

const partnerIds = [...combinedPartnerSource.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(partnerIds).size, partnerIds.length, "两个伙伴页面内的 DOM id 必须全局唯一");

const applicationSource = sourceBetween(
  indexSource,
  '<dialog class="account-action-dialog partner-apply-dialog"',
  "</dialog>",
  "经销商申请表",
);
assert.match(applicationSource, /主要合作方向/, "经销商申请应收集合作方向");
assert.match(applicationSource, /预计月度规模/, "经销商申请应收集预计合作规模");
assert.match(applicationSource, /组织或品牌名称/, "经销商申请应收集业务主体");
assert.doesNotMatch(applicationSource, /主要推广渠道/, "经销商申请不得强制绑定推广渠道");

assert.match(scriptSource, /invite:\s*"推广返佣"/, "页面标签应将默认入口命名为推广返佣");
assert.match(scriptSource, /reseller:\s*"经销商伙伴"/, "页面标签应包含经销商伙伴");
assert.match(scriptSource, /const referralPage = document\.querySelector/, "返佣交互应限定在默认页面内");
assert.match(scriptSource, /const resellerPage = document\.querySelector/, "采购交互应限定在经销商页面内");
assert.match(scriptSource, /querySelectorAll\("\[data-partner-workspace\]"\)/, "两套标签应按页面作用域初始化");
assert.match(scriptSource, /partnerWorkspaces\.forEach\(\(workspace\)/, "每个伙伴页面应独立绑定标签");
assert.match(scriptSource, /referralPage\?\.querySelector\("\[data-referral-generate\]"\)/, "生成链接应绑定推广返佣页面");
assert.match(scriptSource, /resellerPage\?\.querySelector\("\[data-partner-purchase-plan\]"\)/, "采购选择应绑定经销商页面");
assert.match(scriptSource, /resellerPage\?\.querySelector\("\[data-partner-purchase\]"\)/, "采购操作应绑定经销商页面");
assert.match(scriptSource, /referralPage\?\.querySelector\("\[data-referral-settlement\]"\)/, "返佣结算应绑定推广返佣页面");
assert.match(scriptSource, /encodeURIComponent\(selectedChannel\)/, "推广链接应安全编码渠道");
assert.match(scriptSource, /encodeURIComponent\(campaignName\)/, "推广链接应安全编码活动名");
assert.match(scriptSource, /const isPartnerFlow = targetPage === "invite"/, "经销商页面应保持推广中心侧栏高亮");

assert.match(styleSource, /\.partner-tier-card-link:focus-visible/, "经销商入口卡片应有键盘焦点样式");
assert.match(styleSource, /grid-auto-columns:\s*minmax\(0,\s*1fr\)/, "三标签页面应使用内容驱动列宽");
assert.match(styleSource, /\.reseller-page \.reseller-page-header/, "经销商页面应有独立头部布局");

console.log("partner flow UI tests passed: referral and reseller are separate, scoped and accessible pages");
