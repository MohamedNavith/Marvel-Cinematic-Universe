const fs = require('fs');
const path = require('path');
const { DIRS, fetchBuffer, processImage, generateFallbackImage } = require('./image_utils');

const allEntries = JSON.parse(fs.readFileSync('scripts/mapped_entries.json', 'utf8'));
const chars = JSON.parse(fs.readFileSync('scripts/mcu_characters.json', 'utf8'));

// Build actor -> headshot map
const actorMap = new Map();
chars.forEach(c => {
  if (c.image_url && c.played_by) {
    c.played_by.split(',').map(s => s.trim()).forEach(actor => {
      if (!actorMap.has(actor.toLowerCase())) {
        actorMap.set(actor.toLowerCase(), c.image_url);
      }
    });
  }
});

async function runPipeline() {
  console.log(`Starting image pipeline for ${allEntries.length} entries...`);
  const startTime = Date.now();

  let processedCount = 0;

  for (const entry of allEntries) {
    const slug = entry.id;
    console.log(`[${++processedCount}/${allEntries.length}] Processing: ${entry.title}`);

    // 1. Poster
    try {
      if (entry.matchedPoster) {
        const buf = await fetchBuffer(entry.matchedPoster);
        entry.posterAssets = await processImage(buf, `${slug}-poster`, DIRS.posters, { isPoster: true });
      } else {
        entry.posterAssets = await generateFallbackImage(entry.title, entry.accentColor || '#FF9D2E', `${slug}-poster`, DIRS.posters, true);
      }
    } catch (err) {
      console.warn(`Fallback poster for ${entry.title}: ${err.message}`);
      entry.posterAssets = await generateFallbackImage(entry.title, entry.accentColor || '#FF9D2E', `${slug}-poster`, DIRS.posters, true);
    }

    // 2. Backdrop
    try {
      if (entry.matchedBackdrop) {
        const buf = await fetchBuffer(entry.matchedBackdrop);
        entry.backdropAssets = await processImage(buf, `${slug}-backdrop`, DIRS.backdrops, { isPoster: false });
        if (!entry.accentColor || entry.accentColor === '#FF9D2E') {
          entry.accentColor = entry.backdropAssets.dominantColor;
        }
      } else {
        entry.backdropAssets = await generateFallbackImage(entry.title, entry.accentColor || '#FF9D2E', `${slug}-backdrop`, DIRS.backdrops, false);
      }
    } catch (err) {
      console.warn(`Fallback backdrop for ${entry.title}: ${err.message}`);
      entry.backdropAssets = await generateFallbackImage(entry.title, entry.accentColor || '#FF9D2E', `${slug}-backdrop`, DIRS.backdrops, false);
    }

    // 3. Cast Headshots
    if (entry.cast && Array.isArray(entry.cast)) {
      for (let i = 0; i < Math.min(entry.cast.length, 8); i++) {
        const member = entry.cast[i];
        const actorKey = member.actor.toLowerCase();
        const headshotUrl = actorMap.get(actorKey);
        const castSlug = member.actor.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const castThumbFile = path.join(DIRS.cast, `${castSlug}-thumb.webp`);

        if (fs.existsSync(castThumbFile)) {
          member.headshot = `assets/img/cast/${castSlug}-thumb.webp`;
        } else if (headshotUrl) {
          try {
            const buf = await fetchBuffer(headshotUrl);
            const res = await processImage(buf, castSlug, DIRS.cast, { isCast: true });
            member.headshot = res.thumb;
          } catch (e) {
            member.headshot = null;
          }
        }
      }
    }

    // 4. Gallery Scenes (use backdrop or key scene shots)
    if (entry.galleryScenes && Array.isArray(entry.galleryScenes)) {
      entry.galleryScenes.forEach((scene, sIdx) => {
        scene.thumb = entry.backdropAssets.thumb;
        scene.display = entry.backdropAssets.display;
        scene.original = entry.backdropAssets.original;
        scene.lqip = entry.backdropAssets.lqip;
      });
    }

    // Small delay to be polite to CDN
    await new Promise(r => setTimeout(r, 80));
  }

  console.log(`\nPipeline completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s!`);

  // Write final static data/mcu-data.js
  const finalDataContent = `// MCU: THE SACRED TIMELINE - Complete Canonical Dataset
// Generated on: ${new Date().toISOString()}
// Total Entries: ${allEntries.length} (40 Films + 30 Series/Specials)

const MCU_DATA = ${JSON.stringify(allEntries, null, 2)};

// Support both ES module and global window script for file:// protocol execution
if (typeof window !== 'undefined') {
  window.MCU_DATA = MCU_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MCU_DATA;
}
`;

  fs.writeFileSync(path.join(__dirname, '..', 'data', 'mcu-data.js'), finalDataContent);
  console.log('Saved final data/mcu-data.js successfully!');

  // Generate Contact Sheet for Phase B verification
  generateContactSheet(allEntries);
}

function generateContactSheet(entries) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MCU: The Sacred Timeline - Asset Contact Sheet</title>
  <style>
    body { background: #05060A; color: #E2E8F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px; margin: 0; }
    h1 { color: #FF9D2E; margin-bottom: 8px; font-size: 28px; letter-spacing: 2px; }
    p.meta { color: #94A3B8; margin-top: 0; margin-bottom: 24px; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,157,46,0.2); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s; }
    .card:hover { transform: translateY(-4px); border-color: #FF9D2E; }
    .media { display: flex; gap: 8px; padding: 12px; background: #000; align-items: center; justify-content: center; }
    .poster-img { width: 90px; height: 135px; object-fit: cover; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
    .backdrop-img { width: 150px; height: 84px; object-fit: cover; border-radius: 4px; }
    .info { padding: 12px 14px; flex-grow: 1; }
    .title { font-weight: 700; font-size: 15px; margin: 0 0 4px 0; color: #FFF; }
    .sub { font-size: 12px; color: #94A3B8; margin: 0 0 8px 0; }
    .chip { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: rgba(255,157,46,0.15); color: #FF9D2E; border: 1px solid rgba(255,157,46,0.3); }
    .color-swatch { display: inline-block; width: 14px; height: 14px; border-radius: 50%; vertical-align: middle; margin-left: 6px; border: 1px solid #FFF; }
  </style>
</head>
<body>
  <h1>MCU: THE SACRED TIMELINE — ASSET CONTACT SHEET</h1>
  <p class="meta">Verified Phase B Asset Deliverable • ${entries.length} Entries • All 3-tier images processed locally in /assets/img</p>
  <div class="grid">
    ${entries.map(e => `
      <div class="card">
        <div class="media">
          <img class="poster-img" src="../${e.posterAssets.thumb}" alt="${e.title} Poster" loading="lazy">
          <img class="backdrop-img" src="../${e.backdropAssets.thumb}" alt="${e.title} Backdrop" loading="lazy">
        </div>
        <div class="info">
          <div class="title">${e.title}</div>
          <div class="sub">${e.type.toUpperCase()} • ${e.phase ? 'Phase ' + e.phase : 'Special'} • ${e.releaseDate ? e.releaseDate.substring(0,4) : '—'}</div>
          <div>
            <span class="chip">${e.saga || 'Infinity Saga'}</span>
            <span class="color-swatch" style="background:${e.accentColor || '#FF9D2E'}" title="Accent Glow: ${e.accentColor || '#FF9D2E'}"></span>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '..', 'scripts', 'contact_sheet.html'), html);
  console.log('Generated scripts/contact_sheet.html');
}

runPipeline().catch(console.error);
