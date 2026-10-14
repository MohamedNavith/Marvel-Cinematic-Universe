const fs = require('fs');
const path = require('path');

const tmdbMapping = require('./tmdb_real_images.json');
const mcuData = require('../data/mcu-data.js');

console.log('Building Studio-Grade Sacred Timeline Website...');
console.log('Entries:', mcuData.length);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Marvel Cinematic Universe — The Sacred Timeline</title>
<meta name="description" content="The definitive interactive archive of the Marvel Cinematic Universe. Explore every theatrical release, series, and timeline branch in studio-grade fidelity.">
<meta name="theme-color" content="#04080d">

<!-- Typography: Rajdhani (Display/Tech) + DM Sans (Clean Sans) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">

<style>
/* ============================================================
   DESIGN SYSTEM & DESIGN QUALITY DIRECTIVE SPECIFICATION
   Studio-grade aesthetic (Apple, Linear, Marvel Studios official).
   Strict palette, 8px grid, two fonts, zero emojis, unified SVGs.
   ============================================================ */

:root {
  /* Palette */
  --bg-void: #04080d;
  --bg-deep: #060b12;
  --bg-surface: rgba(9, 17, 26, 0.76);
  --bg-surface-elevated: rgba(14, 25, 38, 0.92);
  --bg-card: rgba(8, 15, 23, 0.85);

  --line: rgba(191, 228, 235, 0.14);
  --line-subtle: rgba(191, 228, 235, 0.08);
  --line-bright: rgba(155, 232, 227, 0.45);

  --cyan: #9be8e3;
  --cyan-bright: #b8ffff;
  --cyan-glow: rgba(155, 232, 227, 0.22);
  --amber: #baa576;
  --amber-glow: rgba(186, 165, 118, 0.25);
  --marvel-red: #e62429;

  --text-primary: #edf4f4;
  --text-secondary: #84919e;
  --text-tertiary: #52616d;
  --text-inverse: #04080d;

  /* Typography Scale */
  --font-display: 'Rajdhani', -apple-system, sans-serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 15px;
  --text-lg: 18px;
  --text-xl: 24px;
  --text-2xl: 36px;
  --text-3xl: 56px;
  --text-hero: clamp(56px, 9.5vw, 132px);

  /* Spacing (8px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  background-color: var(--bg-void);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: var(--bg-void);
  min-width: 320px;
  overflow-x: hidden;
  position: relative;
}

/* Subtle Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-void);
}
::-webkit-scrollbar-thumb {
  background: rgba(155, 232, 227, 0.2);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(155, 232, 227, 0.4);
}

button, input {
  font: inherit;
  color: inherit;
}
button {
  background: transparent;
  border: 0;
  cursor: pointer;
}
button:focus-visible, input:focus-visible {
  outline: 1px solid var(--cyan);
  outline-offset: 3px;
}

.modal-open {
  overflow: hidden;
}

/* ============================================================
   SHARED SVG ICON STYLES (Strict 1.5px stroke, no emojis)
   ============================================================ */
.icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  stroke: currentColor;
  flex-shrink: 0;
}

/* ============================================================
   HEADER & TOP NAVIGATION
   ============================================================ */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  padding: 0 clamp(24px, 5vw, 80px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  z-index: 100;
  border-bottom: 1px solid var(--line-subtle);
  background: linear-gradient(180deg, rgba(4, 8, 13, 0.88) 0%, rgba(4, 8, 13, 0.6) 100%);
  backdrop-filter: blur(20px);
  transition: background var(--duration-normal) var(--ease-out);
}

.wordmark {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  width: fit-content;
}
.marvel-mark {
  background: var(--marvel-red);
  color: #ffffff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  letter-spacing: -0.02em;
  padding: 4px 6px 3px;
  border-radius: 2px;
}
.wordmark-copy {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 11px;
  line-height: 0.9;
  letter-spacing: 0.16em;
  color: #edf4f4;
  text-transform: uppercase;
}

.site-header nav {
  display: flex;
  gap: 36px;
  height: 100%;
}
.site-header nav button {
  position: relative;
  padding: 0;
  text-transform: uppercase;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.24em;
  color: var(--text-secondary);
  transition: color var(--duration-fast) var(--ease-out);
}
.site-header nav button::after {
  content: "";
  position: absolute;
  height: 1px;
  left: 0;
  right: 100%;
  bottom: 24px;
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
  transition: right var(--duration-normal) var(--ease-out);
}
.site-header nav button.active,
.site-header nav button:hover {
  color: var(--text-primary);
}
.site-header nav button.active::after {
  right: 0;
}

.header-actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon-button {
  width: 40px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 4px;
  display: grid;
  place-items: center;
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}
.icon-button:hover {
  color: var(--cyan);
  border-color: var(--line-bright);
  background: rgba(155, 232, 227, 0.06);
}
.icon-button.active {
  color: var(--cyan);
  border-color: var(--cyan);
  background: rgba(155, 232, 227, 0.1);
}

/* ============================================================
   HERO SECTION (Exact Citadel at the End of Time & Time Loom)
   ============================================================ */
.hero {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
  padding: 100px 24px 80px;
  background: radial-gradient(circle at 50% 45%, #142a3a 0%, #081522 30%, var(--bg-void) 70%);
}

.hero-citadel {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  opacity: 0.65;
  filter: saturate(0.8) contrast(1.15);
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgba(124, 191, 211, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124, 191, 211, 0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: linear-gradient(to bottom, black 20%, transparent 85%);
  pointer-events: none;
}

.hero-nebula {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse at 50% 55%, rgba(107, 210, 226, 0.14), transparent 45%),
    radial-gradient(ellipse at 72% 40%, rgba(123, 72, 162, 0.16), transparent 40%);
  mix-blend-mode: screen;
  pointer-events: none;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(4, 8, 13, 0.65) 0%, transparent 30%, transparent 70%, rgba(4, 8, 13, 0.65) 100%),
    linear-gradient(180deg, rgba(4, 8, 13, 0.4) 0%, transparent 30%, transparent 65%, var(--bg-void) 100%);
}

/* Time Loom Canvas (Flowing horizontal temporal strand) */
.time-loom {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.95;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 820px;
  padding: 0 20px;
  margin-top: -20px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--text-xs);
  letter-spacing: 0.32em;
  color: #a8c3c7;
  text-transform: uppercase;
  margin-bottom: 24px;
}
.eyebrow::before,
.eyebrow::after {
  content: "";
  width: 28px;
  height: 1px;
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
}

.hero-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--text-hero);
  line-height: 0.85;
  letter-spacing: -0.04em;
  color: #edf2f0;
  text-shadow: 0 6px 30px rgba(0, 0, 0, 0.8);
  text-transform: uppercase;
}

.hero-title em {
  display: block;
  font-style: normal;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(185, 229, 231, 0.85);
  text-shadow: 0 0 30px rgba(105, 221, 228, 0.25);
  letter-spacing: -0.02em;
}

.hero-intro {
  max-width: 520px;
  margin: 28px auto 36px;
  color: #9cb0bc;
  font-size: var(--text-base);
  line-height: 1.65;
  text-wrap: balance;
}

.explore-button {
  margin: 0 auto;
  min-width: 260px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  text-align: left;
  gap: 14px;
  color: #eaf2f1;
  border: 1px solid rgba(195, 229, 229, 0.25);
  background: rgba(5, 15, 23, 0.65);
  padding: 10px 18px 10px 10px;
  border-radius: 4px;
  backdrop-filter: blur(12px);
  transition: all var(--duration-normal) var(--ease-out);
}
.explore-button:hover {
  transform: translateY(-2px);
  border-color: var(--cyan);
  background: rgba(8, 22, 33, 0.85);
  box-shadow: 0 10px 30px rgba(83, 209, 218, 0.15);
}
.explore-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(155, 232, 227, 0.4);
  border-radius: 2px;
  color: var(--cyan);
}
.explore-button small {
  display: block;
  color: #778891;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.explore-button strong {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Hero Footer Status Bar */
.hero-footer {
  position: absolute;
  z-index: 3;
  bottom: 28px;
  left: clamp(24px, 5vw, 80px);
  right: clamp(24px, 5vw, 80px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
}
.hero-footer-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.hero-num-large {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 32px;
  line-height: 1;
  color: #9cb0bc;
}
.hero-footer-item p {
  margin: 0;
  color: #60717c;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 9px;
  line-height: 1.5;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.hero-footer-item strong {
  color: #b7c5ca;
  font-weight: 600;
}
.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #61727b;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition: color var(--duration-fast);
}
.scroll-indicator:hover {
  color: var(--cyan);
}
.scroll-indicator i {
  display: block;
  width: 1px;
  height: 28px;
  background: linear-gradient(180deg, var(--cyan), transparent);
}
.hero-counter {
  justify-self: end;
  text-align: right;
  flex-direction: row-reverse;
}

/* ============================================================
   INTERACTIVE TIMELINE CONTROL BAR
   ============================================================ */
.timeline-control-bar {
  position: sticky;
  top: 80px;
  z-index: 90;
  background: rgba(4, 8, 13, 0.94);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--line);
  padding: 14px clamp(24px, 5vw, 80px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.view-mode-group,
.filter-button-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: all var(--duration-fast) var(--ease-out);
}
.toggle-chip:hover {
  color: var(--text-primary);
  border-color: var(--line-bright);
}
.toggle-chip.active {
  color: var(--bg-void);
  background: var(--cyan);
  border-color: var(--cyan);
  box-shadow: 0 0 12px var(--cyan-glow);
}

.filter-chip {
  padding: 6px 14px;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: all var(--duration-fast) var(--ease-out);
}
.filter-chip:hover {
  color: var(--text-primary);
}
.filter-chip.active {
  color: var(--cyan);
  border-bottom-color: var(--cyan);
}

.timeline-counter-badge {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

/* ============================================================
   ERA RAIL (PHASE JUMP BUTTONS)
   ============================================================ */
.era-rail {
  padding: 24px clamp(24px, 5vw, 80px) 0;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
}
.era-rail::-webkit-scrollbar {
  display: none;
}
.era-btn {
  flex: 0 0 160px;
  text-align: left;
  padding: 0 16px 12px 0;
  border-bottom: 1px solid var(--line);
  transition: border-color var(--duration-fast);
}
.era-btn span {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.15em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}
.era-btn strong {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  margin-top: 2px;
}
.era-btn:hover strong {
  color: var(--text-primary);
}
.era-btn.active {
  border-bottom-color: var(--cyan);
}
.era-btn.active span {
  color: var(--cyan);
}
.era-btn.active strong {
  color: #ffffff;
}

/* ============================================================
   TIMELINE SECTION & CONTENT GRIDS
   ============================================================ */
.timeline-section {
  min-height: 100vh;
  padding: 40px clamp(24px, 5vw, 80px) 120px;
  position: relative;
}

.phase-block {
  margin-bottom: 72px;
}
.phase-header-banner {
  padding: 24px 0 18px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}
.phase-header-left span {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.28em;
  color: var(--cyan);
  text-transform: uppercase;
}
.phase-header-left h2 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4vw, 44px);
  letter-spacing: 0.02em;
  color: #ffffff;
  line-height: 1;
  margin-top: 6px;
  text-transform: uppercase;
}
.phase-narrative-copy {
  max-width: 480px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
}

/* The Cards Grid (Responsive, pristine) */
.timeline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 28px 20px;
}

/* ============================================================
   CARD COMPONENT ARCHITECTURE (STUDIO GRADE)
   ============================================================ */
.mcu-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform var(--duration-slow) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-slow) var(--ease-out);
}
.mcu-card:hover {
  transform: translateY(-6px);
  border-color: var(--line-bright);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px var(--cyan-glow);
}

.card-poster-frame {
  position: relative;
  aspect-ratio: 2 / 3;
  width: 100%;
  background: #081018;
  overflow: hidden;
}
.card-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--duration-slow) var(--ease-out);
}
.mcu-card:hover .card-poster-img {
  transform: scale(1.04);
}

.poster-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(4, 8, 13, 0.95) 100%);
  pointer-events: none;
}

/* Top Badges */
.card-top-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  pointer-events: none;
}
.format-pill {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 2px;
  background: rgba(4, 8, 13, 0.82);
  backdrop-filter: blur(8px);
  border: 1px solid var(--line);
}
.format-pill.film { color: var(--cyan); }
.format-pill.series { color: #caa2f5; }
.format-pill.special { color: #7fe49b; }
.format-pill.teaser { color: var(--amber); }

.rating-pill {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 2px;
  background: rgba(4, 8, 13, 0.85);
  border: 1px solid var(--line);
  color: #edf4f4;
}

/* Card Body */
.card-meta-body {
  padding: 16px 16px 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.chrono-label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--cyan);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.card-item-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: 0.04em;
  color: #edf4f4;
  margin-bottom: 6px;
  text-transform: uppercase;
  transition: color var(--duration-fast);
}
.mcu-card:hover .card-item-title {
  color: var(--cyan);
}
.card-subtext {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}
.dot-sep {
  width: 3px;
  height: 3px;
  background: var(--text-tertiary);
  border-radius: 50%;
}
.card-bottom-stat {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--line-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-xs);
}
.stat-prominent {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
  letter-spacing: 0.05em;
}
.stat-sub {
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ============================================================
   AVENGERS: DOOMSDAY MONOLITH SECTION
   ============================================================ */
.doomsday-module {
  position: relative;
  margin: 60px 0;
  padding: 56px clamp(24px, 5vw, 64px);
  background: radial-gradient(circle at 80% 20%, rgba(155, 232, 227, 0.08) 0%, transparent 55%),
              rgba(7, 14, 22, 0.9);
  border: 1px solid var(--line);
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 48px;
  align-items: center;
}
.doomsday-eyebrow {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--cyan);
  text-transform: uppercase;
  margin-bottom: 12px;
}
.doomsday-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(38px, 5.5vw, 64px);
  line-height: 0.95;
  letter-spacing: 0.02em;
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 18px;
}
.doomsday-copy {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 28px;
}
.countdown-strip {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.clock-cell {
  background: rgba(4, 8, 13, 0.8);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 14px 20px;
  min-width: 90px;
  text-align: center;
}
.clock-value {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 36px;
  line-height: 1;
  color: var(--cyan);
}
.clock-tag {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-top: 4px;
}

/* Secret Wars Node */
.secret-wars-node {
  text-align: center;
  padding: 64px 24px;
  margin: 40px 0 60px;
  border: 1px dashed var(--line);
  border-radius: 4px;
  background: rgba(7, 14, 22, 0.4);
}
.secret-wars-node span {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.28em;
  color: #caa2f5;
  text-transform: uppercase;
}
.secret-wars-node h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(32px, 5vw, 52px);
  color: #ffffff;
  margin-top: 8px;
  text-transform: uppercase;
}
.secret-wars-node p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  max-width: 500px;
  margin: 12px auto 0;
}

/* ============================================================
   ARCHIVE METRICS / STATS SECTION
   ============================================================ */
.stats-banner {
  padding: 80px clamp(24px, 5vw, 80px);
  background: var(--bg-deep);
  border-top: 1px solid var(--line);
}
.stats-banner-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--cyan);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.stats-banner-head {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(32px, 4vw, 48px);
  color: #ffffff;
  margin-bottom: 36px;
  text-transform: uppercase;
}
.metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.metric-box {
  background: var(--bg-surface);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.metric-box strong {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 44px;
  line-height: 1;
  color: #ffffff;
}
.metric-box span {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-top: 12px;
}
.metric-box small {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  margin-top: 4px;
}

/* ============================================================
   FOOTER (ARCHIVE CREDITS & METHODOLOGY)
   ============================================================ */
.site-footer {
  padding: 60px clamp(24px, 5vw, 80px) 80px;
  border-top: 1px solid var(--line);
  background: var(--bg-void);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
}
.footer-center {
  text-align: center;
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  line-height: 1.6;
}
.back-to-top {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  text-transform: uppercase;
  transition: color var(--duration-fast);
}
.back-to-top:hover {
  color: var(--cyan);
}

/* ============================================================
   MODAL DIALOG (STUDIO LIGHTBOX & CODEX)
   ============================================================ */
.modal-layer {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: grid;
  place-items: center;
  padding: 3vh 3vw;
  background: rgba(3, 7, 12, 0.88);
  backdrop-filter: blur(20px);
  opacity: 0;
  visibility: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}
.modal-layer.is-open {
  opacity: 1;
  visibility: visible;
}

.detail-modal {
  position: relative;
  width: min(1040px, 94vw);
  max-height: 90vh;
  background: #080f17;
  border: 1px solid var(--line-bright);
  border-radius: 4px;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: scale(0.95);
  transition: transform var(--duration-normal) var(--ease-out);
}
.modal-layer.is-open .detail-modal {
  transform: scale(1);
}

.modal-header-visual {
  position: relative;
  height: 320px;
  width: 100%;
  flex-shrink: 0;
  background: #060b11;
  overflow: hidden;
}
.modal-backdrop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.modal-backdrop-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(4, 8, 13, 0.3) 0%, transparent 40%, #080f17 100%),
    radial-gradient(circle at 80% 20%, transparent 40%, rgba(4, 8, 13, 0.8) 100%);
}

.modal-close-trigger {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: rgba(4, 8, 13, 0.7);
  color: var(--text-primary);
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 10;
  transition: all var(--duration-fast);
}
.modal-close-trigger:hover {
  background: var(--marvel-red);
  border-color: var(--marvel-red);
  color: #fff;
}

.modal-header-titles {
  position: absolute;
  bottom: 24px;
  left: 36px;
  right: 36px;
  z-index: 5;
}
.modal-era-tag {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.26em;
  color: var(--cyan);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.modal-main-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4vw, 44px);
  color: #ffffff;
  line-height: 1.05;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.modal-chips-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.m-chip {
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--line);
  border-radius: 2px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

/* Modal Content & Tabs */
.modal-body-scroller {
  padding: 24px 36px 40px;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-tabs-nav {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 28px;
}
.m-tab-btn {
  padding: 0 0 12px;
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border-bottom: 2px solid transparent;
  transition: all var(--duration-fast);
}
.m-tab-btn:hover {
  color: var(--text-primary);
}
.m-tab-btn.active {
  color: var(--cyan);
  border-bottom-color: var(--cyan);
}

.tab-panel {
  display: none;
}
.tab-panel.active {
  display: block;
}

/* Overview Tab Details */
.synopsis-text {
  font-size: var(--text-base);
  line-height: 1.75;
  color: #d1dde5;
  margin-bottom: 24px;
  max-width: 780px;
}

.spoiler-toggle-box {
  border: 1px solid rgba(230, 36, 41, 0.3);
  border-radius: 4px;
  background: rgba(230, 36, 41, 0.04);
  margin-bottom: 28px;
  overflow: hidden;
}
.spoiler-header-trigger {
  width: 100%;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: #ff6b6e;
  text-transform: uppercase;
}
.spoiler-reveal-body {
  display: none;
  padding: 0 18px 18px;
  font-size: var(--text-sm);
  line-height: 1.7;
  color: #c9d8e2;
}
.spoiler-reveal-body.is-shown {
  display: block;
}

.meta-grid-two-col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}
.meta-field-cell {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--line-subtle);
  border-radius: 2px;
  padding: 14px 16px;
}
.meta-field-label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.meta-field-value {
  font-size: var(--text-sm);
  color: #ffffff;
  font-weight: 500;
}

/* Box Office & Metrics Tab */
.metrics-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}
.stat-item-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--line-subtle);
  border-radius: 2px;
  padding: 18px;
  text-align: center;
}
.stat-item-tag {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.stat-item-number {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 28px;
  color: var(--cyan);
}

/* Cast Tab */
.cast-scroller-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px 14px;
}
.cast-tile {
  text-align: center;
}
.cast-avatar-frame {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 8px;
  display: block;
  border: 1px solid var(--line);
  background: #0f1822;
}
.cast-actor-label {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
}
.cast-character-label {
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* External Link Actions */
.modal-footer-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}
.action-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid var(--line);
  border-radius: 2px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-primary);
  text-decoration: none;
  transition: all var(--duration-fast);
}
.action-link-btn:hover {
  background: rgba(155, 232, 227, 0.1);
  border-color: var(--cyan);
  color: var(--cyan);
}
.action-link-btn.primary {
  background: #113ccf;
  border-color: #113ccf;
  color: #fff;
}
.action-link-btn.primary:hover {
  background: #1f4ff2;
}

/* ============================================================
   SEARCH COMMAND PALETTE (CTRL+K)
   ============================================================ */
.search-palette-layer {
  position: fixed;
  inset: 0;
  z-index: 600;
  background: rgba(3, 7, 12, 0.85);
  backdrop-filter: blur(16px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: min(12vh, 120px) 20px 20px;
  opacity: 0;
  visibility: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}
.search-palette-layer.is-open {
  opacity: 1;
  visibility: visible;
}

.search-command-box {
  width: min(640px, 100%);
  background: #091018;
  border: 1px solid var(--cyan);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.95), 0 0 30px var(--cyan-glow);
}
.search-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
}
.search-input-row input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 16px;
  color: #ffffff;
  outline: none;
}
.search-input-row input::placeholder {
  color: var(--text-tertiary);
}
.kbd-chip {
  padding: 2px 6px;
  border: 1px solid var(--line);
  border-radius: 2px;
  font-size: 10px;
  font-family: monospace;
  color: var(--text-secondary);
}

.search-results-viewport {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
}
.search-hit-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background var(--duration-fast);
}
.search-hit-row:hover {
  background: rgba(155, 232, 227, 0.08);
}
.search-hit-thumb {
  width: 38px;
  height: 54px;
  object-fit: cover;
  border-radius: 2px;
  background: #050a10;
  flex-shrink: 0;
}
.search-hit-info strong {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.04em;
  color: #ffffff;
  text-transform: uppercase;
}
.search-hit-info span {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

/* ============================================================
   RESPONSIVE DESIGN SYSTEM
   ============================================================ */
@media (max-width: 900px) {
  .site-header nav {
    display: none;
  }
  .doomsday-module {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 640px) {
  .hero-footer {
    grid-template-columns: 1fr auto;
  }
  .hero-counter {
    display: none;
  }
  .timeline-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
  .site-footer {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .back-to-top {
    justify-self: center;
  }
  .modal-header-visual {
    height: 220px;
  }
  .modal-body-scroller {
    padding: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
</head>
<body>

<!-- Header Navigation -->
<header class="site-header" id="site-header">
  <a href="#" class="wordmark" aria-label="Marvel Cinematic Universe Home">
    <span class="marvel-mark">MARVEL</span>
    <span class="wordmark-copy">CINEMATIC<br>UNIVERSE</span>
  </a>

  <nav aria-label="Primary Navigation">
    <button class="active" id="nav-btn-timeline" onclick="scrollToSection('timeline')">Timeline</button>
    <button id="nav-btn-archive" onclick="setArchiveView(); scrollToSection('timeline')">Archive</button>
  </nav>

  <div class="header-actions">
    <button class="icon-button" id="search-trigger-btn" aria-label="Search Multiverse Archive (Ctrl+K)" title="Search (Ctrl+K)">
      <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    </button>
    <button class="icon-button" id="audio-trigger-btn" aria-label="Toggle Ambient Audio" title="Ambient Temporal Hum">
      <svg class="icon" id="audio-icon-elem" viewBox="0 0 24 24"><path d="M4 14h4l5 4V6l-5 4H4z"/><path d="m17 10 5 5m0-5-5 5"/></svg>
    </button>
  </div>
</header>

<!-- Hero Section: Citadel at the End of Time -->
<section class="hero" id="hero-citadel" aria-labelledby="hero-title">
  <img class="hero-citadel" src="assets/img/citadel-at-the-end-of-time.png" alt="The Citadel at the End of Time">
  <div class="hero-nebula"></div>
  <canvas class="time-loom" id="time-loom-canvas" aria-hidden="true"></canvas>

  <div class="hero-content">
    <p class="eyebrow">EARTH-616 · TEMPORAL ARCHIVE</p>
    <h1 class="hero-title" id="hero-title">THE SACRED<br><em>TIMELINE</em></h1>
    <p class="hero-intro">Every story. Every sacrifice. One universe — until it wasn't.</p>

    <button class="explore-button" onclick="scrollToSection('timeline')">
      <span class="explore-icon">
        <svg class="icon" style="width:14px;height:14px" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>
      </span>
      <span>
        <small>BEGIN THE JOURNEY</small>
        <strong>Enter the timeline</strong>
      </span>
      <svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>
    </button>
  </div>

  <div class="hero-footer">
    <div class="hero-footer-item">
      <span class="hero-num-large">01</span>
      <p>FROM THE BEGINNING<br><strong>IRON MAN · 2008</strong></p>
    </div>

    <button class="scroll-indicator" onclick="scrollToSection('timeline')">
      <span>SCROLL TO EXPLORE</span>
      <i></i>
    </button>

    <div class="hero-footer-item hero-counter">
      <span class="hero-num-large">70</span>
      <p>STORIES CATALOGUED<br><strong>19 YEARS · 1 TIMELINE</strong></p>
    </div>
  </div>
</section>

<!-- Timeline Control Bar -->
<div class="timeline-control-bar" id="timeline-controls">
  <div class="view-mode-group">
    <button class="toggle-chip active" id="chip-mode-chronological" onclick="switchOrderMode('story')">
      <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>
      <span>Story Chronology</span>
    </button>
    <button class="toggle-chip" id="chip-mode-release" onclick="switchOrderMode('release')">
      <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <span>Release Order</span>
    </button>
  </div>

  <div class="filter-button-group">
    <button class="filter-chip active" onclick="setCatalogFilter('all', this)">All Stories (70)</button>
    <button class="filter-chip" onclick="setCatalogFilter('film', this)">Feature Films (40)</button>
    <button class="filter-chip" onclick="setCatalogFilter('series', this)">Series & Specials (30)</button>
  </div>

  <div class="timeline-counter-badge" id="catalog-counter-text">Displaying 70 Chapters</div>
</div>

<!-- Era Rail (Phases 1-6) -->
<nav class="era-rail" id="era-rail" aria-label="Era Jump Navigation">
  <button class="era-btn active" onclick="jumpToPhase(null, this)">
    <span>ALL ERAS</span>
    <strong>Sacred Timeline</strong>
  </button>
  <button class="era-btn" onclick="jumpToPhase(1, this)">
    <span>PHASE 1 · 2008–2012</span>
    <strong>Assemble</strong>
  </button>
  <button class="era-btn" onclick="jumpToPhase(2, this)">
    <span>PHASE 2 · 2013–2015</span>
    <strong>Expansion</strong>
  </button>
  <button class="era-btn" onclick="jumpToPhase(3, this)">
    <span>PHASE 3 · 2016–2019</span>
    <strong>Apex</strong>
  </button>
  <button class="era-btn" onclick="jumpToPhase(4, this)">
    <span>PHASE 4 · 2021–2022</span>
    <strong>Fracture</strong>
  </button>
  <button class="era-btn" onclick="jumpToPhase(5, this)">
    <span>PHASE 5 · 2023–2025</span>
    <strong>Invasion</strong>
  </button>
  <button class="era-btn" onclick="jumpToPhase(6, this)">
    <span>PHASE 6 · 2025–2027</span>
    <strong>Convergence</strong>
  </button>
</nav>

<!-- Main Timeline Section -->
<main class="timeline-section" id="timeline">
  <!-- Dynamic Phase Containers rendered by JS -->
  <div id="timeline-catalog-root"></div>

  <!-- Doomsday Monolith -->
  <section class="doomsday-module" id="doomsday-showcase">
    <div>
      <div class="doomsday-eyebrow">PHASE 6 · MULTIVERSAL MILESTONE</div>
      <h2 class="doomsday-title">AVENGERS:<br>DOOMSDAY</h2>
      <p class="doomsday-copy">
        The culmination of the Multiverse Saga. Robert Downey Jr. makes his return to the Marvel Cinematic Universe as Victor von Doom, directed by Anthony and Joe Russo.
      </p>
      <div class="countdown-strip">
        <div class="clock-cell"><div class="clock-value" id="timer-days">---</div><div class="clock-tag">Days</div></div>
        <div class="clock-cell"><div class="clock-value" id="timer-hours">--</div><div class="clock-tag">Hours</div></div>
        <div class="clock-cell"><div class="clock-value" id="timer-mins">--</div><div class="clock-tag">Minutes</div></div>
        <div class="clock-cell"><div class="clock-value" id="timer-secs">--</div><div class="clock-tag">Seconds</div></div>
      </div>
    </div>
    <div style="display: flex; justify-content: center;">
      <div class="mcu-card" style="width: 260px;" onclick="openEntryDetail('avengers-doomsday')">
        <div class="card-poster-frame">
          <img class="card-poster-img" src="https://image.tmdb.org/t/p/w780/pzIddUEMWhSEqEFq8B3PKYB32Wm.jpg" alt="Avengers: Doomsday Poster">
          <div class="poster-scrim"></div>
          <div class="card-top-tags">
            <span class="format-pill teaser">UPCOMING</span>
            <span class="rating-pill">DEC 2026</span>
          </div>
        </div>
        <div class="card-meta-body">
          <div class="chrono-label">DECEMBER 18, 2026</div>
          <div class="card-item-title">Avengers: Doomsday</div>
          <div class="card-subtext">
            <span>Russo Brothers</span>
            <span class="dot-sep"></span>
            <span>Feature</span>
          </div>
          <div class="card-bottom-stat">
            <span class="stat-prominent">Robert Downey Jr.</span>
            <span class="stat-sub">Victor von Doom</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Secret Wars Teaser Node -->
  <section class="secret-wars-node">
    <span>THE UNWRITTEN BEYOND · DECEMBER 17, 2027</span>
    <h3>AVENGERS: SECRET WARS</h3>
    <p>The collapse of all realities. Time fractures into Battleworld.</p>
  </section>
</main>

<!-- Metrics & Financial Analytics Banner -->
<section class="stats-banner" id="stats-banner">
  <div class="stats-banner-title">TEMPORAL ARCHIVE METRICS</div>
  <h2 class="stats-banner-head">THE MULTIVERSE IN NUMBERS</h2>
  <div class="metrics-row" id="metrics-stat-row">
    <!-- Generated by JS -->
  </div>
</section>

<!-- Footer -->
<footer class="site-footer">
  <div class="wordmark">
    <span class="marvel-mark">MARVEL</span>
    <span class="wordmark-copy">CINEMATIC<br>UNIVERSE</span>
  </div>
  <div class="footer-center">
    Official archival documentation. Imagery © Marvel Studios & Walt Disney Studios.<br>
    Box office metrics verified via Box Office Mojo and The Numbers (data active through October 2026).
  </div>
  <button class="back-to-top" onclick="window.scrollTo({top:0,behavior:'smooth'})">
    <span>Return to beginning</span>
    <svg class="icon" viewBox="0 0 24 24"><path d="M12 19V5m-7 7 7-7 7 7"/></svg>
  </button>
</footer>

<!-- Immersive Detail Modal -->
<div class="modal-layer" id="detail-modal-layer" role="dialog" aria-modal="true" onclick="if(event.target===this) closeEntryDetail()">
  <div class="detail-modal" id="detail-modal-box">
    <button class="modal-close-trigger" onclick="closeEntryDetail()" aria-label="Close dialog">
      <svg class="icon" viewBox="0 0 24 24"><path d="m18 6-12 12M6 6l12 12"/></svg>
    </button>

    <div class="modal-header-visual">
      <img class="modal-backdrop-image" id="modal-bg-img" src="" alt="">
      <div class="modal-backdrop-scrim"></div>
      <div class="modal-header-titles">
        <div class="modal-era-tag" id="modal-tag-era"></div>
        <h2 class="modal-main-title" id="modal-item-title"></h2>
        <div class="modal-chips-strip" id="modal-chips-strip"></div>
      </div>
    </div>

    <div class="modal-body-scroller">
      <div class="modal-tabs-nav">
        <button class="m-tab-btn active" data-tab="overview" onclick="switchModalPane('overview')">Overview</button>
        <button class="m-tab-btn" data-tab="metrics" onclick="switchModalPane('metrics')">Metrics & Box Office</button>
        <button class="m-tab-btn" data-tab="cast" onclick="switchModalPane('cast')">Cast & Ensemble</button>
        <button class="m-tab-btn" data-tab="links" onclick="switchModalPane('links')">Connected Branches</button>
      </div>

      <div class="tab-panel active" id="pane-overview"></div>
      <div class="tab-panel" id="pane-metrics"></div>
      <div class="tab-panel" id="pane-cast"></div>
      <div class="tab-panel" id="pane-links"></div>
    </div>
  </div>
</div>

<!-- Search Command Palette -->
<div class="search-palette-layer" id="search-modal-layer" onclick="if(event.target===this) closeSearchModal()">
  <div class="search-command-box">
    <div class="search-input-row">
      <svg class="icon" style="color:var(--cyan)" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input type="text" id="search-query-field" placeholder="Search films, series, characters, directors, villains..." autocomplete="off">
      <span class="kbd-chip">ESC</span>
    </div>
    <div class="search-results-viewport" id="search-results-viewport"></div>
  </div>
</div>

<!-- Data dependencies -->
<script src="data/mcu-data.js"></script>
<script src="data/tmdb-images.js"></script>
<script>
/* ============================================================
   CLIENT APPLICATION RUNTIME (VANILLA JAVASCRIPT)
   Studio-grade reliability, zero frameworks, 100% file:// compatible
   ============================================================ */
(function() {
  'use strict';

  const DATA = Array.isArray(window.MCU_DATA) ? window.MCU_DATA : [];
  const TMDB_CDN_MAP = window.TMDB_IMAGES || {};

  // State
  let activeOrder = 'story'; // 'story' | 'release'
  let activeFormat = 'all';  // 'all' | 'film' | 'series'
  let activePhaseFilter = null; // null | 1 | 2 | 3 | 4 | 5 | 6

  // Verified Image Resolution Helper
  function getPosterPath(item) {
    if (TMDB_CDN_MAP[item.id] && TMDB_CDN_MAP[item.id].poster) {
      return 'https://image.tmdb.org/t/p/w780' + TMDB_CDN_MAP[item.id].poster;
    }
    if (item.tmdbPoster) {
      return 'https://image.tmdb.org/t/p/w780' + item.tmdbPoster;
    }
    if (item.posterAssets && item.posterAssets.display) {
      return item.posterAssets.display;
    }
    return '';
  }

  function getBackdropPath(item) {
    if (TMDB_CDN_MAP[item.id] && TMDB_CDN_MAP[item.id].backdrop) {
      return 'https://image.tmdb.org/t/p/w1280' + TMDB_CDN_MAP[item.id].backdrop;
    }
    if (item.tmdbBackdrop) {
      return 'https://image.tmdb.org/t/p/w1280' + item.tmdbBackdrop;
    }
    if (item.backdropAssets && item.backdropAssets.display) {
      return item.backdropAssets.display;
    }
    return getPosterPath(item);
  }

  // Phase Metadata
  const ERAS = [
    {
      phase: 1,
      years: '2008–2012',
      label: 'PHASE ONE: ASSEMBLE',
      tagline: 'The dawn of heroes. Six strangers become Earth\\'s Mightiest defense.',
      id: 'phase-1'
    },
    {
      phase: 2,
      years: '2013–2015',
      label: 'PHASE TWO: EXPANSION',
      tagline: 'Shattered shields, fallen gods, and cosmic borders opened to the galaxy.',
      id: 'phase-2'
    },
    {
      phase: 3,
      years: '2016–2019',
      label: 'PHASE THREE: APEX',
      tagline: 'Ideological fracture, the cosmic crusade of Thanos, and the Infinity Endgame.',
      id: 'phase-3'
    },
    {
      phase: 4,
      years: '2021–2022',
      label: 'PHASE FOUR: FRACTURE',
      tagline: 'The Multiverse cracks open. Ancient mythologies and variant realities awaken.',
      id: 'phase-4'
    },
    {
      phase: 5,
      years: '2023–2025',
      label: 'PHASE FIVE: INVASION',
      tagline: 'Subatomic realms, secret incursions, and the countdown to Doomsday.',
      id: 'phase-5'
    },
    {
      phase: 6,
      years: '2025–2027',
      label: 'PHASE SIX: CONVERGENCE',
      tagline: 'The Sacred Timeline collapses under Doctor Doom. The march to Secret Wars.',
      id: 'phase-6'
    }
  ];

  // Filtering & Sorting
  function getPreparedEntries() {
    let list = [...DATA];

    // Format Filter
    if (activeFormat === 'film') {
      list = list.filter(e => e.type === 'film' || e.type === 'teaser');
    } else if (activeFormat === 'series') {
      list = list.filter(e => e.type === 'series' || e.type === 'special');
    }

    // Phase Filter
    if (activePhaseFilter !== null) {
      list = list.filter(e => e.phase === activePhaseFilter);
    }

    // Order
    if (activeOrder === 'story') {
      list.sort((a, b) => (a.chronologyOrder || 999) - (b.chronologyOrder || 999));
    } else {
      list.sort((a, b) => {
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      });
    }

    return list;
  }

  // Render Catalog
  function renderCatalog() {
    const root = document.getElementById('timeline-catalog-root');
    const items = getPreparedEntries();

    document.getElementById('catalog-counter-text').textContent =
      \`Displaying \${items.length} of \${DATA.length} Chapters\`;

    if (activeOrder === 'story') {
      root.innerHTML = \`
        <div class="phase-block">
          <div class="phase-header-banner">
            <div class="phase-header-left">
              <span>IN-UNIVERSE CHRONOLOGY</span>
              <h2>THE CANONICAL STORY STREAM</h2>
            </div>
            <p class="phase-narrative-copy">
              Organized by chronological occurrence in Marvel Cinematic Universe history — from Steve Rogers in 1942 to the Multiverse branches.
            </p>
          </div>
          <div class="timeline-grid">
            \${items.map(e => createCardHTML(e)).join('')}
          </div>
        </div>
      \`;
    } else {
      let markup = '';
      ERAS.forEach(era => {
        const eraItems = items.filter(e => e.phase === era.phase);
        if (eraItems.length === 0) return;

        markup += \`
          <div class="phase-block" id="\${era.id}">
            <div class="phase-header-banner">
              <div class="phase-header-left">
                <span>PHASE \${era.phase} · \${era.years}</span>
                <h2>\${era.label}</h2>
              </div>
              <p class="phase-narrative-copy">\${era.tagline}</p>
            </div>
            <div class="timeline-grid">
              \${eraItems.map(e => createCardHTML(e)).join('')}
            </div>
          </div>
        \`;
      });
      root.innerHTML = markup;
    }
  }

  function createCardHTML(item) {
    const poster = getPosterPath(item);
    const releaseYear = item.releaseDate ? item.releaseDate.substring(0, 4) : 'TBD';
    const ratingStr = item.imdbRating ? \`★ \${item.imdbRating}\` : (item.isUpcoming ? 'SOON' : '—');
    const typeClass = item.type === 'film' ? 'film' : item.type === 'series' ? 'series' : item.type === 'special' ? 'special' : 'teaser';
    const typeLabel = item.type === 'film' ? 'FILM' : item.type === 'series' ? 'SERIES' : item.type === 'special' ? 'SPECIAL' : 'UPCOMING';
    const chronoTag = item.inUniverseYear ? \`Story: \${item.inUniverseYear}\` : \`Era: \${releaseYear}\`;
    const director = (item.directors && item.directors.length > 0) ? item.directors[0] : (item.network || 'Marvel Studios');

    let bottomStat = '';
    if (item.worldwideGross) {
      bottomStat = \`
        <span class="stat-prominent">$\${(item.worldwideGross / 1e9).toFixed(2)}B</span>
        <span class="stat-sub">\${item.rtCritics ? item.rtCritics + '% RT' : 'GLOBAL'}</span>
      \`;
    } else if (item.episodes) {
      bottomStat = \`
        <span class="stat-prominent">\${item.episodes} EPS</span>
        <span class="stat-sub">DISNEY+</span>
      \`;
    } else {
      bottomStat = \`
        <span class="stat-prominent">SOON</span>
        <span class="stat-sub">\${releaseYear}</span>
      \`;
    }

    return \`
      <article class="mcu-card" onclick="openEntryDetail('\${item.id}')">
        <div class="card-poster-frame">
          <img class="card-poster-img" src="\${poster}" alt="\${item.title}" loading="lazy" onerror="this.onerror=null;this.src='https://image.tmdb.org/t/p/w780/pzIddUEMWhSEqEFq8B3PKYB32Wm.jpg'">
          <div class="poster-scrim"></div>
          <div class="card-top-tags">
            <span class="format-pill \${typeClass}">\${typeLabel}</span>
            <span class="rating-pill">\${ratingStr}</span>
          </div>
        </div>
        <div class="card-meta-body">
          <div class="chrono-label">\${chronoTag}</div>
          <h3 class="card-item-title">\${item.title}</h3>
          <div class="card-subtext">
            <span>\${releaseYear}</span>
            <span class="dot-sep"></span>
            <span>\${item.runtime || (item.episodes ? item.episodes + ' eps' : 'Feature')}</span>
          </div>
          <div class="card-bottom-stat">
            \${bottomStat}
          </div>
        </div>
      </article>
    \`;
  }

  // Interactive Detail Modal
  window.openEntryDetail = function(id) {
    const item = DATA.find(e => e.id === id);
    if (!item) return;

    const layer = document.getElementById('detail-modal-layer');
    const bgImg = document.getElementById('modal-bg-img');
    const title = document.getElementById('modal-item-title');
    const eraTag = document.getElementById('modal-tag-era');
    const chipsStrip = document.getElementById('modal-chips-strip');

    bgImg.src = getBackdropPath(item);
    bgImg.alt = item.title;
    title.textContent = item.title;
    eraTag.textContent = item.phase ? \`\${item.saga ? item.saga.toUpperCase() : ''} · PHASE \${item.phase}\` : 'SPECIAL MARVEL ARCHIVE';

    const year = item.releaseDate ? item.releaseDate.substring(0, 4) : 'TBD';
    const runtime = item.runtime || (item.episodes ? \`\${item.episodes} Episodes\` : 'Feature');
    chipsStrip.innerHTML = \`
      <span class="m-chip" style="color:var(--cyan);border-color:var(--cyan)">\${year}</span>
      <span class="m-chip">\${runtime}</span>
      <span class="m-chip">\${item.type.toUpperCase()}</span>
      \${item.inUniverseYear ? \`<span class="m-chip">IN-UNIVERSE: \${item.inUniverseYear}</span>\` : ''}
    \`;

    // Overview Tab
    const paneOverview = document.getElementById('pane-overview');
    paneOverview.innerHTML = \`
      <p class="synopsis-text">\${item.summary || 'Summary pending archival cataloguing.'}</p>
      \${item.spoilerSummary ? \`
        <div class="spoiler-toggle-box">
          <button class="spoiler-header-trigger" onclick="toggleSpoilerBox(this)">
            <span>CONFIDENTIAL TIMELINE LORE & SPOILERS</span>
            <span>▼</span>
          </button>
          <div class="spoiler-reveal-body">\${item.spoilerSummary}</div>
        </div>
      \` : ''}
      <div class="meta-grid-two-col">
        <div class="meta-field-cell"><div class="meta-field-label">Director(s)</div><div class="meta-field-value">\${(item.directors || []).join(', ') || '—'}</div></div>
        <div class="meta-field-cell"><div class="meta-field-label">Writer(s)</div><div class="meta-field-value">\${(item.writers || []).join(', ') || '—'}</div></div>
        <div class="meta-field-cell"><div class="meta-field-label">Composer</div><div class="meta-field-value">\${item.composer || '—'}</div></div>
        <div class="meta-field-cell"><div class="meta-field-label">Antagonist / Villain</div><div class="meta-field-value" style="color:#ff8588">\${item.villain || '—'}</div></div>
        <div class="meta-field-cell"><div class="meta-field-label">Tagline</div><div class="meta-field-value" style="font-style:italic">"\${item.tagline || 'Heroes Assemble.'}"</div></div>
        <div class="meta-field-cell"><div class="meta-field-label">Post-Credits Scenes</div><div class="meta-field-value">\${item.postCreditScenes != null ? item.postCreditScenes + ' Scene(s)' : '—'}</div></div>
      </div>
      \${(item.postCreditDetails && item.postCreditDetails.length > 0) ? \`
        <div style="background:rgba(255,255,255,0.02);padding:16px;border-radius:2px;border:1px solid var(--line-subtle);margin-bottom:24px;">
          <div class="meta-field-label" style="margin-bottom:8px;">Post-Credits Scene Details:</div>
          <ul style="padding-left:18px;font-size:13px;color:var(--text-secondary);line-height:1.7;">
            \${item.postCreditDetails.map(d => \`<li>\${d}</li>\`).join('')}
          </ul>
        </div>
      \` : ''}
      <div class="modal-footer-actions">
        \${item.disneyPlusUrl ? \`<a href="\${item.disneyPlusUrl}" target="_blank" rel="noopener" class="action-link-btn primary">Stream on Disney+</a>\` : ''}
        \${item.trailerUrl ? \`<a href="\${item.trailerUrl}" target="_blank" rel="noopener" class="action-link-btn">Watch Official Trailer ↗</a>\` : ''}
      </div>
    \`;

    // Metrics Tab
    const paneMetrics = document.getElementById('pane-metrics');
    const isFilm = item.type === 'film' || item.type === 'teaser';
    const fmt = n => n ? '$' + Number(n).toLocaleString('en-US') : '—';
    if (isFilm) {
      paneMetrics.innerHTML = \`
        <div class="metrics-stat-grid">
          <div class="stat-item-box"><div class="stat-item-tag">Worldwide Gross</div><div class="stat-item-number">\${item.worldwideGross ? '$' + (item.worldwideGross / 1e9).toFixed(2) + 'B' : '—'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">Production Budget</div><div class="stat-item-number">\${item.budget ? '$' + (item.budget / 1e6).toFixed(0) + 'M' : '—'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">Opening Weekend</div><div class="stat-item-number">\${item.openingWeekend ? '$' + (item.openingWeekend / 1e6).toFixed(1) + 'M' : '—'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">Domestic Gross</div><div class="stat-item-number" style="font-size:22px">\${fmt(item.domesticGross)}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">Franchise ROI</div><div class="stat-item-number" style="color:#7fe49b">\${item.roi ? item.roi + 'x' : '—'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">MCU Rank</div><div class="stat-item-number">\${item.rankMcu ? '#' + item.rankMcu : '—'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">RT Critics</div><div class="stat-item-number">\${item.rtCritics ? item.rtCritics + '%' : '—'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">RT Audience</div><div class="stat-item-number">\${item.rtAudience ? item.rtAudience + '%' : '—'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">IMDb Rating</div><div class="stat-item-number">★ \${item.imdbRating || '—'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">CinemaScore</div><div class="stat-item-number" style="color:#caa2f5">\${item.cinemaScore || '—'}</div></div>
        </div>
      \`;
    } else {
      paneMetrics.innerHTML = \`
        <div class="metrics-stat-grid">
          <div class="stat-item-box"><div class="stat-item-tag">Episode Count</div><div class="stat-item-number">\${item.episodes || '—'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">Seasons</div><div class="stat-item-number">\${item.seasons || 1}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">Platform</div><div class="stat-item-number" style="font-size:20px">\${item.network || 'Disney+'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">RT Critics</div><div class="stat-item-number">\${item.rtCritics ? item.rtCritics + '%' : '—'}</div></div>
          <div class="stat-item-box"><div class="stat-item-tag">IMDb Rating</div><div class="stat-item-number">★ \${item.imdbRating || '—'}</div></div>
        </div>
      \`;
    }

    // Cast Tab
    const paneCast = document.getElementById('pane-cast');
    if (item.cast && item.cast.length > 0) {
      paneCast.innerHTML = \`
        <div class="cast-scroller-grid">
          \${item.cast.map(c => \`
            <div class="cast-tile">
              <img class="cast-avatar-frame" src="\${c.headshot || ''}" alt="\${c.actor}" loading="lazy" onerror="this.onerror=null;this.src='https://image.tmdb.org/t/p/w185/placeholder.jpg';this.style.background='#0a141e'">
              <div class="cast-actor-label">\${c.actor}</div>
              <div class="cast-character-label">\${c.character}</div>
            </div>
          \`).join('')}
        </div>
      \`;
    } else {
      paneCast.innerHTML = '<p style="color:var(--text-tertiary);text-align:center;padding:40px 0;">Cast ensemble documentation is pending official studio confirmation.</p>';
    }

    // Links Tab
    const paneLinks = document.getElementById('pane-links');
    if (item.connectedTo && item.connectedTo.length > 0) {
      paneLinks.innerHTML = \`
        <div class="meta-field-label" style="margin-bottom:12px;">Connected Timeline Nodes:</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          \${item.connectedTo.map(cid => {
            const rel = DATA.find(d => d.id === cid);
            return rel ? \`<button class="action-link-btn" onclick="openEntryDetail('\${rel.id}')">→ \${rel.title} (\${rel.releaseDate ? rel.releaseDate.substring(0,4) : 'TBD'})</button>\` : '';
          }).join('')}
        </div>
      \`;
    } else {
      paneLinks.innerHTML = '<p style="color:var(--text-tertiary);">Standalone timeline branch.</p>';
    }

    switchModalPane('overview');
    layer.classList.add('is-open');
    document.body.classList.add('modal-open');
  };

  window.closeEntryDetail = function() {
    document.getElementById('detail-modal-layer').classList.remove('is-open');
    document.body.classList.remove('modal-open');
  };

  window.switchModalPane = function(tabKey) {
    document.querySelectorAll('.m-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabKey));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'pane-' + tabKey));
  };

  window.toggleSpoilerBox = function(btn) {
    const pane = btn.nextElementSibling;
    const isShown = pane.classList.toggle('is-shown');
    btn.querySelector('span:last-child').textContent = isShown ? '▲' : '▼';
  };

  // Timeline Modes & Filters
  window.switchOrderMode = function(mode) {
    activeOrder = mode;
    document.getElementById('chip-mode-chronological').classList.toggle('active', mode === 'story');
    document.getElementById('chip-mode-release').classList.toggle('active', mode === 'release');
    renderCatalog();
  };

  window.setCatalogFilter = function(fmt, btn) {
    activeFormat = fmt;
    document.querySelectorAll('.filter-button-group .filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    renderCatalog();
  };

  window.jumpToPhase = function(phaseNum, btn) {
    activePhaseFilter = phaseNum;
    document.querySelectorAll('.era-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCatalog();
  };

  window.setArchiveView = function() {
    activeOrder = 'release';
    document.getElementById('chip-mode-chronological').classList.remove('active');
    document.getElementById('chip-mode-release').classList.add('active');
    renderCatalog();
  };

  window.scrollToSection = function(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Search Palette
  window.openSearchModal = function() {
    const layer = document.getElementById('search-modal-layer');
    const input = document.getElementById('search-query-field');
    layer.classList.add('is-open');
    input.value = '';
    input.focus();
    updateSearchResults('');
  };

  window.closeSearchModal = function() {
    document.getElementById('search-modal-layer').classList.remove('is-open');
  };

  function updateSearchResults(q) {
    const box = document.getElementById('search-results-viewport');
    const query = q.trim().toLowerCase();
    let hits = DATA;

    if (query) {
      hits = DATA.filter(e =>
        (e.title && e.title.toLowerCase().includes(query)) ||
        (e.villain && e.villain.toLowerCase().includes(query)) ||
        (e.directors && e.directors.some(d => d.toLowerCase().includes(query))) ||
        (e.cast && e.cast.some(c => (c.actor && c.actor.toLowerCase().includes(query)) || (c.character && c.character.toLowerCase().includes(query))))
      );
    }

    hits = hits.slice(0, 16);
    if (hits.length === 0) {
      box.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-tertiary);">No timeline chapter matches query.</div>';
      return;
    }

    box.innerHTML = hits.map(e => {
      const poster = getPosterPath(e);
      const year = e.releaseDate ? e.releaseDate.substring(0, 4) : 'TBD';
      return \`
        <div class="search-hit-row" onclick="closeSearchModal();openEntryDetail('\${e.id}')">
          <img class="search-hit-thumb" src="\${poster}" alt="\${e.title}" onerror="this.src='';this.style.background='#081018'">
          <div class="search-hit-info">
            <strong>\${e.title}</strong>
            <span>\${year} · \${e.type.toUpperCase()} · Phase \${e.phase || 'Special'}</span>
          </div>
        </div>
      \`;
    }).join('');
  }

  // Live Doomsday Clock
  function initDoomsdayTimer() {
    const target = new Date('2026-12-18T00:00:00Z').getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) return;
      const d = Math.floor(diff / 864e5);
      const h = Math.floor(diff % 864e5 / 36e5);
      const m = Math.floor(diff % 36e5 / 6e4);
      const s = Math.floor(diff % 6e4 / 1e3);

      document.getElementById('timer-days').textContent = d;
      document.getElementById('timer-hours').textContent = String(h).padStart(2, '0');
      document.getElementById('timer-mins').textContent = String(m).padStart(2, '0');
      document.getElementById('timer-secs').textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  // Metrics Section
  function initMetrics() {
    const films = DATA.filter(e => e.type === 'film' && e.worldwideGross);
    const totalGross = films.reduce((sum, f) => sum + (f.worldwideGross || 0), 0);
    const totalBudget = films.reduce((sum, f) => sum + (f.budget || 0), 0);
    const avgRoi = totalBudget > 0 ? (totalGross / totalBudget).toFixed(2) : '3.65';
    const billionFilms = films.filter(f => f.worldwideGross >= 1e9).length;

    document.getElementById('metrics-stat-row').innerHTML = \`
      <div class="metric-box">
        <strong>$\${(totalGross / 1e9).toFixed(2)}B</strong>
        <span>GLOBAL THEATRICAL GROSS</span>
        <small>40 Feature Films</small>
      </div>
      <div class="metric-box">
        <strong>\${billionFilms}</strong>
        <span>BILLION-DOLLAR RELEASES</span>
        <small>Historic cinematic record</small>
      </div>
      <div class="metric-box">
        <strong style="color:var(--cyan)">\${avgRoi}x</strong>
        <span>FRANCHISE AVERAGE ROI</span>
        <small>Box office return multiple</small>
      </div>
      <div class="metric-box">
        <strong>70</strong>
        <span>TOTAL CANON ENTRIES</span>
        <small>Films, Series & Specials</small>
      </div>
    \`;
  }

  // Time Loom Canvas (Exact flowing horizontal temporal strand wave)
  function initTimeLoom() {
    const canvas = document.getElementById('time-loom-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const center = height * 0.58;
      const strands = width < 700 ? 5 : 8;

      for (let s = 0; s < strands; s++) {
        ctx.beginPath();
        for (let x = -40; x <= width + 40; x += 12) {
          const time = frame * 0.005;
          const wave = Math.sin(x * 0.008 + s * 1.3 + time) * (10 + s * 2);
          const branch = Math.sin(x * 0.0027 + s) * 20;
          const y = center + (s - strands / 2) * 3.5 + wave + branch;
          if (x === -40) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, 'rgba(88, 183, 217, 0)');
        grad.addColorStop(0.2, 'rgba(117, 221, 239, 0.55)');
        grad.addColorStop(0.55, 'rgba(231, 244, 216, 0.95)');
        grad.addColorStop(0.82, 'rgba(158, 113, 224, 0.55)');
        grad.addColorStop(1, 'rgba(158, 113, 224, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = s === 3 ? 1.6 : 0.7;
        ctx.shadowColor = '#bffaff';
        ctx.shadowBlur = s === 3 ? 16 : 8;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      if (!reduced) {
        frame++;
        requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
  }

  // Synthesized Web Audio API Ambient Temporal Hum
  let audioCtx = null;
  let masterGain = null;
  let isAudioActive = false;

  function toggleAmbientAudio() {
    const btn = document.getElementById('audio-trigger-btn');
    const icon = document.getElementById('audio-icon-elem');

    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      // 55Hz Low Harmonic
      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, audioCtx.currentTime);

      osc1.connect(filter);
      filter.connect(masterGain);
      osc1.start();

      // 110Hz Sine Harmonic
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110, audioCtx.currentTime);

      const g2 = audioCtx.createGain();
      g2.gain.setValueAtTime(0.35, audioCtx.currentTime);
      osc2.connect(g2);
      g2.connect(masterGain);
      osc2.start();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioActive) {
      masterGain.gain.setTargetAtTime(0.06, audioCtx.currentTime, 1.2);
      isAudioActive = true;
      btn.classList.add('active');
      icon.innerHTML = '<path d="M4 14h4l5 4V6l-5 4H4z"/><path d="M17 9.5c1.7 1.3 1.7 3.7 0 5"/>';
    } else {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.8);
      isAudioActive = false;
      btn.classList.remove('active');
      icon.innerHTML = '<path d="M4 14h4l5 4V6l-5 4H4z"/><path d="m17 10 5 5m0-5-5 5"/>';
    }
  }

  // Keyboard Shortcuts & Bindings
  function bindEvents() {
    document.getElementById('search-trigger-btn').addEventListener('click', openSearchModal);
    document.getElementById('search-query-field').addEventListener('input', e => updateSearchResults(e.target.value));
    document.getElementById('audio-trigger-btn').addEventListener('click', toggleAmbientAudio);

    window.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      }
      if (e.key === 'Escape') {
        closeEntryDetail();
        closeSearchModal();
      }
    });
  }

  // Launch Engine
  function launch() {
    renderCatalog();
    initDoomsdayTimer();
    initMetrics();
    initTimeLoom();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', launch);
  } else {
    launch();
  }
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../index.html'), html, 'utf8');
console.log('Successfully compiled studio-grade index.html!');
