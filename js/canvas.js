/**
 * MCU: THE SACRED TIMELINE - 3D CANVAS BACKGROUND ENGINE
 * High-performance 2D Canvas with perspective projection & reactive physics
 */

class SacredTimelineCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: false, desynchronized: true });
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    // Performance metrics & adaptive quality
    this.fpsHistory = [];
    this.lowQualityMode = false;
    this.isPaused = false;
    this.lastTime = performance.now();

    // Camera & Scroll tracking
    this.cameraZ = 0;
    this.targetCameraZ = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // Palette & Phase Color Shifts
    this.currentPhase = 1;
    this.phaseColors = {
      1: { r: 255, g: 157, b: 46 },  // Phase 1: TVA Gold
      2: { r: 14, g: 165, b: 233 },   // Phase 2: Steel Blue
      3: { r: 147, g: 51, b: 234 },   // Phase 3: Infinity Purple
      4: { r: 236, g: 29, b: 36 },    // Phase 4: Scarlet & Cyan
      5: { r: 16, g: 185, b: 129 },   // Phase 5: Emerald Variant
      6: { r: 0, g: 229, b: 255 }     // Phase 6: Multiverse Cyan
    };
    this.activeColor = { ...this.phaseColors[1] };
    this.targetColor = { ...this.phaseColors[1] };

    // Offscreen Sprite Cache
    this.particleSprite = null;
    this.threadGlowSprite = null;

    // Timeline river geometry & particles
    this.points = [];
    this.branches = [];
    this.particles = [];
    
    this.init();
  }

  init() {
    this.resize();
    this.createPreRenderedSprites();
    this.initTimelinePaths();
    this.initParticles();
    this.bindEvents();
    this.render();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  createPreRenderedSprites() {
    // 1. Particle Glow Sprite
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.3, 'rgba(255, 157, 46, 0.8)');
    pGrad.addColorStop(1, 'rgba(255, 157, 46, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);
    this.particleSprite = pCanvas;

    // 2. Thread Node Glow Sprite
    const tCanvas = document.createElement('canvas');
    tCanvas.width = 64;
    tCanvas.height = 64;
    const tCtx = tCanvas.getContext('2d');
    const tGrad = tCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    tGrad.addColorStop(0, 'rgba(255, 220, 150, 0.9)');
    tGrad.addColorStop(0.4, 'rgba(255, 157, 46, 0.5)');
    tGrad.addColorStop(1, 'rgba(255, 157, 46, 0)');
    tCtx.fillStyle = tGrad;
    tCtx.fillRect(0, 0, 64, 64);
    this.threadGlowSprite = tCanvas;
  }

  initTimelinePaths() {
    // Central Sacred Timeline River
    this.points = [];
    const numPoints = 120;
    for (let i = 0; i < numPoints; i++) {
      const z = i * 60;
      const x = Math.sin(i * 0.15) * 140 + Math.cos(i * 0.08) * 60;
      const y = Math.cos(i * 0.12) * 50;
      this.points.push({ x, y, z, originalX: x, originalY: y });
    }

    // Branching Variant Threads
    this.branches = [];
    const numBranches = 14;
    for (let b = 0; b < numBranches; b++) {
      const startIdx = Math.floor(Math.random() * (numPoints - 30)) + 10;
      const startPoint = this.points[startIdx];
      const branchPoints = [];
      const branchLen = Math.floor(Math.random() * 20) + 15;
      const dirX = (Math.random() - 0.5) * 350;
      const isPruned = Math.random() > 0.6; // Pruned branches turn red
      
      for (let j = 0; j < branchLen; j++) {
        const progress = j / branchLen;
        const z = startPoint.z + j * 50;
        const x = startPoint.x + dirX * Math.pow(progress, 0.8) + Math.sin(j * 0.3) * 40;
        const y = startPoint.y + (Math.random() - 0.5) * 80 * progress;
        branchPoints.push({ x, y, z });
      }
      this.branches.push({ points: branchPoints, isPruned, opacity: Math.random() * 0.5 + 0.3 });
    }
  }

  initParticles() {
    this.particles = [];
    const count = this.lowQualityMode ? 80 : 220;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 1800,
        y: (Math.random() - 0.5) * 1200,
        z: Math.random() * 5000,
        size: Math.random() * 2.5 + 1,
        speed: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize(), { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX - this.width / 2) * 0.15;
      this.targetMouseY = (e.clientY - this.height / 2) * 0.15;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      this.isPaused = document.hidden;
      if (!this.isPaused) {
        this.lastTime = performance.now();
        requestAnimationFrame(() => this.render());
      }
    });
  }

  setScrollProgress(progress) {
    // Progress is 0.0 to 1.0 along the timeline
    this.targetCameraZ = progress * 4500;
  }

  setPhase(phaseNumber) {
    this.currentPhase = phaseNumber;
    if (this.phaseColors[phaseNumber]) {
      this.targetColor = { ...this.phaseColors[phaseNumber] };
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.lastTime = performance.now();
      requestAnimationFrame(() => this.render());
    }
  }

  project(x, y, z) {
    const fov = 420;
    const relZ = z - this.cameraZ;
    if (relZ <= 5) return null; // Behind camera
    
    const scale = fov / relZ;
    const screenX = this.width / 2 + (x - this.mouseX) * scale;
    const screenY = this.height / 2 + (y - this.mouseY) * scale;
    return { x: screenX, y: screenY, scale, relZ };
  }

  render() {
    if (this.isPaused) return;

    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    // Adaptive Performance Monitor
    if (dt > 0) {
      this.fpsHistory.push(dt);
      if (this.fpsHistory.length > 30) {
        this.fpsHistory.shift();
        const avgDt = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
        if (avgDt > 20 && !this.lowQualityMode) {
          this.lowQualityMode = true;
          this.initParticles();
        }
      }
    }

    // Lerp Camera & Colors
    this.cameraZ += (this.targetCameraZ - this.cameraZ) * 0.08;
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.06;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.06;

    this.activeColor.r += (this.targetColor.r - this.activeColor.r) * 0.05;
    this.activeColor.g += (this.targetColor.g - this.activeColor.g) * 0.05;
    this.activeColor.b += (this.targetColor.b - this.activeColor.b) * 0.05;

    // Clear background
    this.ctx.fillStyle = '#05060A';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Set additive blending for glowing river & particles
    this.ctx.globalCompositeOperation = 'lighter';

    // 1. Draw Variant Branches
    this.drawBranches();

    // 2. Draw Main Sacred Timeline River
    this.drawSacredRiver(now);

    // 3. Draw Chronal Particles
    this.drawParticles();

    // Reset composite operation
    this.ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(() => this.render());
  }

  drawSacredRiver(time) {
    const projected = [];
    const timeSec = time * 0.001;

    for (let i = 0; i < this.points.length; i++) {
      const pt = this.points[i];
      // Subtle organic wave oscillation
      const waveX = pt.originalX + Math.sin(timeSec * 2 + i * 0.15) * 15;
      const waveY = pt.originalY + Math.cos(timeSec * 1.5 + i * 0.12) * 12;
      const p = this.project(waveX, waveY, pt.z);
      if (p) projected.push(p);
    }

    if (projected.length < 2) return;

    // Outer River Glow
    this.ctx.beginPath();
    this.ctx.moveTo(projected[0].x, projected[0].y);
    for (let i = 1; i < projected.length; i++) {
      this.ctx.lineTo(projected[i].x, projected[i].y);
    }
    const colorStr = `rgba(${Math.round(this.activeColor.r)}, ${Math.round(this.activeColor.g)}, ${Math.round(this.activeColor.b)}`;
    this.ctx.strokeStyle = `${colorStr}, 0.28)`;
    this.ctx.lineWidth = 14;
    this.ctx.stroke();

    // Core Luminous Thread
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = `${colorStr}, 0.75)`;
    this.ctx.stroke();

    // Center Hot White Line
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.stroke();

    // Key Thread Resonance Nodes
    for (let i = 0; i < projected.length; i += 8) {
      const p = projected[i];
      const size = Math.max(12 * p.scale, 8);
      this.ctx.drawImage(this.threadGlowSprite, p.x - size, p.y - size, size * 2, size * 2);
    }
  }

  drawBranches() {
    this.branches.forEach(branch => {
      const projected = [];
      branch.points.forEach(pt => {
        const p = this.project(pt.x, pt.y, pt.z);
        if (p) projected.push(p);
      });

      if (projected.length > 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(projected[0].x, projected[0].y);
        for (let i = 1; i < projected.length; i++) {
          this.ctx.lineTo(projected[i].x, projected[i].y);
        }
        
        // Pruned branches glow red; active branches glow variant cyan
        const strokeColor = branch.isPruned 
          ? `rgba(239, 68, 68, ${branch.opacity * 0.7})` 
          : `rgba(0, 229, 255, ${branch.opacity * 0.55})`;
        
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = branch.isPruned ? 1.5 : 2;
        this.ctx.stroke();
      }
    });
  }

  drawParticles() {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    this.particles.forEach(p => {
      // Loop particles around camera
      if (p.z < this.cameraZ) {
        p.z = this.cameraZ + 4800;
      } else if (p.z > this.cameraZ + 5000) {
        p.z = this.cameraZ + 20;
      }

      const proj = this.project(p.x, p.y, p.z);
      if (proj && proj.x >= 0 && proj.x <= this.width && proj.y >= 0 && proj.y <= this.height) {
        const size = p.size * proj.scale * 12;
        this.ctx.globalAlpha = p.alpha * Math.min(proj.scale * 3, 1);
        this.ctx.drawImage(this.particleSprite, proj.x - size / 2, proj.y - size / 2, size, size);
      }
    });
    this.ctx.globalAlpha = 1.0;
  }
}

// Attach globally
window.SacredTimelineCanvas = SacredTimelineCanvas;
