// Hilfsfunktion: Rendert eine Anzeige (prüft, ob externes HTML vorhanden ist)
function renderAd(adObj) {
    if (adObj.html) {
      return adObj.html;
    }
    return `
      <div class="ad-card-container">
        <img src="${adObj.image}" alt="Ad Bild">
        <div class="ad-card-text">
          <h3>${adObj.title}</h3>
          <p>${adObj.subtitle}</p>
        </div>
      </div>
    `;
  }
  
  // Funktion zum Laden einer AdCard im Ergebnis-Popup
  function loadAdWeiter() {
    fetch('data/adsWeiter.json')
      .then(response => response.json())
      .then(adsWeiter => {
        const adCard = document.getElementById('result-ad');
        const randomAd = adsWeiter[Math.floor(Math.random() * adsWeiter.length)];
        adCard.innerHTML = renderAd(randomAd);
        adCard.addEventListener('click', () => {
          window.location.href = randomAd.link;
        });
      })
      .catch(err => {
        console.error("Fehler beim Laden der adsWeiter Daten:", err);
      });
  }
  
  // Funktion zum Laden der Haupt-AdCard unter den draggable Blöcken
  function loadAdCardMain() {
    fetch('data/ads.json')
      .then(response => response.json())
      .then(ads => {
        const adCard = document.getElementById('ad-card-main');
        if (adCard) {
           const randomAd = ads[Math.floor(Math.random() * ads.length)];
           adCard.innerHTML = renderAd(randomAd);
           adCard.addEventListener('click', () => {
             window.location.href = randomAd.link;
           });
        }
      })
      .catch(err => {
        console.error("Fehler beim Laden der Haupt-Ads:", err);
      });
  }
  