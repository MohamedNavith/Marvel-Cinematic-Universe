const sharp = require('sharp');

async function cleanWatermark() {
  const input = 'Sacred Timeline 4k.webp';
  const { data, info } = await sharp(input).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Seamless gradient inpaint function using boundary sampling from above and organic texture synthesis
  function patchRegion(x1, y1, x2, y2) {
    const padTop = 15;
    for (let y = y1; y <= y2; y++) {
      const distFromTop = y - y1;
      const totalH = y2 - y1 + 1;
      const progress = distFromTop / totalH;

      for (let x = x1; x <= x2; x++) {
        // Sample 12 to 18 pixels above y1 for the natural gradient
        const sampleY = Math.max(0, y1 - 4 - (x % 5));
        const sampleIdx = (sampleY * width + x) * channels;

        // Also sample left / right margins
        const leftIdx = (y * width + Math.max(0, x1 - 5)) * channels;
        const rightIdx = (y * width + Math.min(width - 1, x2 + 5)) * channels;
        const hRatio = (x - x1) / (x2 - x1);

        const targetIdx = (y * width + x) * channels;

        for (let c = 0; c < 3; c++) {
          const topVal = data[sampleIdx + c];
          const edgeVal = data[leftIdx + c] * (1 - hRatio) + data[rightIdx + c] * hRatio;
          
          // Organic blend with slight subtle cosmic darkening towards the very bottom edge
          let val = topVal * 0.75 + edgeVal * 0.25;
          val = val * (1 - progress * 0.08); // subtle natural vignette towards extreme bottom
          
          // Micro cosmic noise dithering to match film grain
          const noise = ((Math.sin(x * 12.9898 + y * 78.233 + c * 37.1) * 43758.5453) % 1);
          data[targetIdx + c] = Math.max(0, Math.min(255, Math.round(val + (noise - 0.5) * 3)));
        }
      }
    }
  }

  // Left watermark: "MARVEL STUDIOS LOKI"
  patchRegion(16, 1195, 385, 1319);

  // Right watermark: "TRIXTER CINESITE"
  patchRegion(2010, 1255, 2495, 1315);

  // Write high quality WebP and JPG
  await sharp(data, { raw: { width, height, channels } })
    .webp({ quality: 96 })
    .toFile('assets/img/sacred-timeline-citadel-clean.webp');

  await sharp(data, { raw: { width, height, channels } })
    .jpeg({ quality: 95 })
    .toFile('assets/img/sacred-timeline-citadel-clean.jpg');

  // Also copy to sibling directory if exists
  const siblingPath = '../MCU Interactive Timeline Website/assets/img';
  try {
    await sharp(data, { raw: { width, height, channels } })
      .webp({ quality: 96 })
      .toFile(siblingPath + '/sacred-timeline-citadel-clean.webp');
    await sharp(data, { raw: { width, height, channels } })
      .jpeg({ quality: 95 })
      .toFile(siblingPath + '/sacred-timeline-citadel-clean.jpg');
    console.log('Synchronized clean background to sibling folder as well.');
  } catch(e) {
    console.warn('Sibling folder copy notice:', e.message);
  }

  console.log('Successfully cleaned watermarks with full coverage!');
}

cleanWatermark();
