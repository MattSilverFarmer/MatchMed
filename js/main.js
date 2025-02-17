// Global definieren – so ist sie überall verfügbar
window.currentCategory = "Tageslevel";

document.addEventListener('DOMContentLoaded', function() {
  initPopup();

  updateActiveCategoryButton();
  initGame();  // initGame() wird in game.js definiert und verwendet window.currentCategory
  loadAdCardMain();
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
