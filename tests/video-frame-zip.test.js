const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createZipBlob, crc32 } = require("../zip-utils.js");

const root = path.join(__dirname, "..");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scriptSource = fs.readFileSync(path.join(root, "script.js"), "utf8");
const encoder = new TextEncoder();
const decoder = new TextDecoder();

assert.equal(crc32(encoder.encode("123456789")), 0xcbf43926, "CRC32 implementation must match the ZIP standard");
assert.ok(indexSource.includes("打包下载全部"), "视频抽帧应明确提供 ZIP 打包下载");
assert.ok(indexSource.includes("data-frame-archive-note"), "视频抽帧应说明批量下载的 ZIP 行为");
assert.ok(
  indexSource.indexOf('src="zip-utils.js') < indexSource.indexOf('src="script.js'),
  "ZIP utility must load before the workspace script",
);
assert.ok(scriptSource.includes("window.ManniuZip.createZipBlob"), "批量下载必须生成一个 ZIP 文件");
assert.doesNotMatch(
  scriptSource,
  /frameDownloadAll\?\.addEventListener\("click",\s*\(\)\s*=>\s*\{\s*extractedFrames\.forEach/,
  "批量下载不应继续触发多个单文件下载",
);

function bytesAt(bytes, offset, length) {
  return bytes.slice(offset, offset + length);
}

async function run() {
  const sourceFiles = [
    { name: "frame-01.txt", content: "first frame" },
    { name: "画面-02.txt", content: "second frame" },
  ];
  const progress = [];
  const archive = await createZipBlob(
    sourceFiles.map((file) => ({ name: file.name, blob: new Blob([file.content]) })),
    (value) => progress.push(value),
  );

  assert.equal(archive.type, "application/zip");
  const bytes = new Uint8Array(await archive.arrayBuffer());
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;

  sourceFiles.forEach((source) => {
    assert.equal(view.getUint32(offset, true), 0x04034b50, "ZIP local header signature is missing");
    assert.equal(view.getUint16(offset + 8, true), 0, "image archives should use the efficient store method");
    assert.ok((view.getUint16(offset + 6, true) & 0x0800) !== 0, "file names must be marked as UTF-8");
    const crc = view.getUint32(offset + 14, true);
    const size = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const name = decoder.decode(bytesAt(bytes, offset + 30, nameLength));
    const fileBytes = bytesAt(bytes, offset + 30 + nameLength, size);
    assert.equal(name, source.name);
    assert.equal(decoder.decode(fileBytes), source.content);
    assert.equal(crc, crc32(fileBytes));
    offset += 30 + nameLength + size;
  });

  const centralOffset = offset;
  sourceFiles.forEach((source) => {
    assert.equal(view.getUint32(offset, true), 0x02014b50, "ZIP central directory signature is missing");
    const nameLength = view.getUint16(offset + 28, true);
    const name = decoder.decode(bytesAt(bytes, offset + 46, nameLength));
    assert.equal(name, source.name);
    offset += 46 + nameLength;
  });

  assert.equal(view.getUint32(offset, true), 0x06054b50, "ZIP end record signature is missing");
  assert.equal(view.getUint16(offset + 8, true), sourceFiles.length);
  assert.equal(view.getUint16(offset + 10, true), sourceFiles.length);
  assert.equal(view.getUint32(offset + 16, true), centralOffset);
  assert.deepEqual(
    progress.map(({ completed, total }) => [completed, total]),
    [[1, 2], [2, 2]],
    "ZIP creation should report deterministic progress",
  );

  console.log("video frame ZIP tests passed: one archive, UTF-8 names, valid directory and progress");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
