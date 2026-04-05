// Simple script to generate PNG icons using sharp or manual buffer
// Since we don't have canvas, let's create minimal valid PNGs

const fs = require('fs');
const path = require('path');

// Create a minimal 1-color PNG for each size
// We'll use the generated image instead - copy from artifacts
const sizes = [16, 48, 128];
const outDir = path.join(__dirname, 'public', 'icons');

// Create a simple solid purple square PNG as placeholder
// PNG minimal structure
function createMinimalPNG(size) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // Build IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);  // width
  ihdrData.writeUInt32BE(size, 4);  // height
  ihdrData.writeUInt8(8, 8);        // bit depth
  ihdrData.writeUInt8(2, 9);        // color type (RGB)
  ihdrData.writeUInt8(0, 10);       // compression
  ihdrData.writeUInt8(0, 11);       // filter
  ihdrData.writeUInt8(0, 12);       // interlace
  
  const ihdr = createChunk('IHDR', ihdrData);
  
  // Build IDAT (image data)
  // Each row: filter byte (0) + RGB pixels
  const rawRows = [];
  for (let y = 0; y < size; y++) {
    const row = [0]; // filter = none
    for (let x = 0; x < size; x++) {
      // Gradient from purple to orange
      const t = (x + y) / (2 * size);
      const r = Math.round(168 + (249 - 168) * t);
      const g = Math.round(85 + (115 - 85) * t);
      const b = Math.round(247 + (22 - 247) * t);
      row.push(r, g, b);
    }
    rawRows.push(...row);
  }
  
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawRows));
  const idat = createChunk('IDAT', compressed);
  
  // IEND
  const iend = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  
  return Buffer.concat([length, typeBuffer, data, crc]);
}

// CRC32 implementation
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate icons
fs.mkdirSync(outDir, { recursive: true });
sizes.forEach(size => {
  const png = createMinimalPNG(size);
  const outPath = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`Generated ${outPath} (${png.length} bytes)`);
});
