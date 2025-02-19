// Global definieren – so ist sie überall verfügbar
window.currentCategory = "Tageslevel";

document.addEventListener('DOMContentLoaded', function() {
  initPopup();
  updateActiveCategoryButton();
  initGame();  // initGame() wird in game.js definiert und verwendet window.currentCategory
  loadAdCardMain();

  setTimeout(adjustHeaderFooterWidth, 100);
  adjustHeaderFooterWidth();
  window.addEventListener("resize", adjustHeaderFooterWidth);


  //initAds();

  // Event Listener für Kategorie-Buttons
  let catButtons = document.querySelectorAll("#category-sidebar .category-btn");
  catButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      window.currentCategory = this.getAttribute("data-category");
      updateActiveCategoryButton();
      initGame();
      // Bei kleinen Bildschirmen automatisch zum Spielfeld scrollen
      if (window.innerWidth < 600) {
        document.getElementById('game-area').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

window.addEventListener("load", adjustHeaderFooterWidth);

window.addEventListener("resize", adjustHeaderFooterWidth);
document.addEventListener("DOMContentLoaded", adjustHeaderFooterWidth);


function adjustHeaderFooterWidth() {
    const gameArea = document.getElementById("game-area");
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    if (gameArea && header && footer) {
      const gameWidth = gameArea.offsetWidth;
      const winWidth = window.innerWidth;
      // Setze Header und Footer auf die größere Breite (Fensterbreite, wenn größer)
      const newWidth = (winWidth > gameWidth ? winWidth : gameWidth) + "px";
      header.style.width = newWidth;
      footer.style.width = newWidth;
    }
  }

function updateActiveCategoryButton() {
  let catButtons = document.querySelectorAll("#category-sidebar .category-btn");
  catButtons.forEach(btn => {
    if (btn.getAttribute("data-category") === window.currentCategory) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

document.getElementById('toggle-sidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('category-sidebar');
    if (sidebar.style.display === 'block') {
      sidebar.style.display = 'none';
    } else {
      sidebar.style.display = 'block';
    }
  });

