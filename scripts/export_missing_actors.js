const fs = require('fs');
const data = require('../data/mcu-data.js');
const chars = require('./mcu_characters.json');

const charMap = new Map();
chars.forEach(c => {
  if (c.played_by && c.image_url) {
    c.played_by.split(',').forEach(p => charMap.set(p.trim().toLowerCase(), c.image_url));
  }
});

const uniqueMissing = new Map();
data.forEach(e => {
  if (e.cast) {
    e.cast.forEach(c => {
      let found = null;
      if (c.headshot) {
        const d1 = c.headshot.replace('-thumb.webp', '-display.webp');
        if (fs.existsSync(d1)) found = d1;
      }
      if (!found && c.actor && charMap.has(c.actor.trim().toLowerCase())) {
        found = charMap.get(c.actor.trim().toLowerCase());
      }
      if (!found && c.actor) {
        uniqueMissing.set(c.actor.trim(), c.character);
      }
    });
  }
});

console.log('Unique missing actors count:', uniqueMissing.size);
fs.writeFileSync('scripts/missing_actors.json', JSON.stringify(Object.fromEntries(uniqueMissing), null, 2));
console.log('Saved missing actors list to scripts/missing_actors.json');
