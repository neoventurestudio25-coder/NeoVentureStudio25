const dayImg = document.querySelector('.sky.day');
const nightImg = document.querySelector('.sky.night');
const headerBar = document.querySelector('.studio-bar');
const footer = document.querySelector('footer');
const glowTexts = document.querySelectorAll('.glow-text');
const gameCards = document.querySelectorAll('.game-card');
const bgMusic = document.getElementById("bgMusic");
const soundBtn = document.getElementById("sound-toggle");
let progress = 1;
let direction = 0;
const duration = 10000;
const dayGradient = { r1:79, g1:195, b1:247, r2:2, g2:136, b2:209 };
const nightGradient = { r1:84, g1:110, b1:122, r2:38, g2:50, b2:56 };
function lerp(a,b,t){ return Math.round(a + (b - a) * t); }
function updateBarGradient(){
  progress += direction * (16 / duration);
  if(progress >= 1){ progress = 1; direction = -1; }
  else if(progress <= 0){ progress = 0; direction = 1; }
  const r1 = lerp(dayGradient.r1, nightGradient.r1, progress);
  const g1 = lerp(dayGradient.g1, nightGradient.g1, progress);
  const b1 = lerp(dayGradient.b1, nightGradient.b1, progress);
  const r2 = lerp(dayGradient.r2, nightGradient.r2, progress);
  const g2 = lerp(dayGradient.g2, nightGradient.g2, progress);
  const b2 = lerp(dayGradient.b2, nightGradient.b2, progress);
  headerBar.style.background = `linear-gradient(90deg,rgb(${r1},${g1},${b1}),rgb(${r2},${g2},${b2}))`;
  requestAnimationFrame(updateBarGradient);
}
requestAnimationFrame(updateBarGradient);
let dayActive = true;
function switchSky(){
  if(dayActive){
    dayImg.style.opacity = 0;
    nightImg.style.opacity = 1;
    document.body.style.background = "#37474f";
    document.body.style.color = "#cfd8dc";
    footer.style.backgroundColor = "#455a64";
    footer.style.color = "#eceff1";
    glowTexts.forEach(el => el.style.textShadow = "0 0 5px #81d4fa,0 0 10px #0288d1,0 0 15px #03a9f4");
  } else {
    dayImg.style.opacity = 1;
    nightImg.style.opacity = 0;
    document.body.style.background = "#e3f2fd";
    document.body.style.color = "#003366";
    footer.style.backgroundColor = "#0288d1";
    footer.style.color = "#e0f7fa";
    glowTexts.forEach(el => el.style.textShadow = "0 0 5px #0288d1,0 0 10px #03a9f4,0 0 15px #81d4fa");
  }
  dayActive = !dayActive;
  setTimeout(switchSky, 10000);
}
switchSky();
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
