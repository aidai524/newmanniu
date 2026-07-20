const fs = require("node:fs/promises");
const path = require("node:path");

const catalog = require("../template-catalog.js");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "assets", "templates");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "generation-manifest.json");
const API_BASE = "https://api.apimart.ai";
const API_KEY = process.env.APIMART_API_KEY;
const args = process.argv.slice(2);
const requestedId = args.find((arg) => arg.startsWith("--id="))?.slice(5);
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const concurrency = Math.max(1, Math.min(6, Number.parseInt(args.find((arg) => arg.startsWith("--concurrency="))?.split("=")[1] || "3", 10) || 3));

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function readManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return { version: catalog.version, model: catalog.model, generatedAt: null, items: {} };
  }
}

async function writeManifest(manifest) {
  manifest.version = catalog.version;
  manifest.model = catalog.model;
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

async function submitTemplate(template) {
  const response = await requestJson(`${API_BASE}/v1/images/generations`, {
    method: "POST",
    body: JSON.stringify({
      model: catalog.model,
      prompt: template.examplePrompt,
      n: 1,
      size: template.ratio,
      resolution: "2k",
    }),
  });
  const taskId = response?.data?.[0]?.task_id;
  if (!taskId) throw new Error("APIMart 未返回 task_id");
  return taskId;
}

async function waitForTask(taskId) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 240_000) {
    await sleep(Date.now() - startedAt < 12_000 ? 6_000 : 4_000);
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

async function generateTemplate(template, manifest) {
  const outputPath = path.join(ROOT, template.asset);
  if (!force) {
    try {
      await fs.access(outputPath);
      console.log(`[跳过] ${template.id} 已存在`);
      return;
    } catch {
      // Continue with generation.
    }
  }
  if (dryRun) {
    console.log(`[预览] ${template.id} · ${template.ratio} · ${template.title}`);
    return;
  }

  console.log(`[提交] ${template.id} · ${template.title}`);
  const taskId = await submitTemplate(template);
  console.log(`[生成] ${template.id} · ${taskId}`);
  const task = await waitForTask(taskId);
  const resultUrl = getResultUrl(task);
  if (!resultUrl) throw new Error("任务已完成，但没有返回图片地址");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await downloadAsset(resultUrl, outputPath);
  manifest.items[template.id] = {
    taskId,
    asset: template.asset,
    model: catalog.model,
    ratio: template.ratio,
    resolution: template.resolution,
    cost: task.cost ?? null,
    generatedAt: new Date().toISOString(),
  };
  await writeManifest(manifest);
  console.log(`[完成] ${template.id} → ${template.asset}${task.cost == null ? "" : ` · cost ${task.cost}`}`);
}

async function runPool(templates, worker) {
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, templates.length) }, async () => {
    while (nextIndex < templates.length) {
      const template = templates[nextIndex];
      nextIndex += 1;
      try {
        await worker(template);
      } catch (error) {
        console.error(`[失败] ${template.id} · ${error.message}`);
        process.exitCode = 1;
      }
    }
  });
  await Promise.all(workers);
}

async function main() {
  if (!API_KEY && !dryRun) throw new Error("缺少 APIMART_API_KEY 环境变量");
  const templates = requestedId
    ? catalog.templates.filter((template) => template.id === requestedId)
    : [...catalog.templates];
  if (!templates.length) throw new Error(`没有找到模板：${requestedId}`);
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const manifest = await readManifest();
  await runPool(templates, (template) => generateTemplate(template, manifest));
  if (dryRun) console.log(`共 ${templates.length} 套模板待生成`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
