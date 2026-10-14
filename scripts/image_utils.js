const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Base directories
const DIRS = {
  posters: path.join(__dirname, '..', 'assets', 'img', 'posters'),
  backdrops: path.join(__dirname, '..', 'assets', 'img', 'backdrops'),
  gallery: path.join(__dirname, '..', 'assets', 'img', 'gallery'),
  cast: path.join(__dirname, '..', 'assets', 'img', 'cast')
};

Object.values(DIRS).forEach(d => fs.mkdirSync(d, { recursive: true }));

// Helper to fetch with timeout and retries
async function fetchBuffer(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 800));
    }
  }
}

// Convert image buffer into 3 tiers, extract dominant color & 24px LQIP
async function processImage(inputBuffer, baseFilename, outDir, options = {}) {
  const isPoster = options.isPoster || false;
  const isCast = options.isCast || false;
  const targetWidths = isCast ? { thumb: 160, display: 320 } : isPoster ? { thumb: 300, display: 600, original: 1000 } : { thumb: 480, display: 1280, original: 2560 };

  const image = sharp(inputBuffer);
  const metadata = await image.metadata();

  // Extract dominant color from stats
  let dominantColor = '#FF9D2E';
  try {
    const stats = await image.stats();
    const dominant = stats.dominant;
    if (dominant) {
      dominantColor = '#' + [dominant.r, dominant.g, dominant.b].map(x => x.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    // fallback
  }

  // 24px LQIP as data URI
  let lqip = '';
  try {
    const lqipBuffer = await sharp(inputBuffer)
      .resize(24, null, { withoutEnlargement: true })
      .blur(2)
      .jpeg({ quality: 40 })
      .toBuffer();
    lqip = `data:image/jpeg;base64,${lqipBuffer.toString('base64')}`;
  } catch (e) {
    // fallback
  }

  // Generate thumb WebP
  const thumbPath = path.join(outDir, `${baseFilename}-thumb.webp`);
  await sharp(inputBuffer)
    .resize(targetWidths.thumb, null, { withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(thumbPath);

  // Generate display WebP
  const displayPath = path.join(outDir, `${baseFilename}-display.webp`);
  await sharp(inputBuffer)
    .resize(targetWidths.display, null, { withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(displayPath);

  // Save 4K / original
  const origExt = metadata.format === 'png' ? 'png' : 'jpg';
  const origFilename = `${baseFilename}-4k.${origExt}`;
  const origPath = path.join(outDir, origFilename);
  await fs.promises.writeFile(origPath, inputBuffer);

  return {
    thumb: `assets/img/${path.basename(outDir)}/${baseFilename}-thumb.webp`,
    display: `assets/img/${path.basename(outDir)}/${baseFilename}-display.webp`,
    original: `assets/img/${path.basename(outDir)}/${origFilename}`,
    dominantColor,
    lqip,
    width: metadata.width,
    height: metadata.height
  };
}

// Generate stylized fallback SVG if image cannot be downloaded
async function generateFallbackImage(title, accentColor, baseFilename, outDir, isPoster = false) {
  const w = isPoster ? 600 : 1280;
  const h = isPoster ? 900 : 720;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <radialGradient id="grad" cx="50%" cy="40%" r="70%" fx="50%" fy="30%">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#05060A" stop-opacity="0.95" />
        </radialGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 157, 46, 0.08)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#07080f"/>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <circle cx="${w/2}" cy="${h/2 - 40}" r="${w/4}" fill="${accentColor}" opacity="0.12" filter="blur(40px)"/>
      <text x="50%" y="${h/2 - 20}" font-family="'Oswald', 'Bebas Neue', 'Segoe UI', sans-serif" font-size="${isPoster ? '36' : '52'}" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">${title.toUpperCase()}</text>
      <text x="50%" y="${h/2 + 35}" font-family="'Inter', sans-serif" font-size="${isPoster ? '14' : '18'}" font-weight="600" fill="${accentColor}" text-anchor="middle" letter-spacing="6">MARVEL CINEMATIC UNIVERSE</text>
      <text x="50%" y="${h/2 + 70}" font-family="'Inter', sans-serif" font-size="12" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="2">THE SACRED TIMELINE</text>
    </svg>
  `;
  const buf = Buffer.from(svg);
  return await processImage(buf, baseFilename, outDir, { isPoster });
}

module.exports = {
  DIRS,
  fetchBuffer,
  processImage,
  generateFallbackImage
};
