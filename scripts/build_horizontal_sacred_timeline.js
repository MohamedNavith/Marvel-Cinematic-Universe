const fs = require('fs');
const path = require('path');

const tmdbMapping = require('./tmdb_real_images.json');
const mcuData = require('../data/mcu-data.js');

console.log('Compiling Horizontal Sacred Timeline Website...');
console.log('Total Entries:', mcuData.length);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Marvel Cinematic Universe — The Sacred Timeline</title>
<meta name="description" content="The definitive interactive horizontal archive of the Marvel Cinematic Universe. Explore every film, series, and phase along the glowing Sacred Timeline.">
<meta name="theme-color" content="#04080d">

<!-- Typography: Rajdhani (Display/Tech) + DM Sans (Clean Sans) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">

<style>
/* ============================================================
   DESIGN SYSTEM: HORIZONTAL SACRED TIMELINE
   Aesthetic: Studio-Grade (Apple/Linear/Marvel Studios),
   Translucent Glassmorphism, Glowing Living Timeline Light,
   Dual-Track Horizontal Scrolling, Verified 4K TMDB Artwork.
   ============================================================ */

:root {
  /* Colors */
  --bg-void: #03070c;
  --bg-space: #050b14;
  --bg-panel: rgba(8, 15, 24, 0.72);
  --bg-panel-hover: rgba(12, 22, 36, 0.88);
  --bg-card: rgba(7, 13, 22, 0.78);
  
  --line: rgba(191, 228, 235, 0.14);
  --line-subtle: rgba(191, 228, 235, 0.08);
  --line-bright: rgba(155, 232, 227, 0.45);

  --cyan: #9be8e3;
  --cyan-bright: #b8ffff;
  --cyan-glow: rgba(155, 232, 227, 0.28);
  --amber: #baa576;
  --gold: #f59e0b;
  --gold-glow: rgba(245, 158, 11, 0.3);
  --purple: #caa2f5;
  --purple-glow: rgba(202, 162, 245, 0.25);
  --marvel-red: #e62429;

  --text-primary: #edf4f4;
  --text-secondary: #8a9ba8;
  --text-tertiary: #526370;

  /* Typography */
  --font-display: 'Rajdhani', -apple-system, sans-serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Scale */
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

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--bg-void);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
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

/* ============================================================
   LIVING GLOWING BACKGROUND (CITADEL + SACRED TIMELINE RING)
   ============================================================ */
.cosmos-backdrop {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background-color: var(--bg-void);
}

/* 4K Clean Citadel with Sacred Timeline Aurora Ring */
.backdrop-citadel-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 46%;
  opacity: 0.85;
  filter: saturate(1.1) contrast(1.12);
  transform: scale(1.02);
  transition: transform 1.2s var(--ease-out), filter 0.8s ease;
}

/* Translucent Branching Timeline Overlay */
.backdrop-branching-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.28;
  mix-blend-mode: screen;
  filter: contrast(1.2);
  pointer-events: none;
}

/* Recreated Living Light Glow along the Sacred Timeline Ring */
.ring-glow-pulse {
  position: absolute;
  top: 36%;
  left: -10%;
  width: 120%;
  height: 140px;
  background: radial-gradient(ellipse 90% 60% at 50% 50%,
    rgba(155, 232, 227, 0.45) 0%,
    rgba(184, 255, 255, 0.35) 25%,
    rgba(202, 162, 245, 0.25) 55%,
    rgba(245, 158, 11, 0.15) 75%,
    transparent 100%);
  mix-blend-mode: screen;
  filter: blur(28px);
  animation: livingLightGlow 5s ease-in-out infinite alternate;
  pointer-events: none;
}

@keyframes livingLightGlow {
  0% {
    opacity: 0.55;
    filter: blur(24px);
    transform: translateY(-2px) scaleY(0.95);
  }
  100% {
    opacity: 0.95;
    filter: blur(36px);
    transform: translateY(2px) scaleY(1.08);
  }
}

/* Secondary Ambient Cosmic Nebulae */
.nebula-shimmer {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 45%, rgba(16, 185, 129, 0.08) 0%, transparent 45%),
    radial-gradient(circle at 82% 52%, rgba(139, 92, 246, 0.12) 0%, transparent 45%),
    radial-gradient(circle at 50% 15%, rgba(6, 182, 212, 0.07) 0%, transparent 50%);
  mix-blend-mode: screen;
  pointer-events: none;
}

/* Flowing Photon Particles Canvas */
#aurora-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* Subtle Vignette for Depth & Readability */
.cosmos-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(3, 7, 12, 0.75) 0%, transparent 22%, transparent 75%, rgba(3, 7, 12, 0.88) 100%),
    linear-gradient(90deg, rgba(3, 7, 12, 0.4) 0%, transparent 15%, transparent 85%, rgba(3, 7, 12, 0.4) 100%);
  pointer-events: none;
}

/* ============================================================
   TOP FIXED CONTROLS BAR (STUDIO-GRADE NAV)
   ============================================================ */
.studio-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  padding: 0 clamp(20px, 4vw, 60px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  background: linear-gradient(180deg, rgba(3, 7, 12, 0.92) 0%, rgba(3, 7, 12, 0.6) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--line-subtle);
}

.brand-badge-group {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.marvel-red-box {
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
.brand-text {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 11px;
  line-height: 0.92;
  letter-spacing: 0.18em;
  color: #edf4f4;
  text-transform: uppercase;
}

/* Phase Quick Jump Scrubber */
.phase-scrubber-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(8, 15, 24, 0.65);
  border: 1px solid var(--line-subtle);
  border-radius: 4px;
  padding: 4px;
}
.phase-pill-btn {
  padding: 6px 14px;
  border-radius: 2px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}
.phase-pill-btn:hover {
  color: var(--text-primary);
  background: rgba(155, 232, 227, 0.08);
}
.phase-pill-btn.active {
  color: var(--bg-void);
  background: var(--cyan);
  box-shadow: 0 0 12px var(--cyan-glow);
}

/* Header Action Controls */
.header-actions-dock {
  display: flex;
  align-items: center;
  gap: 10px;
}
.action-square-btn {
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 3px;
  display: grid;
  place-items: center;
  color: var(--text-secondary);
  background: rgba(8, 15, 24, 0.5);
  transition: all var(--duration-fast) var(--ease-out);
}
.action-square-btn:hover {
  color: var(--cyan);
  border-color: var(--line-bright);
  background: rgba(155, 232, 227, 0.08);
}
.action-square-btn.active {
  color: var(--cyan);
  border-color: var(--cyan);
  background: rgba(155, 232, 227, 0.15);
}

.order-toggle-btn {
  padding: 7px 14px;
  border: 1px solid var(--line);
  border-radius: 3px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  background: rgba(8, 15, 24, 0.5);
  transition: all var(--duration-fast);
  display: flex;
  align-items: center;
  gap: 6px;
}
.order-toggle-btn:hover {
  color: var(--text-primary);
  border-color: var(--line-bright);
}
.order-toggle-btn.story-active {
  color: var(--cyan);
  border-color: var(--cyan);
}

/* ============================================================
   HORIZONTAL TIMELINE MASTER VIEWPORT
   ============================================================ */
.horizontal-timeline-viewport {
  position: absolute;
  top: 72px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  display: flex;
  align-items: stretch;
  cursor: grab;
  user-select: none;
  scrollbar-color: rgba(155, 232, 227, 0.3) transparent;
  scrollbar-width: thin;
  scroll-behavior: smooth;
}
.horizontal-timeline-viewport:active {
  cursor: grabbing;
}

/* The Horizontal Track Canvas */
.timeline-track-rail {
  display: inline-flex;
  align-items: stretch;
  height: 100%;
  padding: 0 80px 0 0;
}

/* ============================================================
   HERO MILESTONE MODULE (Start of Horizontal Timeline)
   ============================================================ */
.hero-timeline-node {
  flex: 0 0 clamp(480px, 45vw, 680px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px clamp(32px, 5vw, 64px);
  border-right: 1px solid var(--line);
  position: relative;
  background: linear-gradient(90deg, rgba(4, 8, 13, 0.8) 0%, rgba(4, 8, 13, 0.3) 100%);
  backdrop-filter: blur(8px);
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.32em;
  color: #a8c3c7;
  text-transform: uppercase;
  margin-bottom: 20px;
}
.hero-eyebrow::before,
.hero-eyebrow::after {
  content: "";
  width: 24px;
  height: 1px;
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
}

.hero-giant-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(48px, 6vw, 84px);
  line-height: 0.85;
  letter-spacing: -0.04em;
  color: #edf2f0;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.hero-giant-title em {
  display: block;
  font-style: normal;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(185, 229, 231, 0.85);
  text-shadow: 0 0 24px rgba(105, 221, 228, 0.25);
  letter-spacing: -0.02em;
}

.hero-blurb-text {
  color: #9cb0bc;
  font-size: 14px;
  line-height: 1.6;
  white-space: normal;
  max-width: 440px;
  margin-bottom: 32px;
}

.hero-start-cta {
  display: inline-grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  color: #eaf2f1;
  border: 1px solid rgba(195, 229, 229, 0.25);
  background: rgba(5, 15, 23, 0.7);
  padding: 10px 18px 10px 10px;
  border-radius: 4px;
  backdrop-filter: blur(12px);
  width: fit-content;
  transition: all var(--duration-normal) var(--ease-out);
}
.hero-start-cta:hover {
  border-color: var(--cyan);
  background: rgba(8, 22, 33, 0.9);
  box-shadow: 0 8px 25px rgba(83, 209, 218, 0.15);
}
.cta-play-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(155, 232, 227, 0.4);
  border-radius: 2px;
  color: var(--cyan);
}
.hero-start-cta small {
  display: block;
  color: #778891;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.hero-start-cta strong {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-timeline-node-footer {
  margin-top: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-tertiary);
  font-family: var(--font-display);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.hero-timeline-node-footer span {
  color: var(--cyan);
}

/* ============================================================
   PHASE SECTIONS ALONG THE HORIZONTAL STREAM
   ============================================================ */
.phase-horizontal-block {
  display: inline-flex;
  align-items: stretch;
  position: relative;
  border-right: 1px dashed var(--line);
}

/* Phase Vertical Header Pillar */
.phase-pillar {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px 24px;
  background: rgba(5, 10, 18, 0.65);
  backdrop-filter: blur(14px);
  border-right: 1px solid var(--line);
  position: sticky;
  left: 0;
  z-index: 5;
}
.pillar-tag {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.25em;
  color: var(--cyan);
  text-transform: uppercase;
}
.pillar-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 26px;
  letter-spacing: 0.04em;
  color: #ffffff;
  line-height: 1.05;
  margin: 6px 0 10px;
  text-transform: uppercase;
}
.pillar-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: normal;
  max-width: 170px;
}
.pillar-count {
  margin-top: auto;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

/* Dual Horizontal Track (Upper = Films, Lower = Series) */
.phase-lanes-cluster {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 24px 36px;
  position: relative;
}

/* Glowing Connecting Horizontal Thread Behind Cards */
.phase-lanes-cluster::before {
  content: "";
  position: absolute;
  top: 31%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(155, 232, 227, 0.2), rgba(155, 232, 227, 0.65), rgba(155, 232, 227, 0.2));
  box-shadow: 0 0 10px var(--cyan-glow);
  z-index: 1;
  pointer-events: none;
}
.phase-lanes-cluster::after {
  content: "";
  position: absolute;
  bottom: 27%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(202, 162, 245, 0.15), rgba(202, 162, 245, 0.5), rgba(202, 162, 245, 0.15));
  box-shadow: 0 0 8px var(--purple-glow);
  z-index: 1;
  pointer-events: none;
}

.horizontal-lane {
  display: flex;
  gap: 20px;
  align-items: center;
  position: relative;
  z-index: 2;
}

/* ============================================================
   TRANSLUCENT HORIZONTAL CARDS
   ============================================================ */
.h-card {
  flex: 0 0 160px;
  width: 160px;
  background: var(--bg-panel);
  border: 1px solid var(--line);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  backdrop-filter: blur(14px);
  transition: transform var(--duration-normal) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
  position: relative;
}
.h-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: var(--cyan);
  background: var(--bg-panel-hover);
  box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.8), 0 0 20px var(--cyan-glow);
}

.h-poster-box {
  position: relative;
  aspect-ratio: 2 / 3;
  width: 100%;
  background: #081018;
  overflow: hidden;
}
.h-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--duration-slow) var(--ease-out);
}
.h-card:hover .h-poster-img {
  transform: scale(1.05);
}

.h-poster-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(4, 8, 13, 0.95) 100%);
  pointer-events: none;
}

.h-top-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  pointer-events: none;
}
.h-format-pill {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 8px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 2px;
  background: rgba(4, 8, 13, 0.85);
  border: 1px solid var(--line);
}
.h-format-pill.film { color: var(--cyan); }
.h-format-pill.series { color: #caa2f5; }
.h-format-pill.special { color: #7fe49b; }

.h-rating-pill {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 10px;
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 2px;
  background: rgba(4, 8, 13, 0.85);
  border: 1px solid var(--line);
}

.h-card-body {
  padding: 10px 12px 14px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.h-chrono-tag {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.15em;
  color: var(--cyan);
  text-transform: uppercase;
  margin-bottom: 2px;
}
.h-card-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  line-height: 1.15;
  letter-spacing: 0.03em;
  color: #edf4f4;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
  transition: color var(--duration-fast);
}
.h-card:hover .h-card-title {
  color: var(--cyan);
}
.h-card-sub {
  font-size: 11px;
  color: var(--text-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ============================================================
   AVENGERS: DOOMSDAY & SECRET WARS ENDCAPS
   ============================================================ */
.doomsday-horizontal-node {
  flex: 0 0 460px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 36px 44px;
  background: radial-gradient(circle at 75% 30%, rgba(155, 232, 227, 0.1) 0%, transparent 60%),
              rgba(6, 12, 20, 0.78);
  backdrop-filter: blur(16px);
  border-right: 1px solid var(--line);
  position: relative;
}
.doomsday-horizontal-node .doomsday-eyebrow {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.28em;
  color: var(--cyan);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.doomsday-horizontal-node h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 40px;
  line-height: 0.95;
  letter-spacing: 0.02em;
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.doomsday-horizontal-node p {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
  white-space: normal;
  max-width: 360px;
  margin-bottom: 24px;
}

.countdown-clock-row {
  display: flex;
  gap: 10px;
}
.cd-unit-box {
  background: rgba(4, 8, 13, 0.85);
  border: 1px solid var(--line);
  border-radius: 3px;
  padding: 10px 14px;
  min-width: 68px;
  text-align: center;
}
.cd-unit-num {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 26px;
  line-height: 1;
  color: var(--cyan);
}
.cd-unit-lbl {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 8px;
  letter-spacing: 0.18em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-top: 2px;
}

/* Secret Wars Endcap */
.secret-wars-endcap {
  flex: 0 0 340px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px;
  background: rgba(8, 12, 22, 0.5);
  border-right: 1px solid var(--line);
}
.secret-wars-endcap span {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 9px;
  letter-spacing: 0.25em;
  color: #caa2f5;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.secret-wars-endcap h4 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 28px;
  letter-spacing: 0.04em;
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.secret-wars-endcap p {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: normal;
  line-height: 1.6;
}

/* ============================================================
   BOTTOM STATUS BAR (TIMELINE PROGRESS & CONTROLS)
   ============================================================ */
.bottom-dock-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  padding: 0 clamp(20px, 4vw, 60px);
  background: rgba(3, 7, 12, 0.9);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--line-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  font-family: var(--font-display);
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.timeline-progress-track {
  flex: 1;
  max-width: 480px;
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1px;
  margin: 0 32px;
  position: relative;
  overflow: hidden;
}
.timeline-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 0%;
  background: linear-gradient(90deg, var(--cyan), #caa2f5);
  box-shadow: 0 0 8px var(--cyan);
  transition: width 80ms ease-out;
}

/* ============================================================
   INTERACTIVE DETAIL MODAL (STUDIO CODEX LIGHTBOX)
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
  width: min(1000px, 94vw);
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
  height: 300px;
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
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 3px;
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
  bottom: 20px;
  left: 32px;
  right: 32px;
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
  font-size: clamp(26px, 4vw, 42px);
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
  padding: 24px 32px 36px;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-tabs-nav {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 24px;
}
.m-tab-btn {
  padding: 0 0 10px;
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

.synopsis-text {
  font-size: 14px;
  line-height: 1.75;
  color: #d1dde5;
  margin-bottom: 22px;
  max-width: 760px;
}

.spoiler-toggle-box {
  border: 1px solid rgba(230, 36, 41, 0.3);
  border-radius: 3px;
  background: rgba(230, 36, 41, 0.04);
  margin-bottom: 24px;
  overflow: hidden;
}
.spoiler-header-trigger {
  width: 100%;
  padding: 12px 16px;
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
  padding: 0 16px 16px;
  font-size: 13px;
  line-height: 1.7;
  color: #c9d8e2;
}
.spoiler-reveal-body.is-shown {
  display: block;
}

.meta-grid-two-col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}
.meta-field-cell {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--line-subtle);
  border-radius: 2px;
  padding: 12px 14px;
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
  font-size: 13px;
  color: #ffffff;
  font-weight: 500;
}

/* Metrics Grid */
.metrics-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
}
.stat-item-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--line-subtle);
  border-radius: 2px;
  padding: 16px;
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
  font-size: 26px;
  color: var(--cyan);
}

/* Cast Grid */
.cast-scroller-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 16px 12px;
}
.cast-tile {
  text-align: center;
}
.cast-avatar-frame {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 6px;
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

/* Search Palette Modal */
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
  color: #ffffff;
  text-transform: uppercase;
}
.search-hit-info span {
  font-size: 11px;
  color: var(--text-secondary);
}

.action-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
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

@media (max-width: 768px) {
  .phase-scrubber-nav { display: none; }
  .h-card { flex-basis: 140px; width: 140px; }
  .phase-pillar { flex-basis: 150px; }
}
</style>
</head>
<body>

<!-- Fixed Glowing Background (Clean Citadel 4K + Living Light Aurora Ring) -->
<div class="cosmos-backdrop">
  <img class="backdrop-citadel-img" src="assets/img/sacred-timeline-citadel-clean.webp" alt="The Sacred Timeline Citadel">
  <img class="backdrop-branching-overlay" src="assets/img/sacred-timeline-branching.png" alt="Branching Timeline Strands">
  <div class="ring-glow-pulse"></div>
  <div class="nebula-shimmer"></div>
  <canvas id="aurora-canvas"></canvas>
  <div class="cosmos-scrim"></div>
</div>

<!-- Studio Header Navigation -->
<header class="studio-header">
  <a href="#" class="brand-badge-group">
    <span class="marvel-red-box">MARVEL</span>
    <span class="brand-text">CINEMATIC<br>UNIVERSE</span>
  </a>

  <!-- Phase Quick Jump Scrubber -->
  <nav class="phase-scrubber-nav" id="phase-scrubber">
    <button class="phase-pill-btn active" onclick="scrollToPhaseAnchor('hero-node', this)">Beginning</button>
    <button class="phase-pill-btn" onclick="scrollToPhaseAnchor('phase-1', this)">Phase 1</button>
    <button class="phase-pill-btn" onclick="scrollToPhaseAnchor('phase-2', this)">Phase 2</button>
    <button class="phase-pill-btn" onclick="scrollToPhaseAnchor('phase-3', this)">Phase 3</button>
    <button class="phase-pill-btn" onclick="scrollToPhaseAnchor('phase-4', this)">Phase 4</button>
    <button class="phase-pill-btn" onclick="scrollToPhaseAnchor('phase-5', this)">Phase 5</button>
    <button class="phase-pill-btn" onclick="scrollToPhaseAnchor('phase-6', this)">Phase 6</button>
    <button class="phase-pill-btn" onclick="scrollToPhaseAnchor('doomsday-node', this)">Doomsday</button>
  </nav>

  <!-- Controls Dock -->
  <div class="header-actions-dock">
    <button class="order-toggle-btn" id="btn-toggle-order" onclick="toggleTimelineOrder()" title="Toggle Story Chronology vs Release Order">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>
      <span id="order-label-text">Story Order</span>
    </button>

    <button class="action-square-btn" id="btn-search-trigger" onclick="openSearchModal()" title="Search Timeline (Ctrl+K)">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    </button>

    <button class="action-square-btn" id="btn-audio-toggle" onclick="toggleAmbientHum()" title="Toggle Ambient Temporal Drone">
      <svg width="15" height="15" id="audio-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 14h4l5 4V6l-5 4H4z"/><path d="m17 10 5 5m0-5-5 5"/></svg>
    </button>
  </div>
</header>

<!-- Horizontal Timeline Viewport -->
<div class="horizontal-timeline-viewport" id="horizontal-timeline">
  <div class="timeline-track-rail">

    <!-- Hero Milestone Anchor -->
    <section class="hero-timeline-node" id="hero-node">
      <div class="hero-eyebrow">EARTH-616 · TEMPORAL ARCHIVE</div>
      <h1 class="hero-giant-title">THE SACRED<br><em>TIMELINE</em></h1>
      <p class="hero-blurb-text">
        Every story. Every sacrifice. One universe — until it wasn't. Scroll horizontally to journey from Tony Stark in 2008 to the dawn of the Multiverse War.
      </p>

      <button class="hero-start-cta" onclick="scrollToPhaseAnchor('phase-1')">
        <span class="cta-play-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        </span>
        <span>
          <small>BEGIN THE JOURNEY</small>
          <strong>Enter the timeline</strong>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>
      </button>

      <div class="hero-timeline-node-footer">
        <div>FROM THE BEGINNING · <span>IRON MAN (2008)</span></div>
        <div><span>SCROLL HORIZONTALLY →</span></div>
      </div>
    </section>

    <!-- Phase Containers Generated by JS -->
    <div id="dynamic-phases-horizontal-root" style="display:inline-flex;align-items:stretch;"></div>

    <!-- Avengers: Doomsday Horizontal Node -->
    <section class="doomsday-horizontal-node" id="doomsday-node">
      <div class="doomsday-eyebrow">PHASE 6 · MULTIVERSE FINALE</div>
      <h3>AVENGERS:<br>DOOMSDAY</h3>
      <p>
        The culmination of the Multiverse Saga. Robert Downey Jr. returns as Victor von Doom, directed by Anthony and Joe Russo.
      </p>

      <div class="countdown-clock-row">
        <div class="cd-unit-box"><div class="cd-unit-num" id="cd-days">---</div><div class="cd-unit-lbl">Days</div></div>
        <div class="cd-unit-box"><div class="cd-unit-num" id="cd-hours">--</div><div class="cd-unit-lbl">Hours</div></div>
        <div class="cd-unit-box"><div class="cd-unit-num" id="cd-mins">--</div><div class="cd-unit-lbl">Mins</div></div>
        <div class="cd-unit-box"><div class="cd-unit-num" id="cd-secs">--</div><div class="cd-unit-lbl">Secs</div></div>
      </div>

      <div style="margin-top:20px;">
        <button class="action-link-btn" onclick="openEntryDetail('avengers-doomsday')">Inspect Milestone Node →</button>
      </div>
    </section>

    <!-- Secret Wars Endcap -->
    <section class="secret-wars-endcap" id="secret-wars-node">
      <span>UNWRITTEN FUTURE · DEC 17, 2027</span>
      <h4>AVENGERS: SECRET WARS</h4>
      <p>The collapse of all realities. Time fractures into Battleworld.</p>
    </section>

  </div>
</div>

<!-- Bottom Status Dock & Progress Bar -->
<div class="bottom-dock-bar">
  <div>01 · FROM THE BEGINNING</div>

  <div class="timeline-progress-track">
    <div class="timeline-progress-fill" id="timeline-progress-fill"></div>
  </div>

  <div id="status-counter-text">70 STORIES · 19 YEARS · 1 TIMELINE</div>
</div>

<!-- Interactive Detail Modal -->
<div class="modal-layer" id="detail-modal-layer" role="dialog" aria-modal="true" onclick="if(event.target===this) closeEntryDetail()">
  <div class="detail-modal">
    <button class="modal-close-trigger" onclick="closeEntryDetail()" aria-label="Close dialog">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 6-12 12M6 6l12 12"/></svg>
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input type="text" id="search-query-field" placeholder="Search films, series, characters, directors, villains..." autocomplete="off">
      <span style="font-size:10px;font-family:monospace;padding:2px 6px;border:1px solid var(--line);border-radius:2px;color:var(--text-secondary)">ESC</span>
    </div>
    <div class="search-results-viewport" id="search-results-viewport"></div>
  </div>
</div>

<!-- Data dependencies -->
<script src="data/mcu-data.js"></script>
<script src="data/tmdb-images.js"></script>
<script>
/* ============================================================
   HORIZONTAL TIMELINE CONTROLLER & ENGINE
   Natural horizontal flow, wheel mapping, glowing living light
   ============================================================ */
(function() {
  'use strict';

  const DATA = Array.isArray(window.MCU_DATA) ? window.MCU_DATA : [];
  const TMDB_CDN_MAP = window.TMDB_IMAGES || {};

  // State
  let timelineOrder = 'story'; // 'story' | 'release'

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

  const PHASES_INFO = [
    { num: 1, label: 'PHASE ONE', name: 'ASSEMBLE', years: '2008–2012', desc: 'Six strangers answer the call to defend Earth.' },
    { num: 2, label: 'PHASE TWO', name: 'EXPANSION', years: '2013–2015', desc: 'Shattered shields and cosmic borders opened.' },
    { num: 3, label: 'PHASE THREE', name: 'APEX', years: '2016–2019', desc: 'The Infinity Gauntlet. The Snap. The Endgame.' },
    { num: 4, label: 'PHASE FOUR', name: 'FRACTURE', years: '2021–2022', desc: 'The Multiverse branches. New legends rise.' },
    { num: 5, label: 'PHASE FIVE', name: 'INVASION', years: '2023–2025', desc: 'Subatomic realms and variant incursions.' },
    { num: 6, label: 'PHASE SIX', name: 'CONVERGENCE', years: '2025–2027', desc: 'The reign of Victor von Doom.' }
  ];

  function getSortedData() {
    let list = [...DATA];
    if (timelineOrder === 'story') {
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

  // Render Horizontal Timeline
  function renderHorizontalTimeline() {
    const root = document.getElementById('dynamic-phases-horizontal-root');
    const items = getSortedData();

    let markup = '';

    PHASES_INFO.forEach(phase => {
      const phaseItems = items.filter(e => e.phase === phase.num);
      if (phaseItems.length === 0) return;

      const films = phaseItems.filter(e => e.type === 'film' || e.type === 'teaser');
      const series = phaseItems.filter(e => e.type === 'series' || e.type === 'special');

      markup += \`
        <section class="phase-horizontal-block" id="phase-\${phase.num}">
          <div class="phase-pillar">
            <span class="pillar-tag">\${phase.label} · \${phase.years}</span>
            <h3 class="pillar-title">\${phase.name}</h3>
            <p class="pillar-desc">\${phase.desc}</p>
            <div class="pillar-count">\${phaseItems.length} CHAPTERS</div>
          </div>

          <div class="phase-lanes-cluster">
            <!-- Upper Lane: Films -->
            <div class="horizontal-lane">
              \${films.map(e => createCardHTML(e)).join('')}
            </div>

            <!-- Lower Lane: Series & Specials -->
            \${series.length > 0 ? \`
              <div class="horizontal-lane">
                \${series.map(e => createCardHTML(e)).join('')}
              </div>
            \` : ''}
          </div>
        </section>
      \`;
    });

    root.innerHTML = markup;
    updateTimelineProgress();
  }

  function createCardHTML(item) {
    const poster = getPosterPath(item);
    const year = item.releaseDate ? item.releaseDate.substring(0, 4) : 'TBD';
    const rating = item.imdbRating ? \`★ \${item.imdbRating}\` : (item.isUpcoming ? 'SOON' : '—');
    const typeClass = item.type === 'film' ? 'film' : item.type === 'series' ? 'series' : item.type === 'special' ? 'special' : 'teaser';
    const typeLabel = item.type === 'film' ? 'FILM' : item.type === 'series' ? 'SERIES' : item.type === 'special' ? 'SPECIAL' : 'UPCOMING';
    const chronoTag = item.inUniverseYear ? \`Story: \${item.inUniverseYear}\` : \`Era: \${year}\`;

    return \`
      <article class="h-card" onclick="openEntryDetail('\${item.id}')">
        <div class="h-poster-box">
          <img class="h-poster-img" src="\${poster}" alt="\${item.title}" loading="lazy" onerror="this.onerror=null;this.src='https://image.tmdb.org/t/p/w780/pzIddUEMWhSEqEFq8B3PKYB32Wm.jpg'">
          <div class="h-poster-scrim"></div>
          <div class="h-top-badge">
            <span class="h-format-pill \${typeClass}">\${typeLabel}</span>
            <span class="h-rating-pill">\${rating}</span>
          </div>
        </div>
        <div class="h-card-body">
          <div class="h-chrono-tag">\${chronoTag}</div>
          <h4 class="h-card-title">\${item.title}</h4>
          <div class="h-card-sub">
            <span>\${year}</span>
            <span>\${item.runtime || (item.episodes ? item.episodes + ' eps' : 'Feature')}</span>
          </div>
        </div>
      </article>
    \`;
  }

  // Smooth Horizontal Wheel Scroll Mapping
  const viewport = document.getElementById('horizontal-timeline');

  viewport.addEventListener('wheel', (e) => {
    // When inside horizontal viewport, map vertical mouse wheel directly to smooth horizontal scroll
    if (e.deltaY !== 0 && !e.shiftKey) {
      viewport.scrollLeft += e.deltaY * 1.6;
      e.preventDefault();
      updateTimelineProgress();
    }
  }, { passive: false });

  // Update progress bar and active phase on horizontal scroll
  viewport.addEventListener('scroll', () => {
    updateTimelineProgress();
    highlightActivePhase();
  }, { passive: true });

  function updateTimelineProgress() {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    if (maxScroll <= 0) return;
    const pct = Math.min(100, Math.max(0, (viewport.scrollLeft / maxScroll) * 100));
    document.getElementById('timeline-progress-fill').style.width = pct + '%';
  }

  function highlightActivePhase() {
    const scrollPos = viewport.scrollLeft + 300;
    const phases = ['hero-node', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'phase-5', 'phase-6', 'doomsday-node'];
    
    for (let i = phases.length - 1; i >= 0; i--) {
      const el = document.getElementById(phases[i]);
      if (el && el.offsetLeft <= scrollPos) {
        document.querySelectorAll('.phase-pill-btn').forEach((btn, idx) => {
          btn.classList.toggle('active', idx === i);
        });
        break;
      }
    }
  }

  // Smooth navigation to anchors
  window.scrollToPhaseAnchor = function(anchorId, btn) {
    const el = document.getElementById(anchorId);
    if (!el) return;
    viewport.scrollTo({
      left: el.offsetLeft - 40,
      behavior: 'smooth'
    });
    if (btn) {
      document.querySelectorAll('.phase-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  };

  // Toggle Story Order vs Release Order
  window.toggleTimelineOrder = function() {
    timelineOrder = timelineOrder === 'story' ? 'release' : 'story';
    const label = document.getElementById('order-label-text');
    const btn = document.getElementById('btn-toggle-order');
    if (timelineOrder === 'story') {
      label.textContent = 'Story Order';
      btn.classList.add('story-active');
    } else {
      label.textContent = 'Release Order';
      btn.classList.remove('story-active');
    }
    renderHorizontalTimeline();
  };

  // Modal Details
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
        <div style="background:rgba(255,255,255,0.02);padding:14px;border-radius:2px;border:1px solid var(--line-subtle);margin-bottom:20px;">
          <div class="meta-field-label" style="margin-bottom:6px;">Post-Credits Scene Details:</div>
          <ul style="padding-left:18px;font-size:13px;color:var(--text-secondary);line-height:1.7;">
            \${item.postCreditDetails.map(d => \`<li>\${d}</li>\`).join('')}
          </ul>
        </div>
      \` : ''}
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px;">
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
  };

  window.closeEntryDetail = function() {
    document.getElementById('detail-modal-layer').classList.remove('is-open');
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

  // Search Modal
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

  // Doomsday Timer
  function initDoomsdayTimer() {
    const target = new Date('2026-12-18T00:00:00Z').getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) return;
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

  // Living Light Aurora Wave Canvas
  function initLivingCanvas() {
    const canvas = document.getElementById('aurora-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const NUM = 45;
    for (let i = 0; i < NUM; i++) {
      particles.push({
        x: Math.random() * width,
        y: height * 0.35 + Math.random() * 80,
        vx: 0.4 + Math.random() * 0.8,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#b8ffff' : '#f59e0b',
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      requestAnimationFrame(animate);
    }
    animate();
  }

  // Synthesized Web Audio API Ambient Temporal Hum
  let audioCtx = null;
  let masterGain = null;
  let isAudioActive = false;

  window.toggleAmbientHum = function() {
    const btn = document.getElementById('btn-audio-toggle');
    const svg = document.getElementById('audio-icon-svg');

    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, audioCtx.currentTime);

      osc1.connect(filter);
      filter.connect(masterGain);
      osc1.start();

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
      svg.innerHTML = '<path d="M4 14h4l5 4V6l-5 4H4z"/><path d="M17 9.5c1.7 1.3 1.7 3.7 0 5"/>';
    } else {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.8);
      isAudioActive = false;
      btn.classList.remove('active');
      svg.innerHTML = '<path d="M4 14h4l5 4V6l-5 4H4z"/><path d="m17 10 5 5m0-5-5 5"/>';
    }
  };

  // Keyboard navigation
  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeEntryDetail();
      closeSearchModal();
    }
    if (e.key === 'ArrowRight') {
      viewport.scrollBy({ left: 320, behavior: 'smooth' });
    }
    if (e.key === 'ArrowLeft') {
      viewport.scrollBy({ left: -320, behavior: 'smooth' });
    }
  });

  document.getElementById('search-query-field').addEventListener('input', e => updateSearchResults(e.target.value));

  // Initialize
  function init() {
    renderHorizontalTimeline();
    initDoomsdayTimer();
    initLivingCanvas();
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

fs.writeFileSync(path.join(__dirname, '../index.html'), html, 'utf8');
console.log('Successfully written horizontal index.html!');
