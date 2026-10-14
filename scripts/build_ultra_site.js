const fs = require('fs');
const path = require('path');

const tmdbMapping = require('./tmdb_real_images.json');
const mcuData = require('../data/mcu-data.js');

console.log('TMDB Mapping entries:', Object.keys(tmdbMapping).length);
console.log('MCU Data entries:', mcuData.length);

// Let's create the full index.html
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MCU: The Sacred Timeline — Definitive Interactive Temporal Archive</title>
<meta name="description" content="Experience the complete Marvel Cinematic Universe: every film, series, and special from Iron Man (2008) to Avengers: Doomsday (2026). Explore release and chronological story timelines in ultra-realistic fidelity.">
<meta name="theme-color" content="#030712">

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&family=Oswald:wght@400;500;600;700&family=Cinzel:wght@700&display=swap" rel="stylesheet">

<style>
/* ============================================================
   MCU: THE SACRED TIMELINE — ULTRA-REALISTIC DESIGN SYSTEM
   Theme: Loki Citadel Spacetime Void, Golden Temporal Strands,
   TVA Brass Accents, Glassmorphic 4K Surfaces.
   ============================================================ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg-deep: #020409;
  --bg-space: #060a16;
  --bg-card: rgba(13, 20, 36, 0.75);
  --bg-card-hover: rgba(20, 31, 56, 0.9);
  --surface-border: rgba(255, 255, 255, 0.08);
  --surface-border-active: rgba(245, 158, 11, 0.4);
  
  --gold-primary: #f59e0b;
  --gold-glow: rgba(245, 158, 11, 0.35);
  --gold-light: #fbbf24;
  --loki-green: #10b981;
  --loki-glow: rgba(16, 185, 129, 0.35);
  --multiverse-purple: #8b5cf6;
  --multiverse-glow: rgba(139, 92, 246, 0.3);
  --quantum-cyan: #06b6d4;
  --quantum-glow: rgba(6, 182, 212, 0.3);
  --tva-red: #ef4444;
  --tva-amber: #d97706;

  --text-main: #f8fafc;
  --text-sub: #cbd5e1;
  --text-muted: #64748b;
  --text-dim: #475569;

  --font-display: 'Bebas Neue', 'Oswald', Impact, sans-serif;
  --font-heading: 'Oswald', sans-serif;
  --font-cinzel: 'Cinzel', serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

html {
  scroll-behavior: smooth;
  background-color: var(--bg-deep);
  color: var(--text-main);
  font-family: var(--font-body);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: radial-gradient(circle at 50% 0%, #0d172e 0%, var(--bg-deep) 70%);
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-deep);
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--gold-primary), var(--multiverse-purple));
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--gold-light);
}

/* ============================================================
   CANVAS BACKGROUND (Loki Sacred Timeline Ribbons & Stars)
   ============================================================ */
#timeline-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  opacity: 0.85;
}

/* Ambient Radial Spacetime Glows */
.spacetime-glow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 90% 60% at 50% -10%, rgba(245, 158, 11, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 70% 50% at 85% 40%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 15% 75%, rgba(16, 185, 129, 0.06) 0%, transparent 50%);
}

/* ============================================================
   HEADER & FLOATING CONTROLS (TVA DOCK)
   ============================================================ */
.tva-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(16px, 4vw, 48px);
  background: rgba(4, 7, 16, 0.82);
  backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid var(--surface-border);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.tva-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: #fff;
}
.marvel-badge {
  background: #e62429;
  color: #fff;
  font-family: var(--font-display);
  font-size: 15px;
  letter-spacing: 2.5px;
  padding: 3px 10px 1px;
  border-radius: 2px;
  font-weight: 700;
  box-shadow: 0 0 15px rgba(230, 36, 41, 0.4);
}
.brand-title {
  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 3.5px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand-title .gold {
  color: var(--gold-primary);
  text-shadow: 0 0 16px var(--gold-glow);
}

/* Nav quick jumps */
.nav-phases {
  display: flex;
  gap: 6px;
  align-items: center;
}
.phase-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid transparent;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.25s ease;
}
.phase-btn:hover {
  color: #fff;
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.35);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.2);
}

/* Nav Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.action-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--surface-border);
  color: var(--text-sub);
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;
}
.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateY(-1px);
}
.search-btn {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: var(--gold-light);
}
.search-btn:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: var(--gold-primary);
  box-shadow: 0 0 16px var(--gold-glow);
}
.kbd-pill {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-family: monospace;
  color: var(--text-muted);
}

/* Audio ambient button */
.audio-btn.active {
  border-color: var(--loki-green);
  color: var(--loki-green);
  background: rgba(16, 185, 129, 0.12);
  box-shadow: 0 0 14px var(--loki-glow);
}

/* Thanos Snap Button */
.snap-btn {
  border-color: rgba(139, 92, 246, 0.4);
  color: #c084fc;
  background: rgba(139, 92, 246, 0.1);
}
.snap-btn:hover {
  background: rgba(139, 92, 246, 0.25);
  box-shadow: 0 0 20px var(--multiverse-glow);
}

/* ============================================================
   HERO SECTION (Citadel at the End of Time & Temporal Loom)
   ============================================================ */
.hero-citadel {
  position: relative;
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 24px 60px;
  z-index: 10;
}

.tva-seal {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 20px;
  border-radius: 40px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: var(--gold-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  margin-bottom: 24px;
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.15);
  animation: pulseSeal 4s ease-in-out infinite alternate;
}
@keyframes pulseSeal {
  0% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.1); }
  100% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.25); }
}

.hero-main-title {
  font-family: var(--font-display);
  font-size: clamp(54px, 11vw, 130px);
  line-height: 0.92;
  letter-spacing: 8px;
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 20px;
  background: linear-gradient(180deg, #ffffff 40%, #cbd5e1 75%, var(--gold-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 60px rgba(245, 158, 11, 0.35));
}

.hero-subtitle {
  font-size: clamp(16px, 2.2vw, 21px);
  font-weight: 400;
  color: var(--text-sub);
  max-width: 760px;
  line-height: 1.65;
  margin: 0 auto 36px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

/* Primary Metric Badges */
.hero-kpis {
  display: flex;
  gap: clamp(16px, 3vw, 40px);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
}
.kpi-item {
  background: rgba(13, 20, 36, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid var(--surface-border);
  border-radius: 14px;
  padding: 16px 26px;
  text-align: center;
  min-width: 140px;
  transition: all 0.3s ease;
}
.kpi-item:hover {
  transform: translateY(-4px);
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.15);
}
.kpi-val {
  font-family: var(--font-display);
  font-size: clamp(30px, 4vw, 40px);
  color: #fff;
  letter-spacing: 2px;
  line-height: 1;
  margin-bottom: 4px;
}
.kpi-val.gold { color: var(--gold-primary); text-shadow: 0 0 14px var(--gold-glow); }
.kpi-val.green { color: var(--loki-green); text-shadow: 0 0 14px var(--loki-glow); }
.kpi-val.purple { color: #a855f7; text-shadow: 0 0 14px var(--multiverse-glow); }
.kpi-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* Down arrow hint */
.scroll-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s;
}
.scroll-cta:hover { color: var(--gold-light); }
.strand-beam {
  width: 2px;
  height: 48px;
  background: linear-gradient(180deg, var(--gold-primary), transparent);
  animation: beamGlow 2.5s infinite;
}
@keyframes beamGlow {
  0%, 100% { opacity: 0.2; transform: scaleY(0.7); }
  50% { opacity: 1; transform: scaleY(1.1); box-shadow: 0 0 12px var(--gold-primary); }
}

/* ============================================================
   CONTROL CONSOLE (ORDER TOGGLE & TYPE FILTERS)
   ============================================================ */
.console-bar {
  position: sticky;
  top: 72px;
  z-index: 900;
  background: rgba(4, 7, 16, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--surface-border);
  padding: 16px clamp(16px, 4vw, 48px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8);
}

/* Timeline Mode Switcher (Release vs Chronological) */
.order-switcher {
  display: inline-flex;
  background: rgba(13, 20, 36, 0.9);
  border: 1px solid var(--surface-border);
  border-radius: 30px;
  padding: 4px;
  gap: 4px;
}
.mode-toggle {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 8px 18px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}
.mode-toggle.active {
  background: var(--gold-primary);
  color: #000;
  box-shadow: 0 2px 14px var(--gold-glow);
}

/* Filter Pills */
.filter-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}
.filter-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--surface-border);
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.filter-chip.active {
  background: rgba(245, 158, 11, 0.15);
  border-color: var(--gold-primary);
  color: var(--gold-light);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.2);
}

.count-badge {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* ============================================================
   MAIN TIMELINE STREAM (Vertical Scroll with Loom Ribbon)
   ============================================================ */
.timeline-stream-container {
  position: relative;
  max-width: 1540px;
  margin: 0 auto;
  padding: 40px clamp(16px, 4vw, 48px) 100px;
  z-index: 10;
}

/* Phase Section Header */
.phase-group {
  position: relative;
  margin-bottom: 80px;
}

.phase-separator {
  position: relative;
  text-align: center;
  margin: 80px 0 40px;
  padding: 30px 20px;
  border-radius: 20px;
  background: radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.07) 0%, transparent 80%);
}
.phase-separator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--surface-border-active), transparent);
}
.phase-saga-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--gold-primary);
  margin-bottom: 8px;
  display: inline-block;
}
.phase-headline {
  font-family: var(--font-display);
  font-size: clamp(38px, 6vw, 68px);
  letter-spacing: 5px;
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 12px;
  line-height: 1;
}
.phase-narrative {
  font-size: 15px;
  color: var(--text-sub);
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Grid of Cards */
.entries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 28px;
}

/* ============================================================
   CARD ARCHITECTURE (4K Posters, Glass Surfaces, HD Meta)
   ============================================================ */
.mcu-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--surface-border);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
  opacity: 0;
  transform: translateY(30px);
}
.mcu-card.visible {
  opacity: 1;
  transform: translateY(0);
}
.mcu-card:hover {
  transform: translateY(-10px) scale(1.02);
  border-color: var(--surface-border-active);
  background: var(--bg-card-hover);
  box-shadow:
    0 25px 60px -15px rgba(0, 0, 0, 0.9),
    0 0 35px var(--accent-glow, rgba(245, 158, 11, 0.18));
}

/* Poster Frame */
.poster-viewport {
  position: relative;
  aspect-ratio: 2 / 3;
  width: 100%;
  background: #090e1a;
  overflow: hidden;
}
.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  display: block;
}
.mcu-card:hover .poster-img {
  transform: scale(1.07);
}

.poster-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, #1e293b, #0f172a);
}
.poster-fallback .fallback-title {
  font-family: var(--font-display);
  font-size: 24px;
  color: #fff;
  letter-spacing: 2px;
}

/* Poster Overlays & Badges */
.poster-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(2, 4, 9, 0.95) 100%);
  pointer-events: none;
}

.top-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5;
  pointer-events: none;
}
.type-badge {
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.type-badge.film { color: var(--quantum-cyan); border: 1px solid rgba(6, 182, 212, 0.4); }
.type-badge.series { color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.4); }
.type-badge.special { color: var(--loki-green); border: 1px solid rgba(16, 185, 129, 0.4); }
.type-badge.teaser { color: var(--gold-light); border: 1px solid rgba(245, 158, 11, 0.5); }

.rating-badge {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(245, 158, 11, 0.35);
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  color: var(--gold-light);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Card Content Area */
.card-details {
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  z-index: 5;
  margin-top: -30px;
}

.chrono-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--gold-primary);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.entry-title {
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 1.15;
  color: #fff;
  letter-spacing: 1.2px;
  margin-bottom: 8px;
  transition: color 0.2s;
}
.mcu-card:hover .entry-title {
  color: var(--gold-light);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
}

.director-line {
  font-size: 11px;
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: auto;
}

/* Card Bottom Highlight (Box Office or Network) */
.card-footer-stat {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
}
.stat-highlight {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--gold-primary);
  letter-spacing: 1px;
}
.network-highlight {
  color: #38bdf8;
  font-weight: 600;
  font-size: 11px;
}

/* Pruned Ash State (Thanos Snap) */
.mcu-card.snapped {
  opacity: 0.04 !important;
  filter: grayscale(1) blur(6px) !important;
  transform: scale(0.92) !important;
  pointer-events: none !important;
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* ============================================================
   AVENGERS: DOOMSDAY SHOWCASE (DECEMBER 18, 2026 COUNTDOWN)
   ============================================================ */
.doomsday-monolith {
  position: relative;
  margin: 100px 0 60px;
  padding: 60px clamp(20px, 5vw, 60px);
  border-radius: 24px;
  background:
    radial-gradient(circle at 75% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 60%),
    rgba(10, 16, 28, 0.85);
  border: 1px solid rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 60px rgba(16, 185, 129, 0.15), 0 30px 80px -20px rgba(0, 0, 0, 0.9);
  overflow: hidden;
}
.doomsday-monolith::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--loki-green), var(--gold-primary), transparent);
}
.doomsday-layout {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 48px;
  align-items: center;
}
@media (max-width: 900px) {
  .doomsday-layout { grid-template-columns: 1fr; }
}

.doomsday-badge {
  color: var(--loki-green);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.doomsday-title {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 72px);
  line-height: 0.95;
  color: #fff;
  letter-spacing: 4px;
  margin-bottom: 16px;
}
.doomsday-desc {
  font-size: 15px;
  color: var(--text-sub);
  line-height: 1.7;
  margin-bottom: 28px;
}
.doom-highlight-box {
  background: rgba(16, 185, 129, 0.06);
  border-left: 3px solid var(--loki-green);
  padding: 14px 18px;
  border-radius: 0 8px 8px 0;
  font-size: 13px;
  color: #a7f3d0;
  margin-bottom: 30px;
}

/* Live Countdown Grid */
.countdown-clock {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.clock-unit {
  background: rgba(5, 10, 20, 0.9);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 14px;
  padding: 16px 20px;
  min-width: 95px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}
.clock-val {
  font-family: var(--font-display);
  font-size: clamp(34px, 5vw, 48px);
  color: #fff;
  line-height: 1;
  letter-spacing: 2px;
  color: #34d399;
  text-shadow: 0 0 16px rgba(52, 211, 153, 0.4);
}
.clock-lbl {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-top: 4px;
}

/* Secret Wars Teaser Node */
.secret-wars-portal {
  text-align: center;
  padding: 80px 20px;
  margin: 60px 0;
  border-radius: 24px;
  background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
  border: 1px dashed rgba(139, 92, 246, 0.4);
}
.secret-wars-tag {
  color: #c084fc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.secret-wars-title {
  font-family: var(--font-display);
  font-size: clamp(36px, 6vw, 64px);
  color: #fff;
  letter-spacing: 4px;
  margin-bottom: 12px;
  text-shadow: 0 0 30px var(--multiverse-glow);
}
.secret-wars-sub {
  color: var(--text-sub);
  font-size: 15px;
  max-width: 580px;
  margin: 0 auto;
}

/* ============================================================
   TEMPORAL ANALYTICS DASHBOARD
   ============================================================ */
.analytics-section {
  padding: 80px 0;
}
.analytics-header {
  text-align: center;
  margin-bottom: 48px;
}
.analytics-title {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 56px);
  letter-spacing: 4px;
  color: #fff;
}
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}
.stat-box {
  background: var(--bg-card);
  border: 1px solid var(--surface-border);
  border-radius: 16px;
  padding: 26px;
  text-align: center;
}
.stat-box-val {
  font-family: var(--font-display);
  font-size: 42px;
  color: var(--gold-primary);
  letter-spacing: 2px;
  margin-bottom: 4px;
}
.stat-box-lbl {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  text-transform: uppercase;
}

/* ============================================================
   IMMERSIVE DETAIL MODAL (4K Lightbox & Lore Codex)
   ============================================================ */
.modal-scrim {
  position: fixed;
  inset: 0;
  background: rgba(2, 4, 9, 0.88);
  backdrop-filter: blur(20px);
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.35s ease;
}
.modal-scrim.active {
  opacity: 1;
  visibility: visible;
}

.modal-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.92);
  width: min(1040px, 94vw);
  max-height: 90vh;
  background: #080d1a;
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 20px;
  overflow: hidden;
  z-index: 2001;
  display: flex;
  flex-direction: column;
  opacity: 0;
  visibility: hidden;
  box-shadow: 0 30px 100px -20px rgba(0, 0, 0, 0.95), 0 0 50px rgba(245, 158, 11, 0.15);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-dialog.active {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) scale(1);
}

.modal-backdrop-viewport {
  position: relative;
  height: 340px;
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
}
.modal-backdrop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.modal-backdrop-gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 40%, #080d1a 100%),
    radial-gradient(circle at 80% 20%, transparent 40%, rgba(2, 4, 9, 0.7) 100%);
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  transition: all 0.2s;
}
.modal-close-btn:hover {
  background: var(--tva-red);
  border-color: var(--tva-red);
  transform: scale(1.1);
}

.modal-hero-content {
  position: absolute;
  bottom: 24px;
  left: 36px;
  right: 36px;
  z-index: 10;
}
.modal-phase-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--gold-primary);
  margin-bottom: 6px;
}
.modal-entry-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 5.5vw, 52px);
  color: #fff;
  letter-spacing: 2px;
  line-height: 1;
  margin-bottom: 10px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.9);
}
.modal-chips-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.modal-chip {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  color: var(--text-sub);
}
.modal-chip.gold {
  border-color: rgba(245, 158, 11, 0.4);
  color: var(--gold-light);
}

/* Modal Body & Navigation Tabs */
.modal-scroll-area {
  padding: 24px 36px 36px;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-nav-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 12px;
  margin-bottom: 28px;
}
.m-tab {
  background: transparent;
  border: none;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;
}
.m-tab:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}
.m-tab.active {
  color: var(--gold-primary);
  background: rgba(245, 158, 11, 0.12);
}

.tab-pane {
  display: none;
}
.tab-pane.active {
  display: block;
}

/* Overview Content */
.entry-synopsis {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-sub);
  margin-bottom: 24px;
}
.spoiler-accordion {
  margin-bottom: 28px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.04);
  overflow: hidden;
}
.spoiler-header-btn {
  width: 100%;
  background: transparent;
  border: none;
  color: #f87171;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 14px 20px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.spoiler-content {
  display: none;
  padding: 0 20px 20px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-sub);
}
.spoiler-content.revealed {
  display: block;
}

/* Key Metadata Cards */
.meta-codex-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}
.codex-card {
  background: rgba(13, 20, 36, 0.6);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 16px;
}
.codex-key {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.codex-val {
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

/* Box Office & Economics Tab */
.economics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.econ-card {
  background: rgba(13, 20, 36, 0.7);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 18px;
  text-align: center;
}
.econ-key {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.econ-val {
  font-family: var(--font-display);
  font-size: 30px;
  color: var(--gold-primary);
  letter-spacing: 1px;
}

/* Cast Grid */
.cast-ensemble-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 18px;
}
.cast-member-card {
  text-align: center;
}
.cast-avatar {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 10px;
  display: block;
  border: 2px solid var(--surface-border);
  background: #1e293b;
  transition: transform 0.2s, border-color 0.2s;
}
.cast-member-card:hover .cast-avatar {
  transform: scale(1.08);
  border-color: var(--gold-primary);
}
.actor-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}
.character-name {
  font-size: 11px;
  color: var(--text-muted);
}

/* Connections Tags */
.connections-wrap {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}
.connection-pill {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #38bdf8;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.connection-pill:hover {
  background: rgba(6, 182, 212, 0.2);
  transform: translateY(-2px);
}

/* External Link Buttons */
.modal-actions-row {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}
.ext-btn {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.ext-btn.disney {
  background: #113ccf;
  color: #fff;
}
.ext-btn.disney:hover {
  background: #1f4ff2;
  box-shadow: 0 0 16px rgba(17, 60, 207, 0.5);
}
.ext-btn.trailer {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid var(--surface-border);
}
.ext-btn.trailer:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* ============================================================
   SEARCH COMMAND PALETTE (CTRL+K / CMD+K)
   ============================================================ */
.search-modal-scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(16px);
  z-index: 3000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: min(12vh, 100px) 20px 20px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s ease;
}
.search-modal-scrim.active {
  opacity: 1;
  visibility: visible;
}
.search-palette {
  width: min(680px, 100%);
  background: #0b1120;
  border: 1px solid var(--gold-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 80px -15px rgba(0, 0, 0, 0.95), 0 0 40px var(--gold-glow);
  transform: translateY(-20px);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.search-modal-scrim.active .search-palette {
  transform: translateY(0);
}
.search-input-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--surface-border);
}
.search-input-header input {
  flex: 1;
  background: transparent;
  border: none;
  font-family: var(--font-body);
  font-size: 18px;
  color: #fff;
  outline: none;
}
.search-results-list {
  max-height: 420px;
  overflow-y: auto;
  padding: 8px 0;
}
.search-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.15s;
}
.search-row:hover, .search-row.selected {
  background: rgba(245, 158, 11, 0.1);
}
.search-thumb {
  width: 42px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  background: #1e293b;
  flex-shrink: 0;
}
.search-row-title {
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: 1px;
  color: #fff;
  margin-bottom: 2px;
}
.search-row-sub {
  font-size: 12px;
  color: var(--text-muted);
}

/* ============================================================
   FOOTER (TVA CITATIONS & ACADEMIC CREDITS)
   ============================================================ */
.tva-footer {
  position: relative;
  z-index: 10;
  border-top: 1px solid var(--surface-border);
  padding: 60px clamp(16px, 4vw, 48px) 80px;
  text-align: center;
  background: #020409;
}
.footer-brand {
  font-family: var(--font-display);
  font-size: 26px;
  letter-spacing: 4px;
  color: #fff;
  margin-bottom: 14px;
}
.footer-text {
  font-size: 13px;
  color: var(--text-muted);
  max-width: 720px;
  margin: 0 auto 20px;
  line-height: 1.7;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .nav-phases { display: none; }
  .entries-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
  .entry-title { font-size: 18px; }
  .modal-dialog { width: 96vw; max-height: 94vh; }
  .modal-backdrop-viewport { height: 220px; }
  .modal-hero-content { left: 20px; right: 20px; bottom: 16px; }
  .modal-scroll-area { padding: 20px; }
  .console-bar { flex-direction: column; align-items: stretch; }
  .order-switcher { width: 100%; justify-content: center; }
  .filter-group { justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
</head>
<body>

<!-- Interactive Loki Sacred Timeline Canvas -->
<canvas id="timeline-canvas"></canvas>
<div class="spacetime-glow"></div>

<!-- TVA Navbar -->
<header class="tva-navbar" id="navbar">
  <a href="#" class="tva-brand">
    <span class="marvel-badge">MARVEL</span>
    <span class="brand-title">THE SACRED <span class="gold">TIMELINE</span></span>
  </a>

  <!-- Phase Jump Links -->
  <nav class="nav-phases" aria-label="Phases">
    <a href="#phase-1" class="phase-btn">Phase 1</a>
    <a href="#phase-2" class="phase-btn">Phase 2</a>
    <a href="#phase-3" class="phase-btn">Phase 3</a>
    <a href="#phase-4" class="phase-btn">Phase 4</a>
    <a href="#phase-5" class="phase-btn">Phase 5</a>
    <a href="#phase-6" class="phase-btn">Phase 6</a>
    <a href="#analytics" class="phase-btn">Analytics</a>
  </nav>

  <!-- Control Actions -->
  <div class="nav-actions">
    <button class="action-btn search-btn" id="open-search-btn" title="Search MCU Archives (Ctrl+K)">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <span>Search</span>
      <span class="kbd-pill">⌘K</span>
    </button>
    <button class="action-btn audio-btn" id="audio-toggle-btn" title="Toggle TVA Ambient Temporal Hum">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
      <span id="audio-state-text">Sound</span>
    </button>
    <button class="action-btn snap-btn" id="snap-toggle-btn" title="Thanos Snap: Prune half the timeline branches!">
      <span>⚡ Snap</span>
    </button>
  </div>
</header>

<!-- Hero Section: Citadel at the End of Time -->
<section class="hero-citadel" id="citadel-hero">
  <div class="tva-seal">TIME VARIANCE AUTHORITY • TEMPORAL MONOGRAPH</div>
  <h1 class="hero-main-title">THE SACRED<br>TIMELINE</h1>
  <p class="hero-subtitle">
    Every canon chapter of the Marvel Cinematic Universe — from Tony Stark's first Mark I flight in 2008 to the dawn of the Multiversal War in Avengers: Doomsday.
  </p>

  <!-- Live Canonical Metrics -->
  <div class="hero-kpis">
    <div class="kpi-item">
      <div class="kpi-val gold">70</div>
      <div class="kpi-label">Canonical Entries</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">$31.8B+</div>
      <div class="kpi-label">Global Box Office</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val green">6</div>
      <div class="kpi-label">Phases Woven</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val purple">19 YRS</div>
      <div class="kpi-label">Temporal Span</div>
    </div>
  </div>

  <div class="scroll-cta" onclick="document.getElementById('console-dock').scrollIntoView({behavior:'smooth'})">
    <span>Descend The Timeline</span>
    <div class="strand-beam"></div>
  </div>
</section>

<!-- Timeline Control Dock (Sticky) -->
<div class="console-bar" id="console-dock">
  <!-- Mode Switcher -->
  <div class="order-switcher">
    <button class="mode-toggle active" id="btn-order-release" onclick="setTimelineOrder('release')">
      <span>📅</span> Release Order
    </button>
    <button class="mode-toggle" id="btn-order-story" onclick="setTimelineOrder('story')">
      <span>⏳</span> Story Chronology
    </button>
  </div>

  <!-- Type Filters -->
  <div class="filter-group">
    <button class="filter-chip active" onclick="setFilter('all')">All Entries (70)</button>
    <button class="filter-chip" onclick="setFilter('film')">Films (40)</button>
    <button class="filter-chip" onclick="setFilter('series')">Disney+ Series & Specials (30)</button>
    <button class="filter-chip" onclick="setFilter('infinity')">Infinity Saga (Phases 1-3)</button>
    <button class="filter-chip" onclick="setFilter('multiverse')">Multiverse Saga (Phases 4-6)</button>
  </div>

  <div class="count-badge" id="visible-count-badge">Displaying 70 of 70 Chapters</div>
</div>

<!-- Main Timeline Container -->
<main class="timeline-stream-container" id="stream-container">
  <!-- Dynamic Phase Sections generated by JS -->
  <div id="dynamic-phases-root"></div>

  <!-- Special Monolith: Avengers: Doomsday Live Countdown -->
  <section class="doomsday-monolith" id="doomsday-showcase">
    <div class="doomsday-layout">
      <div>
        <div class="doomsday-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Phase 6 • Multiverse Finale Milestone
        </div>
        <h2 class="doomsday-title">AVENGERS:<br>DOOMSDAY</h2>
        <p class="doomsday-desc">
          The culmination of the Multiverse Saga. Robert Downey Jr. returns to the Marvel Cinematic Universe in an unprecedented role as Victor von Doom, directed by the Russo Brothers.
        </p>
        <div class="doom-highlight-box">
          <strong>THE MONARCH ASCENDS:</strong> In theaters December 18, 2026. Official casting confirms Doctor Doom, the Fantastic Four, and Earth's Mightiest Heroes.
        </div>
        <!-- Live Countdown -->
        <div class="countdown-clock" id="doomsday-clock">
          <div class="clock-unit"><div class="clock-val" id="cd-days">---</div><div class="clock-lbl">Days</div></div>
          <div class="clock-unit"><div class="clock-val" id="cd-hours">--</div><div class="clock-lbl">Hours</div></div>
          <div class="clock-unit"><div class="clock-val" id="cd-mins">--</div><div class="clock-lbl">Minutes</div></div>
          <div class="clock-unit"><div class="clock-val" id="cd-secs">--</div><div class="clock-lbl">Seconds</div></div>
        </div>
      </div>
      <div style="text-align: center;">
        <div class="mcu-card" style="max-width: 340px; margin: 0 auto; opacity: 1; transform: none;" onclick="openEntryModal('avengers-doomsday')">
          <div class="poster-viewport">
            <img class="poster-img" src="https://image.tmdb.org/t/p/w780/pzIddUEMWhSEqEFq8B3PKYB32Wm.jpg" alt="Avengers: Doomsday Promo" onerror="this.src='https://image.tmdb.org/t/p/w780/cRH03Lu2Bvfh2WwKOXSTvK3TdX2.jpg'">
            <div class="poster-scrim"></div>
            <div class="top-badges">
              <span class="type-badge teaser">UPCOMING</span>
              <span class="rating-badge">DEC 2026</span>
            </div>
          </div>
          <div class="card-details">
            <div class="chrono-tag">DECEMBER 18, 2026</div>
            <div class="entry-title">Avengers: Doomsday</div>
            <div class="meta-row">
              <span>Russo Brothers</span>
              <span class="meta-dot"></span>
              <span>Kevin Feige</span>
            </div>
            <div class="card-footer-stat">
              <span class="stat-highlight">Robert Downey Jr.</span>
              <span class="network-highlight">Doctor Doom</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Final Node: Avengers: Secret Wars Teaser -->
  <section class="secret-wars-portal" id="secret-wars-node">
    <div class="secret-wars-tag">THE UNWRITTEN BEYOND • DECEMBER 17, 2027</div>
    <h2 class="secret-wars-title">AVENGERS: SECRET WARS</h2>
    <p class="secret-wars-sub">
      The ultimate temporal singularity. Time collapses into Battleworld. All timelines converge.
    </p>
  </section>

  <!-- Analytics Section -->
  <section class="analytics-section" id="analytics">
    <div class="analytics-header">
      <div class="phase-saga-tag">TIME VARIANCE AUTHORITY FINANCIAL CODEX</div>
      <h2 class="analytics-title">THE MULTIVERSE IN NUMBERS</h2>
    </div>
    <div class="analytics-grid" id="analytics-grid">
      <!-- Generated by JS -->
    </div>
  </section>
</main>

<!-- Footer -->
<footer class="tva-footer">
  <div class="footer-brand">MCU: THE SACRED TIMELINE</div>
  <p class="footer-text">
    All imagery © Marvel Studios & Walt Disney Studios, retrieved via TMDB API.
    Curated strictly for academic scholarship, motion design demonstration, and historical chronology documentation.
    Box office metrics compiled via Box Office Mojo and The Numbers (data active through October 2026).
  </p>
  <p style="font-size: 11px; color: var(--text-dim);">
    Double-click runnable • Zero external framework dependencies • Static vanilla ES architecture
  </p>
</footer>

<!-- Interactive Detail Modal -->
<div class="modal-scrim" id="modal-scrim" onclick="closeModal()"></div>
<div class="modal-dialog" id="modal-dialog" role="dialog" aria-modal="true">
  <button class="modal-close-btn" id="modal-close-btn" onclick="closeModal()" title="Close (ESC)">✕</button>
  
  <div class="modal-backdrop-viewport">
    <img class="modal-backdrop-img" id="modal-backdrop-img" src="" alt="Backdrop">
    <div class="modal-backdrop-gradient"></div>
    <div class="modal-hero-content">
      <div class="modal-phase-tag" id="modal-phase-tag"></div>
      <h2 class="modal-entry-title" id="modal-title"></h2>
      <div class="modal-chips-row" id="modal-chips"></div>
    </div>
  </div>

  <div class="modal-scroll-area">
    <div class="modal-nav-tabs">
      <button class="m-tab active" data-tab="overview" onclick="switchModalTab('overview')">Overview & Lore</button>
      <button class="m-tab" data-tab="economics" onclick="switchModalTab('economics')">Box Office & Metrics</button>
      <button class="m-tab" data-tab="cast" onclick="switchModalTab('cast')">Cast & Ensemble</button>
      <button class="m-tab" data-tab="connections" onclick="switchModalTab('connections')">Timeline Links</button>
    </div>

    <div class="tab-pane active" id="tab-overview"></div>
    <div class="tab-pane" id="tab-economics"></div>
    <div class="tab-pane" id="tab-cast"></div>
    <div class="tab-pane" id="tab-connections"></div>
  </div>
</div>

<!-- Search Command Palette -->
<div class="search-modal-scrim" id="search-scrim" onclick="if(event.target===this) closeSearch()">
  <div class="search-palette">
    <div class="search-input-header">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="search-box" placeholder="Search films, series, characters, villains, directors..." autocomplete="off">
      <span class="kbd-pill">ESC</span>
    </div>
    <div class="search-results-list" id="search-results-container"></div>
  </div>
</div>

<!-- Scripts -->
<script src="data/mcu-data.js"></script>
<script src="data/tmdb-images.js"></script>
<script>
/* ============================================================
   MCU: THE SACRED TIMELINE — CORE ENGINE
   Zero dependencies, file:// runnable, ultra-smooth animations
   ============================================================ */
(function() {
  'use strict';

  // 1. Data Access & Fallback
  const DATA = Array.isArray(window.MCU_DATA) ? window.MCU_DATA : [];
  const TMDB_MAP = window.TMDB_IMAGES || {};

  // State
  let currentOrder = 'release'; // 'release' | 'story'
  let currentFilter = 'all'; // 'all' | 'film' | 'series' | 'infinity' | 'multiverse'
  let isSnapped = false;

  // 2. Verified TMDB CDN URL Helper
  function getPosterUrl(entry) {
    if (TMDB_MAP[entry.id] && TMDB_MAP[entry.id].poster) {
      return 'https://image.tmdb.org/t/p/w780' + TMDB_MAP[entry.id].poster;
    }
    if (entry.tmdbPoster) {
      return 'https://image.tmdb.org/t/p/w780' + entry.tmdbPoster;
    }
    if (entry.posterAssets && entry.posterAssets.display) {
      return entry.posterAssets.display;
    }
    return '';
  }

  function getBackdropUrl(entry) {
    if (TMDB_MAP[entry.id] && TMDB_MAP[entry.id].backdrop) {
      return 'https://image.tmdb.org/t/p/w1280' + TMDB_MAP[entry.id].backdrop;
    }
    if (entry.tmdbBackdrop) {
      return 'https://image.tmdb.org/t/p/w1280' + entry.tmdbBackdrop;
    }
    if (entry.backdropAssets && entry.backdropAssets.display) {
      return entry.backdropAssets.display;
    }
    return getPosterUrl(entry);
  }

  // 3. Phase Definitions
  const PHASES_METADATA = [
    {
      num: 1,
      saga: 'THE INFINITY SAGA',
      title: 'PHASE ONE: ASSEMBLE',
      tagline: 'The dawn of heroes. Six extraordinary individuals answer the call to defend Earth.',
      id: 'phase-1'
    },
    {
      num: 2,
      saga: 'THE INFINITY SAGA',
      title: 'PHASE TWO: EXPANSION',
      tagline: 'Shattered shields, fallen gods, and the cosmic boundaries of the galaxy cracked open.',
      id: 'phase-2'
    },
    {
      num: 3,
      saga: 'THE INFINITY SAGA',
      title: 'PHASE THREE: APEX',
      tagline: 'Civil war fractures the Avengers. Thanos arrives with the Infinity Gauntlet. The Snap. The Endgame.',
      id: 'phase-3'
    },
    {
      num: 4,
      saga: 'THE MULTIVERSE SAGA',
      title: 'PHASE FOUR: FRACTURE',
      tagline: 'Grief ripples across realities. The Sacred Timeline branches. New champions emerge from the void.',
      id: 'phase-4'
    },
    {
      num: 5,
      saga: 'THE MULTIVERSE SAGA',
      title: 'PHASE FIVE: INVASION',
      tagline: 'The Quantum Realm opens. Multiversal variants clash. The path to Doomsday begins.',
      id: 'phase-5'
    },
    {
      num: 6,
      saga: 'THE MULTIVERSE SAGA',
      title: 'PHASE SIX: CONVERGENCE',
      tagline: 'The Sacred Timeline collapses under the reign of Doctor Doom. The march to Secret Wars.',
      id: 'phase-6'
    }
  ];

  // 4. Render Pipeline
  function filterAndSortData() {
    let list = [...DATA];

    // Filter
    if (currentFilter === 'film') {
      list = list.filter(e => e.type === 'film' || e.type === 'teaser');
    } else if (currentFilter === 'series') {
      list = list.filter(e => e.type === 'series' || e.type === 'special');
    } else if (currentFilter === 'infinity') {
      list = list.filter(e => e.saga === 'Infinity Saga' || e.phase <= 3);
    } else if (currentFilter === 'multiverse') {
      list = list.filter(e => e.saga === 'Multiverse Saga' || e.phase >= 4);
    }

    // Sort
    if (currentOrder === 'story') {
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

  function renderTimeline() {
    const root = document.getElementById('dynamic-phases-root');
    const items = filterAndSortData();

    document.getElementById('visible-count-badge').textContent =
      \`Displaying \${items.length} of \${DATA.length} Chapters\`;

    if (currentOrder === 'story') {
      // In story mode, render a single cohesive chronological flow
      root.innerHTML = \`
        <section class="phase-group">
          <div class="phase-separator">
            <span class="phase-saga-tag">CHRONOLOGICAL STORY SEQUENCE</span>
            <h2 class="phase-headline">THE IN-UNIVERSE TIMELINE</h2>
            <p class="phase-narrative">
              Events ordered as they occurred in Marvel Cinematic Universe history — from Steve Rogers in 1942 through the Multiverse branches.
            </p>
          </div>
          <div class="entries-grid">
            \${items.map(e => renderCard(e)).join('')}
          </div>
        </section>
      \`;
    } else {
      // In release mode, group cleanly by Phase
      let html = '';
      PHASES_METADATA.forEach(phase => {
        const phaseItems = items.filter(e => e.phase === phase.num);
        if (phaseItems.length === 0) return;

        html += \`
          <section class="phase-group" id="\${phase.id}">
            <div class="phase-separator">
              <span class="phase-saga-tag">\${phase.saga}</span>
              <h2 class="phase-headline">\${phase.title}</h2>
              <p class="phase-narrative">\${phase.tagline}</p>
            </div>
            <div class="entries-grid">
              \${phaseItems.map(e => renderCard(e)).join('')}
            </div>
          </section>
        \`;
      });
      root.innerHTML = html;
    }

    // Trigger scroll animations for newly rendered cards
    observeCards();
  }

  function renderCard(entry) {
    const poster = getPosterUrl(entry);
    const releaseYear = entry.releaseDate ? entry.releaseDate.substring(0, 4) : 'TBD';
    const ratingText = entry.imdbRating ? \`★ \${entry.imdbRating}\` : (entry.isUpcoming ? 'SOON' : '—');
    const typeClass = entry.type === 'film' ? 'film'
      : entry.type === 'series' ? 'series'
      : entry.type === 'special' ? 'special' : 'teaser';
    const typeLabel = entry.type === 'film' ? 'FILM'
      : entry.type === 'series' ? 'SERIES'
      : entry.type === 'special' ? 'SPECIAL' : 'UPCOMING';

    const chronoText = entry.inUniverseYear ? \`Story Year \${entry.inUniverseYear}\` : \`Era: \${releaseYear}\`;
    const director = (entry.directors && entry.directors.length > 0) ? entry.directors[0] : (entry.network || 'Marvel Studios');

    // Bottom stat
    let footerStat = '';
    if (entry.worldwideGross) {
      footerStat = \`
        <span class="stat-highlight">$\${(entry.worldwideGross / 1e9).toFixed(2)}B</span>
        <span class="network-highlight">\${entry.rtCritics ? entry.rtCritics + '% RT' : ''}</span>
      \`;
    } else if (entry.episodes) {
      footerStat = \`
        <span class="stat-highlight" style="font-size:14px;color:var(--text-sub)">\${entry.episodes} EPISODES</span>
        <span class="network-highlight">Disney+</span>
      \`;
    } else {
      footerStat = \`
        <span class="stat-highlight" style="font-size:14px;color:var(--gold-light)">PREMIERE</span>
        <span class="network-highlight">\${releaseYear}</span>
      \`;
    }

    return \`
      <article class="mcu-card" data-id="\${entry.id}" style="--accent-glow:\${entry.accentColor ? entry.accentColor + '33' : 'rgba(245,158,11,0.2)'}" onclick="openEntryModal('\${entry.id}')">
        <div class="poster-viewport">
          \${poster ? \`
            <img class="poster-img" src="\${poster}" alt="\${entry.title} Official Poster" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\\\'poster-fallback\\\\'><div class=\\\\'fallback-title\\\\'>\${entry.title.replace(/'/g, "\\\\'") }</div></div>';">
          \` : \`
            <div class="poster-fallback" style="background:linear-gradient(135deg, \${entry.accentColor || '#1e293b'}, #0b0f19)">
              <div class="fallback-title">\${entry.title}</div>
            </div>
          \`}
          <div class="poster-scrim"></div>
          <div class="top-badges">
            <span class="type-badge \${typeClass}">\${typeLabel}</span>
            <span class="rating-badge">\${ratingText}</span>
          </div>
        </div>
        <div class="card-details">
          <div class="chrono-tag">\${chronoText}</div>
          <h3 class="entry-title">\${entry.title}</h3>
          <div class="meta-row">
            <span>\${releaseYear}</span>
            <span class="meta-dot"></span>
            <span>\${entry.runtime || (entry.episodes ? entry.episodes + ' eps' : 'Feature')}</span>
          </div>
          <div class="director-line">Dir: \${director}</div>
          <div class="card-footer-stat">
            \${footerStat}
          </div>
        </div>
      </article>
    \`;
  }

  // 5. Scroll Animations (Intersection Observer)
  let cardObserver = null;
  function observeCards() {
    if (cardObserver) cardObserver.disconnect();

    cardObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.08
    });

    document.querySelectorAll('.mcu-card').forEach(c => cardObserver.observe(c));
  }

  // 6. Timeline Mode & Filter Actions
  window.setTimelineOrder = function(order) {
    currentOrder = order;
    document.getElementById('btn-order-release').classList.toggle('active', order === 'release');
    document.getElementById('btn-order-story').classList.toggle('active', order === 'story');
    renderTimeline();
  };

  window.setFilter = function(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-chip').forEach(btn => {
      const match = btn.getAttribute('onclick').includes(filter);
      btn.classList.toggle('active', match);
    });
    renderTimeline();
  };

  // 7. Interactive Entry Modal
  window.openEntryModal = function(id) {
    const entry = DATA.find(e => e.id === id);
    if (!entry) return;

    const scrim = document.getElementById('modal-scrim');
    const dialog = document.getElementById('modal-dialog');
    const bgImg = document.getElementById('modal-backdrop-img');
    const title = document.getElementById('modal-title');
    const phaseTag = document.getElementById('modal-phase-tag');
    const chips = document.getElementById('modal-chips');

    bgImg.src = getBackdropUrl(entry);
    bgImg.alt = entry.title + ' Cinematic Backdrop';
    title.textContent = entry.title;
    phaseTag.textContent = entry.phase ? \`\${entry.saga || ''} • PHASE \${entry.phase}\` : 'SPECIAL MARVEL ARCHIVE';

    const year = entry.releaseDate ? entry.releaseDate.substring(0, 4) : 'TBD';
    const runtime = entry.runtime || (entry.episodes ? \`\${entry.episodes} Episodes\` : 'Feature');
    chips.innerHTML = \`
      <span class="modal-chip gold">\${year}</span>
      <span class="modal-chip">\${runtime}</span>
      <span class="modal-chip">\${entry.type.toUpperCase()}</span>
      \${entry.inUniverseYear ? \`<span class="modal-chip">Story Year: \${entry.inUniverseYear}</span>\` : ''}
    \`;

    // Tab 1: Overview
    const tabOverview = document.getElementById('tab-overview');
    tabOverview.innerHTML = \`
      <p class="entry-synopsis">\${entry.summary || 'Summary pending TVA archive transmission.'}</p>
      \${entry.spoilerSummary ? \`
        <div class="spoiler-accordion">
          <button class="spoiler-header-btn" onclick="toggleSpoilerContent(this)">
            <span>⚠️ REVEAL TIMELINE SPOILERS & LORE IMPACT</span>
            <span>▼</span>
          </button>
          <div class="spoiler-content">\${entry.spoilerSummary}</div>
        </div>
      \` : ''}
      <div class="meta-codex-grid">
        <div class="codex-card"><div class="codex-key">Director(s)</div><div class="codex-val">\${(entry.directors || []).join(', ') || '—'}</div></div>
        <div class="codex-card"><div class="codex-key">Writer(s)</div><div class="codex-val">\${(entry.writers || []).join(', ') || '—'}</div></div>
        <div class="codex-card"><div class="codex-key">Composer</div><div class="codex-val">\${entry.composer || '—'}</div></div>
        <div class="codex-card"><div class="codex-key">Antagonist / Villain</div><div class="codex-val" style="color:var(--tva-red)">\${entry.villain || '—'}</div></div>
        <div class="codex-card"><div class="codex-key">Tagline</div><div class="codex-val" style="font-style:italic">"\${entry.tagline || 'Heroes Assemble.'}"</div></div>
        <div class="codex-card"><div class="codex-key">Post-Credits Scenes</div><div class="codex-val">\${entry.postCreditScenes != null ? entry.postCreditScenes + ' Scene(s)' : '—'}</div></div>
      </div>
      \${(entry.postCreditDetails && entry.postCreditDetails.length > 0) ? \`
        <div style="background:rgba(255,255,255,0.03);padding:16px;border-radius:12px;border:1px solid var(--surface-border);margin-top:16px;">
          <div class="codex-key" style="margin-bottom:8px;">Post-Credits Scene Breakdown:</div>
          <ul style="padding-left:20px;font-size:13px;color:var(--text-sub);line-height:1.7;">
            \${entry.postCreditDetails.map(d => \`<li>\${d}</li>\`).join('')}
          </ul>
        </div>
      \` : ''}
      <div class="modal-actions-row">
        \${entry.disneyPlusUrl ? \`<a href="\${entry.disneyPlusUrl}" target="_blank" rel="noopener" class="ext-btn disney">Stream on Disney+</a>\` : ''}
        \${entry.trailerUrl ? \`<a href="\${entry.trailerUrl}" target="_blank" rel="noopener" class="ext-btn trailer">Watch Official Trailer ↗</a>\` : ''}
      </div>
    \`;

    // Tab 2: Economics & Reception
    const tabEconomics = document.getElementById('tab-economics');
    const isFilm = entry.type === 'film' || entry.type === 'teaser';
    const fmt = n => n ? '$' + Number(n).toLocaleString('en-US') : '—';
    if (isFilm) {
      tabEconomics.innerHTML = \`
        <div class="economics-grid">
          <div class="econ-card"><div class="econ-key">Worldwide Gross</div><div class="econ-val">\${entry.worldwideGross ? '$' + (entry.worldwideGross / 1e9).toFixed(2) + 'B' : '—'}</div></div>
          <div class="econ-card"><div class="econ-key">Production Budget</div><div class="econ-val">\${entry.budget ? '$' + (entry.budget / 1e6).toFixed(0) + 'M' : '—'}</div></div>
          <div class="econ-card"><div class="econ-key">Opening Weekend</div><div class="econ-val">\${entry.openingWeekend ? '$' + (entry.openingWeekend / 1e6).toFixed(1) + 'M' : '—'}</div></div>
          <div class="econ-card"><div class="econ-key">Domestic Gross</div><div class="econ-val" style="font-size:24px">\${fmt(entry.domesticGross)}</div></div>
          <div class="econ-card"><div class="econ-key">ROI Multiple</div><div class="econ-val" style="color:var(--loki-green)">\${entry.roi ? entry.roi + 'x' : '—'}</div></div>
          <div class="econ-card"><div class="econ-key">Rank Within MCU</div><div class="econ-val">\${entry.rankMcu ? '#' + entry.rankMcu : '—'}</div></div>
          <div class="econ-card"><div class="econ-key">All-Time Global Rank</div><div class="econ-val">\${entry.rankAllTime ? '#' + entry.rankAllTime : '—'}</div></div>
          <div class="econ-card"><div class="econ-key">RT Critics</div><div class="econ-val">\${entry.rtCritics ? entry.rtCritics + '%' : '—'}</div></div>
          <div class="econ-card"><div class="econ-key">RT Audience</div><div class="econ-val">\${entry.rtAudience ? entry.rtAudience + '%' : '—'}</div></div>
          <div class="econ-card"><div class="econ-key">IMDb Rating</div><div class="econ-val">★ \${entry.imdbRating || '—'}</div></div>
          <div class="econ-card"><div class="econ-key">CinemaScore</div><div class="econ-val" style="color:#c084fc">\${entry.cinemaScore || '—'}</div></div>
        </div>
      \`;
    } else {
      tabEconomics.innerHTML = \`
        <div class="economics-grid">
          <div class="econ-card"><div class="econ-key">Total Episodes</div><div class="econ-val">\${entry.episodes || '—'}</div></div>
          <div class="econ-card"><div class="econ-key">Seasons</div><div class="econ-val">\${entry.seasons || 1}</div></div>
          <div class="econ-card"><div class="econ-key">Network</div><div class="econ-val" style="font-size:22px;color:#38bdf8">\${entry.network || 'Disney+'}</div></div>
          <div class="econ-card"><div class="econ-key">RT Critics</div><div class="econ-val">\${entry.rtCritics ? entry.rtCritics + '%' : '—'}</div></div>
          <div class="econ-card"><div class="econ-key">IMDb Rating</div><div class="econ-val">★ \${entry.imdbRating || '—'}</div></div>
        </div>
      \`;
    }

    // Tab 3: Cast
    const tabCast = document.getElementById('tab-cast');
    if (entry.cast && entry.cast.length > 0) {
      tabCast.innerHTML = \`
        <div class="cast-ensemble-grid">
          \${entry.cast.map(c => \`
            <div class="cast-member-card">
              <img class="cast-avatar" src="\${c.headshot || ''}" alt="\${c.actor}" loading="lazy" onerror="this.onerror=null;this.src='https://image.tmdb.org/t/p/w185/placeholder.jpg';this.style.background='#1e293b';">
              <div class="actor-name">\${c.actor}</div>
              <div class="character-name">\${c.character}</div>
            </div>
          \`).join('')}
        </div>
      \`;
    } else {
      tabCast.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 0;">Cast announcements for this timeline node are classified by Marvel Studios.</p>';
    }

    // Tab 4: Connections
    const tabConnections = document.getElementById('tab-connections');
    if (entry.connectedTo && entry.connectedTo.length > 0) {
      tabConnections.innerHTML = \`
        <div class="codex-key">Directly Connected MCU Timeline Nodes:</div>
        <div class="connections-wrap">
          \${entry.connectedTo.map(cid => {
            const rel = DATA.find(d => d.id === cid);
            return rel ? \`<button class="connection-pill" onclick="openEntryModal('\${rel.id}')">→ \${rel.title} (\${rel.releaseDate ? rel.releaseDate.substring(0,4) : 'TBD'})</button>\` : '';
          }).join('')}
        </div>
      \`;
    } else {
      tabConnections.innerHTML = '<p style="color:var(--text-muted);">Standalone temporal branch node.</p>';
    }

    // Reset to first tab
    switchModalTab('overview');

    // Open
    scrim.classList.add('active');
    dialog.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function() {
    document.getElementById('modal-scrim').classList.remove('active');
    document.getElementById('modal-dialog').classList.remove('active');
    document.body.style.overflow = '';
  };

  window.switchModalTab = function(tabName) {
    document.querySelectorAll('.m-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tabName));
  };

  window.toggleSpoilerContent = function(btn) {
    const pane = btn.nextElementSibling;
    const isShown = pane.classList.toggle('revealed');
    btn.querySelector('span:first-child').textContent = isShown ? '▲ CONCEAL TIMELINE SPOILERS' : '⚠️ REVEAL TIMELINE SPOILERS & LORE IMPACT';
    btn.querySelector('span:last-child').textContent = isShown ? '▲' : '▼';
  };

  // 8. Search Command Palette
  window.openSearch = function() {
    const scrim = document.getElementById('search-scrim');
    const box = document.getElementById('search-box');
    scrim.classList.add('active');
    box.value = '';
    box.focus();
    renderSearchResults('');
  };

  window.closeSearch = function() {
    document.getElementById('search-scrim').classList.remove('active');
  };

  function renderSearchResults(q) {
    const container = document.getElementById('search-results-container');
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

    hits = hits.slice(0, 15);
    if (hits.length === 0) {
      container.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-muted);">No timeline branch matched your query.</div>';
      return;
    }

    container.innerHTML = hits.map(e => {
      const poster = getPosterUrl(e);
      const year = e.releaseDate ? e.releaseDate.substring(0, 4) : 'TBD';
      return \`
        <div class="search-row" onclick="closeSearch();openEntryModal('\${e.id}')">
          <img class="search-thumb" src="\${poster || ''}" alt="\${e.title}" onerror="this.src='';this.style.background='#1e293b'">
          <div>
            <div class="search-row-title">\${e.title}</div>
            <div class="search-row-sub">\${year} • \${e.type.toUpperCase()} • Phase \${e.phase || 'Special'}</div>
          </div>
        </div>
      \`;
    }).join('');
  }

  // 9. Live Doomsday Countdown (Dec 18, 2026)
  function initCountdown() {
    const target = new Date('2026-12-18T00:00:00Z').getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        document.getElementById('doomsday-clock').innerHTML = '<div style="color:#10b981;font-size:24px;font-weight:700">DOOMSDAY HAS ARRIVED</div>';
        return;
      }
      const d = Math.floor(diff / 864e5);
      const h = Math.floor(diff % 864e5 / 36e5);
      const m = Math.floor(diff % 36e5 / 6e4);
      const s = Math.floor(diff % 6e4 / 1e3);

      document.getElementById('cd-days').textContent = d;
      document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
      document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
      document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  // 10. Financial & Archive Analytics Dashboard
  function initAnalytics() {
    const films = DATA.filter(e => e.type === 'film' && e.worldwideGross);
    const totalGross = films.reduce((acc, f) => acc + (f.worldwideGross || 0), 0);
    const totalBudget = films.reduce((acc, f) => acc + (f.budget || 0), 0);
    const billionFilms = films.filter(f => f.worldwideGross >= 1e9).length;
    const avgRoi = totalBudget > 0 ? (totalGross / totalBudget).toFixed(2) : '3.65';

    document.getElementById('analytics-grid').innerHTML = \`
      <div class="stat-box">
        <div class="stat-box-val">$\${(totalGross / 1e9).toFixed(2)}B</div>
        <div class="stat-box-lbl">Global Box Office Total</div>
      </div>
      <div class="stat-box">
        <div class="stat-box-val">\${billionFilms}</div>
        <div class="stat-box-lbl">Billion-Dollar Blockbusters</div>
      </div>
      <div class="stat-box">
        <div class="stat-box-val" style="color:var(--loki-green)">\${avgRoi}x</div>
        <div class="stat-box-lbl">Average Return On Investment</div>
      </div>
      <div class="stat-box">
        <div class="stat-box-val" style="color:#c084fc">40 Films</div>
        <div class="stat-box-lbl">30 Series & Specials</div>
      </div>
    \`;
  }

  // 11. Thanos Snap Easter Egg
  function initThanosSnap() {
    const btn = document.getElementById('snap-toggle-btn');
    btn.addEventListener('click', () => {
      isSnapped = !isSnapped;
      const cards = document.querySelectorAll('.mcu-card');
      if (isSnapped) {
        btn.innerHTML = '<span>💎 Reverse</span>';
        btn.style.borderColor = 'var(--loki-green)';
        btn.style.color = 'var(--loki-green)';
        cards.forEach((card, idx) => {
          if (idx % 2 === 0) card.classList.add('snapped');
        });
      } else {
        btn.innerHTML = '<span>⚡ Snap</span>';
        btn.style.borderColor = 'rgba(139, 92, 246, 0.4)';
        btn.style.color = '#c084fc';
        cards.forEach(card => card.classList.remove('snapped'));
      }
    });
  }

  // 12. Synthesized Web Audio API Temporal Drone
  let audioCtx = null;
  let isAudioPlaying = false;
  let masterGain = null;

  function toggleAudio() {
    const btn = document.getElementById('audio-toggle-btn');
    const text = document.getElementById('audio-state-text');

    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Master output
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      // Low cosmic drone (55Hz A1)
      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, audioCtx.currentTime);

      osc1.connect(filter);
      filter.connect(masterGain);
      osc1.start();

      // Second harmonic drone (110Hz)
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110, audioCtx.currentTime);

      const gain2 = audioCtx.createGain();
      gain2.gain.setValueAtTime(0.4, audioCtx.currentTime);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioPlaying) {
      masterGain.gain.setTargetAtTime(0.08, audioCtx.currentTime, 1.2);
      isAudioPlaying = true;
      btn.classList.add('active');
      text.textContent = 'Humming';
    } else {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.8);
      isAudioPlaying = false;
      btn.classList.remove('active');
      text.textContent = 'Sound';
    }
  }

  // 13. Dynamic Loki Sacred Timeline Canvas Animation
  function initCanvas() {
    const canvas = document.getElementById('timeline-canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Particle nodes along temporal strands
    const particles = [];
    const NUM_PARTICLES = 60;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.6,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.6 ? '#f59e0b' : (Math.random() > 0.5 ? '#10b981' : '#8b5cf6'),
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    let time = 0;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      // Draw flowing golden temporal streams (Loki Loom aesthetics)
      ctx.save();
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        const baseColor = s === 0 ? 'rgba(245, 158, 11, 0.12)' : (s === 1 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(139, 92, 246, 0.08)');
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 2 + s * 2;
        ctx.filter = 'blur(6px)';

        const scrollY = window.scrollY * 0.25;
        const startX = width * 0.15 + s * 80;
        ctx.moveTo(startX, 0);

        for (let y = 0; y <= height; y += 40) {
          const wave = Math.sin(y * 0.005 + time + s) * 70 + Math.cos(y * 0.002 - scrollY * 0.01) * 40;
          ctx.lineTo(startX + wave, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) { p.y = height; p.x = Math.random() * width; }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      requestAnimationFrame(animate);
    }
    animate();
  }

  // 14. Global Event Bindings
  function bindGlobalEvents() {
    // Search
    document.getElementById('open-search-btn').addEventListener('click', openSearch);
    document.getElementById('search-box').addEventListener('input', e => renderSearchResults(e.target.value));

    // Audio
    document.getElementById('audio-toggle-btn').addEventListener('click', toggleAudio);

    // Keyboard Shortcuts
    window.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeModal();
        closeSearch();
      }
    });
  }

  // 15. Engine Launch
  function init() {
    renderTimeline();
    initCountdown();
    initAnalytics();
    initThanosSnap();
    initCanvas();
    bindGlobalEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../index.html'), htmlContent, 'utf8');
console.log('Successfully generated complete ultra-realistic index.html!');
