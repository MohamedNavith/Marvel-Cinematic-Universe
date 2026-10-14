const fs = require('fs');
const path = require('path');

const compiledRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'compiled_mcu_data.json'), 'utf8'));
const compiled = [...(compiledRaw.films || []), ...(compiledRaw.series || [])];
const mcuData = require('../data/mcu-data.js');

let updated = 0;
compiled.forEach(c => {
  const target = mcuData.find(e => e.id === c.id);
  if (target) {
    if (target.summary !== c.summary) {
      target.summary = c.summary;
      updated++;
    }
  }
});

console.log(`Updated ${updated} entries in mcuData.`);

const finalDataContent = `// MCU: THE SACRED TIMELINE - Complete Canonical Dataset
// Generated on: ${new Date().toISOString()}
// Total Entries: ${mcuData.length} (40 Films + 30 Series/Specials)

const MCU_DATA = ${JSON.stringify(mcuData, null, 2)};

MCU_DATA.entries = MCU_DATA;

// Support both ES module and global window script for file:// protocol execution
if (typeof window !== 'undefined') {
  window.MCU_DATA = MCU_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MCU_DATA;
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'data', 'mcu-data.js'), finalDataContent);
console.log('Successfully synced data/mcu-data.js!');
