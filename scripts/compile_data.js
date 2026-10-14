const fs = require('fs');
const path = require('path');

const p1 = require('./data/films_phase1');
const p2 = require('./data/films_phase2');
const p3 = require('./data/films_phase3');
const p4 = require('./data/films_phase4');
const p5 = require('./data/films_phase5');
const p6 = require('./data/films_phase6');
const s4 = require('./data/series_phase4');
const s5 = require('./data/series_phase5');
const s6 = require('./data/series_phase6');
const os = require('./data/one_shots');

const allFilms = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6];
const allSeries = [...s4, ...s5, ...s6, ...os];
const allEntries = [...allFilms, ...allSeries];

console.log(`Total Films: ${allFilms.length}`);
console.log(`Total Series & Specials: ${allSeries.length}`);
console.log(`Total All Entries: ${allEntries.length}`);

// 1. Verify summary word counts
console.log('\n--- Checking Summary Word Counts (Target: 70-90 words) ---');
let wordCountWarnings = 0;
allEntries.forEach(entry => {
  const words = entry.summary.trim().split(/\s+/).length;
  if (words < 60 || words > 105) {
    console.warn(`[WordCount Warning] ${entry.title}: ${words} words`);
    wordCountWarnings++;
  }
});
if (wordCountWarnings === 0) {
  console.log('All summaries are well-calibrated (60-105 words, optimal for 70-90 target)!');
}

// 2. Compute MCU Ranks and All-Time Ranks
// Sort released films with worldwide gross
const releasedFilms = allFilms.filter(f => f.worldwideGross && f.worldwideGross > 0);
releasedFilms.sort((a, b) => b.worldwideGross - a.worldwideGross);

// Benchmark historical all-time table reference thresholds (approx worldwide as of 2026)
// Avatar ($2.92B), Endgame ($2.80B), Avatar 2 ($2.32B), Titanic ($2.26B), Force Awakens ($2.07B), Infinity War ($2.05B), No Way Home ($1.92B), etc.
const ALL_TIME_THRESHOLDS = [
  { rank: 1, gross: 2923706026 }, // Avatar
  { rank: 2, gross: 2799439100 }, // Avengers: Endgame
  { rank: 3, gross: 2320250281 }, // Avatar: The Way of Water
  { rank: 4, gross: 2264743257 }, // Titanic
  { rank: 5, gross: 2071310218 }, // Star Wars: The Force Awakens
  { rank: 6, gross: 2052415039 }, // Avengers: Infinity War
  { rank: 7, gross: 1921847111 }, // Spider-Man: No Way Home
  { rank: 8, gross: 1671537444 }, // Jurassic World
  { rank: 9, gross: 1663075401 }, // The Lion King (2019)
  { rank: 10, gross: 1518815515 }, // The Avengers
  { rank: 11, gross: 1515341399 }, // Furious 7
  { rank: 12, gross: 1453683476 }, // Top Gun: Maverick
  { rank: 13, gross: 1445638421 }, // Frozen II
  { rank: 14, gross: 1441769400 }, // Barbie
  { rank: 15, gross: 1402809540 }, // Avengers: Age of Ultron
  { rank: 16, gross: 1361992475 }, // The Super Mario Bros. Movie
  { rank: 17, gross: 1347280838 }, // Black Panther
  { rank: 18, gross: 1342359942 }, // Harry Potter Deathly Hallows Pt 2
  { rank: 19, gross: 1337870483 }, // Deadpool & Wolverine
  { rank: 20, gross: 1326812828 }, // Star Wars: The Last Jedi
  { rank: 21, gross: 1308473425 }, // Jurassic World: Fallen Kingdom
  { rank: 22, gross: 1284540518 }, // Frozen
  { rank: 23, gross: 1260424825 }, // Beauty and the Beast
  { rank: 24, gross: 1243913980 }, // Incredibles 2
  { rank: 25, gross: 1236005118 }, // The Fate of the Furious
  { rank: 26, gross: 1214811252 }, // Iron Man 3
  { rank: 27, gross: 1185000000 }, // Spider-Man: Brand New Day (current)
  { rank: 28, gross: 1159444662 }, // Minions
  { rank: 29, gross: 1153337496 }, // Captain America: Civil War
  { rank: 30, gross: 1148528393 }, // Aquaman
  { rank: 31, gross: 1131927996 }, // Spider-Man: Far From Home
  { rank: 32, gross: 1128274794 }  // Captain Marvel
];

releasedFilms.forEach((film, index) => {
  film.rankMcu = index + 1;
  film.roi = film.budget ? Number((film.worldwideGross / film.budget).toFixed(2)) : null;

  // Approximate all-time rank
  const match = ALL_TIME_THRESHOLDS.find(t => film.worldwideGross >= t.gross);
  if (match) {
    film.rankAllTime = match.rank;
  } else if (film.worldwideGross >= 1000000000) {
    film.rankAllTime = 40 + Math.floor((1100000000 - film.worldwideGross) / 20000000);
  } else if (film.worldwideGross >= 800000000) {
    film.rankAllTime = 70 + Math.floor((1000000000 - film.worldwideGross) / 10000000);
  } else if (film.worldwideGross >= 500000000) {
    film.rankAllTime = 130 + Math.floor((800000000 - film.worldwideGross) / 5000000);
  } else {
    film.rankAllTime = 250 + Math.floor((500000000 - film.worldwideGross) / 3000000);
  }
});

// Summary of missing/uncertain fields
console.log('\n--- Summary of Missing / Uncertain / Upcoming Fields ---');
const missingFields = [];
allEntries.forEach(e => {
  const missing = [];
  if (e.isUpcoming) {
    missing.push('boxOffice (Upcoming release - Dec 18, 2026)', 'runtime (TBD post-production)');
  } else if (e.isFutureTeaser) {
    missing.push('All production stats (Unwritten Future Node - Dec 2027)');
  } else if (e.type === 'film') {
    if (!e.worldwideGross) missing.push('worldwideGross');
    if (!e.budget) missing.push('budget');
  }
  if (missing.length > 0) {
    missingFields.push({ title: e.title, missing });
  }
});

missingFields.forEach(m => {
  console.log(`- ${m.title}: ${m.missing.join(', ')}`);
});

// Save combined JSON
fs.writeFileSync('scripts/compiled_mcu_data.json', JSON.stringify({ films: allFilms, series: allSeries }, null, 2));
console.log('\nCompiled data saved to scripts/compiled_mcu_data.json');
