/* ═══════════════════════════════════════════
   CloudCandy - Main JavaScript v2
   Enhanced: Clouds, Tropical Fish, Coral Reefs,
   Atmospheric Particles, Animated Waves
   ═══════════════════════════════════════════ */

import skySrc from './img/sky.jpg';
import seaSrc from './img/sea.jpg';

const skyImg = new Image();
skyImg.src = skySrc;
const seaImg = new Image();
seaImg.src = seaSrc;

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTabs();
  initFadeIn();
  initRipple();
  initWaterRipple();
  initCustomCursor();

  const checkGSAP = setInterval(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      clearInterval(checkGSAP);
      gsap.registerPlugin(ScrollTrigger);
      initScrollAnimation();
      initParticleCanvas();
    }
  }, 100);
});

/* ═══════════ WATER RIPPLE (page-load distortion) ═══════════ */
function initWaterRipple() {
  const displacement = document.getElementById('ripple-displacement');
  const turbulence = document.getElementById('ripple-turbulence');
  const overlay = document.getElementById('ripple-overlay');
  if (!displacement || !turbulence || !overlay) return;

  // リプルを即座に開始（フェードインと同時）
  document.body.classList.add('ripple-active');

  const duration = 1500;    // リプル時間（ms）- 短め
  const peakScale = 12;     // 控えめな歪み
  const startTime = performance.now();

  function animateRipple(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const attackProgress = Math.min(progress / 0.1, 1);
    const decayProgress = Math.max((progress - 0.1) / 0.9, 0);

    const attack = Math.sin(attackProgress * Math.PI / 2);
    const decay = 1 - decayProgress * decayProgress * decayProgress;
    const scale = peakScale * attack * decay;

    const freq = 0.012 - progress * 0.009;
    const freqStr = `${Math.max(freq, 0.003)} ${Math.max(freq, 0.003)}`;

    displacement.setAttribute('scale', scale);
    turbulence.setAttribute('baseFrequency', freqStr);

    if (progress < 1) {
      requestAnimationFrame(animateRipple);
    } else {
      displacement.setAttribute('scale', '0');
      document.body.classList.remove('ripple-active');
    }
  }

  // 白フェードインとリプルを同時スタート
  requestAnimationFrame(() => {
    overlay.classList.add('fade-out');
    requestAnimationFrame(animateRipple);
  });

  // フェードイン完了後にオーバーレイを非表示
  setTimeout(() => {
    overlay.classList.add('done');
  }, 1400);
}


/* ═══════════ NAVIGATION ═══════════ */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => l.classList.remove('active'));
          const activeLink = navLinks.querySelector(`[data-section="${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
  );
  sections.forEach(sec => observer.observe(sec));
}

/* ═══════════ TAB SWITCHER ═══════════ */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === `panel-${tabId}`) {
          p.classList.add('active');
          p.querySelectorAll('.fade-in').forEach(el => {
            el.classList.remove('visible');
            requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
          });
        }
      });
    });
  });
}

/* ═══════════ FADE-IN ═══════════ */
function initFadeIn() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ═══════════ RIPPLE ═══════════ */
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const r = this.querySelector('.btn-ripple');
      if (!r) return;
      const rect = this.getBoundingClientRect();
      r.style.left = (e.clientX - rect.left) + 'px';
      r.style.top = (e.clientY - rect.top) + 'px';
      r.style.animation = 'none';
      requestAnimationFrame(() => { r.style.animation = 'ripple 0.6s ease-out'; });
    });
  });
}

/* ═══════════ SCROLL ANIMATION (GSAP) ═══════════ */
function initScrollAnimation() {
  const colorStops = [
    { pos: 0, color: [135, 206, 235] },
    { pos: 0.15, color: [160, 216, 239] },
    { pos: 0.3, color: [104, 184, 215] },
    { pos: 0.45, color: [27, 126, 161] },
    { pos: 0.65, color: [13, 79, 110] },
    { pos: 0.85, color: [0, 42, 78] },
    { pos: 1, color: [0, 31, 63] },
  ];

  function lerpColor(stops, progress) {
    progress = Math.max(0, Math.min(1, progress));
    let from = stops[0], to = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (progress >= stops[i].pos && progress <= stops[i + 1].pos) {
        from = stops[i]; to = stops[i + 1]; break;
      }
    }
    const t = (progress - from.pos) / ((to.pos - from.pos) || 1);
    return [
      Math.round(from.color[0] + (to.color[0] - from.color[0]) * t),
      Math.round(from.color[1] + (to.color[1] - from.color[1]) * t),
      Math.round(from.color[2] + (to.color[2] - from.color[2]) * t),
    ];
  }

  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: self => {
      const [r, g, b] = lerpColor(colorStops, self.progress);
      document.body.style.background = `rgb(${r},${g},${b})`;
      document.body.style.color = self.progress > 0.5 ? '#E8F4FD' : '#0A1628';
    },
  });

  const char = document.querySelector('.character-img');
  if (char) {
    gsap.to(char, {
      y: -60, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });
  }

  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    gsap.to(heroText, {
      y: 80, opacity: 0,
      scrollTrigger: { trigger: '#hero', start: 'center center', end: 'bottom top', scrub: 1 },
    });
  }
}

/* ═══════════════════════════════════════════
   ENHANCED PARTICLE SYSTEM (Canvas)
   ═══════════════════════════════════════════ */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  let scrollProgress = 0;
  let time = 0;

  let corals = [];
  let particlesInitialized = false;

  function rebuildCorals() {
    corals = [];
    for (let x = 20; x < w; x += rand(40, 90)) {
      corals.push(new Coral(x, h - rand(0, 15)));
    }
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    // リサイズ時にサンゴの配置を再計算（初期化完了後のみ実行）
    if (particlesInitialized) {
      rebuildCorals();
    }
  }
  resize();
  window.addEventListener('resize', resize);

  ScrollTrigger.create({
    trigger: 'body', start: 'top top', end: 'bottom bottom',
    onUpdate: self => { scrollProgress = self.progress; },
  });

  /* ── Utility ── */
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ═══════ CLOUD ═══════ */
  class Cloud {
    constructor() { this.reset(true); }
    reset(init) {
      this.isForeground = Math.random() > 0.5;
      // 雲を少し小さめに調整
      this.scale = this.isForeground ? rand(0.8, 2.0) : rand(0.3, 0.8);
      this.speed = (this.isForeground ? rand(0.1, 0.3) : rand(0.02, 0.08)) * (Math.random() > 0.5 ? 1 : -1);
      this.y = rand(-h * 0.05, h * 0.35); // 水面より確実に上に配置
      this.opacity = this.isForeground ? rand(0.4, 0.7) : rand(0.15, 0.3);
      this.x = init ? rand(-w * 0.2, w * 1.2) : (this.speed > 0 ? -300 * this.scale : w + 300 * this.scale);

      this.blobs = [];
      const count = Math.floor(rand(8, 16)); // 円の数を増やしてモコモコにする
      for (let i = 0; i < count; i++) {
        const angle = rand(0, Math.PI); // 上半分を中心に配置
        const dist = rand(0, 90) * this.scale; // 中心からの距離

        // より丸に近い楕円で構成（横長になりすぎないように）
        const sizeBase = Math.max(20, 90 - (dist / this.scale)); // 中心ほど大きく、外側ほど小さく
        this.blobs.push({
          ox: Math.cos(angle) * dist * 1.5, // 横方向への広がり
          oy: -Math.abs(Math.sin(angle)) * dist * 0.5, // 上方向へ盛り上がるように
          rx: rand(sizeBase * 0.8, sizeBase * 1.2) * this.scale,
          ry: rand(sizeBase * 0.7, sizeBase) * this.scale,
        });
      }
    }
    update() {
      this.x += this.speed;
      if (this.speed > 0 && this.x > w + 400 * this.scale) this.reset(false);
      if (this.speed < 0 && this.x < -400 * this.scale) this.reset(false);
    }
    draw(ctx, heroTop) {
      // パララックス：スクロールに対し半分程度の速度で移動
      const pY = this.y + heroTop * 0.5;
      ctx.save();
      ctx.globalAlpha = this.opacity;

      // 影レイヤー
      ctx.fillStyle = this.isForeground ? 'rgba(210, 225, 245, 0.7)' : 'rgba(200, 220, 240, 0.4)';
      this.blobs.forEach(b => {
        ctx.beginPath();
        ctx.ellipse(this.x + b.ox, pY + b.oy + b.ry * 0.3, b.rx, b.ry * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      // ハイライトレイヤー
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      this.blobs.forEach(b => {
        ctx.beginPath();
        ctx.ellipse(this.x + b.ox, pY + b.oy, b.rx, b.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  }

  /* ═══════ ATMOSPHERIC PARTICLE (dust / light motes) ═══════ */
  class DustMote {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = rand(0, w);
      this.y = init ? rand(0, h) : rand(-20, h + 20);
      this.r = rand(1, 3.5);
      this.speedX = rand(-0.3, 0.3);
      this.speedY = rand(-0.4, 0.1);
      this.opacity = rand(0.1, 0.4);
      this.twinkleSpeed = rand(0.01, 0.04);
      this.phase = rand(0, Math.PI * 2);
      this.life = 0;
      this.maxLife = rand(300, 800);
    }
    update() {
      this.x += this.speedX + Math.sin(this.phase) * 0.2;
      this.y += this.speedY;
      this.phase += this.twinkleSpeed;
      this.life++;
      if (this.life > this.maxLife || this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10)
        this.reset(false);
    }
    draw(ctx) {
      const twinkle = (Math.sin(this.phase) * 0.5 + 0.5);
      const fadeIn = Math.min(1, this.life / 60);
      const fadeOut = Math.min(1, (this.maxLife - this.life) / 60);
      const alpha = this.opacity * twinkle * fadeIn * fadeOut;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }
  }

  /* ═══════ BUBBLE ═══════ */
  class Bubble {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = rand(0, w);
      this.y = init ? rand(0, h) : h + rand(10, 100);
      this.r = rand(2, 7);
      this.speed = rand(0.5, 2);
      this.wobbleSpeed = rand(0.01, 0.03);
      this.wobbleAmp = rand(15, 40);
      this.opacity = rand(0.08, 0.35);
      this.phase = rand(0, Math.PI * 2);
    }
    update() {
      this.y -= this.speed;
      this.phase += this.wobbleSpeed;
      if (this.y < -20) this.reset(false);
    }
    draw(ctx) {
      const xOff = Math.sin(this.phase) * this.wobbleAmp;
      const px = this.x + xOff;
      // Glass-like bubble
      ctx.beginPath();
      ctx.arc(px, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180, 230, 255, ${this.opacity * 0.8})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = `rgba(180, 230, 255, ${this.opacity * 0.3})`;
      ctx.fill();
      // Highlight
      ctx.beginPath();
      ctx.arc(px - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.9})`;
      ctx.fill();
    }
  }

  /* ═══════ TROPICAL FISH ═══════ */
  const fishPalette = [
    { body: [255, 150, 80], fin: [255, 120, 50] },     // Clownfish orange
    { body: [100, 200, 255], fin: [60, 160, 230] },    // Neon blue
    { body: [255, 200, 100], fin: [255, 170, 60] },    // Yellow tang
    { body: [180, 130, 255], fin: [150, 100, 230] },   // Purple
    { body: [100, 230, 180], fin: [60, 200, 150] },    // Aquamarine
    { body: [255, 130, 170], fin: [230, 100, 140] },   // Pink
  ];

  class TropicalFish {
    constructor() { this.reset(true); }
    reset(init) {
      this.dir = Math.random() > 0.5 ? 1 : -1;
      this.x = init ? rand(0, w) : (this.dir > 0 ? rand(-80, -40) : rand(w + 40, w + 80));
      this.y = rand(h * 0.15, h * 0.85);
      this.speed = rand(0.8, 2.5) * this.dir;
      this.size = rand(6, 14);
      this.opacity = rand(0.3, 0.65);
      this.wobble = rand(0, Math.PI * 2);
      this.wobbleSpeed = rand(0.03, 0.06);
      this.tailPhase = 0;
      this.tailSpeed = rand(0.15, 0.3);
      const palette = fishPalette[Math.floor(rand(0, fishPalette.length))];
      this.bodyColor = palette.body;
      this.finColor = palette.fin;
      // Stripes
      this.hasStripes = Math.random() > 0.4;
      this.stripeCount = Math.floor(rand(2, 4));
    }
    update() {
      this.x += this.speed;
      this.wobble += this.wobbleSpeed;
      this.tailPhase += this.tailSpeed;
      if ((this.dir > 0 && this.x > w + 60) || (this.dir < 0 && this.x < -60)) this.reset(false);
    }
    draw(ctx) {
      const yOff = Math.sin(this.wobble) * 8;
      const tailSwing = Math.sin(this.tailPhase) * this.size * 0.5;
      ctx.save();
      ctx.translate(this.x, this.y + yOff);
      if (this.dir < 0) ctx.scale(-1, 1);
      ctx.globalAlpha = this.opacity;

      const s = this.size;
      const [br, bg, bb] = this.bodyColor;
      const [fr, fg, fb] = this.finColor;

      // Tail fin
      ctx.beginPath();
      ctx.moveTo(-s * 0.9, 0);
      ctx.lineTo(-s * 1.5, -s * 0.5 + tailSwing * 0.5);
      ctx.lineTo(-s * 1.5, s * 0.5 + tailSwing * 0.5);
      ctx.closePath();
      ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, 0.85)`;
      ctx.fill();

      // Body (ellipse)
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${br}, ${bg}, ${bb}, 0.9)`;
      ctx.fill();

      // Stripes (white bands like clownfish)
      if (this.hasStripes) {
        ctx.fillStyle = `rgba(255, 255, 255, 0.35)`;
        for (let i = 0; i < this.stripeCount; i++) {
          const sx = lerp(-s * 0.5, s * 0.5, i / (this.stripeCount));
          ctx.fillRect(sx - 1, -s * 0.45, 2.5, s * 0.9);
        }
      }

      // Dorsal fin
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, -s * 0.45);
      ctx.quadraticCurveTo(s * 0.1, -s * 0.9, s * 0.5, -s * 0.4);
      ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, 0.7)`;
      ctx.fill();

      // Eye
      ctx.beginPath();
      ctx.arc(s * 0.45, -s * 0.05, s * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s * 0.48, -s * 0.05, s * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(10,10,30,0.9)';
      ctx.fill();

      ctx.restore();
    }
  }

  /* ═══════ CORAL REEF ═══════ */
  /* ═══════ CORAL REEF (Optimized & High Quality) ═══════ */
  const coralPalette = [
    [160, 130, 120],  // Muted pink
    [160, 140, 130],  // Muted salmon
    [140, 120, 150],  // Muted lavender
    [110, 150, 140],  // Muted seafoam
    [160, 145, 120],  // Muted orange
    [120, 140, 160],  // Muted blue
  ];

  class Coral {
    constructor(baseX, baseBottom) {
      this.baseX = baseX;
      this.baseY = baseBottom;
      this.type = Math.floor(rand(0, 3)); // 0=branching, 1=fan, 2=tube
      this.color = coralPalette[Math.floor(rand(0, coralPalette.length))];
      this.scale = rand(0.5, 1.2);
      this.swayPhase = rand(0, Math.PI * 2);
      // 🔥 非常にゆっくりとした自然な海流の揺れに修正 🔥
      this.swaySpeed = rand(0.0005, 0.002);
      this.swayAmp = rand(2, 6) * 0.01;

      // オフスクリーンキャンバスで1度だけ精細に描画（パフォーマンス最適化）
      this.offscreen = document.createElement('canvas');
      this.offscreen.width = 240;
      this.offscreen.height = 240;
      const ctx = this.offscreen.getContext('2d');
      this.renderOffscreen(ctx);
    }

    renderOffscreen(ctx) {
      // 主張を抑えるためにブラーと明度低下
      ctx.filter = 'blur(4px) brightness(0.7)';
      const [r, g, b] = this.color;
      ctx.translate(120, 240); // center-bottom

      if (this.type === 0) {
        // 枝状サンゴ (フラクタル)
        this.drawFractalBranch(ctx, 0, 0, -50, 12, -Math.PI / 2, r, g, b, 0);
      } else if (this.type === 1) {
        // ウミウチワ (扇状サンゴ)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-100, -40, -80, -140, 0, -160);
        ctx.bezierCurveTo(80, -140, 100, -40, 0, 0);
        ctx.fill();
        // 脈絡を描画
        ctx.strokeStyle = `rgba(${r - 40}, ${g - 40}, ${b - 40}, 0.5)`;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 9; i++) {
          const a = -Math.PI * 0.85 + (Math.PI * 0.7 / 8) * i;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const cp1x = Math.cos(a) * 50 + rand(-10, 10);
          const cp1y = Math.sin(a) * 50;
          const ex = Math.cos(a) * 140;
          const ey = Math.sin(a) * 140;
          ctx.quadraticCurveTo(cp1x, cp1y, ex, ey);
          ctx.stroke();
        }
      } else {
        // パイプ状サンゴ (カイメン等)
        for (let i = 0; i < 6; i++) {
          const w = rand(12, 24);
          const h = rand(40, 120);
          const ox = rand(-40, 40);
          const controlX = ox + rand(-20, 20);

          ctx.beginPath();
          ctx.moveTo(ox - w / 2, 0);
          ctx.quadraticCurveTo(controlX - w / 2, -h / 2, ox - w * 0.8, -h);
          ctx.lineTo(ox + w * 0.8, -h);
          ctx.quadraticCurveTo(controlX + w / 2, -h / 2, ox + w / 2, 0);
          const grad = ctx.createLinearGradient(ox, 0, ox, -h);
          grad.addColorStop(0, `rgba(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)}, 0.9)`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.9)`);
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(ox, -h, w * 0.8, w * 0.35, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.max(0, r - 90)}, ${Math.max(0, g - 90)}, ${Math.max(0, b - 90)}, 1)`;
          ctx.fill();
        }
      }
    }

    drawFractalBranch(ctx, x, y, len, width, angle, r, g, b, depth) {
      if (depth > 4) return;
      const nx = x + Math.cos(angle) * Math.abs(len);
      const ny = y + Math.sin(angle) * Math.abs(len);

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.9 - depth * 0.1})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      if (depth > 1) {
        ctx.fillStyle = `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, 0.8)`;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(nx + rand(-6, 6), ny + rand(-6, 6), rand(1, 3.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const branches = Math.floor(rand(1, 4));
      for (let i = 0; i < branches; i++) {
        this.drawFractalBranch(ctx, nx, ny, len * rand(0.5, 0.8), width * 0.65, angle + rand(-0.7, 0.7), r, g, b, depth + 1);
      }
    }

    update() {
      this.swayPhase += this.swaySpeed;
    }
    draw(ctx) {
      const rot = Math.sin(this.swayPhase) * this.swayAmp;
      ctx.save();
      ctx.translate(this.baseX, this.baseY);
      ctx.scale(this.scale, this.scale);
      ctx.rotate(rot); // 全体が根元からゆっくり揺れる
      ctx.drawImage(this.offscreen, -120, -240);
      ctx.restore();
    }
  }

  /* ═══════ SEAGULLS (BIRDS) ═══════ */
  class Bird {
    constructor() { this.reset(true); }
    reset(init) {
      this.dir = Math.random() > 0.5 ? 1 : -1;
      this.x = init ? rand(0, w) : (this.dir > 0 ? rand(-100, -20) : rand(w + 20, w + 100));
      this.y = rand(h * 0.05, h * 0.25);
      this.speedX = rand(0.5, 1.2) * this.dir;
      this.speedY = rand(-0.05, 0.05);
      this.size = rand(2.5, 4.5);
      this.flapSpeed = rand(0.08, 0.15);
      this.flapPhase = rand(0, Math.PI * 2);
      this.opacity = rand(0.4, 0.7);
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.flapPhase += this.flapSpeed;
      if ((this.dir > 0 && this.x > w + 50) || (this.dir < 0 && this.x < -50)) this.reset(false);
    }
    draw(ctx, heroTop) {
      const pY = this.y + heroTop * 0.4; // 水上パララックス
      const wingY = Math.sin(this.flapPhase) * this.size * 0.8;
      ctx.save();
      ctx.translate(this.x, pY);
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-this.size * 2, -wingY);
      ctx.quadraticCurveTo(-this.size, -wingY * 0.5, 0, 0);
      ctx.quadraticCurveTo(this.size, -wingY * 0.5, this.size * 2, -wingY);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ═══════ JELLYFISH ═══════ */
  class Jellyfish {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = rand(w * 0.1, w * 0.9);
      this.y = init ? rand(h * 0.5, h * 1.5) : h + rand(50, 200);
      this.size = rand(15, 30);
      this.speedY = rand(0.2, 0.5);
      this.pulseSpeed = rand(0.015, 0.03);
      this.pulsePhase = rand(0, Math.PI * 2);
      this.driftPhase = rand(0, Math.PI * 2);
      this.opacity = rand(0.4, 0.8);
    }
    update() {
      this.pulsePhase += this.pulseSpeed;
      this.driftPhase += 0.01;
      const pulseForce = Math.max(0, Math.sin(this.pulsePhase));
      this.y -= this.speedY + pulseForce * 0.7; // 収縮時に加速
      this.x += Math.cos(this.driftPhase) * 0.4;
      if (this.y < -150) this.reset(false);
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = this.opacity;

      const pulse = Math.sin(this.pulsePhase);
      const stretch = 1 + pulse * 0.15;
      const width = this.size * (1 - pulse * 0.15);
      ctx.scale(width / this.size, stretch);

      // 傘
      ctx.beginPath();
      ctx.moveTo(-this.size, 0);
      ctx.bezierCurveTo(-this.size, -this.size * 1.5, this.size, -this.size * 1.5, this.size, 0);
      ctx.quadraticCurveTo(0, -this.size * 0.15, -this.size, 0);
      const grad = ctx.createLinearGradient(0, -this.size * 1.5, 0, 0);
      grad.addColorStop(0, 'rgba(180, 230, 255, 0.9)');
      grad.addColorStop(1, 'rgba(100, 200, 255, 0.1)');
      ctx.fillStyle = grad;
      ctx.fill();

      // 発光器官
      ctx.beginPath();
      ctx.arc(0, -this.size * 0.6, this.size * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();

      // 触手
      ctx.strokeStyle = 'rgba(180, 230, 255, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = -this.size * 0.7; i <= this.size * 0.7; i += this.size * 0.35) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        let tx = i, ty = 0;
        for (let j = 0; j < 4; j++) {
          let nty = ty + this.size * 0.8;
          let ntx = tx + Math.sin(this.driftPhase * 2 + j + i) * 6;
          ctx.quadraticCurveTo(tx, ty + this.size * 0.4, ntx, nty);
          tx = ntx; ty = nty;
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* ═══════ PLANKTON (Glowing Deep Sea Dots) ═══════ */
  class Plankton {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = rand(0, w);
      this.y = init ? rand(h * 0.4, h * 1.2) : h + rand(10, 50);
      this.size = rand(0.5, 2.5);
      this.speedY = rand(0.1, 0.4);
      this.speedX = rand(-0.15, 0.15);
      this.phase = rand(0, Math.PI * 2);
      this.opacity = rand(0.3, 1);
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.phase += 0.03) * 0.2;
      if (this.y < h * 0.3) this.reset(false); // 深海のみ存在
    }
    draw(ctx) {
      const glow = Math.sin(this.phase * 0.5) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (1 + glow * 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 255, 230, ${this.opacity * (0.4 + glow * 0.6)})`;
      ctx.fill();
    }
  }


  /* ═══════ GOD RAY ═══════ */
  class GodRay {
    constructor() { this.reset(); }
    reset() {
      this.x = rand(0, w);
      this.width = rand(40, 80);
      this.opacity = rand(0.02, 0.06);
      this.swayPhase = rand(0, Math.PI * 2);
      this.swaySpeed = rand(0.002, 0.006);
    }
    update() { this.swayPhase += this.swaySpeed; }
    draw(ctx) {
      const sway = Math.sin(this.swayPhase) * 50;
      const gradient = ctx.createLinearGradient(this.x + sway, 0, this.x + sway, h);
      gradient.addColorStop(0, `rgba(200, 235, 255, ${this.opacity})`);
      gradient.addColorStop(0.5, `rgba(200, 235, 255, ${this.opacity * 0.4})`);
      gradient.addColorStop(1, 'rgba(200, 235, 255, 0)');
      ctx.beginPath();
      ctx.moveTo(this.x + sway - this.width / 2, 0);
      ctx.lineTo(this.x + sway + this.width / 2, 0);
      ctx.lineTo(this.x + sway + this.width * 1.2, h);
      ctx.lineTo(this.x + sway - this.width * 1.2, h);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  /* ═══════ WATER SURFACE WAVE ═══════ */
  function drawWaterSurface(ctx, sp, heroBottom) {
    // Heroセクションの最下部に波を完全に追従させる
    const waveY = heroBottom - 20;

    // 画面外に出た場合は描画スキップ
    if (waveY > h + 100 || waveY < -200) return;

    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      ctx.moveTo(0, waveY);
      for (let x = 0; x <= w; x += 4) {
        // 波のうねりを時間とレイヤーごとに計算
        const y = waveY
          + Math.sin(x * 0.006 + time * 0.5 + layer * 1.2) * 14
          + Math.sin(x * 0.012 + time * 0.8 + layer * 0.8) * 8
          + Math.sin(x * 0.003 + time * 0.2) * 15;
        ctx.lineTo(x, y);
      }

      // 波の下部をグラデーションで自然に背景色へ溶け込ませる
      ctx.lineTo(w, waveY + 200);
      ctx.lineTo(0, waveY + 200);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, waveY - 20, 0, waveY + 200);
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.15 + layer * 0.05})`);
      grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 水面のきらめき（ジャギジャギを避けるため加算合成に変更）
    ctx.globalCompositeOperation = 'lighter';
    for (let x = 0; x < w; x += 25) {
      const shimmerY = waveY + Math.sin(x * 0.01 + time * 0.7) * 12;
      const shimmerAlpha = 0.5 * (Math.sin(x * 0.05 + time * 1.8) * 0.5 + 0.5);
      ctx.beginPath();
      ctx.ellipse(x, shimmerY, rand(10, 25), 2.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${shimmerAlpha})`;
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ═══════ LIGHT CAUSTICS ═══════ */
  function drawCaustics(ctx, progress) {
    const causticsAlpha = Math.max(0, (progress - 0.3) / 0.5) * 0.09;
    if (causticsAlpha <= 0.001) return;

    for (let i = 0; i < 18; i++) {
      const cx = (Math.sin(time * 0.25 + i * 2.1) * 0.5 + 0.5) * w;
      const cy = (Math.cos(time * 0.15 + i * 1.7) * 0.5 + 0.5) * h;
      const r = 40 + Math.sin(time * 0.4 + i) * 20;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      gradient.addColorStop(0, `rgba(180, 230, 255, ${causticsAlpha})`);
      gradient.addColorStop(1, 'rgba(180, 230, 255, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  /* ═══════ INITIALIZE ALL PARTICLES ═══════ */
  const clouds = Array.from({ length: 7 }, () => new Cloud());
  const dustMotes = Array.from({ length: 36 }, () => new DustMote()); // 60 -> 36 (-40%)
  const birds = Array.from({ length: 15 }, () => new Bird());

  const bubbles = Array.from({ length: 36 }, () => new Bubble()); // 60 -> 36 (-40%)
  const tropicalFish = Array.from({ length: 9 }, () => new TropicalFish()); // 15 -> 9 (-40%)
  const godRays = Array.from({ length: 8 }, () => new GodRay());
  const jellyfish = Array.from({ length: 5 }, () => new Jellyfish());
  const planktons = Array.from({ length: 90 }, () => new Plankton()); // 150 -> 90 (-40%)

  particlesInitialized = true;
  rebuildCorals();

  /* ═══════ MAIN ANIMATION LOOP ═══════ */
  function animate() {
    ctx.clearRect(0, 0, w, h);
    time += 0.016;

    const sp = scrollProgress;
    const skyPhase = Math.max(0, 1 - sp / 0.25);
    const waterPhase = Math.max(0, (sp - 0.13) / 0.87);
    const deepPhase = Math.max(0, (sp - 0.45) / 0.55);

    /* ── SKY ELEMENTS ── */
    const hero = document.getElementById('hero');
    const heroRect = hero ? hero.getBoundingClientRect() : { top: 0, bottom: h };

    if (skyPhase > 0.01) {
      ctx.globalAlpha = skyPhase;

      // Heroの背景グラデーションをCanvas側で描画
      ctx.globalCompositeOperation = 'source-over';
      const bgGrad = ctx.createLinearGradient(0, heroRect.top, 0, heroRect.bottom);
      bgGrad.addColorStop(0, '#87CEEB');     // top: sky blue
      bgGrad.addColorStop(0.9, '#A0D8EF');   // var(--sky-light)
      bgGrad.addColorStop(1, 'rgba(160, 216, 239, 0)'); // フェードアウト
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, heroRect.top, w, heroRect.bottom - heroRect.top + 50);

      // 空の背景画像（薄くブレンド）
      if (skyImg.complete && skyImg.naturalWidth > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = skyPhase * 0.5; // 画像を10%濃くする

        // 画像を画面幅に合わせてカバーするように描画
        const imgRatio = skyImg.width / skyImg.height;
        const screenRatio = w / (heroRect.bottom - heroRect.top);
        let drawW = w;
        let drawH = w / imgRatio;
        if (screenRatio < imgRatio) {
          drawH = heroRect.bottom - heroRect.top;
          drawW = drawH * imgRatio;
        }
        ctx.drawImage(skyImg, (w - drawW) / 2, heroRect.top, drawW, drawH);
        ctx.restore();
      }

      // 太陽の強烈な光とフレア
      const sunY = h * 0.15 + heroRect.top * 0.6;
      const sunX = w * 0.8;
      ctx.save();
      const grad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, h * 0.8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.1, 'rgba(255, 245, 220, 0.5)');
      grad.addColorStop(0.3, 'rgba(180, 230, 255, 0.15)');
      grad.addColorStop(1, 'rgba(135, 206, 235, 0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 海の水平線（遠景）と光の道 (Sun Glint)
      const horizonY = heroRect.bottom - 120;
      ctx.globalCompositeOperation = 'source-over';
      const oceanGrad = ctx.createLinearGradient(0, horizonY, 0, horizonY + 120);
      oceanGrad.addColorStop(0, 'rgba(150, 210, 235, 0.4)');
      oceanGrad.addColorStop(1, 'rgba(50, 150, 200, 0)');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, horizonY, w, 120);

      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 30; i++) {
        const glintY = horizonY + Math.pow(Math.random(), 2) * 120;
        const widthParams = (glintY - horizonY) * 0.6 + 20;
        const glintX = sunX + rand(-widthParams, widthParams) * 1.5;
        ctx.globalAlpha = rand(0.2, 0.7);
        ctx.fillRect(glintX, glintY, rand(10, 40), rand(1, 2.5));
      }
      ctx.restore();

      clouds.forEach(c => { c.update(); c.draw(ctx, heroRect.top); });
      birds.forEach(b => { b.update(); b.draw(ctx, heroRect.top); });
      dustMotes.forEach(d => { d.update(); d.draw(ctx); });
    }

    /* ── WATER SURFACE ── */
    drawWaterSurface(ctx, sp, heroRect.bottom);

    /* ── UNDERWATER ELEMENTS ── */
    if (waterPhase > 0.01) {
      ctx.globalAlpha = waterPhase;

      const seaTop = heroRect.bottom;
      // seaTopがマイナスになっても画面最下部まで確実にカバーできる高さを確保
      const fillHeight = Math.max(h * 2, h - seaTop + 100);

      // 海の基本グラデーション背景
      ctx.globalCompositeOperation = 'source-over';
      const uwGrad = ctx.createLinearGradient(0, seaTop, 0, Math.max(h, seaTop + h));
      uwGrad.addColorStop(0, 'rgba(27, 126, 161, 0.2)');
      uwGrad.addColorStop(1, 'rgba(0, 31, 63, 0.4)');
      ctx.fillStyle = uwGrad;
      ctx.fillRect(0, seaTop, w, fillHeight);

      // 海中の基本背景カラーレイヤー（深海）
      // 【修正】画像よりも「背面」に描画することで、深海でも画像が黒く塗りつぶされないようにする
      ctx.fillStyle = `rgba(13, 31, 63, ${deepPhase})`;
      ctx.fillRect(0, seaTop, w, fillHeight);

      // 海の背景画像（薄くブレンド）
      if (seaImg.complete && seaImg.naturalWidth > 0) {
        ctx.save();

        // 海の画像は「画面に固定」し、水面(seaTop)より下の領域だけ表示する
        ctx.beginPath();
        // 【修正】高さがhだとクリッピングが画面途中で切れてしまうバグを修正
        ctx.rect(0, seaTop, w, fillHeight);
        ctx.clip();

        ctx.globalCompositeOperation = 'soft-light';
        // 深海に進むにつれて少し不透明度を上げる（暗い背景に馴染ませる）
        // さらに15%透明に下げて調整
        ctx.globalAlpha = Math.min(1, waterPhase * 0.15);

        const imgRatio = seaImg.width / seaImg.height;
        const screenRatio = w / h;

        // 画面サイズにぴったり合わせる（Cover・引き延ばさない）
        let drawW = w;
        let drawH = h;
        if (screenRatio > imgRatio) {
          drawH = w / imgRatio;
        } else {
          drawW = h * imgRatio;
        }

        // 画面中央に固定（スクロールしても固定）
        const drawX = (w - drawW) / 2;
        const drawY = (h - drawH) / 2;

        ctx.drawImage(seaImg, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      drawCaustics(ctx, sp);

      if (deepPhase > 0.01) {
        ctx.globalAlpha = Math.min(1, waterPhase) * deepPhase;
        godRays.forEach(r => { r.update(); r.draw(ctx); });

        ctx.globalAlpha = Math.min(1, deepPhase * 2);
        planktons.forEach(p => { p.update(); p.draw(ctx); });
        jellyfish.forEach(j => { j.update(); j.draw(ctx); });
      }

      ctx.globalAlpha = Math.min(1, waterPhase * 2);
      bubbles.forEach(b => { b.update(); b.draw(ctx); });

      const coralAlpha = Math.max(0, (sp - 0.45) / 0.45);
      if (coralAlpha > 0.01) {
        ctx.globalAlpha = Math.min(1, coralAlpha);
        corals.forEach(c => { c.update(); c.draw(ctx); });
      }

      ctx.globalAlpha = Math.min(1, waterPhase * 1.5);
      tropicalFish.forEach(f => { f.update(); f.draw(ctx); });
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  animate();
}

/* ═══════════ CUSTOM CURSOR & BUBBLES ═══════════ */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 泡を時々生成（ぷくぷくと少し）
    if (Math.random() < 0.08) {
      createCursorBubble(mouseX, mouseY);
    }
  });

  // 慣性のある追従
  function animate() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    cursorX += dx * 0.2;
    cursorY += dy * 0.2;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animate);
  }
  animate();

  // ホバー時の拡大
  function updateInteractables() {
    const interactables = document.querySelectorAll('a, button, [role="button"]');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }
  updateInteractables();

  // タブ切り替えなどで要素が動的に追加された場合に対応するため
  const observer = new MutationObserver(updateInteractables);
  observer.observe(document.body, { childList: true, subtree: true });

  function createCursorBubble(x, y) {
    const bubble = document.createElement('div');
    bubble.className = 'cursor-bubble';

    const size = Math.random() * 8 + 4;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;

    document.body.appendChild(bubble);

    // アニメーション終了後に削除
    setTimeout(() => {
      bubble.remove();
    }, 2000);
  }
}

