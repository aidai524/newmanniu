(function exposeManniuZip(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ManniuZip = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const textEncoder = new TextEncoder();
  const CRC_TABLE = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) !== 0 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    CRC_TABLE[index] = value >>> 0;
  }

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let index = 0; index < bytes.length; index += 1) {
      crc = CRC_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function dosDateTime(value) {
    const date = value instanceof Date && !Number.isNaN(value.getTime()) ? value : new Date();
    const year = Math.min(2107, Math.max(1980, date.getFullYear()));
    return {
      date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
      time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    };
  }

  function safeEntryName(value, index) {
    const normalized = String(value || "")
      .replace(/[\\/]+/g, "-")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .trim();
    return normalized || `manniu-file-${String(index + 1).padStart(2, "0")}`;
  }

  function makeLocalHeader(entry) {
    const header = new Uint8Array(30 + entry.nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0x0800, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, entry.time, true);
    view.setUint16(12, entry.date, true);
    view.setUint32(14, entry.crc, true);
    view.setUint32(18, entry.bytes.length, true);
    view.setUint32(22, entry.bytes.length, true);
    view.setUint16(26, entry.nameBytes.length, true);
    view.setUint16(28, 0, true);
    header.set(entry.nameBytes, 30);
    return header;
  }

  function makeCentralHeader(entry) {
    const header = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0x0800, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, entry.time, true);
    view.setUint16(14, entry.date, true);
    view.setUint32(16, entry.crc, true);
    view.setUint32(20, entry.bytes.length, true);
    view.setUint32(24, entry.bytes.length, true);
    view.setUint16(28, entry.nameBytes.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, entry.offset, true);
    header.set(entry.nameBytes, 46);
    return header;
  }

  async function createZipBlob(files, onProgress) {
    if (!Array.isArray(files) || files.length === 0) throw new Error("没有可打包的文件");
    if (files.length > 0xffff) throw new Error("单个 ZIP 文件最多包含 65535 个文件");

    const entries = [];
    let localSize = 0;

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      if (!(file?.blob instanceof Blob)) throw new Error(`第 ${index + 1} 个文件无效`);
      const name = safeEntryName(file.name, index);
      const nameBytes = textEncoder.encode(name);
      if (nameBytes.length > 0xffff) throw new Error(`文件名过长：${name}`);
      const bytes = new Uint8Array(await file.blob.arrayBuffer());
      const timestamp = dosDateTime(file.modifiedAt);
      const entry = {
        bytes,
        crc: crc32(bytes),
        date: timestamp.date,
        name,
        nameBytes,
        offset: localSize,
        time: timestamp.time,
      };
      entries.push(entry);
      localSize += 30 + nameBytes.length + bytes.length;
      if (localSize > 0xffffffff) throw new Error("ZIP 文件超过 4GB，请减少文件数量");
      if (typeof onProgress === "function") onProgress({ completed: index + 1, total: files.length, fileName: name });
    }

    const localChunks = [];
    const centralChunks = [];
    let centralSize = 0;

    entries.forEach((entry) => {
      localChunks.push(makeLocalHeader(entry), entry.bytes);
      const centralHeader = makeCentralHeader(entry);
      centralChunks.push(centralHeader);
      centralSize += centralHeader.length;
    });

    const endRecord = new Uint8Array(22);
    const endView = new DataView(endRecord.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(4, 0, true);
    endView.setUint16(6, 0, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, localSize, true);
    endView.setUint16(20, 0, true);

    return new Blob([...localChunks, ...centralChunks, endRecord], { type: "application/zip" });
  }

  return { createZipBlob, crc32 };
});
