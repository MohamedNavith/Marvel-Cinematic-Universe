const fs = require('fs');

const { films, series } = JSON.parse(fs.readFileSync('scripts/compiled_mcu_data.json', 'utf8'));
const listings = JSON.parse(fs.readFileSync('scripts/listings.json', 'utf8'));
const chars = JSON.parse(fs.readFileSync('scripts/mcu_characters.json', 'utf8'));

console.log('Mapping image assets for all entries...');

const allEntries = [...films, ...series];

let matchedPosters = 0;
let matchedBackdrops = 0;

allEntries.forEach(entry => {
  // Find match in listings
  const match = listings.find(l => {
    if (entry.tmdbId && l.id === entry.tmdbId) return true;
    if (l.title && l.title.toLowerCase() === entry.title.toLowerCase()) return true;
    if (l.original_title && l.original_title.toLowerCase() === entry.title.toLowerCase()) return true;
    if (l.slug && l.slug === entry.id) return true;
    return false;
  });

  if (match) {
    if (match.poster_path) {
      entry.matchedPoster = `https://image.tmdb.org/t/p/original${match.poster_path}`;
      matchedPosters++;
    }
    if (match.backdrop_path) {
      entry.matchedBackdrop = `https://image.tmdb.org/t/p/original${match.backdrop_path}`;
      matchedBackdrops++;
    }
  }
});

console.log(`Matched Posters: ${matchedPosters} / ${allEntries.length}`);
console.log(`Matched Backdrops: ${matchedBackdrops} / ${allEntries.length}`);

// Sample
allEntries.slice(0, 10).forEach(e => {
  console.log(`${e.title}: poster=${!!e.matchedPoster}, backdrop=${!!e.matchedBackdrop}`);
});

fs.writeFileSync('scripts/mapped_entries.json', JSON.stringify(allEntries, null, 2));
