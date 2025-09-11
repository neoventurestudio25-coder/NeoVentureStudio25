const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
const title = document.getElementById('studio-logo-text');
const bgMusic = document.getElementById("bgMusic");
const soundBtn = document.getElementById("sound-toggle");
let particles = [];
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random()*3 + 1;
        this.speedX = (Math.random()-0.5)*1;
        this.speedY = (Math.random()-0.5)*1;
        this.opacity = 1;
        this.fade = Math.random()*0.02 + 0.005;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= this.fade;
    }
    draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size,0,Math.PI*2);
        ctx.fill();
    }
}
function createParticles() {
    const rect = title.getBoundingClientRect();
    const minX = rect.left;
    const maxX = rect.right;
    const minY = rect.top;
    const maxY = rect.bottom;
    for(let i=0;i<3;i++){
        const x = Math.random() * (maxX - minX) + minX;
        const y = Math.random() * (maxY - minY) + minY;
        particles.push(new Particle(x, y));
    }
}
function updateParticles() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=particles.length-1;i>=0;i--){
        let p=particles[i];
        p.update();
        p.draw();
        if(p.opacity<=0) particles.splice(i,1);
    }
    requestAnimationFrame(updateParticles);
}
setInterval(createParticles,50);
updateParticles();
soundBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    soundBtn.textContent = "🔊";
  } else {
    bgMusic.pause();
    soundBtn.textContent = "🔇";
  }
})
