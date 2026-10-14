/**
 * MCU: THE SACRED TIMELINE - MODAL DIALOG & SHARED-ELEMENT FLIP ENGINE
 * Web Animations API 60fps transitions, Tab management, SVG Stats Charts, 4K Lightbox
 */

class DetailModal {
  constructor(options = {}) {
    this.overlay = document.getElementById('modal-overlay');
    this.dialog = document.getElementById('modal-dialog');
    this.closeBtn = document.getElementById('modal-close-btn');

    // Header & Meta Elements
    this.heroBg = document.getElementById('modal-hero-bg');
    this.tagline = document.getElementById('modal-tagline');
    this.title = document.getElementById('modal-title');
    this.chipsRow = document.getElementById('modal-chips-row');
    this.trailerBtn = document.getElementById('modal-trailer-btn');

    // Tabs & Body
    this.tabs = document.querySelectorAll('.modal-tab-btn');
    this.tabIndicator = document.getElementById('tab-indicator');
    this.tabContents = {
      overview: document.getElementById('tab-content-overview'),
      cast: document.getElementById('tab-content-cast'),
      numbers: document.getElementById('tab-content-numbers'),
      gallery: document.getElementById('tab-content-gallery')
    };

    // Neighbor Navigation
    this.prevBtn = document.getElementById('modal-prev-btn');
    this.nextBtn = document.getElementById('modal-next-btn');

    // Lightbox
    this.lightbox = document.getElementById('lightbox-overlay');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxClose = document.getElementById('lightbox-close-btn');

    this.currentEntry = null;
    this.allEntries = [];
    this.activeTab = 'overview';
    this.onNavigate = options.onNavigate || (() => {});

    this.init();
  }

  init() {
    this.bindEvents();
  }

  setEntries(entries) {
    this.allEntries = entries;
  }

  bindEvents() {
    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click to close
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
    }

    // Esc key to close modal & lightbox
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.lightbox && this.lightbox.classList.contains('open')) {
          this.closeLightbox();
        } else if (this.isOpen()) {
          this.close();
        }
      }
    });

    // Tab switcher
    this.tabs.forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const targetTab = tabBtn.dataset.tab;
        this.switchTab(targetTab, tabBtn);
      });
    });

    // Lightbox close button
    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }
    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });
    }

    // Previous / Next neighbor navigation
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        if (this.currentEntry) {
          const idx = this.allEntries.findIndex(e => e.id === this.currentEntry.id);
          if (idx > 0) this.open(this.allEntries[idx - 1]);
        }
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        if (this.currentEntry) {
          const idx = this.allEntries.findIndex(e => e.id === this.currentEntry.id);
          if (idx < this.allEntries.length - 1) this.open(this.allEntries[idx + 1]);
        }
      });
    }
  }

  isOpen() {
    return this.overlay && this.overlay.classList.contains('open');
  }

  open(entry, originCard = null) {
    this.currentEntry = entry;
    window.location.hash = `#/${entry.type === 'film' || entry.type === 'teaser' ? 'film' : 'series'}/${entry.id}`;

    // Populate data
    this.populateModal(entry);

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Show overlay
    this.overlay.classList.add('open');
    this.dialog.setAttribute('aria-hidden', 'false');

    // Set accent theme color
    const accent = entry.accentColor || '#FF9D2E';
    this.dialog.style.setProperty('--modal-accent', accent);

    // FLIP Animation: animate from origin card if provided
    if (originCard && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      const first = originCard.getBoundingClientRect();
      const last = this.dialog.getBoundingClientRect();

      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;
      const deltaW = first.width / last.width;
      const deltaH = first.height / last.height;

      this.dialog.animate([
        {
          transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`,
          opacity: 0.8
        },
        {
          transform: 'none',
          opacity: 1
        }
      ], {
        duration: 380,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
      });
    }

    // Default to Overview tab
    const firstTabBtn = document.querySelector('.modal-tab-btn[data-tab="overview"]');
    if (firstTabBtn) this.switchTab('overview', firstTabBtn);

    // Focus close button for accessibility
    setTimeout(() => {
      if (this.closeBtn) this.closeBtn.focus();
    }, 50);
  }

  close() {
    if (!this.isOpen()) return;

    this.overlay.classList.remove('open');
    this.dialog.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Clear hash without reload
    history.replaceState(null, null, ' ');

    this.currentEntry = null;
  }

  switchTab(tabKey, tabButton) {
    this.activeTab = tabKey;

    // Toggle tab buttons
    this.tabs.forEach(btn => btn.classList.remove('active'));
    tabButton.classList.add('active');

    // Move sliding tab indicator
    if (this.tabIndicator) {
      this.tabIndicator.style.left = `${tabButton.offsetLeft}px`;
      this.tabIndicator.style.width = `${tabButton.offsetWidth}px`;
    }

    // Toggle tab contents
    Object.keys(this.tabContents).forEach(key => {
      const el = this.tabContents[key];
      if (el) {
        if (key === tabKey) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      }
    });

    // Trigger tab-specific renders
    if (tabKey === 'numbers' && this.currentEntry) {
      this.renderNumbersTab(this.currentEntry);
    }
  }

  populateModal(entry) {
    // 1. Header
    const backdropDisplay = entry.backdropAssets ? entry.backdropAssets.display : '';
    if (this.heroBg) {
      this.heroBg.src = backdropDisplay;
      this.heroBg.alt = `${entry.title} Hero Backdrop`;
    }

    if (this.tagline) {
      this.tagline.textContent = entry.tagline || 'MARVEL CINEMATIC UNIVERSE';
    }

    if (this.title) {
      this.title.textContent = entry.title;
    }

    if (this.chipsRow) {
      const year = entry.releaseDate ? entry.releaseDate.substring(0, 4) : '2026';
      const runtimeOrEps = entry.runtime || (entry.episodes ? `${entry.episodes} Episodes` : '—');
      const phaseBadge = entry.phase ? `Phase ${entry.phase}` : 'Special';
      const sagaBadge = entry.saga || 'The Multiverse Saga';

      this.chipsRow.innerHTML = `
        <span class="hero-chip" style="color:var(--modal-accent)">${phaseBadge}</span>
        <span class="hero-chip">${sagaBadge}</span>
        <span class="hero-chip">${year}</span>
        <span class="hero-chip">${runtimeOrEps}</span>
        <span class="hero-chip">${entry.inUniverseYear ? 'Era: ' + entry.inUniverseYear : ''}</span>
      `;
    }

    if (this.trailerBtn) {
      if (entry.trailerUrl) {
        this.trailerBtn.href = entry.trailerUrl;
        this.trailerBtn.style.display = 'inline-flex';
      } else {
        this.trailerBtn.style.display = 'none';
      }
    }

    // 2. OVERVIEW TAB
    const summaryEl = document.getElementById('modal-story-summary');
    if (summaryEl) summaryEl.textContent = entry.summary;

    const spoilerBox = document.getElementById('modal-spoiler-box');
    const spoilerContent = document.getElementById('modal-spoiler-content');
    const spoilerTrigger = document.getElementById('modal-spoiler-trigger');

    if (spoilerContent) {
      spoilerContent.textContent = entry.spoilerSummary || 'No spoilers recorded.';
      spoilerContent.classList.remove('revealed');
    }

    if (spoilerTrigger) {
      spoilerTrigger.onclick = () => {
        if (spoilerContent) {
          spoilerContent.classList.toggle('revealed');
          spoilerTrigger.textContent = spoilerContent.classList.contains('revealed')
            ? 'Hide Spoilers ▲'
            : 'Reveal Spoilers & Lore Impact ▼';
        }
      };
      spoilerTrigger.textContent = 'Reveal Spoilers & Lore Impact ▼';
    }

    // Meta details list
    const directorsEl = document.getElementById('meta-directors');
    if (directorsEl) directorsEl.textContent = (entry.directors || []).join(', ') || '—';

    const writersEl = document.getElementById('meta-writers');
    if (writersEl) writersEl.textContent = (entry.writers || []).join(', ') || '—';

    const composerEl = document.getElementById('meta-composer');
    if (composerEl) composerEl.textContent = entry.composer || '—';

    const villainEl = document.getElementById('meta-villain');
    if (villainEl) villainEl.textContent = entry.villain || '—';

    const postCreditsEl = document.getElementById('meta-post-credits');
    if (postCreditsEl) {
      const count = entry.postCreditScenes !== null ? `${entry.postCreditScenes} scene(s)` : '—';
      const details = (entry.postCreditDetails && entry.postCreditDetails.length > 0)
        ? entry.postCreditDetails.map(d => `<div style="font-size:12px;color:#94a3b8;margin-top:4px;">• ${d}</div>`).join('')
        : '';
      postCreditsEl.innerHTML = `<div>${count}</div>${details}`;
    }

    // 3. CAST TAB
    const castContainer = document.getElementById('modal-cast-container');
    if (castContainer) {
      if (entry.cast && entry.cast.length > 0) {
        castContainer.innerHTML = entry.cast.map(c => `
          <div class="cast-card">
            <div class="cast-headshot-frame">
              <img class="cast-headshot-img" src="${c.headshot || 'assets/img/posters/' + entry.id + '-poster-thumb.webp'}" alt="${c.actor}" loading="lazy">
            </div>
            <div class="cast-actor-name">${c.actor}</div>
            <div class="cast-char-name">${c.character}</div>
          </div>
        `).join('');
      } else {
        castContainer.innerHTML = '<p style="color:#94a3b8;">Cast lineup pending official announcement.</p>';
      }
    }

    // 4. GALLERY TAB
    const galleryContainer = document.getElementById('modal-gallery-container');
    if (galleryContainer) {
      if (entry.galleryScenes && entry.galleryScenes.length > 0) {
        galleryContainer.innerHTML = entry.galleryScenes.map(scene => `
          <div class="gallery-item" data-4k="${scene.original || entry.backdropAssets.original}">
            <img class="gallery-thumb-img" src="${scene.display || entry.backdropAssets.display}" alt="${scene.title}" loading="lazy">
            <div class="gallery-caption-overlay">
              <div class="gallery-caption-title">${scene.title}</div>
              <div class="gallery-caption-desc">${scene.desc}</div>
            </div>
          </div>
        `).join('');

        // Attach 4K Lightbox triggers
        galleryContainer.querySelectorAll('.gallery-item').forEach(item => {
          item.addEventListener('click', () => {
            const url4k = item.dataset['4k'];
            this.openLightbox(url4k);
          });
        });
      } else {
        galleryContainer.innerHTML = '<p style="color:#94a3b8;">Key-scene stills arriving soon.</p>';
      }
    }

    // Update Neighbor Buttons
    const currIdx = this.allEntries.findIndex(e => e.id === entry.id);
    if (this.prevBtn) {
      if (currIdx > 0) {
        this.prevBtn.style.visibility = 'visible';
        this.prevBtn.querySelector('.btn-label').textContent = this.allEntries[currIdx - 1].title;
      } else {
        this.prevBtn.style.visibility = 'hidden';
      }
    }
    if (this.nextBtn) {
      if (currIdx < this.allEntries.length - 1) {
        this.nextBtn.style.visibility = 'visible';
        this.nextBtn.querySelector('.btn-label').textContent = this.allEntries[currIdx + 1].title;
      } else {
        this.nextBtn.style.visibility = 'hidden';
      }
    }
  }

  renderNumbersTab(entry) {
    const isFilm = entry.type === 'film' || entry.type === 'teaser';

    const numbersContainer = document.getElementById('tab-content-numbers');
    if (!numbersContainer) return;

    if (!isFilm) {
      // Series & Specials Numbers Tab
      numbersContainer.innerHTML = `
        <div class="stats-grid">
          <div class="stat-box">
            <span class="stat-label">Episodes</span>
            <span class="stat-value">${entry.episodes || '—'}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Seasons</span>
            <span class="stat-value">${entry.seasons || '1'}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Rotten Tomatoes Critics</span>
            <span class="stat-value stat-badge">${entry.rtCritics ? entry.rtCritics + '%' : '—'}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">IMDb Rating</span>
            <span class="stat-value">${entry.imdbRating ? '★ ' + entry.imdbRating : '—'}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Network / Platform</span>
            <span class="stat-value" style="font-size:20px;">${entry.network || 'Disney+'}</span>
          </div>
        </div>
        <div class="chart-container">
          <div class="chart-title">Connected MCU Productions</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${(entry.connectedTo || []).map(cid => `<span class="filter-chip" style="pointer-events:none;">${cid}</span>`).join('')}
          </div>
        </div>
      `;
      return;
    }

    // Theatrical Film Numbers Tab
    const formatCurr = (n) => n ? '$' + Number(n).toLocaleString() : '—';
    const roiStr = entry.roi ? `${entry.roi}x` : '—';
    const mcuRankStr = entry.rankMcu ? `#${entry.rankMcu}` : '—';
    const allTimeRankStr = entry.rankAllTime ? `#${entry.rankAllTime}` : '—';

    numbersContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-label">Worldwide Gross</span>
          <span class="stat-value stat-badge count-up" data-val="${entry.worldwideGross || 0}">${formatCurr(entry.worldwideGross)}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Production Budget</span>
          <span class="stat-value">${formatCurr(entry.budget)}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Domestic Gross</span>
          <span class="stat-value">${formatCurr(entry.domesticGross)}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Opening Weekend</span>
          <span class="stat-value">${formatCurr(entry.openingWeekend)}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">MCU Box Office Rank</span>
          <span class="stat-value stat-badge">${mcuRankStr}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">All-Time Worldwide Rank</span>
          <span class="stat-value">${allTimeRankStr}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Box Office ROI Multiple</span>
          <span class="stat-value stat-badge">${roiStr}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Rotten Tomatoes (Critics / Audience)</span>
          <span class="stat-value" style="font-size:22px;">${entry.rtCritics ? entry.rtCritics + '%' : '—'} / ${entry.rtAudience ? entry.rtAudience + '%' : '—'}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">CinemaScore & IMDb</span>
          <span class="stat-value" style="font-size:22px;">${entry.cinemaScore || '—'} • ★ ${entry.imdbRating || '—'}</span>
        </div>
      </div>

      <!-- SVG Chart 1: Budget vs Worldwide Gross Bar -->
      <div class="chart-container">
        <div class="chart-title">Financial Performance: Budget vs. Global Gross</div>
        <svg class="svg-chart" viewBox="0 0 800 120">
          <defs>
            <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#FF9D2E" />
              <stop offset="100%" stop-color="#EC1D24" />
            </linearGradient>
          </defs>
          <text x="0" y="24" fill="#94A3B8" font-size="12" font-family="'Inter'">Budget: ${formatCurr(entry.budget)}</text>
          <rect x="0" y="32" width="${entry.budget ? Math.min((entry.budget / 3000000000) * 800, 750) : 0}" height="14" rx="4" fill="#475569" />
          
          <text x="0" y="76" fill="#FFF" font-weight="700" font-size="12" font-family="'Inter'">Worldwide Gross: ${formatCurr(entry.worldwideGross)}</text>
          <rect x="0" y="84" width="${entry.worldwideGross ? Math.min((entry.worldwideGross / 3000000000) * 800, 780) : 0}" height="22" rx="4" fill="url(#barGrad)" />
        </svg>
      </div>

      <!-- SVG Chart 2: Sparkline of ALL MCU Films Worldwide Gross -->
      <div class="chart-container">
        <div class="chart-title">Global Gross Ranking Context Across All MCU Films</div>
        ${this.buildMcuGrossSparkline(entry)}
      </div>
    `;

    // Trigger Count-Up animations
    this.animateCountUps();
  }

  buildMcuGrossSparkline(currentFilm) {
    const released = this.allEntries.filter(e => (e.type === 'film') && e.worldwideGross);
    released.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

    const maxGross = 2800000000;
    const w = 800;
    const h = 100;
    const step = w / (released.length - 1);

    const points = released.map((f, i) => {
      const x = i * step;
      const y = h - (f.worldwideGross / maxGross) * (h - 20) - 10;
      return { x, y, film: f };
    });

    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

    const currentPt = points.find(p => p.film.id === currentFilm.id);

    return `
      <svg class="svg-chart" viewBox="0 0 ${w} ${h}">
        <path d="${d}" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2" />
        ${currentPt ? `
          <circle cx="${currentPt.x}" cy="${currentPt.y}" r="6" fill="#FF9D2E" filter="drop-shadow(0 0 8px #FF9D2E)" />
          <text x="${Math.min(currentPt.x, w - 120)}" y="${Math.max(currentPt.y - 12, 14)}" fill="#FF9D2E" font-weight="700" font-size="12" font-family="'Inter'">
            ${currentFilm.title} ($${(currentFilm.worldwideGross / 1e9).toFixed(2)}B)
          </text>
        ` : ''}
      </svg>
    `;
  }

  animateCountUps() {
    const els = document.querySelectorAll('.count-up');
    els.forEach(el => {
      const targetVal = Number(el.dataset.val);
      if (!targetVal) return;
      let startVal = 0;
      const duration = 900;
      const startTime = performance.now();

      const update = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * targetVal);
        el.textContent = '$' + current.toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    });
  }

  openLightbox(url4k) {
    if (!this.lightbox || !this.lightboxImg) return;
    this.lightboxImg.src = url4k;
    this.lightbox.classList.add('open');
  }

  closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('open');
  }
}

// Attach globally
window.DetailModal = DetailModal;
