// ===== Particles Effect Around Title =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
const studioLogo = document.getElementById('studio-logo');

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle Class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1.5;
        this.speedX = (Math.random() - 0.5) * 1.5; // حركة أفقية
        this.speedY = (Math.random() - 0.5) * 1.5; // حركة رأسية
        this.opacity = 1;
        this.fade = Math.random() * 0.015 + 0.005;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= this.fade;
    }
    draw() {
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===== Create Particles from Edges of Title =====
function createParticles() {
    const rect = studioLogo.getBoundingClientRect();
    const edges = ['top', 'bottom', 'left', 'right'];

    edges.forEach(edge => {
        const count = 2; // عدد particles لكل حافة
        for (let i = 0; i < count; i++) {
            let x, y;
            switch(edge) {
                case 'top':
                    x = rect.left + Math.random() * rect.width;
                    y = rect.top;
                    break;
                case 'bottom':
                    x = rect.left + Math.random() * rect.width;
                    y = rect.bottom;
                    break;
                case 'left':
                    x = rect.left;
                    y = rect.top + Math.random() * rect.height;
                    break;
                case 'right':
                    x = rect.right;
                    y = rect.top + Math.random() * rect.height;
                    break;
            }
            particles.push(new Particle(x, y));
        }
    });
}

// ===== Update & Draw =====
function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.update();
        p.draw();
        if (p.opacity <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(updateParticles);
}

// ===== Animate =====
setInterval(createParticles, 50);
updateParticles();
