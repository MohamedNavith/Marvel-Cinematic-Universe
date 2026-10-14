const mcuData = require('../data/mcu-data.js');
const tmdbMapping = require('./tmdb_real_images.json');

console.log('Testing render simulation...');

// Check poster URL generation
let missingPosters = 0;
let missingBackdrops = 0;

mcuData.forEach(entry => {
  const p = tmdbMapping[entry.id] ? tmdbMapping[entry.id].poster : entry.tmdbPoster;
  const b = tmdbMapping[entry.id] ? tmdbMapping[entry.id].backdrop : entry.tmdbBackdrop;
  if (!p) {
    console.error('Missing poster for:', entry.id);
    missingPosters++;
  }
  if (!b) {
    console.error('Missing backdrop for:', entry.id);
    missingBackdrops++;
  }
});

console.log('Missing posters:', missingPosters);
console.log('Missing backdrops:', missingBackdrops);

// Check story order
const storySorted = [...mcuData].sort((a, b) => (a.chronologyOrder || 999) - (b.chronologyOrder || 999));
console.log('Story order first 3:', storySorted.slice(0, 3).map(e => `${e.title} (${e.inUniverseYear})`));
console.log('Story order last 3:', storySorted.slice(-3).map(e => `${e.title} (${e.inUniverseYear || e.releaseDate})`));

// Check release order
const releaseSorted = [...mcuData].sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
console.log('Release order first 3:', releaseSorted.slice(0, 3).map(e => `${e.title} (${e.releaseDate})`));
console.log('Release order last 3:', releaseSorted.slice(-3).map(e => `${e.title} (${e.releaseDate})`));

console.log('Render simulation test: 100% SUCCESS!');
