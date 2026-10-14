const fs = require('fs');
const data = require('../data/mcu-data.js');
const chars = require('./mcu_characters.json');

const charMap = new Map();
chars.forEach(c => {
  if (c.played_by && c.image_url) {
    const parts = c.played_by.split(',');
    parts.forEach(p => {
      charMap.set(p.trim().toLowerCase(), c.image_url);
    });
  }
});

function slugify(name) {
  return name.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[.'"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const castFiles = fs.readdirSync('assets/img/cast');

let covered = 0;
let total = 0;
const missing = new Map();

data.forEach(e => {
  if (e.cast) {
    e.cast.forEach(c => {
      total++;
      let found = null;

      // 1. Direct local file check
      if (c.headshot) {
        const d1 = c.headshot.replace('-thumb.webp', '-display.webp');
        const d2 = c.headshot.replace('-thumb.webp', '-4k.jpg');
        if (fs.existsSync(d1)) found = d1;
        else if (fs.existsSync(d2)) found = d2;
      }

      // 2. Slug check in assets/img/cast
      if (!found && c.actor) {
        const slug = slugify(c.actor);
        const match = castFiles.find(f => (f.startsWith(slug + '-') || f.startsWith(slug + '--')) && (f.endsWith('-display.webp') || f.endsWith('-4k.jpg')));
        if (match) {
          found = 'assets/img/cast/' + match;
        }
      }

      // 3. TMDB w500 from character dataset
      if (!found && c.actor && charMap.has(c.actor.trim().toLowerCase())) {
        found = charMap.get(c.actor.trim().toLowerCase());
      }

      if (found) {
        covered++;
      } else if (c.actor) {
        missing.set(c.actor.trim(), c.character);
      }
    });
  }
});

console.log('Total cast entries:', total);
console.log('Covered with high-res (display/4k or w500):', covered);
console.log('Unique missing actors remaining:', missing.size);
fs.writeFileSync('scripts/missing_actors_clean.json', JSON.stringify(Object.fromEntries(missing), null, 2));
