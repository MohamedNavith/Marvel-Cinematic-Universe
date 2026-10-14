const fs = require('fs');
const path = require('path');
const mcuData = require('../data/mcu-data.js');

console.log('=== DATA INTEGRITY VERIFICATION ===');
console.log('Total entries:', mcuData.entries.length);

const films = mcuData.entries.filter(e => e.type === 'film' || e.type === 'teaser');
const series = mcuData.entries.filter(e => e.type === 'series' || e.type === 'special');
const oneshots = mcuData.entries.filter(e => e.type === 'one-shot');

console.log('Films count:', films.length);
console.log('Series & Specials count:', series.length);
console.log('One-Shots count:', oneshots.length);

// Check summary word counts
let wordCountErrors = 0;
mcuData.entries.forEach(e => {
  const words = (e.summary || '').trim().split(/\s+/).length;
  if (words < 70 || words > 95) {
    console.warn(`Summary word count: "${e.title}" has ${words} words`);
    wordCountErrors++;
  }
});
console.log(`Summary word count check completed. Total out of 70-95 range: ${wordCountErrors}`);

// Check image paths
let missingThumb = 0;
let missingBackdrop = 0;
let totalCast = 0;
let missingCast = 0;

mcuData.entries.forEach(e => {
  if (e.posterAssets && e.posterAssets.thumb) {
    if (!fs.existsSync(path.resolve(__dirname, '..', e.posterAssets.thumb))) {
      missingThumb++;
    }
  }
  if (e.backdropAssets && e.backdropAssets.display) {
    if (!fs.existsSync(path.resolve(__dirname, '..', e.backdropAssets.display))) {
      missingBackdrop++;
    }
  }
  if (e.cast && Array.isArray(e.cast)) {
    e.cast.forEach(c => {
      totalCast++;
      if (c.headshot && !fs.existsSync(path.resolve(__dirname, '..', c.headshot))) {
        missingCast++;
      }
    });
  }
});
console.log(`Poster thumbs missing: ${missingThumb}`);
console.log(`Backdrops display missing: ${missingBackdrop}`);
console.log(`Total cast members: ${totalCast}, missing headshots: ${missingCast}`);

// Check Doomsday & Secret Wars
const doomsday = mcuData.entries.find(e => e.id === 'avengers-doomsday');
console.log('Doomsday node present:', !!doomsday, '| Release Date:', doomsday?.releaseDate, '| Villain:', doomsday?.villain);

const secretWars = mcuData.entries.find(e => e.id === 'avengers-secret-wars');
console.log('Secret Wars node present:', !!secretWars, '| Release Date:', secretWars?.releaseDate);

// Check Brand New Day box office
const bnd = mcuData.entries.find(e => e.id === 'spider-man-brand-new-day');
console.log('Brand New Day box office:', bnd?.worldwideGross, '| MCU Rank:', bnd?.rankMcu);

// Check Rankings Consistency
const releasedFilms = mcuData.entries.filter(e => e.type === 'film' && e.worldwideGross);
console.log(`Released films with box office: ${releasedFilms.length}`);
const topGrosser = releasedFilms.find(f => f.rankMcu === 1);
console.log(`Top MCU grosser (#1): ${topGrosser?.title} ($${topGrosser?.worldwideGross.toLocaleString()})`);
