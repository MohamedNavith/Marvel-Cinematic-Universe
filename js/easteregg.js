/**
 * MCU: THE SACRED TIMELINE
 * Easter Egg: The Decimation (Thanos Infinity Snap)
 *
 * Triggerable via the classic Konami Code:
 *   [Up, Up, Down, Down, Left, Right, Left, Right, B, A]
 * or via clicking the Infinity Gauntlet trigger in the footer / nav.
 *
 * Renders a cosmic snap shockwave, sound effects, and dissolves 50%
 * of timeline cards into disintegrating quantum ash particles.
 */

class ThanosDecimation {
  constructor() {
    this.canvas = document.getElementById('snap-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.konamiSequence = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    this.currentIndex = 0;
    this.isSnapping = false;
    this.isSnapped = false;
    this.particles = [];
    this.animationId = null;

    this._bindEvents();
  }

  _bindEvents() {
    // Keyboard Konami Code listener
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      const expectedKey = this.konamiSequence[this.currentIndex].toLowerCase();

      if (key === expectedKey) {
        this.currentIndex++;
        if (this.currentIndex === this.konamiSequence.length) {
          this.currentIndex = 0;
          this.trigger();
        }
      } else {
        this.currentIndex = 0;
        if (key === this.konamiSequence[0].toLowerCase()) {
          this.currentIndex = 1;
        }
      }
    });

    // Resize canvas
    window.addEventListener('resize', () => {
      if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    });
  }

  trigger() {
    if (this.isSnapping) return;
    if (this.isSnapped) {
      this.restore();
      return;
    }

    this.isSnapping = true;

    // 1. Play synthesized snap audio
    if (window.TimelineAudio) {
      window.TimelineAudio.playSnapSound();
    }

    // 2. Prepare canvas for cosmic flash & ash particles
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.canvas.classList.add('active');
    }

    // 3. Screen shockwave flash
    this._flashShockwave();

    // 4. Gather visible timeline cards and dissolve 50% of them
    const cards = Array.from(document.querySelectorAll('.timeline-node-card:not(.teaser-node)'));
    if (cards.length > 0) {
      // Shuffle cards randomly
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      const halfCount = Math.ceil(shuffled.length / 2);
      const doomedCards = shuffled.slice(0, halfCount);

      // Spawn ash particles from doomed cards
      this._spawnDustParticles(doomedCards);

      // Apply disintegrate styles
      setTimeout(() => {
        doomedCards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('snapped-dust');
          }, i * 35);
        });
      }, 400);
    }

    // 5. Display banner with "Restore Reality" button
    this._showSnapBanner();

    this.isSnapped = true;
    setTimeout(() => {
      this.isSnapping = false;
    }, 2500);
  }

  _flashShockwave() {
    const flashEl = document.createElement('div');
    flashEl.className = 'snap-flash';
    document.body.appendChild(flashEl);

    setTimeout(() => {
      if (flashEl.parentNode) flashEl.parentNode.removeChild(flashEl);
    }, 1200);
  }

  _spawnDustParticles(doomedCards) {
    if (!this.ctx) return;
    this.particles = [];

    doomedCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.right < 0 || rect.left > window.innerWidth || rect.bottom < 0 || rect.top > window.innerHeight) {
        return; // Off screen
      }

      // Generate dust particles distributed across card area
      const particleCount = 40;
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: rect.left + Math.random() * rect.width,
          y: rect.top + Math.random() * rect.height,
          vx: (Math.random() - 0.3) * 3.5,
          vy: -(Math.random() * 3.8 + 1.2),
          size: Math.random() * 3.5 + 1.2,
          alpha: Math.random() * 0.8 + 0.2,
          decay: Math.random() * 0.007 + 0.003,
          color: Math.random() > 0.4 ? 'rgba(215, 160, 90,' : 'rgba(120, 100, 90,'
        });
      }
    });

    this._animateParticles();
  }

  _animateParticles() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx += (Math.random() - 0.5) * 0.2;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = `${p.color} ${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this._animateParticles());
    } else {
      if (this.canvas) this.canvas.classList.remove('active');
    }
  }

  _showSnapBanner() {
    const existing = document.getElementById('snap-notification-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'snap-notification-banner';
    banner.className = 'snap-banner';
    banner.setAttribute('role', 'alert');
    banner.innerHTML = `
      <div class="snap-banner-content">
        <span class="snap-banner-icon">⚡</span>
        <span class="snap-banner-text"><strong>THE DECIMATION OCCURRED:</strong> 50% of the Sacred Timeline was turned to dust.</span>
        <button id="snap-restore-btn" class="snap-banner-btn" aria-label="Undo Snap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          RESTORE REALITY (AVENGERS TIME HEIST)
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    const restoreBtn = document.getElementById('snap-restore-btn');
    if (restoreBtn) {
      restoreBtn.addEventListener('click', () => this.restore());
    }
  }

  restore() {
    if (this.isSnapping) return;
    this.isSnapping = true;

    // Green Time Stone chime / chirp
    if (window.TimelineAudio) {
      window.TimelineAudio.playChirp(true);
    }

    // Time reversal effect
    const snappedCards = document.querySelectorAll('.snapped-dust');
    snappedCards.forEach((card, idx) => {
      setTimeout(() => {
        card.classList.remove('snapped-dust');
        card.classList.add('snapped-restoring');
        setTimeout(() => {
          card.classList.remove('snapped-restoring');
        }, 1200);
      }, idx * 25);
    });

    const banner = document.getElementById('snap-notification-banner');
    if (banner) {
      banner.style.opacity = '0';
      banner.style.transform = 'translate(-50%, -20px)';
      setTimeout(() => banner.remove(), 400);
    }

    this.isSnapped = false;
    setTimeout(() => {
      this.isSnapping = false;
    }, 1500);
  }
}

// Global instance export
window.ThanosDecimation = ThanosDecimation;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThanosDecimation };
}
