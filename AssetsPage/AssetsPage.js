const heroSpace = document.querySelector('.hero-space');
const heroGlow = document.createElement('div');
heroGlow.classList.add('hero-glow');
heroSpace.appendChild(heroGlow);
const bgMusic = document.getElementById("bgMusic");
const soundBtn = document.getElementById("sound-toggle");
const totalAssets = 672;
let assetIndex = 1441;
let activeAssets = [];
const visibleAssets = 20;
function createAssetImg(index) {
    const img = document.createElement('img');
    img.src = `AssetsShow/fc${index}.png`;
    img.classList.add('hero-asset');
    img.style.top = `${Math.random() * 100}%`;
    img.style.left = `${Math.random() * 100}%`;
    img.style.opacity = 0;
    heroSpace.appendChild(img);
    return img;
}
function initAssets() {
    activeAssets = [];
    for (let i = 0; i < visibleAssets; i++) {
        if (assetIndex > 2112) assetIndex = 1441;
        const img = createAssetImg(assetIndex);
        activeAssets.push(img);
        assetIndex++;
    }
}
function animateAssets() {
    activeAssets.forEach((img, i) => {
        setTimeout(() => {
            img.style.opacity = 1;
            setTimeout(() => {
                img.style.opacity = 0;
                setTimeout(() => heroSpace.removeChild(img), 2000);
            }, 3000 + Math.random() * 2000);
        }, i * 500);
    });
    setTimeout(() => {
        initAssets();
        animateAssets();
    }, 8000);
}
initAssets();
animateAssets();
soundBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    soundBtn.textContent = "🔊";
  } else {
    bgMusic.pause();
    soundBtn.textContent = "🔇";
  }
})
