/**
 * MCU: THE SACRED TIMELINE - TIMELINE ENGINE & VIRTUALIZATION
 * Drives 60fps/120fps horizontal scrolling, DOM recycling, 3D card tilt & scrubber syncing
 */

class TimelineEngine {
  constructor(options = {}) {
    this.data = options.data || [];
    this.canvas = options.canvas || null;
    this.onSelectNode = options.onSelectNode || (() => {});

    // DOM Elements
    this.section = document.getElementById('timeline-section');
    this.trackStage = document.getElementById('timeline-track-stage');
    this.trackContent = document.getElementById('timeline-track-content');
    this.lanes = {
      films: document.getElementById('lane-films'),
      series: document.getElementById('lane-series')
    };
    this.connectorsSvg = document.getElementById('timeline-connectors-svg');
    this.scrubberThumb = document.getElementById('scrubber-thumb');
    this.scrubberTrack = document.getElementById('scrubber-track-outer');
    this.scrubberTitle = document.getElementById('scrubber-title');
    this.scrubberYear = document.getElementById('scrubber-year');

    // Engine State
    this.mode = 'release'; // 'release' | 'chronology'
    this.filterType = 'all'; // 'all' | 'film' | 'series'
    this.filterPhase = 'all'; // 'all' | 1 | 2 | 3 | 4 | 5 | 6
    this.filterSaga = 'all'; // 'all' | 'Infinity Saga' | 'Multiverse Saga'
    this.filterCategory = 'all';

    // Layout Dimensions
    this.cardWidth = 250;
    this.cardGap = 160;
    this.totalWidth = 0;
    this.viewportWidth = window.innerWidth;

    // Smooth Scroll Lerp State
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.currentX = 0;
    this.targetX = 0;
    this.isDraggingScrubber = false;

    // Node Render Cache
    this.items = [];
    this.activeNodesMap = new Map(); // id -> DOM Element

    // Snap Effect Triggered flag
    this.snapTriggered = false;

    this.init();
  }

  init() {
    this.computeLayout();
    this.buildMinimapTicks();
    this.bindEvents();
    this.startDoomsdayCountdown();
    this.loop();
  }

  setMode(newMode) {
    if (this.mode === newMode) return;
    this.mode = newMode;
    this.computeLayout();
    this.buildMinimapTicks();
    this.renderConnectors();
  }

  setFilter(filterKey, value) {
    if (filterKey === 'type') this.filterType = value;
    if (filterKey === 'phase') this.filterPhase = value;
    if (filterKey === 'saga') this.filterSaga = value;
    if (filterKey === 'category') this.filterCategory = value;

    this.computeLayout();
    this.buildMinimapTicks();
    this.renderConnectors();
  }

  computeLayout() {
    // 1. Filter entries
    let filtered = this.data.filter(item => {
      if (this.filterType !== 'all') {
        if (this.filterType === 'film' && item.type !== 'film' && item.type !== 'teaser') return false;
        if (this.filterType === 'series' && item.type !== 'series' && item.type !== 'special') return false;
      }
      if (this.filterPhase !== 'all' && item.phase !== Number(this.filterPhase)) return false;
      if (this.filterSaga !== 'all' && item.saga !== this.filterSaga) return false;
      if (this.filterCategory !== 'all') {
        if (!item.categories || !item.categories.includes(this.filterCategory)) return false;
      }
      return true;
    });

    // 2. Sort by mode
    if (this.mode === 'chronology') {
      filtered.sort((a, b) => (a.chronologyOrder || 999) - (b.chronologyOrder || 999));
    } else {
      // Default release date order
      filtered.sort((a, b) => {
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      });
    }

    // 3. Compute absolute horizontal coordinates for both lanes
    let filmIdx = 0;
    let seriesIdx = 0;
    const startOffset = 220;

    this.items = filtered.map((entry) => {
      const isFilm = entry.type === 'film' || entry.type === 'teaser';
      let x = 0;
      if (isFilm) {
        x = startOffset + filmIdx * (this.cardWidth + this.cardGap);
        filmIdx++;
      } else {
        // Series lane staggered slightly for harmonious parallel river flow
        x = startOffset + (seriesIdx * (this.cardWidth + this.cardGap * 0.95)) + 60;
        seriesIdx++;
      }

      return {
        ...entry,
        x,
        lane: isFilm ? 'films' : 'series'
      };
    });

    const maxFilmX = startOffset + filmIdx * (this.cardWidth + this.cardGap);
    const maxSeriesX = startOffset + seriesIdx * (this.cardWidth + this.cardGap * 0.95);
    this.totalWidth = Math.max(maxFilmX, maxSeriesX) + 600;

    // Adjust sticky scroll spacer height based on total horizontal distance
    if (this.section) {
      const scrollFactor = Math.max(this.totalWidth / this.viewportWidth, 4);
      this.section.style.height = `${scrollFactor * 100}vh`;
    }

    this.renderConnectors();
  }

  buildMinimapTicks() {
    const container = document.getElementById('scrubber-ticks');
    if (!container) return;
    container.innerHTML = '';

    const phaseColors = {
      1: '#FF9D2E', 2: '#0EA5E9', 3: '#9333EA', 4: '#EC1D24', 5: '#10B981', 6: '#00E5FF'
    };

    this.items.forEach(item => {
      const pct = Math.min((item.x / this.totalWidth) * 100, 100);
      const tick = document.createElement('div');
      tick.className = 'scrubber-node-tick';
      tick.style.left = `${pct}%`;
      tick.style.background = phaseColors[item.phase] || '#CBD5E1';
      tick.title = `${item.title} (${item.releaseDate ? item.releaseDate.substring(0, 4) : '—'})`;
      container.appendChild(tick);
    });
  }

  renderConnectors() {
    if (!this.connectorsSvg) return;
    this.connectorsSvg.setAttribute('width', this.totalWidth);
    this.connectorsSvg.setAttribute('height', '700');
    this.connectorsSvg.innerHTML = '';

    // Draw connector bezier curves between connected films & series
    const itemMap = new Map();
    this.items.forEach(it => itemMap.set(it.id, it));

    this.items.forEach(source => {
      if (source.connectedTo && Array.isArray(source.connectedTo)) {
        source.connectedTo.forEach(targetId => {
          const target = itemMap.get(targetId);
          if (target && source.lane !== target.lane) {
            const x1 = source.x + this.cardWidth / 2;
            const y1 = source.lane === 'films' ? 360 : 420;
            const x2 = target.x + this.cardWidth / 2;
            const y2 = target.lane === 'films' ? 360 : 420;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const midY = (y1 + y2) / 2;
            const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
            path.setAttribute('d', d);
            path.setAttribute('class', 'timeline-connector-path');
            this.connectorsSvg.appendChild(path);
          }
        });
      }
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.viewportWidth = window.innerWidth;
      this.computeLayout();
    }, { passive: true });

    // Scrubber click & drag navigation
    if (this.scrubberTrack) {
      const handleScrubberMove = (e) => {
        const rect = this.scrubberTrack.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: pct * maxScroll, behavior: 'instant' });
      };

      this.scrubberTrack.addEventListener('mousedown', (e) => {
        this.isDraggingScrubber = true;
        handleScrubberMove(e);
      });
      window.addEventListener('mousemove', (e) => {
        if (this.isDraggingScrubber) handleScrubberMove(e);
      });
      window.addEventListener('mouseup', () => {
        this.isDraggingScrubber = false;
      });
    }

    // Keyboard navigation (Left/Right, Home/End)
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const step = 400;
      if (e.key === 'ArrowRight') {
        window.scrollBy({ top: step, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        window.scrollBy({ top: -step, behavior: 'smooth' });
      } else if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End') {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: maxScroll, behavior: 'smooth' });
      }
    });
  }

  loop() {
    // Read Scroll Position
    this.scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? Math.min(Math.max(this.scrollY / maxScroll, 0), 1) : 0;

    // Horizontal Travel target
    this.targetX = -scrollProgress * (this.totalWidth - this.viewportWidth);
    this.currentX += (this.targetX - this.currentX) * 0.12;

    // Apply horizontal transform once per frame
    if (this.trackStage) {
      this.trackStage.style.transform = `translate3d(${this.currentX.toFixed(2)}px, -50%, 0)`;
    }

    // Update 3D Canvas Background
    if (this.canvas) {
      this.canvas.setScrollProgress(scrollProgress);
    }

    // Update Scrubber Thumb position
    if (this.scrubberThumb) {
      this.scrubberThumb.style.left = `${(scrollProgress * 100).toFixed(2)}%`;
    }

    // VIRTUALIZATION: Recycle DOM cards outside camera window
    this.updateVirtualizedDOM();

    // Check Infinity War Snap Node Trigger
    this.checkSnapMoment();

    requestAnimationFrame(() => this.loop());
  }

  updateVirtualizedDOM() {
    const viewLeft = -this.currentX - 400;
    const viewRight = -this.currentX + this.viewportWidth + 400;

    let nearestItem = null;
    let nearestDist = Infinity;

    this.items.forEach(item => {
      const isVisible = (item.x + this.cardWidth >= viewLeft) && (item.x <= viewRight);
      const isMounted = this.activeNodesMap.has(item.id);

      // Track nearest item for scrubber label
      const itemCenter = item.x + this.cardWidth / 2;
      const cameraCenter = -this.currentX + this.viewportWidth / 2;
      const dist = Math.abs(itemCenter - cameraCenter);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestItem = item;
      }

      if (isVisible && !isMounted) {
        // Mount node card
        const cardElem = this.createCardElement(item);
        const laneContainer = this.lanes[item.lane];
        if (laneContainer) {
          laneContainer.appendChild(cardElem);
          this.activeNodesMap.set(item.id, cardElem);
        }
      } else if (!isVisible && isMounted) {
        // Unmount node card to preserve 60fps
        const cardElem = this.activeNodesMap.get(item.id);
        if (cardElem && cardElem.parentNode) {
          cardElem.parentNode.removeChild(cardElem);
        }
        this.activeNodesMap.delete(item.id);
      }
    });

    // Update scrubber title & phase
    if (nearestItem) {
      if (this.scrubberTitle) this.scrubberTitle.textContent = nearestItem.title;
      if (this.scrubberYear) {
        this.scrubberYear.textContent = nearestItem.releaseDate ? nearestItem.releaseDate.substring(0, 4) : '2026';
      }
      if (this.canvas && nearestItem.phase) {
        this.canvas.setPhase(nearestItem.phase);
      }
    }
  }

  createCardElement(item) {
    const card = document.createElement('div');
    card.className = `timeline-node-card ${item.id === 'avengers-doomsday' ? 'doomsday-card' : ''} ${item.id === 'avengers-secret-wars' ? 'secret-wars-card' : ''}`;
    card.id = `card-${item.id}`;
    card.style.left = `${item.x}px`;
    card.style.setProperty('--card-accent', item.accentColor || '#FF9D2E');
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${item.title}, ${item.type}, released ${item.releaseDate || 'Upcoming'}`);

    const posterThumb = item.posterAssets ? item.posterAssets.thumb : 'assets/img/posters/fallback.webp';
    const ratingText = item.imdbRating ? `★ ${item.imdbRating}` : (item.isUpcoming ? 'UPCOMING' : '—');
    const yearText = item.releaseDate ? item.releaseDate.substring(0, 4) : 'TBD';

    let doomsdayHtml = '';
    if (item.id === 'avengers-doomsday') {
      doomsdayHtml = `
        <div class="doomsday-countdown-box">
          <div class="countdown-unit"><span class="countdown-val" id="dd-days">--</span><span class="countdown-label">Days</span></div>
          <div class="countdown-unit"><span class="countdown-val" id="dd-hours">--</span><span class="countdown-label">Hours</span></div>
          <div class="countdown-unit"><span class="countdown-val" id="dd-mins">--</span><span class="countdown-label">Mins</span></div>
          <div class="countdown-unit"><span class="countdown-val" id="dd-secs">--</span><span class="countdown-label">Secs</span></div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="card-inner-3d">
        ${doomsdayHtml}
        <div class="card-specular-glare"></div>
        <div class="card-poster-wrapper">
          <img class="card-poster-img" src="${posterThumb}" alt="${item.title} Poster" loading="lazy" decoding="async">
        </div>
        <div class="card-meta-overlay">
          <span class="card-phase-badge">${item.phase ? 'Phase ' + item.phase : 'Special'}</span>
          <div class="card-title">${item.title}</div>
          <div class="card-subtext">
            <span>${yearText} • ${item.type.toUpperCase()}</span>
            <span class="card-rating-pill">${ratingText}</span>
          </div>
        </div>
      </div>
    `;

    // 3D Pointer Tilt & Specular Glare Listeners
    const inner = card.querySelector('.card-inner-3d');
    const glare = card.querySelector('.card-specular-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      inner.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`;
      if (glare) {
        glare.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        glare.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      }
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    // Select Card & Open Modal
    card.addEventListener('click', () => {
      this.onSelectNode(item, card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.onSelectNode(item, card);
      }
    });

    return card;
  }

  startDoomsdayCountdown() {
    const target = new Date('2026-12-18T00:00:00Z').getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        const elD = document.getElementById('dd-days');
        const elH = document.getElementById('dd-hours');
        const elM = document.getElementById('dd-mins');
        const elS = document.getElementById('dd-secs');

        if (elD) elD.textContent = days;
        if (elH) elH.textContent = String(hours).padStart(2, '0');
        if (elM) elM.textContent = String(mins).padStart(2, '0');
        if (elS) elS.textContent = String(secs).padStart(2, '0');
      }
    };

    update();
    setInterval(update, 1000);
  }

  checkSnapMoment() {
    const iw = this.items.find(it => it.id === 'avengers-infinity-war');
    if (!iw) return;

    const cameraCenter = -this.currentX + this.viewportWidth / 2;
    const dist = Math.abs(iw.x - cameraCenter);

    if (dist < 180 && !this.snapTriggered) {
      this.snapTriggered = true;
      if (window.triggerSnapParticles) {
        window.triggerSnapParticles();
      }
    } else if (dist > 400) {
      this.snapTriggered = false;
    }
  }

  jumpTo(id) {
    const target = this.items.find(it => it.id === id);
    if (!target) return;

    const targetScrollRatio = target.x / this.totalWidth;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetScrollRatio * maxScroll,
      behavior: 'smooth'
    });
  }
}

// Attach globally
window.TimelineEngine = TimelineEngine;
