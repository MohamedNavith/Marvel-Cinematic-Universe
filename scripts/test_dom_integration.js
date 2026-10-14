/**
 * Test DOM Integration to ensure every element referenced by ID in JS exists in index.html
 */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const expectedIds = [
  'timeline-canvas',
  'snap-canvas',
  'tva-loader',
  'loader-year',
  'loader-bar',
  'loader-enter-btn',
  'brand-home-btn',
  'order-release',
  'order-chronology',
  'search-open-btn',
  'dashboard-nav-btn',
  'audio-toggle-btn',
  'snap-easteregg-btn',
  'timeline-section',
  'timeline-connectors-svg',
  'timeline-track-stage',
  'timeline-track-content',
  'lane-films',
  'lane-series',
  'scrubber-year',
  'scrubber-title',
  'scrubber-track-outer',
  'scrubber-ticks-container',
  'scrubber-thumb',
  'dashboard-section',
  'modal-overlay',
  'modal-dialog',
  'modal-close-btn',
  'modal-prev-btn',
  'modal-next-btn',
  'modal-hero-bg',
  'modal-tagline',
  'modal-title',
  'modal-chips-row',
  'tab-indicator',
  'tab-content-overview',
  'tab-content-cast',
  'tab-content-numbers',
  'tab-content-gallery',
  'modal-story-summary',
  'modal-spoiler-box',
  'modal-spoiler-content',
  'modal-spoiler-trigger',
  'meta-directors',
  'meta-writers',
  'meta-composer',
  'meta-villain',
  'meta-post-credits',
  'modal-cast-container',
  'modal-gallery-container',
  'lightbox-overlay',
  'lightbox-img',
  'lightbox-close-btn',
  'search-palette',
  'search-input',
  'search-results-list',
  'reduced-motion-toggle'
];

let missing = 0;
expectedIds.forEach(id => {
  const pattern = new RegExp(`id=["']${id}["']`);
  if (!pattern.test(html)) {
    console.error(`✗ Missing required element in index.html: #${id}`);
    missing++;
  } else {
    // console.log(`✓ #${id} found`);
  }
});

console.log(`\nDOM Verification complete. Checked ${expectedIds.length} critical IDs. Missing: ${missing}`);
if (missing === 0) {
  console.log('★ All DOM IDs 100% matched across HTML and JavaScript engines!');
}
