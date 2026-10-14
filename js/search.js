/**
 * MCU: THE SACRED TIMELINE - SEARCH PALETTE (Ctrl+K)
 * Fuzzy search across all titles, cast members, directors, villains, and lore tags
 */

class SearchPalette {
  constructor(options = {}) {
    this.data = options.data || [];
    this.onSelect = options.onSelect || (() => {});

    this.palette = document.getElementById('search-palette');
    this.input = document.getElementById('search-input');
    this.resultsList = document.getElementById('search-results-list');
    this.selectedIndex = -1;
    this.filteredResults = [];

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Global shortcut Ctrl+K or Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Close on backdrop click
    if (this.palette) {
      this.palette.addEventListener('click', (e) => {
        if (e.target === this.palette) this.close();
      });
    }

    // Input search queries
    if (this.input) {
      this.input.addEventListener('input', (e) => {
        this.query(e.target.value);
      });

      // Keyboard navigation
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.moveSelection(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.moveSelection(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (this.selectedIndex >= 0 && this.filteredResults[this.selectedIndex]) {
            this.chooseResult(this.filteredResults[this.selectedIndex]);
          }
        }
      });
    }

    // Trigger button on top nav
    const triggerBtn = document.getElementById('search-trigger-btn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.open());
    }
  }

  isOpen() {
    return this.palette && this.palette.classList.contains('open');
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  open() {
    if (!this.palette) return;
    this.palette.classList.add('open');
    if (this.input) {
      this.input.value = '';
      this.input.focus();
    }
    this.query('');
  }

  close() {
    if (!this.palette) return;
    this.palette.classList.remove('open');
  }

  query(q) {
    const raw = q.trim().toLowerCase();
    this.selectedIndex = -1;

    if (!raw) {
      // Show default top suggestions
      this.filteredResults = this.data.slice(0, 8);
    } else {
      this.filteredResults = this.data.filter(item => {
        if (item.title && item.title.toLowerCase().includes(raw)) return true;
        if (item.villain && item.villain.toLowerCase().includes(raw)) return true;
        if (item.directors && item.directors.some(d => d.toLowerCase().includes(raw))) return true;
        if (item.cast && item.cast.some(c => c.actor.toLowerCase().includes(raw) || c.character.toLowerCase().includes(raw))) return true;
        if (item.categories && item.categories.some(cat => cat.toLowerCase().includes(raw))) return true;
        return false;
      }).slice(0, 12);
    }

    this.renderResults();
  }

  renderResults() {
    if (!this.resultsList) return;

    if (this.filteredResults.length === 0) {
      this.resultsList.innerHTML = `
        <li style="padding: 24px; text-align: center; color: var(--color-text-muted);">
          No timelines or variants found. Try searching for "Iron Man", "Thanos", "Russo Brothers", or "Multiverse".
        </li>
      `;
      return;
    }

    this.resultsList.innerHTML = this.filteredResults.map((item, idx) => {
      const posterThumb = item.posterAssets ? item.posterAssets.thumb : 'assets/img/posters/fallback.webp';
      const year = item.releaseDate ? item.releaseDate.substring(0, 4) : '2026';
      const typeStr = item.type.toUpperCase();

      return `
        <li class="search-result-item ${idx === this.selectedIndex ? 'selected' : ''}" data-idx="${idx}">
          <img class="search-thumb-img" src="${posterThumb}" alt="${item.title}" loading="lazy">
          <div class="search-result-text">
            <span class="search-result-title">${item.title}</span>
            <span class="search-result-sub">${year} • ${typeStr} • ${item.phase ? 'Phase ' + item.phase : 'Special'}</span>
          </div>
          <span class="hero-chip" style="font-size:10px;">${item.saga || 'Infinity Saga'}</span>
        </li>
      `;
    }).join('');

    // Attach click handlers
    this.resultsList.querySelectorAll('.search-result-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const idx = Number(itemEl.dataset.idx);
        this.chooseResult(this.filteredResults[idx]);
      });
    });
  }

  moveSelection(dir) {
    if (this.filteredResults.length === 0) return;
    this.selectedIndex = Math.max(0, Math.min(this.filteredResults.length - 1, this.selectedIndex + dir));
    this.renderResults();
  }

  chooseResult(item) {
    this.close();
    this.onSelect(item);
  }
}

// Attach globally
window.SearchPalette = SearchPalette;
