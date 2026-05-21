const ZIP_DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
const ZIP_DOS_TIME = 0;

export function createZipBlob(
  files: Array<{
    data: Uint8Array;
    name: string;
  }>,
) {
  const encoder = new TextEncoder();
  const localParts: Array<Uint8Array> = [];
  const centralParts: Array<Uint8Array> = [];
  let localOffset = 0;

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const crc = getCrc32(file.data);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);

    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, ZIP_DOS_TIME, true);
    localView.setUint16(12, ZIP_DOS_DATE, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, file.data.length, true);
    localView.setUint32(22, file.data.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, file.data);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);

    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, ZIP_DOS_TIME, true);
    centralView.setUint16(14, ZIP_DOS_DATE, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, file.data.length, true);
    centralView.setUint32(24, file.data.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, localOffset, true);
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    localOffset += localHeader.length + file.data.length;
  });

  const centralSize = centralParts.reduce(
    (total, part) => total + part.length,
    0,
  );
  const endHeader = new Uint8Array(22);
  const endView = new DataView(endHeader.buffer);

  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, localOffset, true);
  endView.setUint16(20, 0, true);

  const zipParts = [...localParts, ...centralParts, endHeader];
  const zipSize = zipParts.reduce((total, part) => total + part.length, 0);
  const zipBuffer = new ArrayBuffer(zipSize);
  const zipBytes = new Uint8Array(zipBuffer);
  let zipOffset = 0;

  zipParts.forEach((part) => {
    zipBytes.set(part, zipOffset);
    zipOffset += part.length;
  });

  return new Blob([zipBuffer], { type: "application/zip" });
}

const CRC32_TABLE = new Uint32Array(
  Array.from({ length: 256 }, (_, index) => {
    let value = index;

    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }

    return value >>> 0;
  }),
);

function getCrc32(data: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of data) {
    crc = CRC32_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}
