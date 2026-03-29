// ── CANVAS PARTICLES ──
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

const particles = [];
const PARTICLE_COUNT = 80;

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.size = Math.random() * 2 + 0.5;
    this.color = Math.random() > 0.5 ? '0,200,255' : '123,47,255';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,200,255,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();
window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;

function updateCursorPosition(x, y) {
  mouseX = x;
  mouseY = y;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  setTimeout(() => {
    cursorRing.style.left = mouseX + 'px';
    cursorRing.style.top = mouseY + 'px';
  }, 80);
}

document.addEventListener('mousemove', e => updateCursorPosition(e.clientX, e.clientY));

document.addEventListener('touchstart', e => {
  if (e.touches && e.touches[0]) {
    updateCursorPosition(e.touches[0].clientX, e.touches[0].clientY);
    cursor.style.display = 'block';
    cursorRing.style.display = 'block';
  }
});

document.addEventListener('touchmove', e => {
  if (e.touches && e.touches[0]) {
    updateCursorPosition(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

document.addEventListener('touchend', () => {
  cursor.style.display = 'none';
  cursorRing.style.display = 'none';
});

document.querySelectorAll('a, button, .skill-card, .project-card, .repo-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorRing.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorRing.classList.remove('hover'); });
});

// ── TERMINAL INTRO ──
const termLines = ['whoami', 'developer --type=full-stack', 'ssh mahin@portfolio', 'ls ./skills'];
let termIdx = 0, termCharIdx = 0;
const termEl = document.getElementById('terminalText');

function typeTerminal() {
  if (termCharIdx < termLines[termIdx].length) {
    termEl.textContent += termLines[termIdx][termCharIdx++];
    setTimeout(typeTerminal, 80);
  } else {
    setTimeout(() => {
      termEl.textContent = '';
      termCharIdx = 0;
      termIdx = (termIdx + 1) % termLines.length;
      typeTerminal();
    }, 2000);
  }
}
typeTerminal();

// ── TYPED TAGLINES ──
const phrases = [
  'Building AI Systems 🤖',
  'Exploring Cybersecurity 🔐',
  'Automating the Web ⚡',
  'Capturing Moments 📷',
  'Writing Poetry ✍️',
  'Hacking the Future 🛡️'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typePhrase() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) { deleting = true; setTimeout(typePhrase, 1800); return; }
  } else {
    typedEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(typePhrase, deleting ? 40 : 80);
}
setTimeout(typePhrase, 2000);

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE MENU ──
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── SKILL BARS ──
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 200);
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// ── CONTACT FORM ──
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    document.getElementById('formSuccess').style.display = 'block';
    this.reset();
    setTimeout(() => { document.getElementById('formSuccess').style.display = 'none'; }, 4000);
  }, 1200);
});

// ── DOWNLOAD RESUME ──
function downloadResume(e) {
  e.preventDefault();
  const a = document.createElement('a');
  const content = `MAHIN - Resume\n==============\nDeveloper | Ethical Hacker Learner | AI Enthusiast\n\nSkills: Python, JavaScript, AI/ML, Cybersecurity, Automation\nContact: mahin@email.com | github.com/mahin`;
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
  a.download = 'Mahin_Resume.txt';
  a.click();
}

// ── MUSIC TOGGLE ──
const eqMeter = document.getElementById('equalizer');
const profileEq = document.getElementById('profileEqualizer');
const audio = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let analyser = null;
let analyserData = null;
let visualizerRAF = null;

const floatBars = eqMeter ? Array.from(eqMeter.querySelectorAll('.bar')) : [];
const profileBars = profileEq ? Array.from(profileEq.querySelectorAll('.bar')) : [];

function initAudioAnalyser() {
  if (!AudioContext || !audio) return;
  if (audioCtx && analyser) return;

  audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;
  analyser.smoothingTimeConstant = 0.8;

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyserData = new Uint8Array(analyser.frequencyBinCount);
}

function updateEqualizerBars() {
  if (!analyser || !analyserData) return;

  analyser.getByteFrequencyData(analyserData);

  function setBars(bars) {
    bars.forEach((bar, idx) => {
      const value = analyserData[idx * 2] || analyserData[idx] || 0;
      const scale = Math.max(0.25, value / 180);
      bar.style.transform = `scaleY(${scale})`;
      bar.style.opacity = `${0.4 + scale * 0.6}`;
    });
  }

  setBars(floatBars);
  setBars(profileBars);

  visualizerRAF = requestAnimationFrame(updateEqualizerBars);
}

function startVisualizer() {
  if (!analyser || visualizerRAF) return;
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  visualizerRAF = requestAnimationFrame(updateEqualizerBars);
}

function stopVisualizer() {
  if (visualizerRAF) {
    cancelAnimationFrame(visualizerRAF);
    visualizerRAF = null;
  }
  const resetBars = (bars) => bars.forEach(bar => {
    bar.style.transform = 'scaleY(0.35)';
    bar.style.opacity = '0.45';
  });
  resetBars(floatBars);
  resetBars(profileBars);
}

function setEqualizerVisible(show) {
  if (eqMeter) {
    eqMeter.classList.toggle('active', show);
    eqMeter.classList.toggle('hidden', !show);
  }
  if (profileEq) {
    profileEq.classList.toggle('active', show);
  }
}


function updateMusicStatus() {
  const playing = !audio.paused && !audio.ended && !audio.muted;
  console.log('Music state', {
    paused: audio.paused,
    muted: audio.muted,
    ended: audio.ended,
    readyState: audio.readyState,
    playing
  });

  setEqualizerVisible(playing || !audio.paused); // show when playing or when unpaused fallback
  musicIcon.textContent = audio.muted || audio.paused ? '🔇' : '🔊';

  if (playing) {
    initAudioAnalyser();
    startVisualizer();
  } else {
    stopVisualizer();
  }
}


function toggleMusic() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch((error) => { console.warn('AudioContext resume blocked:', error); });
  }

  const wasPaused = audio.paused;

  if (audio.paused) {
    audio.play().catch((error) => { console.warn('Audio play blocked:', error); });
  }

  audio.muted = !audio.muted;

  // after unmute/mute, make sure audio tries to play again on user action
  if (wasPaused) {
    audio.play().then(() => {
      updateMusicStatus();
    }).catch((error) => {
      console.warn('Audio play retry blocked:', error);
      updateMusicStatus();
    });
    return;
  }

  updateMusicStatus();
}

audio.addEventListener('play', updateMusicStatus);
audio.addEventListener('pause', updateMusicStatus);
audio.addEventListener('ended', updateMusicStatus);
audio.addEventListener('volumechange', updateMusicStatus);

audio.addEventListener('error', () => {
  console.warn('Audio error: cannot play on this device');
  setEqualizerVisible(false);
  musicIcon.textContent = '🔇';
});

const audioHelp = document.getElementById('audioHelp');
const audioHelpToggle = document.getElementById('audioHelpToggle');
const audioHelpClose = document.getElementById('audioHelpClose');

function updateHelpUI() {
  if (!audioHelp || !audioHelpToggle) return;
  audioHelpToggle.textContent = audio.muted ? 'Unmute' : 'Mute';
  audioHelp.style.display = audio.paused ? 'flex' : 'flex';

  // sync nav button icon with current audio state
  musicIcon.textContent = audio.muted || audio.paused ? '🔇' : '🔊';
}

audioHelpToggle?.addEventListener('click', () => {
  toggleMusic();
  updateHelpUI();
});

audioHelpClose?.addEventListener('click', () => {
  if (audioHelp) audioHelp.style.display = 'none';
});

window.addEventListener('DOMContentLoaded', () => {
  if (!audio) return;

  // Try autoplay with muted fallback to satisfy policy.
  audio.muted = true;
  audio.play().then(() => {
    // if autoplay worked, unmute to start sound and sync state
    audio.muted = false;
    updateMusicStatus();
    updateHelpUI();
  }).catch((err) => {
    console.warn('Autoplay blocked, starting muted and showing controls:', err);
    if (audioHelp) audioHelp.style.display = 'flex';
    // start with muted autoplay as policy-safe fallback
    audio.muted = true;
    audio.play().catch(() => {});
    updateMusicStatus();
    updateHelpUI();
  });
});

updateMusicStatus();

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});