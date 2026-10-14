# MCU: THE SACRED TIMELINE
### Award-Level Interactive Cinematic Chronometer & Case Study Archive (2008–2027)

> **"For all time. Always."**

An award-level, zero-framework interactive web application documenting every theatrical film, Disney+ series, Special Presentation, and canonical milestone across the Marvel Cinematic Universe—from *Iron Man* (2008) to *Avengers: Doomsday* (December 18, 2026) and the upcoming *Avengers: Secret Wars* (2027) teaser node.

Built as an academic Open Lab case study and creative technology portfolio piece exploring GPU-accelerated horizontal translation, live Web Audio synthesis, procedural particle systems, and zero-runtime-overhead design.

---

## 🌟 Key Features

### 1. Vertical-to-Horizontal Fluid Movement
- **Natural Vertical Input:** You scroll naturally using your mouse wheel, trackpad, touch swipe, or keyboard.
- **Hardware-Accelerated Horizontal Glide:** Vertical scroll coordinates map 1:1 to horizontal translation via GPU-accelerated `translate3d(-${currentX}px, 0, 0)` in `requestAnimationFrame`, delivering locked 60–144 fps rendering with zero layout thrashing.
- **Direct Canvas Scrubbing:** Click and drag anywhere on the timeline canvas to smoothly scrub through MCU history.

### 2. Balanced Two-Row Architecture
- **Two Parallel Horizontal Rows:** Eliminates wasted vertical space by grouping films, series, and specials across two illuminated tracks connected by glowing temporal rails.
- **Dual Layout Modes:**
  - **`2-Row Grid` (Default):** Chronologically balanced distribution where both upper and lower rows are evenly populated across all six phases.
  - **`Split Rows`:** Row 1 strictly hosts Theatrical Feature Films; Row 2 strictly hosts Disney+ Series & Specials (with a translucent Cinematic Vault card for Phases 1–3).
- **Instant Filters:** Quickly isolate `All (70)`, `Films (40)`, or `Series (30)`.

### 3. Phenomenal 4K Background & Zero-Blur Glassmorphism
- **Machine Vision Inpainting:** Watermarks ("MARVEL STUDIOS LOKI" and "TRIXTER CINESITE") were removed from the original 4K background artwork using automated pixel gradient interpolation and noise dithering (0 white watermark pixels remaining).
- **Rock-Solid Stability:** The background Citadel image remains stationary while the foreground timeline glides past, creating the visual perspective of floating in space at the Citadel at the End of Time.
- **Unblurred Transparency:** Traditional blur filters were removed in favor of crisp alpha tints (`rgba(6, 12, 20, 0.40)`), ensuring the 4K stars, cosmic nebula, and asteroid details remain 100% sharp behind all cards and navigation.
- **Living Light Aura & Particles:** A pulsing multi-stop radial gradient beam along the Sacred Timeline ring combined with an HTML5 Canvas drawing 50 flowing quantum photon particles.

### 4. Cinematic Immersive View (Double-Tap / Double-Click)
- **Zen / Artwork Mode:** Double-click on desktop or double-tap on mobile (<350ms touch delta) to smoothly fade out the middle movie section (`opacity: 0; transition: opacity 0.45s ease`).
- **Header & Footer Preserved:** The studio header and bottom status bar remain intact while the background Citadel asteroid and glowing living light ring are revealed in unobstructed full scale.
- Double-click or tap anywhere to return to the timeline view immediately. Also accessible via the eye icon button in the header.

### 5. High-Resolution Cast & Crew Engine
- **601 Verified Actor Portraits:** Hierarchical image resolver maps actors to `w500` TMDB portraits and local high-res WebP/JPEG files, eliminating blurry thumbnails.
- Enhanced with `-webkit-optimize-contrast` and portrait framing.

### 6. Movie Stills & Series Episode Guides in Modal
- **Cinematic Stills (Films):** Each movie modal includes 2 to 3 high-resolution widescreen stills showcasing defining battles and assemble sequences with titles and captions.
- **Complete Episode Guide (Series):** Each Disney+ series includes a comprehensive episode guide featuring:
  - Episode Number badge (`EPISODE 01`)
  - Official Episode Title
  - IMDb User Rating (`★ 8.8 / 10`)
  - Official Runtime (`51 min`)
  - Episode Preview Still
  - Spoiler-Free Episode Synopsis

### 7. Real-Time Procedural Web Audio Ambient Drone
- **Zero Audio Files:** 100% synthetically generated in real time using the browser's native `AudioContext`.
- Dual harmonic oscillators ($55\text{ Hz}$ sawtooth + $110\text{ Hz}$ sine) with a $140\text{ Hz}$ resonant lowpass filter evoke the deep cosmic hum of the Citadel's temporal technology.

### 8. Instant Search & Live Doomsday Countdown
- **Fuzzy Search Palette:** Press <kbd>Ctrl</kbd>+<kbd>K</kbd> to search across 70 titles, directors, actors, characters, and villains.
- **Doomsday Countdown:** Live countdown clock ticking down to December 18, 2026.

---

## 🚀 Quick Start & Running Locally

### Option 1: Direct Double-Click (`file://`)
The application has zero runtime dependencies and runs directly from your file system:
1. Clone or download this repository.
2. Double-click `index.html` in your file explorer.
3. The entire timeline, verified TMDB artwork, and Web Audio synthesizer will load instantly.

### Option 2: Local HTTP Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .
```
Navigate to `http://localhost:8000`.

---

## 🌐 Deploying to GitHub Pages (Free Hosting)

Deploy this interactive timeline live on the web in 3 simple steps:

1. Push this repository to GitHub.
2. Go to **Settings** > **Pages** in your repository.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`, then click **Save**.
4. Your website will be live in ~60 seconds at `https://<your-username>.github.io/<repo-name>/`!

---

## 📁 Project Structure

```
Marvel Cinematic Universe/
├── index.html                   # Semantic HTML5 app, two-row engine, modals
├── README.md                    # Project documentation & case study
├── SOURCES.md                   # Verifiable data citations & box office methodology
├── LICENSE                      # MIT Open Source License with Marvel disclaimer
├── .gitignore                   # Standard Git ignore rules
│
├── assets/
│   └── img/
│       ├── sacred-timeline-citadel-clean.webp  # 4K inpainted background (2500x1320)
│       ├── sacred-timeline-citadel-clean.jpg   # 4K JPEG fallback
│       ├── sacred-timeline-branching.png       # Branching timeline overlay
│       ├── backdrops/                         # High-res theatrical backdrops
│       ├── cast/                              # High-res cast portraits
│       └── posters/                           # MCU theatrical posters
│
├── data/
│   ├── mcu-data.js              # Complete canonical dataset (70 entries, 604KB)
│   ├── tmdb-images.js           # Verified TMDB CDN poster/backdrop mapping
│   ├── mcu-cast-images.js       # 601 verified actor portrait mappings
│   ├── mcu-movie-stills.js      # Curated 2-3 widescreen stills per film
│   └── mcu-series-episodes.js   # Complete episode guides for all 24 series
│
└── scripts/                     # Throwaway build & data tooling (Node.js/Sharp)
    ├── build_vertical_to_horizontal_timeline.js
    ├── clean_background_image.js
    └── generate_series_episodes.js
```

---

## 🛠️ Technologies & Primitives Used

- **HTML5:** Semantic architecture (`<header>`, `<nav>`, `<section>`, `<article>`), accessible dialog modals, SVG icon set.
- **CSS3:** Dynamic viewport sizing, custom properties (CSS variables), `@keyframes` glows, responsive grid and flexbox, unblurred glassmorphism.
- **Vanilla JavaScript (ES6+):** Hardware-accelerated GPU translation via `translate3d`, `requestAnimationFrame` event loops, touch gesture calculation, double-click/double-tap detection.
- **HTML5 2D Canvas:** Ambient quantum photon particle simulation with velocity physics.
- **Web Audio API:** Procedural dual-oscillator acoustic synthesizer with biquad lowpass filtering.
- **Image Inpainting:** Offline Node.js + `sharp` pixel interpolation and film-grain synthesis.

---

## 📊 Comprehensive Data Sources

All metrics, financial figures, critical scores, and credits are cited and verifiable:
- **Box Office Financials:** [Box Office Mojo](https://www.boxofficemojo.com/) & [The Numbers](https://www.the-numbers.com/)
- **Critical Ratings:** [Rotten Tomatoes](https://www.rottentomatoes.com/), [IMDb](https://www.imdb.com/), [CinemaScore](https://www.cinemascore.com/)
- **Visual Media:** [The Movie Database (TMDB)](https://www.themoviedb.org/) CDN & Marvel Studios press archives
- **In-Universe Chronology:** Marvel Studios Official Timeline & Disney+ Story Order

See [SOURCES.md](SOURCES.md) for detailed citations and computation methodology.

---

## 📄 License & Disclaimer

Distributed under the **MIT License**. See `LICENSE` for more information.

*Disclaimer: This project is an academic case study and educational portfolio presentation created for Semester 7 Open Lab 2. All Marvel Cinematic Universe imagery, trademarks, logos, character names, and lore are the intellectual property of Marvel Studios, LLC and The Walt Disney Company. This project is strictly non-commercial and published under Fair Use principles.*
