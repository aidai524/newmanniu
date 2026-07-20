const fs = require("node:fs/promises");
const path = require("node:path");

const realCases = require("../template-real-cases.js");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "assets", "template-real-cases");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "generation-manifest.json");
const API_BASE = "https://api.apimart.ai";
const API_KEY = process.env.APIMART_API_KEY;
const args = process.argv.slice(2);
const requestedId = args.find((arg) => arg.startsWith("--id="))?.slice(5);
const requestedIds = args.find((arg) => arg.startsWith("--ids="))?.slice(6).split(",").map((id) => id.trim()).filter(Boolean);
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const concurrency = Math.max(1, Math.min(3, Number.parseInt(args.find((arg) => arg.startsWith("--concurrency="))?.split("=")[1] || "2", 10) || 2));

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function readManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return { version: realCases.version, model: realCases.model, generatedAt: null, items: {} };
  }
}

async function writeManifest(manifest) {
  manifest.version = realCases.version;
  manifest.model = realCases.model;
  manifest.generatedAt = new Date().toISOString();
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const body = await response.text();
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    payload = { message: body.slice(0, 500) };
  }
  if (!response.ok || payload.code && payload.code !== 200) {
    const message = payload?.error?.message || payload?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

function mimeTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  return "image/jpeg";
}

async function readReferenceDataUrl(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  const data = await fs.readFile(absolutePath);
  return `data:${mimeTypeFor(absolutePath)};base64,${data.toString("base64")}`;
}

async function submitCase(item) {
  const reference = await readReferenceDataUrl(item.productAsset);
  const response = await requestJson(`${API_BASE}/v1/images/generations`, {
    method: "POST",
    body: JSON.stringify({
      model: realCases.model,
      prompt: item.prompt,
      image_urls: [reference],
      n: 1,
      size: item.ratio,
      resolution: item.resolution.toLowerCase(),
    }),
  });
  const taskId = response?.data?.[0]?.task_id;
  if (!taskId) throw new Error("APIMart 未返回 task_id");
  return taskId;
}

async function waitForTask(taskId) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 300_000) {
    await sleep(Date.now() - startedAt < 15_000 ? 7_000 : 4_000);
    const response = await requestJson(`${API_BASE}/v1/tasks/${encodeURIComponent(taskId)}?language=zh`);
    const task = response?.data;
    if (task?.status === "completed") return task;
    if (["failed", "cancelled"].includes(task?.status)) {
      throw new Error(task?.error?.message || task?.fail_reason || `任务状态：${task.status}`);
    }
  }
  throw new Error("等待 APIMart 结果超时");
}

function getResultUrl(task) {
  const url = task?.result?.images?.[0]?.url;
  return Array.isArray(url) ? url[0] : url;
}

async function downloadAsset(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`下载生成图片失败：HTTP ${response.status}`);
  const temporaryPath = `${outputPath}.part`;
  await fs.writeFile(temporaryPath, Buffer.from(await response.arrayBuffer()));
  await fs.rename(temporaryPath, outputPath);
}

async function generateCase(item, manifest) {
  const outputPath = path.join(ROOT, item.output);
  if (!force) {
    try {
      await fs.access(outputPath);
      console.log(`[跳过] ${item.id} 已存在`);
      return;
    } catch {
      // Continue with generation.
    }
  }
  if (dryRun) {
    console.log(`[预览] ${item.id} · ${item.productId} · ${item.ratio} · ${item.title}`);
    return;
  }

  console.log(`[提交] ${item.id} · 参考商品 ${item.productId}`);
  const taskId = await submitCase(item);
  console.log(`[生成] ${item.id} · ${taskId}`);
  const task = await waitForTask(taskId);
  const resultUrl = getResultUrl(task);
  if (!resultUrl) throw new Error("任务已完成，但没有返回图片地址");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await downloadAsset(resultUrl, outputPath);
  manifest.items[item.id] = {
    taskId,
    productId: item.productId,
    productAsset: item.productAsset,
    output: item.output,
    model: realCases.model,
    ratio: item.ratio,
    resolution: item.resolution,
    fidelity: item.fidelity,
    cost: task.cost ?? null,
    generatedAt: new Date().toISOString(),
  };
  await writeManifest(manifest);
  console.log(`[完成] ${item.id} → ${item.output}${task.cost == null ? "" : ` · cost ${task.cost}`}`);
}

async function runPool(items, worker) {
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex];
      nextIndex += 1;
      try {
        await worker(item);
      } catch (error) {
        console.error(`[失败] ${item.id} · ${error.message}`);
        process.exitCode = 1;
      }
    }
  });
  await Promise.all(workers);
}

async function main() {
  if (!API_KEY && !dryRun) throw new Error("缺少 APIMART_API_KEY 环境变量");
  const idFilter = requestedIds?.length ? new Set(requestedIds) : requestedId ? new Set([requestedId]) : null;
  const items = idFilter ? realCases.cases.filter((item) => idFilter.has(item.id)) : [...realCases.cases];
  if (idFilter && items.length !== idFilter.size) {
    const foundIds = new Set(items.map((item) => item.id));
    const missingIds = [...idFilter].filter((id) => !foundIds.has(id));
    throw new Error(`没有找到真实案例：${missingIds.join(", ")}`);
  }
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const manifest = await readManifest();
  await runPool(items, (item) => generateCase(item, manifest));
  if (dryRun) console.log(`共 ${items.length} 套真实案例待生成，使用 ${realCases.products.length} 组商品母素材`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
