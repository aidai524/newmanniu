const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scriptSource = fs.readFileSync(path.join(root, "script.js"), "utf8");

function sourceBetween(source, startMarker, endMarker, description) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0, `缺少${description}起始结构：${startMarker}`);
  assert.ok(end > start, `缺少${description}结束结构：${endMarker}`);
  return source.slice(start, end);
}

const accountStripSource = sourceBetween(
  indexSource,
  '<div class="account-strip"',
  '<div class="user-menu"',
  "顶栏账户区",
);

assert.equal(
  (accountStripSource.match(/class="points"/g) || []).length,
  2,
  "顶栏应继续分别展示永久积分和临时积分",
);
assert.match(accountStripSource, /永久积分\s*<strong>3,710<\/strong>/, "顶栏必须保留永久积分");
assert.match(accountStripSource, /临时积分\s*<strong>260<\/strong>/, "顶栏必须保留临时积分");
assert.match(
  accountStripSource,
  /class="[^"]*cash-balance[^"]*"[^>]*data-page="balance"[^>]*>[\s\S]*?data-account-balance/,
  "现金余额应使用独立入口并进入余额明细页",
);
assert.match(accountStripSource, /账户余额/, "现金余额必须明确标注为账户余额");
assert.match(
  accountStripSource,
  /class="charge-btn"[^>]*(?:data-balance-open|data-account-action="recharge")/,
  "顶栏充值按钮必须打开充值弹框",
);

const membershipSource = sourceBetween(
  indexSource,
  'data-page-panel="rights"',
  'data-page-panel="invite"',
  "会员与积分页面",
);

assert.match(membershipSource, /class="wallet-overview"/, "会员页应展示资金与积分概览");
assert.match(membershipSource, /class="wallet-balance-card"/, "会员页应有独立现金余额卡片");
assert.match(membershipSource, /class="wallet-points-card"/, "会员页应有独立积分卡片");
assert.match(membershipSource, /data-account-balance/, "现金余额卡片应与顶栏同步余额");
assert.match(membershipSource, /永久积分[\s\S]*?3,710/, "积分概览应展示永久积分");
assert.match(membershipSource, /临时积分[\s\S]*?260/, "积分概览应展示临时积分");
assert.match(
  membershipSource,
  /(?:data-balance-open|data-account-action="recharge")[^>]*>[\s\S]*?充值/,
  "资金卡应提供充值入口",
);
assert.match(
  membershipSource,
  /data-page="balance"[^>]*>[\s\S]*?余额明细/,
  "资金卡应提供余额明细入口",
);
assert.match(
  membershipSource,
  /data-page="balance"[^>]*data-balance-filter-target="expense"[^>]*>[\s\S]*?消费记录/,
  "资金卡应提供直达消费记录的入口",
);
assert.match(
  membershipSource,
  /data-page="orders"[^>]*data-order-view="invoices"[^>]*>[\s\S]*?发票管理/,
  "资金卡应提供发票管理入口",
);

const balancePageSource = sourceBetween(
  indexSource,
  'data-page-panel="balance"',
  'data-page-panel="orders"',
  "余额明细页面",
);

assert.match(balancePageSource, /<h1>余额明细<\/h1>/, "余额页标题应为余额明细");
assert.match(balancePageSource, /data-account-balance/, "余额页应同步展示当前余额");
assert.match(balancePageSource, /data-total-recharged/, "余额页应展示累计充值");
assert.match(balancePageSource, /data-total-spent/, "余额页应展示累计消费");
assert.match(balancePageSource, /data-balance-filter="all"/, "余额页应提供全部流水筛选");
assert.match(balancePageSource, /data-balance-filter="recharge"/, "余额页应提供充值筛选");
assert.match(balancePageSource, /data-balance-filter="expense"/, "余额页应提供消费筛选");
assert.match(balancePageSource, /data-balance-transaction-body/, "余额页应提供可更新的流水表体");
assert.match(
  balancePageSource,
  /data-balance-transaction="recharge"/,
  "余额页应包含充值流水",
);
assert.match(
  balancePageSource,
  /data-balance-transaction="expense"/,
  "余额页应包含消费流水",
);
assert.match(balancePageSource, /data-balance-empty/, "余额页应提供筛选无结果状态");

const rechargeDialogSource = sourceBetween(
  indexSource,
  '<dialog class="account-action-dialog recharge-dialog"',
  "</dialog>",
  "充值弹框",
);

assert.match(rechargeDialogSource, /data-balance-dialog/, "充值弹框应提供独立脚本钩子");
assert.match(rechargeDialogSource, /data-balance-form/, "充值弹框应包含可提交表单");
assert.match(rechargeDialogSource, /name="recharge-amount"/, "充值弹框应提供金额选项");
assert.equal(
  (rechargeDialogSource.match(/name="recharge-amount"/g) || []).length,
  4,
  "充值弹框应提供四档明确金额",
);
assert.match(rechargeDialogSource, /data-recharge-summary/, "充值弹框应展示本次充值摘要");
assert.match(rechargeDialogSource, /微信支付/, "充值弹框应提供微信支付");
assert.match(rechargeDialogSource, /支付宝/, "充值弹框应提供支付宝");

assert.match(
  scriptSource,
  /(?:cashAccount|accountBalance)StorageKey\s*=\s*["'][^"']*cash-account[^"']*["']/,
  "现金账户状态应使用独立 localStorage key",
);
assert.match(
  scriptSource,
  /(?:balance|totalRecharged|totalSpent)Cents/,
  "现金金额必须使用整数分字段保存，避免浮点金额误差",
);
assert.match(
  scriptSource,
  /localStorage\.getItem\((?:cashAccount|accountBalance)StorageKey\)/,
  "初始化时应读取现金账户状态",
);
assert.match(
  scriptSource,
  /localStorage\.setItem\((?:cashAccount|accountBalance)StorageKey,\s*JSON\.stringify\(/,
  "账户变化后应持久化现金账户状态",
);
assert.match(
  scriptSource,
  /querySelectorAll\(["']\[data-account-balance\]["']\)/,
  "余额变化必须同步全部余额展示位",
);
assert.match(
  scriptSource,
  /transactions:\s*\[transaction,\s*\.\.\.currentState\.transactions\]/,
  "充值成功后应将新流水加入余额流水首位",
);
assert.match(
  scriptSource,
  /orderTableBody\.prepend\(createRechargeOrderRow\(transaction\)\)/,
  "充值成功后应同步新增订单记录",
);
assert.match(
  scriptSource,
  /showWorkspaceToast\([^)]*充值成功/,
  "充值成功后应通过工作台 toast 明确反馈",
);
assert.match(
  scriptSource,
  /data-balance-filter/,
  "脚本应绑定余额流水筛选器",
);
assert.match(
  scriptSource,
  /(?:row|transactionRow)\.hidden\s*=/,
  "余额筛选应实际控制流水行可见性",
);

console.log(
  "account balance UI tests passed: cash balance, points separation, recharge sync, transactions and invoice entry",
);
