#!/usr/bin/env node
/**
 * One-off build helper: produces public/maco-mark-hero.png from
 * public/white-logo.png. Rendered ONLY via CSS mask-image +
 * background-color: currentColor (see components/mark.tsx), so only the
 * alpha channel is ever read — the RGB channels are dead weight. This
 * script therefore:
 *   1. Downsamples 2x2 -> 1x1 (box filter on alpha only; RGB forced to a
 *      flat 255 so the encoded stream compresses much better).
 *   2. Re-encodes as PNG color type 4 (grayscale + alpha, 2 bytes/px)
 *      instead of the source's color type 6 (RGBA, 4 bytes/px).
 * Pure Node zlib, no dependency. Not part of the app build — run once,
 * commit the output.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 8;
  const idatChunks = [];
  let width, height, bitDepth, colorType;
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    if (type === "IHDR") {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
      bitDepth = buf[offset + 16];
      colorType = buf[offset + 17];
    }
    if (type === "IDAT") idatChunks.push(buf.subarray(offset + 8, offset + 8 + length));
    if (type === "IEND") break;
    offset += 12 + length;
  }
  if (bitDepth !== 8) throw new Error("expected 8-bit depth");
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  const bpp = channels;
  const stride = width * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  const out = Buffer.alloc(height * stride);

  const paeth = (a, b, c) => {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  };

  for (let y = 0; y < height; y++) {
    const filterType = raw[y * (stride + 1)];
    const lineStart = y * (stride + 1) + 1;
    for (let x = 0; x < stride; x++) {
      const raw_x = raw[lineStart + x];
      const a = x >= bpp ? out[y * stride + x - bpp] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = x >= bpp && y > 0 ? out[(y - 1) * stride + x - bpp] : 0;
      let value;
      switch (filterType) {
        case 0:
          value = raw_x;
          break;
        case 1:
          value = raw_x + a;
          break;
        case 2:
          value = raw_x + b;
          break;
        case 3:
          value = raw_x + ((a + b) >> 1);
          break;
        case 4:
          value = raw_x + paeth(a, b, c);
          break;
        default:
          value = raw_x;
      }
      out[y * stride + x] = value & 0xff;
    }
  }
  return { width, height, channels, bpp, stride, pixels: out };
}

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePngGrayAlpha(width, height, pixels /* stride = width*2, unfiltered */) {
  const stride = width * 2;
  const withFilters = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    withFilters[y * (stride + 1)] = 0; // filter type 0 = None
    pixels.copy(withFilters, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(withFilters, { level: 9 });

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 4; // color type: grayscale + alpha
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function main() {
  const srcPath = path.join(__dirname, "../public/white-logo.png");
  const outPath = path.join(__dirname, "../public/maco-mark-hero.png");
  const src = decodePng(srcPath);
  console.log(`source: ${srcPath} — ${src.width}x${src.height}, ${src.channels} channels`);

  const outW = Math.round(src.width / 2);
  const outH = Math.round(src.height / 2);
  const outPixels = Buffer.alloc(outW * outH * 2);

  const alphaAt = (x, y) => {
    if (x >= src.width || y >= src.height) return 0;
    const o = y * src.stride + x * src.bpp;
    return src.channels === 4 ? src.pixels[o + 3] : 255;
  };

  for (let oy = 0; oy < outH; oy++) {
    for (let ox = 0; ox < outW; ox++) {
      const sx = ox * 2;
      const sy = oy * 2;
      // Box filter over the 2x2 source block, alpha only.
      const a = (alphaAt(sx, sy) + alphaAt(sx + 1, sy) + alphaAt(sx, sy + 1) + alphaAt(sx + 1, sy + 1)) / 4;
      const i = (oy * outW + ox) * 2;
      outPixels[i] = 255; // gray channel: flat white, only alpha is ever read via CSS mask
      outPixels[i + 1] = Math.round(a);
    }
  }

  const png = encodePngGrayAlpha(outW, outH, outPixels);
  fs.writeFileSync(outPath, png);

  const srcSize = fs.statSync(srcPath).size;
  const outSize = fs.statSync(outPath).size;
  console.log(`output: ${outPath} — ${outW}x${outH}, grayscale+alpha`);
  console.log(`size: ${srcSize} -> ${outSize} bytes (${(100 * outSize / srcSize).toFixed(1)}% of original)`);
}

main();
