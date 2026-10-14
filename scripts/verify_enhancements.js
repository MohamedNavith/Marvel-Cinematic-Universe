const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');

const tests = [
  { name: 'Stable background (no transform on citadelImg in sync)', test: !html.includes('citadelImg.style.transform =') },
  { name: 'Zero blur (no backdrop-filter blur anywhere in CSS)', test: !html.includes('backdrop-filter: blur') },
  { name: 'Double-click listener present', test: html.includes("window.addEventListener('dblclick'") },
  { name: 'Touch double-tap listener present', test: html.includes('lastTapTimestamp') },
  { name: 'Cinematic mode class and toggle present', test: html.includes('cinematic-mode') && html.includes('toggleCinematicMode') },
  { name: 'Cinematic toggle header button present', test: html.includes('btn-cinematic-toggle') },
  { name: 'Cast images dictionary script tag included', test: html.includes('src="data/mcu-cast-images.js"') },
  { name: 'Movie stills dictionary script tag included', test: html.includes('src="data/mcu-movie-stills.js"') },
  { name: 'Series episodes dictionary script tag included', test: html.includes('src="data/mcu-series-episodes.js"') },
  { name: 'Series sub-info format separator present (no 20267 bug)', test: html.includes('sub-sep') && html.includes('formatCardSubInfo') },
  { name: 'Stills and Episodes tab present in modal', test: html.includes('modal-tab-gallery-btn') && html.includes('pane-gallery') },
  { name: 'Mobile media queries present', test: html.includes('@media (max-width: 860px)') }
];

let allPassed = true;
tests.forEach(t => {
  console.log((t.test ? '✓ PASS' : '✗ FAIL') + ' - ' + t.name);
  if (!t.test) allPassed = false;
});

if (!allPassed) process.exit(1);

// Validate script syntax
const scriptMatches = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
scriptMatches.forEach((m, idx) => {
  new vm.Script(m[1]);
  console.log(`✓ PASS - Inline JavaScript syntax validation (Script #${idx+1})`);
});

console.log('\nAll new enhancement verification tests passed with 100% success!');
