/**
 * MCU: THE SACRED TIMELINE
 * Application Orchestrator & Bootstrapper
 *
 * Coordinates Canvas 3D engine, Virtualized Timeline, Detail Modal, Search Palette,
 * "Multiverse in Numbers" Dashboard, Web Audio Ambient Drone, and Thanos Snap Easter Egg.
 * Works natively from file:// and any static hosting without external servers.
 */

class SacredTimelineApp {
  constructor() {
    const raw = window.MCU_DATA || [];
    this.entries = Array.isArray(raw) ? raw : (raw.entries || []);
    this.canvasEngine = null;
    this.timelineEngine = null;
    this.modal = null;
    this.search = null;
    this.dashboard = null;
    this.decimation = null;
    this.audio = window.TimelineAudio;

    this.cursorEl = document.querySelector('.custom-cursor');
  }

  init() {
    console.log(`[SacredTimeline] Booting with ${this.entries.length} canonical nodes.`);

    // 1. Initialize TVA Intro Loader
    this._initLoader();

    // 2. Initialize 3D Canvas Background
    const canvasEl = document.getElementById('timeline-canvas');
    if (canvasEl) {
      this.canvasEngine = new SacredTimelineCanvas(canvasEl);
    }

    // 3. Initialize Detail Modal
    this.modal = new DetailModal({
      onNavigate: (entry) => {
        if (entry) {
          history.replaceState(null, '', `#/entry/${entry.slug || entry.id}`);
          if (this.audio) this.audio.playChirp(false);
        }
      }
    });
    this.modal.setEntries(this.entries);

    // Clean hash when modal closes
    if (this.modal.closeBtn) {
      const origClose = this.modal.close.bind(this.modal);
      this.modal.close = () => {
        origClose();
        if (window.location.hash.startsWith('#/entry/')) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      };
    }

    // 4. Initialize Timeline Engine
    this.timelineEngine = new TimelineEngine({
      data: this.entries,
      canvas: this.canvasEngine,
      onSelectNode: (entry, originCard) => {
        this.openEntry(entry, originCard);
      }
    });

    // 5. Initialize Search Palette (Ctrl+K)
    this.search = new SearchPalette({
      data: this.entries,
      onSelect: (entry) => {
        this.openEntry(entry);
        if (this.timelineEngine) {
          this.timelineEngine.jumpTo(entry.id);
        }
      }
    });

    // 6. Initialize Multiverse in Numbers Dashboard
    this.dashboard = new MultiverseDashboard({
      data: this.entries,
      onSelectFilm: (entry) => {
        this.openEntry(entry);
      }
    });

    // 7. Initialize Thanos Decimation Easter Egg
    this.decimation = new ThanosDecimation();

    // 8. Bind UI Controls (Audio, Filters, Reduced Motion, Custom Cursor, Hash Routing)
    this._bindControls();
    this._bindCustomCursor();
    this._bindHashRouting();
  }

  _initLoader() {
    const loader = document.getElementById('tva-loader');
    const yearEl = document.getElementById('loader-year');
    const barEl = document.getElementById('loader-bar');
    const enterBtn = document.getElementById('loader-enter-btn');

    if (!loader) return;

    let startYear = 2008;
    const endYear = 2026;
    let progress = 0;

    const interval = setInterval(() => {
      progress += 6;
      if (progress > 100) progress = 100;

      const currentYear = Math.floor(startYear + ((endYear - startYear) * (progress / 100)));
      if (yearEl) yearEl.textContent = currentYear;
      if (barEl) barEl.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this._dismissLoader();
        }, 350);
      }
    }, 45);

    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        clearInterval(interval);
        this._dismissLoader();
      });
    }

    // Fail-safe auto-dismiss after 2.5s
    setTimeout(() => {
      this._dismissLoader();
    }, 2500);
  }

  _dismissLoader() {
    const loader = document.getElementById('tva-loader');
    if (loader && !loader.classList.contains('loaded')) {
      loader.classList.add('loaded');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 700);
    }
  }

  openEntry(entry, originEl = null) {
    if (!entry || !this.modal) return;
    this.modal.open(entry, originEl);
    history.replaceState(null, '', `#/entry/${entry.slug || entry.id}`);
    if (this.audio) this.audio.playChirp(false);
  }

  _bindControls() {
    // 1. Audio Toggle Button
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn && this.audio) {
      const updateAudioBtn = (isPlaying) => {
        audioBtn.classList.toggle('active', isPlaying);
        audioBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
        const textSpan = audioBtn.querySelector('.btn-text');
        if (textSpan) {
          textSpan.textContent = isPlaying ? 'TVA HUM: ON' : 'TVA HUM: OFF';
        }
      };

      audioBtn.addEventListener('click', () => {
        const isPlaying = this.audio.toggle();
        updateAudioBtn(isPlaying);
      });

      this.audio.onStateChange(updateAudioBtn);
    }

    // 2. Search Modal Trigger Button
    const searchBtn = document.getElementById('search-open-btn');
    if (searchBtn && this.search) {
      searchBtn.addEventListener('click', () => this.search.open());
    }

    // 3. Thanos Snap Easter Egg Button
    const snapBtn = document.getElementById('snap-easteregg-btn');
    if (snapBtn && this.decimation) {
      snapBtn.addEventListener('click', () => this.decimation.trigger());
    }

    // 4. Multiverse Dashboard Jump Button
    const dashNavBtn = document.getElementById('dashboard-nav-btn');
    if (dashNavBtn) {
      dashNavBtn.addEventListener('click', () => {
        const dashSection = document.getElementById('dashboard-section');
        if (dashSection) {
          dashSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // 5. Timeline Order Toggle (Release vs In-Universe Chronology)
    const orderBtns = document.querySelectorAll('.order-btn');
    orderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        orderBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.order || 'release';
        if (this.timelineEngine) {
          this.timelineEngine.setMode(mode);
        }
      });
    });

    // 6. Filter Chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Handle chip group active styling
        const group = chip.closest('.filter-chips-group');
        if (group) {
          group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        }

        const filterType = chip.dataset.filterType;
        const filterVal = chip.dataset.filterValue;

        if (this.timelineEngine) {
          if (filterType === 'all') {
            this.timelineEngine.setFilter('type', 'all');
            this.timelineEngine.setFilter('phase', 'all');
            this.timelineEngine.setFilter('saga', 'all');
          } else {
            this.timelineEngine.setFilter(filterType, filterVal);
          }
        }
      });
    });

    // 7. Reduced Motion Toggle
    const motionToggle = document.getElementById('reduced-motion-toggle');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setReducedMotion = (enabled) => {
      document.documentElement.classList.toggle('reduced-motion', enabled);
      if (this.canvasEngine) this.canvasEngine.lowQualityMode = enabled;
      if (motionToggle) motionToggle.checked = enabled;
    };

    setReducedMotion(prefersReducedMotion);

    if (motionToggle) {
      motionToggle.addEventListener('change', (e) => {
        setReducedMotion(e.target.checked);
      });
    }
  }

  _bindCustomCursor() {
    if (!this.cursorEl || window.matchMedia('(pointer: coarse)').matches) return;

    window.addEventListener('pointermove', (e) => {
      this.cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }, { passive: true });

    // Expand cursor hover ring on interactable elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('button, a, .timeline-node-card, .filter-chip, .order-btn, input');
      if (target) {
        this.cursorEl.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('button, a, .timeline-node-card, .filter-chip, .order-btn, input');
      if (target) {
        this.cursorEl.classList.remove('hover');
      }
    });
  }

  _bindHashRouting() {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/entry/')) {
        const idOrSlug = hash.replace('#/entry/', '').trim();
        const found = this.data.entries.find(e => e.slug === idOrSlug || e.id === idOrSlug);
        if (found) {
          this.openEntry(found);
          if (this.timelineEngine) {
            this.timelineEngine.jumpTo(found.id);
          }
        }
      } else if (hash === '#/dashboard') {
        const dashSection = document.getElementById('dashboard-section');
        if (dashSection) {
          dashSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    // Initial check on load
    setTimeout(handleHash, 400);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new SacredTimelineApp();
  window.app.init();
});
