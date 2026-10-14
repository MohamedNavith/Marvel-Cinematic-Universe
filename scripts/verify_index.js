const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Extract script content
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
if (!scriptMatch) {
  console.error('No inline script found in index.html!');
  process.exit(1);
}

const scriptCode = scriptMatch[1];
try {
  // Test parsing via new Function
  new Function(scriptCode);
  console.log('Script syntax: 100% VALID! No syntax errors.');
} catch (err) {
  console.error('Syntax error in inline script:', err);
  process.exit(1);
}

// Check presence of key DOM elements
const requiredIds = [
  'timeline-canvas',
  'navbar',
  'open-search-btn',
  'audio-toggle-btn',
  'snap-toggle-btn',
  'console-dock',
  'btn-order-release',
  'btn-order-story',
  'dynamic-phases-root',
  'doomsday-showcase',
  'doomsday-clock',
  'cd-days',
  'cd-hours',
  'cd-mins',
  'cd-secs',
  'secret-wars-node',
  'analytics-grid',
  'modal-scrim',
  'modal-dialog',
  'modal-backdrop-img',
  'modal-title',
  'modal-phase-tag',
  'modal-chips',
  'tab-overview',
  'tab-economics',
  'tab-cast',
  'tab-connections',
  'search-scrim',
  'search-box',
  'search-results-container'
];

let missing = 0;
requiredIds.forEach(id => {
  if (!html.includes(`id="${id}"`)) {
    console.error('Missing ID:', id);
    missing++;
  }
});

if (missing === 0) {
  console.log(`All ${requiredIds.length} required DOM elements verified present!`);
} else {
  console.error(`${missing} required elements missing!`);
  process.exit(1);
}
