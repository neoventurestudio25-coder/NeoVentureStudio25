const headerBar = document.querySelector('.studio-bar');
const footer = document.querySelector('footer');
const glowTexts = document.querySelectorAll('.glow-text');
const gameCards = document.querySelectorAll('.game-card');
const bgMusic = document.getElementById("bgMusic");
const soundBtn = document.getElementById("sound-toggle");
const skyBg = document.querySelector('.sky-bg');
const modeBtn = document.getElementById('mode-toggle');

let mode = 'cycle'; // 'cycle' | 'day' | 'night'
let cycleTimer = null;

const dayGradient = { r1:79, g1:195, b1:247, r2:2, g2:136, b2:209 };
const nightGradient = { r1:84, g1:110, b1:122, r2:38, g2:50, b2:56 };
function lerp(a,b,t){ return Math.round(a + (b - a) * t); }

// durations (ms)
const holdDuration = 10000;
const transitionDuration = 2000;
document.documentElement.style.setProperty('--transition-time', transitionDuration + 'ms');

// create duplicated sky images for seamless scrolling - one duplicate per layer
function duplicateSkies(){
  const allSkyLayers = Array.from(document.querySelectorAll('.sky.day, .sky.night'));
  
  // Different overlap for each layer depth
  const overlapSettings = {
    'far-layer': 5,    // far layer: 5px overlap
    'mid-layer': 5,    // mid layer: 5px overlap
    'near-layer': 5    // near layer: 5px overlap
  };
  
  allSkyLayers.forEach(img => {
    const clone = img.cloneNode(true);
    clone.classList.add('duplicate');
    
    // Get overlap value based on layer class
    let overlapPx = 5;
    for(let [layerClass, overlap] of Object.entries(overlapSettings)){
      if(img.classList.contains(layerClass)){
        overlapPx = overlap;
        break;
      }
    }
    
    img.style.left = '0%';
    img.classList.add('slide-left');
    clone.style.left = `calc(100% - ${overlapPx}px)`;
    clone.style.top = '0';
    clone.style.width = '100%';
    clone.style.height = '100%';
    clone.classList.add('slide-left');
    skyBg.appendChild(clone);
  });
}
// DO NOT call duplicateSkies immediately—wait until images are preloaded to avoid flicker

// Preload helper: returns a Promise that resolves when all .sky images are complete (or errored)
function preloadSkyImages(){
  const imgs = Array.from(document.querySelectorAll('.sky'));
  return Promise.all(imgs.map(img => new Promise(res => {
    if(img.complete && img.naturalWidth !== 0) return res();
    const onFinish = () => { img.removeEventListener('load', onFinish); img.removeEventListener('error', onFinish); res(); };
    img.addEventListener('load', onFinish);
    img.addEventListener('error', onFinish);
  })));
}

// Start visuals only after images are ready
preloadSkyImages().then(() => {
  // create duplicates and start animations
  duplicateSkies();
  // reset skyStart so sliding begins synced with visuals
  skyStart = performance.now();
  setVisuals(progress);
  cycleTimer = setTimeout(cycle, holdDuration);
  requestAnimationFrame(animateSkies);
}).catch(() => {
  // fallback if preload fails: still initialize
  duplicateSkies();
  skyStart = performance.now();
  setVisuals(progress);
  cycleTimer = setTimeout(cycle, holdDuration);
  requestAnimationFrame(animateSkies);
});

let progress = 0; // 0 = day, 1 = night
let dayActive = true;
// visual animation state synchronized into main RAF loop
let visualAnim = { active: false, start: 0, from: 0, to: 0, cb: null };

function setVisuals(p){
  // Calculate opacity values
  const dayOpacity = Math.max(0, Math.min(1, 1 - p));
  const nightOpacity = Math.max(0, Math.min(1, p));
  
  // Update ALL day images (original + duplicate) at SAME TIME
  document.querySelectorAll('.sky.day').forEach(el => {
    el.style.opacity = String(dayOpacity);
  });
  
  // Update ALL night images (original + duplicate) at SAME TIME
  document.querySelectorAll('.sky.night').forEach(el => {
    el.style.opacity = String(nightOpacity);
  });

  // header gradient
  const r1 = lerp(dayGradient.r1, nightGradient.r1, p);
  const g1 = lerp(dayGradient.g1, nightGradient.g1, p);
  const b1 = lerp(dayGradient.b1, nightGradient.b1, p);
  const r2 = lerp(dayGradient.r2, nightGradient.r2, p);
  const g2 = lerp(dayGradient.g2, nightGradient.g2, p);
  const b2 = lerp(dayGradient.b2, nightGradient.b2, p);
  headerBar.style.background = `linear-gradient(90deg,rgb(${r1},${g1},${b1}),rgb(${r2},${g2},${b2}))`;

  // body background interpolation between day (#e3f2fd) and night (#37474f)
  const dayBody = {r:227,g:242,b:253};
  const nightBody = {r:55,g:71,b:79};
  const br = lerp(dayBody.r, nightBody.r, p);
  const bg = lerp(dayBody.g, nightBody.g, p);
  const bb = lerp(dayBody.b, nightBody.b, p);
  document.body.style.background = `rgb(${br},${bg},${bb})`;

  // colors that don't need smooth interpolation can flip at midpoint for readability
  if(p > 0.5){
    document.body.style.color = '#cfd8dc';
    footer.style.backgroundColor = '#455a64';
    footer.style.color = '#eceff1';
    glowTexts.forEach(el => el.style.textShadow = '0 0 5px #81d4fa,0 0 10px #0288d1,0 0 15px #03a9f4');
  } else {
    document.body.style.color = '#003366';
    footer.style.backgroundColor = '#0288d1';
    footer.style.color = '#e0f7fa';
    glowTexts.forEach(el => el.style.textShadow = '0 0 5px #0288d1,0 0 10px #03a9f4,0 0 15px #81d4fa');
  }
}

function animateTo(target, cb){
  // schedule visual animation; actual per-frame stepping happens inside animateSkies()
  visualAnim.active = true;
  visualAnim.start = performance.now();
  visualAnim.from = progress;
  visualAnim.to = target;
  visualAnim.cb = cb || null;
}

function cycle(){
  if (mode !== 'cycle') return;
  const target = dayActive ? 1 : 0;
  // schedule each layer separately so they animate independently with a slow fade (15s)
  const slowFade = 15000; // 15 seconds
  if(typeof animateLayer === 'function'){
    animateLayer('far', target, slowFade, null);
    animateLayer('mid', target, slowFade, null);
    animateLayer('near', target, slowFade, () => {
      dayActive = !dayActive;
      cycleTimer = setTimeout(cycle, holdDuration);
    });
  } else {
    // fallback to previous behavior
    animateTo(target, () => {
      dayActive = !dayActive;
      cycleTimer = setTimeout(cycle, holdDuration);
    });
  }
}

// start the cycle (smoother, all elements animated from same timeline)
setVisuals(progress);
cycleTimer = setTimeout(cycle, holdDuration);

function setMode(m){
  mode = m;
  const label = mode.charAt(0).toUpperCase()+mode.slice(1);
  const icons = { cycle: '🔁', day: '🌞', night: '🌙' };
  if(modeBtn){
    modeBtn.textContent = icons[mode] || '🔁';
    modeBtn.setAttribute('aria-label', `Mode: ${label}`);
    modeBtn.title = `Mode: ${label}`;
  }
  if(cycleTimer){ clearTimeout(cycleTimer); cycleTimer = null; }
  if(mode === 'cycle'){
    // resume automatic cycling
    cycleTimer = setTimeout(cycle, holdDuration);
  } else if(mode === 'day'){
    // force day (progress 0)
    animateTo(0, () => { dayActive = false; });
  } else if(mode === 'night'){
    // force night (progress 1)
    animateTo(1, () => { dayActive = true; });
  }
}

if(modeBtn){
  modeBtn.addEventListener('click', () => {
    const modes = ['cycle','day','night'];
    const next = modes[(modes.indexOf(mode) + 1) % modes.length];
    setMode(next);
  });
}
// initialize UI to current mode
setMode(mode);

// JS-driven sky sliding with parallax depth - different speeds per layer
const skyDuration = 60000; // ms, base duration for near layer
let skyStart = performance.now();
function animateSkies(now){
  // advance visual (day/night) animation if scheduled so opacity updates occur in same RAF
  if(visualAnim.active){
    const tVis = Math.min(1, (now - visualAnim.start) / transitionDuration);
    const easedVis = tVis < 0.5 ? 2*tVis*tVis : -1 + (4 - 2*tVis) * tVis;
    progress = visualAnim.from + (visualAnim.to - visualAnim.from) * easedVis;
    setVisuals(progress);
    if(tVis >= 1){
      // finish
      progress = visualAnim.to;
      setVisuals(progress);
      visualAnim.active = false;
      if(typeof visualAnim.cb === 'function'){
        // call callback asynchronously to avoid reentrancy issues
        const cb = visualAnim.cb;
        visualAnim.cb = null;
        setTimeout(() => cb(), 0);
      }
    }
  }

  const width = skyBg.clientWidth || window.innerWidth;
  const t = (now - skyStart) % skyDuration;
  
  // Speed multipliers for parallax effect
  // Far: slow (distant), Mid: medium, Near: fast (closest)
  const speedMultipliers = {
    'far-layer': 0.33,   // far clouds move slow
    'mid-layer': 0.67,   // mid clouds move medium
    'near-layer': 1.0    // near clouds move fastest
  };

  // Floating amplitudes (in pixels)
  const floatAmplitudes = {
    'far-layer': 3,      // far clouds float subtle
    'mid-layer': 8,      // mid clouds float medium
    'near-layer': 15     // near clouds float more
  };

  // Floating durations (in ms)
  const floatDurations = {
    'far-layer': 15000,
    'mid-layer': 12000,
    'near-layer': 8000
  };
  
  // Apply different offsets to each layer based on depth
  document.querySelectorAll('.slide-left').forEach(el => {
    let multiplier = 1.0;
    let amplitude = 15;
    let duration = 8000;
    
    for(let [layerClass, speed] of Object.entries(speedMultipliers)){
      if(el.classList.contains(layerClass)){
        multiplier = speed;
        amplitude = floatAmplitudes[layerClass];
        duration = floatDurations[layerClass];
        break;
      }
    }
    
    // Calculate horizontal scroll offset
    const xOffset = (t / skyDuration) * width * multiplier;
    
    // Calculate vertical float offset using sine wave
    const yOffset = Math.sin((now / duration) * Math.PI * 2) * amplitude;
    
    el.style.transform = `translateX(${-xOffset}px) translateY(${yOffset}px)`;
  });
  
  requestAnimationFrame(animateSkies);
}
requestAnimationFrame(animateSkies);
gameCards.forEach(card => {
  card.addEventListener('click', () => {
    const gameName = card.querySelector('span').textContent;
    alert(`You selected: ${gameName}`);
  });
});
soundBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    soundBtn.textContent = "🔊";
  } else {
    bgMusic.pause();
    soundBtn.textContent = "🔇";
  }
})

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // close nav when a link is clicked (mobile)
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    })
  });
}

// update aria-pressed for sound button
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    const pressed = bgMusic && !bgMusic.paused;
    soundBtn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
  });
}
