/* ══════════════════════════════════════════════
   CONFIG — easily editable
   ══════════════════════════════════════════════ */
const PHOTOS = [
  'assets/media/zap.jpg',
  'assets/media/zap2.jpg',
  'assets/media/zap3.jpg',
  'assets/media/zap4.jpg',
  'assets/media/zap5.jpg',
  'assets/media/zap6.jpg',
  'assets/media/zap7.jpg',
  'assets/media/zap8.jpg',
  'assets/media/zap9.jpg',
  'assets/media/zap10.jpg',
];

const VIDEOS = [
  'assets/media/zap.mp4',
  'assets/media/zap2.mp4',
  'assets/media/zap3.mp4',
  'assets/media/zap4.mp4',
  'assets/media/zap5.mp4',
  'assets/media/zap6.mp4',
  'assets/media/zap7.mp4',
  'assets/media/zap8.mp4',
  'assets/media/zap9.mp4',
  'assets/media/zap10.mp4',
];

const MUSIC = 'assets/media/love-song.mp3';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ══════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ══════════════════════════════════════════════ */
(function scrollProgress() {
  const bar = document.getElementById('scrollBar');
  if (!bar) return;

  let raf = false;
  function update() {
    const h = document.documentElement;
    const scrolled = h.scrollTop || document.body.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    bar.style.width = pct + '%';
    raf = false;
  }
  function onScroll() {
    if (!raf) {
      raf = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();


/* ══════════════════════════════════════════════
   REVEAL ON SCROLL
   ══════════════════════════════════════════════ */
(function reveals() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });
  items.forEach(el => io.observe(el));
})();


/* ══════════════════════════════════════════════
   BEGIN BUTTON — scroll + start music
   ══════════════════════════════════════════════ */
(function begin() {
  const btn = document.getElementById('beginBtn');
  const music = document.getElementById('musicPlayer');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const target = document.getElementById('story');
    if (target) {
      target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    }
    // reveal music player and try to start
    if (music) music.classList.add('show');
    tryStartMusic();
  });
})();


/* ══════════════════════════════════════════════
   PARTICLE CANVAS (light, mobile-friendly)
   ══════════════════════════════════════════════ */
(function particles() {
  const canvas = document.getElementById('particles');
  if (!canvas || REDUCED) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0, h = 0, dpr = 1;
  let stars = [];
  let hearts = [];
  let raf;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    const area = w * h;
    // keep it light for phones
    const starCount = Math.min(70, Math.max(28, Math.floor(area / 24000)));
    const heartCount = Math.min(8, Math.max(4, Math.floor(area / 220000)));

    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.4,
        a: Math.random() * 0.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        tw: Math.random() * Math.PI * 2,
        twSpd: 0.006 + Math.random() * 0.012,
      });
    }

    hearts = [];
    for (let i = 0; i < heartCount; i++) {
      hearts.push({
        x: Math.random() * w,
        y: h + Math.random() * h,
        size: 6 + Math.random() * 10,
        vy: -(0.15 + Math.random() * 0.25),
        vx: (Math.random() - 0.5) * 0.15,
        a: 0.15 + Math.random() * 0.25,
        rot: Math.random() * Math.PI * 2,
        rotSpd: (Math.random() - 0.5) * 0.004,
      });
    }
  }

  function drawHeart(x, y, size, alpha, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ff6fae';
    ctx.shadowColor = 'rgba(255,111,174,0.9)';
    ctx.shadowBlur = size * 1.4;
    ctx.beginPath();
    const s = size / 16;
    ctx.moveTo(0, 4 * s);
    ctx.bezierCurveTo(0, 0, -8 * s, -4 * s, -8 * s, -8 * s);
    ctx.bezierCurveTo(-8 * s, -14 * s, 0, -14 * s, 0, -9 * s);
    ctx.bezierCurveTo(0, -14 * s, 8 * s, -14 * s, 8 * s, -8 * s);
    ctx.bezierCurveTo(8 * s, -4 * s, 0, 0, 0, 4 * s);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    // stars
    for (const s of stars) {
      s.x += s.vx;
      s.y += s.vy;
      s.tw += s.twSpd;
      if (s.x < -10) s.x = w + 10;
      if (s.x > w + 10) s.x = -10;
      if (s.y < -10) s.y = h + 10;
      if (s.y > h + 10) s.y = -10;

      const tw = (Math.sin(s.tw) + 1) * 0.5;
      const alpha = s.a * (0.5 + tw * 0.5);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 200, 230, ${alpha})`;
      ctx.shadowColor = 'rgba(255,111,174,0.6)';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // hearts
    for (const hrt of hearts) {
      hrt.x += hrt.vx;
      hrt.y += hrt.vy;
      hrt.rot += hrt.rotSpd;
      if (hrt.y < -40) {
        hrt.y = h + 40;
        hrt.x = Math.random() * w;
      }
      drawHeart(hrt.x, hrt.y, hrt.size, hrt.a, hrt.rot);
    }

    raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    frame();
  }, { passive: true });

  // pause when tab hidden to save battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      cancelAnimationFrame(raf);
      frame();
    }
  });

  frame();
})();


/* ══════════════════════════════════════════════
   HELPERS — image / video fallback
   ══════════════════════════════════════════════ */
function makePhotoPlaceholder(name) {
  const div = document.createElement('div');
  div.className = 'ph';
  div.innerHTML = `
    <svg viewBox="0 0 32 30" fill="none" stroke="currentColor" stroke-width="1.2">
      <path d="M16 29S1 19.2 1 10.4C1 5.7 4.7 2 9.3 2c2.9 0 5.5 1.5 6.7 3.8C17.2 3.5 19.8 2 22.7 2 27.3 2 31 5.7 31 10.4 31 19.2 16 29 16 29z"/>
    </svg>
    <span>${name}</span>
    <span style="opacity:.6;font-size:.75rem;letter-spacing:.1em;">coming soon</span>
  `;
  return div;
}

function makeVideoPlaceholder(name) {
  const div = document.createElement('div');
  div.className = 'ph';
  div.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
      <rect x="2" y="5" width="14" height="14" rx="3"/>
      <path d="M16 10l6-3v10l-6-3"/>
    </svg>
    <span>${name}</span>
    <span style="opacity:.6;font-size:.75rem;letter-spacing:.1em;">coming soon</span>
  `;
  return div;
}


/* ══════════════════════════════════════════════
   PHOTO CAROUSEL
   ══════════════════════════════════════════════ */
(function photoCarousel() {
  const stage  = document.getElementById('photoStage');
  const dotsEl = document.getElementById('photoDots');
  const prevB  = document.getElementById('photoPrev');
  const nextB  = document.getElementById('photoNext');
  const wrap   = document.getElementById('photoCarousel');
  if (!stage || !dotsEl) return;

  let index = 0;
  const slides = [];

  PHOTOS.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');

    const img = document.createElement('img');
    img.alt = 'Our memory ' + (i + 1);
    img.loading = i < 2 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.src = src;

    img.addEventListener('error', () => {
      img.remove();
      slide.appendChild(makePhotoPlaceholder(src.split('/').pop()));
    }, { once: true });

    // click to open lightbox
    img.addEventListener('click', () => openLightbox(i));

    slide.appendChild(img);
    stage.appendChild(slide);
    slides.push(slide);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Photo ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(i) {
    if (i === index) return;
    slides[index].classList.remove('active');
    dotsEl.children[index].classList.remove('active');
    index = (i + slides.length) % slides.length;
    slides[index].classList.add('active');
    dotsEl.children[index].classList.add('active');
  }

  prevB && prevB.addEventListener('click', () => goTo(index - 1));
  nextB && nextB.addEventListener('click', () => goTo(index + 1));

  // swipe
  let sx = 0, sy = 0, tracking = false;
  wrap.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    sx = t.clientX; sy = t.clientY; tracking = true;
  }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    }
  }, { passive: true });

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // ═══ lightbox ═══
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');
  let lbIndex = 0;

  function openLightbox(i) {
    lbIndex = i;
    lbImg.src = PHOTOS[i];
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function lbGo(delta) {
    lbIndex = (lbIndex + delta + PHOTOS.length) % PHOTOS.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = PHOTOS[lbIndex];
      lbImg.style.opacity = '1';
    }, 150);
  }

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbPrev  && lbPrev.addEventListener('click', () => lbGo(-1));
  lbNext  && lbNext.addEventListener('click', () => lbGo(1));
  lb && lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbGo(-1);
    if (e.key === 'ArrowRight') lbGo(1);
  });
  lbImg && (lbImg.style.transition = 'opacity .3s ease');
})();


/* ══════════════════════════════════════════════
   VIDEO CAROUSEL
   ══════════════════════════════════════════════ */
(function videoCarousel() {
  const stage  = document.getElementById('videoStage');
  const dotsEl = document.getElementById('videoDots');
  const prevB  = document.getElementById('videoPrev');
  const nextB  = document.getElementById('videoNext');
  const wrap   = document.getElementById('videoCarousel');
  if (!stage) return;

  let index = 0;
  const slides = [];

  VIDEOS.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');

    const video = document.createElement('video');
    video.src = src;
    video.playsInline = true;
    video.muted = true;
    video.loop = false;
    video.preload = i === 0 ? 'metadata' : 'none';
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    video.addEventListener('error', () => {
      video.remove();
      slide.appendChild(makeVideoPlaceholder(src.split('/').pop()));
    }, { once: true });

    slide.appendChild(video);

    // caption
    const cap = document.createElement('div');
    cap.className = 'v-cap';
    cap.textContent = 'Memory ' + (i + 1);
    slide.appendChild(cap);

    stage.appendChild(slide);
    slides.push({ el: slide, video });

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Video ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function pauseAll(except) {
    slides.forEach((s, i) => {
      if (i === except) return;
      try { s.video.pause(); } catch (_) {}
    });
  }

  function goTo(i) {
    if (i === index) return;
    pauseAll(-1);
    slides[index].el.classList.remove('active');
    dotsEl.children[index].classList.remove('active');
    index = (i + slides.length) % slides.length;
    slides[index].el.classList.add('active');
    dotsEl.children[index].classList.add('active');
    // try to play new active one
    const v = slides[index].video;
    v.currentTime = 0;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
    wrap.classList.add('touched');
  }

  // controls overlay per active slide
  const ctrl = document.createElement('div');
  ctrl.className = 'v-controls';
  ctrl.innerHTML = `
    <button class="v-btn" id="vPlay" aria-label="Play or pause">
      <svg viewBox="0 0 24 24" width="18" height="18" id="vPlayIcon">
        <path fill="currentColor" d="M8 5v14l11-7z"/>
      </svg>
    </button>
    <button class="v-btn" id="vMute" aria-label="Mute or unmute">
      <svg viewBox="0 0 24 24" width="18" height="18" id="vMuteIcon">
        <path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z"/>
      </svg>
    </button>
  `;
  wrap.appendChild(ctrl);

  const vPlay = ctrl.querySelector('#vPlay');
  const vPlayIcon = ctrl.querySelector('#vPlayIcon');
  const vMute = ctrl.querySelector('#vMute');
  const vMuteIcon = ctrl.querySelector('#vMuteIcon');

  function currentVideo() { return slides[index].video; }

  vPlay && vPlay.addEventListener('click', () => {
    const v = currentVideo();
    if (v.paused) {
      pauseAll(index);
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  });

  vMute && vMute.addEventListener('click', () => {
    const v = currentVideo();
    v.muted = !v.muted;
    vMuteIcon.innerHTML = v.muted
      ? '<path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z"/>'
      : '<path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/>';
  });

  // update play icon on play/pause for active slide
  slides.forEach((s, i) => {
    s.video.addEventListener('play', () => {
      if (i === index) vPlayIcon.innerHTML = '<path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/>';
    });
    s.video.addEventListener('pause', () => {
      if (i === index) vPlayIcon.innerHTML = '<path fill="currentColor" d="M8 5v14l11-7z"/>';
    });
  });

  prevB && prevB.addEventListener('click', () => goTo(index - 1));
  nextB && nextB.addEventListener('click', () => goTo(index + 1));

  // swipe
  let sx = 0, sy = 0, tracking = false;
  wrap.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    sx = t.clientX; sy = t.clientY; tracking = true;
  }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    }
  }, { passive: true });

  // Only play active video, pause others when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseAll(-1);
    }
  });

  // Start first one once user interacts (autoplay may be blocked)
  wrap.classList.add('touched');

  // Pause active video when it leaves viewport
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) {
          const v = currentVideo();
          if (v && !v.paused) v.pause();
        }
      });
    }, { threshold: 0.15 });
    vio.observe(wrap);
  }
})();


/* ══════════════════════════════════════════════
   FLOATING HEARTS ON CLICK/TAP
   ══════════════════════════════════════════════ */
(function tapHearts() {
  if (REDUCED) return;
  const glyphs = ['❤', '❤️', '💕', '💖', '♡'];
  let lastTime = 0;

  function spawn(x, y) {
    const now = Date.now();
    if (now - lastTime < 55) return; // throttle
    lastTime = now;

    const el = document.createElement('span');
    el.className = 'floating-heart';
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.style.fontSize = (16 + Math.random() * 14) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  window.addEventListener('click', (e) => {
    // ignore if inside interactive controls
    const t = e.target;
    if (t.closest('button, a, input, .music-player, .lightbox, .nav, .dots')) return;
    spawn(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    const t = e.target;
    if (t.closest('button, a, input, .music-player, .lightbox, .nav, .dots')) return;
    const touch = e.touches[0];
    if (touch) spawn(touch.clientX, touch.clientY);
  }, { passive: true });
})();


/* ══════════════════════════════════════════════
   MUSIC PLAYER
   ══════════════════════════════════════════════ */
let tryStartMusic;

(function musicPlayer() {
  const audio    = document.getElementById('bgMusic');
  const player   = document.getElementById('musicPlayer');
  const toggle   = document.getElementById('mpToggle');
  const fill     = document.getElementById('mpFill');
  const progress = document.getElementById('mpProgress');
  const timeEl   = document.getElementById('mpTime');
  const volume   = document.getElementById('mpVolume');
  if (!audio || !player) return;

  audio.src = MUSIC;
  audio.loop = true;
  audio.preload = 'metadata';
  audio.volume = parseFloat(volume?.value || '0.6');

  let available = true;

  // If file missing, hide the player gracefully
  audio.addEventListener('error', () => {
    available = false;
    player.classList.remove('show');
  });

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateUI() {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    fill.style.width = pct + '%';
    timeEl.textContent = fmt(audio.currentTime);
  }

  audio.addEventListener('timeupdate', updateUI);
  audio.addEventListener('loadedmetadata', updateUI);

  audio.addEventListener('play',  () => player.classList.add('playing'));
  audio.addEventListener('pause', () => player.classList.remove('playing'));

  tryStartMusic = function () {
    if (!available) return;
    const p = audio.play();
    if (p && p.catch) p.catch(() => {/* autoplay blocked, user can tap */});
  };

  toggle && toggle.addEventListener('click', () => {
    if (!available) return;
    if (audio.paused) {
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      audio.pause();
    }
  });

  // seek
  progress && progress.addEventListener('click', (e) => {
    if (!audio.duration || !available) return;
    const rect = progress.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  });

  // volume
  volume && volume.addEventListener('input', () => {
    audio.volume = parseFloat(volume.value);
  });

  // keyboard support for progress
  progress && progress.addEventListener('keydown', (e) => {
    if (!audio.duration) return;
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (e.key === 'ArrowLeft')  audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
})();