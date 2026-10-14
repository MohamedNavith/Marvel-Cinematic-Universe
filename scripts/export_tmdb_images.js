const fs = require('fs');
const path = require('path');
const real = require('./tmdb_real_images.json');
fs.writeFileSync(path.join(__dirname, '../data/tmdb-images.js'), 'window.TMDB_IMAGES = ' + JSON.stringify(real, null, 2) + ';\nif (typeof module !== "undefined") { module.exports = window.TMDB_IMAGES; }\n');
console.log('Successfully wrote data/tmdb-images.js with', Object.keys(real).length, 'entries.');

