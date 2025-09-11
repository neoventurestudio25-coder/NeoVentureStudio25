document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".news-card");
const bgMusic = document.getElementById("bgMusic");
const soundBtn = document.getElementById("sound-toggle");
soundBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    soundBtn.textContent = "🔊";
  } else {
    bgMusic.pause();
    soundBtn.textContent = "🔇";
  }
})
  cards.forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(5vh)";
    setTimeout(() => {
      card.style.transition = "0.8s ease";
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }, i * 300);
  });
});

