/**
 * MCU: THE SACRED TIMELINE - "THE MULTIVERSE IN NUMBERS" DASHBOARD CONTROLLER
 * High-impact visualizations: Top Grossing Bar Race, Phase Breakdown, ROI Leaderboard, Director Stats
 */

class MultiverseDashboard {
  constructor(options = {}) {
    this.data = options.data || [];
    this.container = document.getElementById('dashboard-section');
    this.onSelectFilm = options.onSelectFilm || (() => {});

    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;

    const films = this.data.filter(e => (e.type === 'film') && e.worldwideGross);
    const totalGross = films.reduce((acc, f) => acc + (f.worldwideGross || 0), 0);
    const totalBudget = films.reduce((acc, f) => acc + (f.budget || 0), 0);
    const avgRoi = (totalGross / totalBudget).toFixed(2);
    const billionFilms = films.filter(f => f.worldwideGross >= 1000000000).length;

    // Phase totals
    const phaseMap = {};
    films.forEach(f => {
      const p = f.phase || 1;
      if (!phaseMap[p]) phaseMap[p] = { gross: 0, budget: 0, count: 0 };
      phaseMap[p].gross += f.worldwideGross || 0;
      phaseMap[p].budget += f.budget || 0;
      phaseMap[p].count++;
    });

    // Top 10 Grossing Films
    const topGrossing = [...films].sort((a, b) => b.worldwideGross - a.worldwideGross).slice(0, 10);
    const maxTopGross = topGrossing[0].worldwideGross;

    // Top ROI Films
    const topRoi = [...films].filter(f => f.roi).sort((a, b) => b.roi - a.roi).slice(0, 8);
    const maxRoi = topRoi[0].roi;

    // Director Frequency
    const directorCounts = {};
    films.forEach(f => {
      (f.directors || []).forEach(d => {
        directorCounts[d] = (directorCounts[d] || 0) + 1;
      });
    });
    const sortedDirectors = Object.entries(directorCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

    this.container.innerHTML = `
      <div class="dashboard-header">
        <div class="dashboard-badge">SACRED ARCHIVES ANALYSIS</div>
        <h2 class="dashboard-title">The Multiverse in Numbers</h2>
        <p class="dashboard-subtitle">
          From a \$140M gamble on Tony Stark in 2008 to the highest-grossing film franchise in human cinematic history. 
          Real-time analytics across budgets, returns, and box-office milestones.
        </p>
      </div>

      <!-- KPI Summary Ribbon -->
      <div class="dashboard-kpi-row">
        <div class="kpi-card">
          <span class="kpi-label">Total MCU Global Gross</span>
          <span class="kpi-number">$${(totalGross / 1e9).toFixed(2)}B</span>
          <span class="kpi-subtext">38 Released Theatrical Films</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Total Production Invested</span>
          <span class="kpi-number">$${(totalBudget / 1e9).toFixed(2)}B</span>
          <span class="kpi-subtext">Across All Six Phases</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Franchise-Wide ROI</span>
          <span class="kpi-number">${avgRoi}x</span>
          <span class="kpi-subtext">Average Global Multiple</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Billion-Dollar Hits</span>
          <span class="kpi-number">${billionFilms}</span>
          <span class="kpi-subtext">More than any studio in history</span>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Top 10 Grossing Films Bar Race -->
        <div class="dashboard-card">
          <div class="dashboard-card-title">
            <span>All-Time Top 10 Grossing MCU Films</span>
            <span style="font-size:12px;color:var(--color-text-muted);">Worldwide Gross</span>
          </div>
          <div class="leaderboard-list">
            ${topGrossing.map((f, idx) => {
              const pct = (f.worldwideGross / maxTopGross) * 100;
              return `
                <div class="leaderboard-item" style="cursor:pointer;" data-id="${f.id}">
                  <span class="leaderboard-rank">#${idx + 1}</span>
                  <div class="leaderboard-bar-wrap">
                    <div class="leaderboard-bar-fill" style="width:${pct}%;background:${f.accentColor || 'var(--color-tva-amber)'}"></div>
                    <span class="leaderboard-name">${f.title}</span>
                  </div>
                  <span class="leaderboard-val">$${(f.worldwideGross / 1e9).toFixed(2)}B</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Highest Return on Investment (ROI) Leaderboard -->
        <div class="dashboard-card">
          <div class="dashboard-card-title">
            <span>Highest ROI Multiples</span>
            <span style="font-size:12px;color:var(--color-text-muted);">Gross ÷ Budget</span>
          </div>
          <div class="leaderboard-list">
            ${topRoi.map((f, idx) => {
              const pct = (f.roi / maxRoi) * 100;
              return `
                <div class="leaderboard-item" style="cursor:pointer;" data-id="${f.id}">
                  <span class="leaderboard-rank">#${idx + 1}</span>
                  <div class="leaderboard-bar-wrap">
                    <div class="leaderboard-bar-fill" style="width:${pct}%;background:linear-gradient(90deg, #10B981, #00E5FF)"></div>
                    <span class="leaderboard-name">${f.title}</span>
                  </div>
                  <span class="leaderboard-val" style="color:#10B981;">${f.roi}x</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Phase-by-Phase Box Office Accumulation -->
        <div class="dashboard-card">
          <div class="dashboard-card-title">
            <span>Box Office Totals by Phase</span>
            <span style="font-size:12px;color:var(--color-text-muted);">Infinity vs Multiverse</span>
          </div>
          <div class="leaderboard-list">
            ${Object.keys(phaseMap).map(pNum => {
              const pData = phaseMap[pNum];
              const maxPhase = 13500000000;
              const pct = (pData.gross / maxPhase) * 100;
              const phaseSaga = Number(pNum) <= 3 ? 'Infinity Saga' : 'Multiverse Saga';
              return `
                <div class="leaderboard-item">
                  <span class="leaderboard-rank" style="color:var(--color-tva-amber);font-size:12px;">P${pNum}</span>
                  <div class="leaderboard-bar-wrap">
                    <div class="leaderboard-bar-fill" style="width:${pct}%;background:linear-gradient(90deg, var(--color-tva-amber), var(--color-marvel-red))"></div>
                    <span class="leaderboard-name">Phase ${pNum} (${pData.count} films) • ${phaseSaga}</span>
                  </div>
                  <span class="leaderboard-val">$${(pData.gross / 1e9).toFixed(2)}B</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Most Prolific Directors Leaderboard -->
        <div class="dashboard-card">
          <div class="dashboard-card-title">
            <span>Most-Used MCU Directors</span>
            <span style="font-size:12px;color:var(--color-text-muted);">Feature Films</span>
          </div>
          <div class="leaderboard-list">
            ${sortedDirectors.map(([director, count], idx) => {
              const pct = (count / 4) * 100;
              return `
                <div class="leaderboard-item">
                  <span class="leaderboard-rank">#${idx + 1}</span>
                  <div class="leaderboard-bar-wrap">
                    <div class="leaderboard-bar-fill" style="width:${pct}%;background:linear-gradient(90deg, #6366F1, #8B5CF6)"></div>
                    <span class="leaderboard-name">${director}</span>
                  </div>
                  <span class="leaderboard-val">${count} Film${count > 1 ? 's' : ''}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Attach click listeners to jump to modal
    this.container.querySelectorAll('.leaderboard-item[data-id]').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const film = this.data.find(f => f.id === id);
        if (film) this.onSelectFilm(film);
      });
    });
  }
}

// Attach globally
window.MultiverseDashboard = MultiverseDashboard;
