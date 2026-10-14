const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const checks = [
  { name: 'HTML closing tag', test: html.trim().endsWith('</html>') },
  { name: 'Contains Sacred Timeline title', test: html.includes('THE SACRED') },
  { name: 'Contains clean background image', test: html.includes('assets/img/sacred-timeline-citadel-clean.webp') },
  { name: 'Contains horizontal track', test: html.includes('id="horizontal-track"') },
  { name: 'Contains Phase navigation', test: html.includes('phase-scrubber-nav') },
  { name: 'Contains Two-row rendering function', test: html.includes('renderTwoRowTimeline') },
  { name: 'Contains vertical-to-horizontal sync', test: html.includes('syncHorizontalPosition') },
  { name: 'Contains Doomsday countdown', test: html.includes('initDoomsdayTimer') },
  { name: 'Contains Living Canvas aurora particles', test: html.includes('initLivingCanvas') },
  { name: 'Contains Detail Modal', test: html.includes('detail-modal-layer') },
  { name: 'Contains Search Palette', test: html.includes('search-modal-layer') },
  { name: 'Contains Layout Toggle', test: html.includes('btn-toggle-layout') },
  { name: 'Contains Type Filters', test: html.includes('filter-pill-strip') }
];

let allPassed = true;
checks.forEach(c => {
  console.log((c.test ? '✓ PASS' : '✗ FAIL') + ' - ' + c.name);
  if (!c.test) allPassed = false;
});

if (allPassed) {
  console.log('\nAll 13 integration checks passed successfully!');
} else {
  process.exit(1);
}
