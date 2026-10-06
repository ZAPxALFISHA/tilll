/* ══════════════════════════════════════════════
   CONFIG — har photo/video ki story yahin edit karo
   ══════════════════════════════════════════════ */
const PHOTOS = [
  { src: 'assets/media/zap.jpg',   chapter: 'Chapter One',   title: 'The First Time',        story: 'The very first moment I saw you, something in me shifted. I didn\'t know it yet, but my whole world had just quietly changed.' },
  { src: 'assets/media/zap2.jpg',  chapter: 'Chapter Two',   title: 'That Smile',            story: 'The way you smile when you\'re truly happy — I\'ve memorised it. It\'s my favourite thing in the entire universe.' },
  { src: 'assets/media/zap3.jpg',  chapter: 'Chapter Three', title: 'Us, Being Us',          story: 'The silliest, softest, most ordinary moments — and somehow they became the ones I treasure the most.' },
  { src: 'assets/media/zap4.jpg',  chapter: 'Chapter Four',  title: 'Golden Hour',           story: 'The light that day was beautiful — but you outshone every bit of it. You always do.' },
  { src: 'assets/media/zap5.jpg',  chapter: 'Chapter Five',  title: 'A Quiet Moment',        story: 'No words needed. Just you, me, and a silence that felt like home.' },
  { src: 'assets/media/zap6.jpg',  chapter: 'Chapter Six',   title: 'My Favourite View',     story: 'Of all the beautiful things I\'ve ever seen, you\'re still the one my eyes always find first.' },
  { src: 'assets/media/zap7.jpg',  chapter: 'Chapter Seven', title: 'Laughing Together',     story: 'That laugh of yours — the real one, the loud one. I\'d trade anything to hear it every single day.' },
  { src: 'assets/media/zap8.jpg',  chapter: 'Chapter Eight', title: 'Just Us',               story: 'It\'s never been about where we are. It\'s always been about who I\'m with.' },
  { src: 'assets/media/zap9.jpg',  chapter: 'Chapter Nine',  title: 'Held Close',            story: 'Every hug from you feels like the safest place in the world. Like nothing bad can reach me here.' },
  { src: 'assets/media/zap10.jpg', chapter: 'Chapter Ten',   title: 'Forever, Starting Now', story: 'This isn\'t the last chapter. It\'s barely the beginning. And I want every single page with you.' },
];

const VIDEOS = [
  { src: 'assets/media/zap.mp4',   chapter: 'Chapter One',   title: 'A Little Moment',       story: 'A tiny clip, but it holds a whole feeling. I still watch this one when I miss you too much.' },
  { src: 'assets/media/zap2.mp4',  chapter: 'Chapter Two',   title: 'Your Voice',            story: 'I could listen to you talk about anything — literally anything — and never get tired of it.' },
  { src: 'assets/media/zap3.mp4',  chapter: 'Chapter Three', title: 'That Laugh',            story: 'There it is. The laugh that fixes my worst days. I replay this one more than I should.' },
  { src: 'assets/media/zap4.mp4',  chapter: 'Chapter Four',  title: 'Us Being Silly',        story: 'The stupid little things we do when nobody\'s watching — that\'s where the real love lives.' },
  { src: 'assets/media/zap5.mp4',  chapter: 'Chapter Five',  title: 'A Soft Moment',         story: 'Quiet, gentle, just you. My heart is right here, in this frame, forever.' },
  { src: 'assets/media/zap6.mp4',  chapter: 'Chapter Six',   title: 'Goofing Around',        story: 'You making me laugh until my cheeks hurt — that\'s a memory I\'ll keep for a lifetime.' },
  { src: 'assets/media/zap7.mp4',  chapter: 'Chapter Seven', title: 'Just Being Us',         story: 'No filters, no pretending. Just the two of us, being exactly who we are.' },
  { src: 'assets/media/zap8.mp4',  chapter: 'Chapter Eight', title: 'Close To You',          story: 'Even a million miles away, watching this makes me feel like you\'re right beside me.' },
  { src: 'assets/media/zap9.mp4',  chapter: 'Chapter Nine',  title: 'My Favourite Person',   story: 'You, exactly as you are — unedited, unposed, and absolutely perfect to me.' },
  { src: 'assets/media/zap10.mp4', chapter: 'Chapter Ten',   title: 'To Be Continued…',      story: 'The story never really ends. Every day with you is a new scene I can\'t wait to film.' },
];

/* ─── MUSIC PLAYLIST (auto-plays one after another) ─── */
const MUSIC_PLAYLIST = [
  { src: 'assets/media/love-song.mp3',  title: 'Our Song' },
  { src: 'assets/media/love-song2.mp3', title: 'You & Me' },
  { src: 'assets/media/love-song3.mp3', title: 'Forever Yours' },
  { src: 'assets/media/love-song4.mp3', title: 'My Heartbeat' },
];

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ══════════════════════════════════════════════
   SCROLL PROGRESS
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
    if (!raf) { raf = true; requestAnimationFrame(update); }
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
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  items.forEach(el => io.observe(el));
})();


/* ══════════════════════════════════════════════
   MUSIC PLAYER — playlist with auto-advance
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
  const titleEl  = document.getElementById('mpTitle');
  if (!audio || !player) return;

  audio.preload = 'auto';
  audio.volume = parseFloat(volume?.value || '0.55');
  audio.autoplay = true;

  let trackIndex = 0;
  let available = true;

  function loadTrack(i) {
    trackIndex = ((i % MUSIC_PLAYLIST.length) + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length;
    const track = MUSIC_PLAYLIST[trackIndex];
    audio.src = track.src;
    if (titleEl) titleEl.textContent = track.title;
    // refresh playlist on the fly
    if (player) player.classList.add('show');
  }

  function playCurrent() {
    if (!available) return;
    const p = audio.play();
    if (p && p.catch) p.catch(() => { /* blocked — user tap needed */ });
  }

  // When a track ends, auto-advance to next
  audio.addEventListener('ended', () => {
    loadTrack(trackIndex + 1);
    playCurrent();
  });

  // Handle missing file: try next track
  audio.addEventListener('error', () => {
    // if we tried all tracks, disable
    const tried = audio.dataset.fails ? parseInt(audio.dataset.fails) : 0;
    if (tried >= MUSIC_PLAYLIST.length - 1) {
      available = false;
      player.classList.remove('show');
      return;
    }
    audio.dataset.fails = String(tried + 1);
    loadTrack(trackIndex + 1);
    playCurrent();
  });

  audio.addEventListener('playing', () => {
    player.classList.add('playing');
    delete audio.dataset.fails;
  });
  audio.addEventListener('pause', () => player.classList.remove('playing'));

  // Load first track
  loadTrack(0);
  player.classList.add('show');

  // Try autoplay immediately
  playCurrent();

  // Also try on first user gesture (mobile autoplay policies)
  let firstGesture = false;
  function firstUserGesture() {
    if (firstGesture) return;
    firstGesture = true;
    playCurrent();
  }
  window.addEventListener('click', firstUserGesture, { once: true, passive: true });
  window.addEventListener('touchstart', firstUserGesture, { once: true, passive: true });
  window.addEventListener('keydown', firstUserGesture, { once: true, passive: true });

  tryStartMusic = function () {
    player.classList.add('show');
    playCurrent();
  };

  // UI formatting
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

  toggle && toggle.addEventListener('click', () => {
    if (audio.paused) { playCurrent(); }
    else { audio.pause(); }
  });

  progress && progress.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progress.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  });

  volume && volume.addEventListener('input', () => {
    audio.volume = parseFloat(volume.value);
  });

  progress && progress.addEventListener('keydown', (e) => {
    if (!audio.duration) return;
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (e.key === 'ArrowLeft')  audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
})();


/* ══════════════════════════════════════════════
   BEGIN BUTTON
   ══════════════════════════════════════════════ */
(function begin() {
  const btn = document.getElementById('beginBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const target = document.getElementById('story');
    if (target) target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    if (tryStartMusic) tryStartMusic();
  });
})();


/* ══════════════════════════════════════════════
   PARTICLE CANVAS
   ══════════════════════════════════════════════ */
(function particles() {
  const canvas = document.getElementById('particles');
  if (!canvas || REDUCED) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0, h = 0, dpr = 1;
  let stars = [], hearts = [], raf;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    const area = w * h;
    const starCount = Math.min(70, Math.max(28, Math.floor(area / 24000)));
    const heartCount = Math.min(8, Math.max(4, Math.floor(area / 220000)));

    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
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
        x: Math.random() * w, y: h + Math.random() * h,
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
    ctx.translate(x, y); ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#e56b8f';
    ctx.shadowColor = 'rgba(229,107,143,0.95)';
    ctx.shadowBlur = size * 1.5;
    ctx.beginPath();
    const s = size / 16;
    ctx.moveTo(0, 4 * s);
    ctx.bezierCurveTo(0, 0, -8 * s, -4 * s, -8 * s, -8 * s);
    ctx.bezierCurveTo(-8 * s, -14 * s, 0, -14 * s, 0, -9 * s);
    ctx.bezierCurveTo(0, -14 * s, 8 * s, -14 * s, 8 * s, -8 * s);
    ctx.bezierCurveTo(8 * s, -4 * s, 0, 0, 0, 4 * s);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.x += s.vx; s.y += s.vy; s.tw += s.twSpd;
      if (s.x < -10) s.x = w + 10;
      if (s.x > w + 10) s.x = -10;
      if (s.y < -10) s.y = h + 10;
      if (s.y > h + 10) s.y = -10;
      const tw = (Math.sin(s.tw) + 1) * 0.5;
      const alpha = s.a * (0.5 + tw * 0.5);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 200, 210, ${alpha})`;
      ctx.shadowColor = 'rgba(229,107,143,0.65)';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    for (const hrt of hearts) {
      hrt.x += hrt.vx; hrt.y += hrt.vy; hrt.rot += hrt.rotSpd;
      if (hrt.y < -40) { hrt.y = h + 40; hrt.x = Math.random() * w; }
      drawHeart(hrt.x, hrt.y, hrt.size, hrt.a, hrt.rot);
    }
    raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf); resize(); frame();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) frame();
  });
  frame();
})();


/* ══════════════════════════════════════════════
   PLACEHOLDERS
   ══════════════════════════════════════════════ */
function makePhotoPlaceholder(name) {
  const div = document.createElement('div');
  div.className = 'ph';
  div.innerHTML = `
    <svg viewBox="0 0 32 30" fill="none" stroke="currentColor" stroke-width="1.2">
      <path d="M16 29S1 19.2 1 10.4C1 5.7 4.7 2 9.3 2c2.9 0 5.5 1.5 6.7 3.8C17.2 3.5 19.8 2 22.7 2 27.3 2 31 5.7 31 10.4 31 19.2 16 29 16 29z"/>
    </svg>
    <span>${name}</span>
    <span style="opacity:.6;font-size:.75rem;letter-spacing:.1em;">coming soon</span>`;
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
    <span style="opacity:.6;font-size:.75rem;letter-spacing:.1em;">coming soon</span>`;
  return div;
}


/* ══════════════════════════════════════════════
   PHOTO CAROUSEL (with story caption)
   ══════════════════════════════════════════════ */
(function photoCarousel() {
  const stage   = document.getElementById('photoStage');
  const dotsEl  = document.getElementById('photoDots');
  const prevB   = document.getElementById('photoPrev');
  const nextB   = document.getElementById('photoNext');
  const wrap    = document.getElementById('photoCarousel');
  const chapEl  = document.getElementById('photoChapter');
  const titleEl = document.getElementById('photoTitle');
  const storyEl = document.getElementById('photoStory');
  if (!stage) return;

  let index = 0;
  const slides = [];

  PHOTOS.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');

    const img = document.createElement('img');
    img.alt = item.title;
    img.loading = i < 2 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.src = item.src;
    img.addEventListener('error', () => {
      img.remove();
      slide.appendChild(makePhotoPlaceholder(item.src.split('/').pop()));
    }, { once: true });
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

  function updateCaption(i) {
    const item = PHOTOS[i];
    if (!item) return;
    storyEl.style.opacity = '0';
    setTimeout(() => {
      chapEl.textContent  = item.chapter;
      titleEl.textContent = item.title;
      storyEl.textContent = item.story;
      storyEl.style.opacity = '1';
    }, 250);
  }

  function goTo(i) {
    if (i === index) return;
    slides[index].classList.remove('active');
    dotsEl.children[index].classList.remove('active');
    index = (i + slides.length) % slides.length;
    slides[index].classList.add('active');
    dotsEl.children[index].classList.add('active');
    updateCaption(index);
  }

  // initial caption
  chapEl.textContent  = PHOTOS[0].chapter;
  titleEl.textContent = PHOTOS[0].title;
  storyEl.textContent = PHOTOS[0].story;

  prevB && prevB.addEventListener('click', () => goTo(index - 1));
  nextB && nextB.addEventListener('click', () => goTo(index + 1));

  // swipe
  let sx = 0, sy = 0, tracking = false;
  wrap.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; sx = t.clientX; sy = t.clientY; tracking = true;
  }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    if (!tracking) return; tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      goTo(dx < 0 ? index + 1 : index - 1);
    }
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('.lightbox.open')) return;
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // ═══ LIGHTBOX ═══
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');
  let lbIndex = 0;

  function openLightbox(i) {
    lbIndex = i;
    lbImg.src = PHOTOS[i].src;
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
      lbImg.src = PHOTOS[lbIndex].src;
      lbImg.style.opacity = '1';
    }, 150);
  }

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbPrev  && lbPrev.addEventListener('click', () => lbGo(-1));
  lbNext  && lbNext.addEventListener('click', () => lbGo(1));
  lb && lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbGo(-1);
    if (e.key === 'ArrowRight') lbGo(1);
  });
  lbImg.style.transition = 'opacity .3s ease';
})();


/* ══════════════════════════════════════════════
   VIDEO CAROUSEL (with story caption)
   ══════════════════════════════════════════════ */
(function videoCarousel() {
  const stage   = document.getElementById('videoStage');
  const dotsEl  = document.getElementById('videoDots');
  const prevB   = document.getElementById('videoPrev');
  const nextB   = document.getElementById('videoNext');
  const wrap    = document.getElementById('videoCarousel');
  const chapEl  = document.getElementById('videoChapter');
  const titleEl = document.getElementById('videoTitle');
  const storyEl = document.getElementById('videoStory');
  if (!stage) return;

  let index = 0;
  const slides = [];

  VIDEOS.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');

    const video = document.createElement('video');
    video.src = item.src;
    video.playsInline = true;
    video.muted = true;
    video.loop = false;
    video.preload = i === 0 ? 'metadata' : 'none';
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.addEventListener('error', () => {
      video.remove();
      slide.appendChild(makeVideoPlaceholder(item.src.split('/').pop()));
    }, { once: true });
    slide.appendChild(video);
    stage.appendChild(slide);
    slides.push({ el: slide, video });

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Video ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function updateCaption(i) {
    const item = VIDEOS[i];
    if (!item) return;
    storyEl.style.opacity = '0';
    setTimeout(() => {
      chapEl.textContent  = item.chapter;
      titleEl.textContent = item.title;
      storyEl.textContent = item.story;
      storyEl.style.opacity = '1';
    }, 250);
  }

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
    const v = slides[index].video;
    v.currentTime = 0;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
    wrap.classList.add('touched');
    updateCaption(index);
  }

  // initial caption
  chapEl.textContent  = VIDEOS[0].chapter;
  titleEl.textContent = VIDEOS[0].title;
  storyEl.textContent = VIDEOS[0].story;

  // controls
  const ctrl = document.createElement('div');
  ctrl.className = 'v-controls';
  ctrl.innerHTML = `
    <button class="v-btn" id="vPlay" aria-label="Play or pause">
      <svg viewBox="0 0 24 24" width="18" height="18" id="vPlayIcon"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
    </button>
    <button class="v-btn" id="vMute" aria-label="Mute or unmute">
      <svg viewBox="0 0 24 24" width="18" height="18" id="vMuteIcon"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z"/></svg>
    </button>`;
  wrap.appendChild(ctrl);

  const vPlay = ctrl.querySelector('#vPlay');
  const vPlayIcon = ctrl.querySelector('#vPlayIcon');
  const vMute = ctrl.querySelector('#vMute');
  const vMuteIcon = ctrl.querySelector('#vMuteIcon');
  const currentVideo = () => slides[index].video;

  vPlay && vPlay.addEventListener('click', () => {
    const v = currentVideo();
    if (v.paused) { pauseAll(index); const p = v.play(); if (p && p.catch) p.catch(()=>{}); }
    else { v.pause(); }
  });
  vMute && vMute.addEventListener('click', () => {
    const v = currentVideo();
    v.muted = !v.muted;
    vMuteIcon.innerHTML = v.muted
      ? '<path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z"/>'
      : '<path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/>';
  });

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

  let sx = 0, sy = 0, tracking = false;
  wrap.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; sx = t.clientX; sy = t.clientY; tracking = true;
  }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    if (!tracking) return; tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
      goTo(dx < 0 ? index + 1 : index - 1);
    }
  }, { passive: true });

  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAll(-1); });

  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) { const v = currentVideo(); if (v && !v.paused) v.pause(); }
      });
    }, { threshold: 0.15 });
    vio.observe(wrap);
  }
})();


/* ══════════════════════════════════════════════
   FLOATING HEARTS ON TAP
   ══════════════════════════════════════════════ */
(function tapHearts() {
  if (REDUCED) return;
  const glyphs = ['❤', '❤️', '💕', '💖', '🌹'];
  let lastTime = 0;

  function spawn(x, y) {
    const now = Date.now();
    if (now - lastTime < 55) return;
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