// ===== Query Selectors =====
// Select DOM elements for later manipulation
const dayImg = document.querySelector('.sky.day'); // Day sky image
const nightImg = document.querySelector('.sky.night'); // Night sky image
const headerBar = document.querySelector('.studio-bar'); // Header bar
const footer = document.querySelector('footer'); // Footer
const glowTexts = document.querySelectorAll('.glow-text'); // All glow text elements
const gameCards = document.querySelectorAll('.game-card'); // All game cards

// ===== Day/Night Gradient Animation Variables =====
let progress = 1; // Progress for gradient transition (0 to 1)
let direction = 0; // Direction of gradient animation (forward/backward)
const duration = 10000; // Duration for full transition in ms
// RGB values for day gradient
const dayGradient = { r1:79, g1:195, b1:247, r2:2, g2:136, b2:209 };
// RGB values for night gradient
const nightGradient = { r1:84, g1:110, b1:122, r2:38, g2:50, b2:56 };

// ===== Linear Interpolation Function =====
function lerp(a,b,t){
    // Returns interpolated value between a and b based on t (0-1)
    return Math.round(a + (b - a) * t);
}

// ===== Header Gradient Animation =====
function updateBarGradient(){
    // Update progress
    progress += direction * (16 / duration); // 16ms per frame approximation
    if(progress >= 1){ progress = 1; direction = -1; } // Reverse at end
    else if(progress <= 0){ progress = 0; direction = 1; } // Reverse at start
    
    // Interpolate RGB values for gradient
    const r1 = lerp(dayGradient.r1, nightGradient.r1, progress);
    const g1 = lerp(dayGradient.g1, nightGradient.g1, progress);
    const b1 = lerp(dayGradient.b1, nightGradient.b1, progress);
    const r2 = lerp(dayGradient.r2, nightGradient.r2, progress);
    const g2 = lerp(dayGradient.g2, nightGradient.g2, progress);
    const b2 = lerp(dayGradient.b2, nightGradient.b2, progress);
    
    // Apply new gradient to header bar
    headerBar.style.background = `linear-gradient(90deg,rgb(${r1},${g1},${b1}),rgb(${r2},${g2},${b2}))`;
    
    requestAnimationFrame(updateBarGradient); // Loop animation
}
requestAnimationFrame(updateBarGradient); // Start the animation

// ===== Day/Night Switch =====
let dayActive = true; // Track current sky state
function switchSky(){
    if(dayActive){
        // Switch to night
        dayImg.style.opacity = 0;
        nightImg.style.opacity = 1;
        document.body.style.background = "#37474f"; // Night background color
        document.body.style.color = "#cfd8dc"; // Night text color
        footer.style.backgroundColor = "#455a64"; // Night footer color
        footer.style.color = "#eceff1"; // Night footer text
        // Update glow text shadows for night
        glowTexts.forEach(el => el.style.textShadow = "0 0 10px #81d4fa,0 0 20px #0288d1,0 0 30px #03a9f4");
    } else {
        // Switch to day
        dayImg.style.opacity = 1;
        nightImg.style.opacity = 0;
        document.body.style.background = "#e3f2fd"; // Day background
        document.body.style.color = "#003366"; // Day text
        footer.style.backgroundColor = "#0288d1"; // Day footer
        footer.style.color = "#e0f7fa"; // Day footer text
        // Update glow text shadows for day
        glowTexts.forEach(el => el.style.textShadow = "0 0 10px #0288d1,0 0 20px #03a9f4,0 0 30px #81d4fa");
    }
    dayActive = !dayActive; // Toggle state
}

// Automatically switch sky every 10 seconds
setInterval(switchSky, 10000);
switchSky(); // Initial call to set starting state

// ===== Game Card Click Events =====
gameCards.forEach(card => {
    card.addEventListener('click', () => {
        // Get the game name from the first <span> inside the card
        const gameName = card.querySelector('span').textContent;
        alert(`You selected: ${gameName}`); // Show alert on click
    });
});