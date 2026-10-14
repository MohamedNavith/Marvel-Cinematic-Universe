const fs = require('fs');
const path = require('path');
const real = require('./tmdb_real_images.json');
const mcuPath = path.join(__dirname, '../data/mcu-data.js');

const data = require(mcuPath);


let updated = 0;
data.forEach(entry => {
  if (real[entry.id]) {
    entry.tmdbPoster = real[entry.id].poster;
    entry.tmdbBackdrop = real[entry.id].backdrop;
    updated++;
  }
});

const newCode = `// MCU: THE SACRED TIMELINE - Complete Canonical Dataset
// Generated on: ${new Date().toISOString()}
// Total Entries: ${data.length} (40 Films + 30 Series/Specials)

const MCU_DATA = ${JSON.stringify(data, null, 2)};

MCU_DATA.entries = MCU_DATA;

// Support both ES module and global window script for file:// protocol execution
if (typeof window !== 'undefined') {
  window.MCU_DATA = MCU_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MCU_DATA;
}
`;

fs.writeFileSync(mcuPath, newCode, 'utf8');
console.log(`Updated ${updated} entries in data/mcu-data.js with verified TMDB paths!`);
