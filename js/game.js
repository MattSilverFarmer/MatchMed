// Globale Variablen
let lives = 7;
let levelsData = [];
let remainingSlots = 0;
const cellSize = 100;    // Gittergröße in Pixeln
const blockSize = 80;    // Blockgröße in Pixeln
const offset = (cellSize - blockSize) / 2; // Zentrierung innerhalb einer Zelle

// currentMode: "daily" für Tageslevel, "bonus" für Bonuslevel
let currentMode = "daily";

// Liefert den Dateinamen des JSONs anhand der aktuellen Kategorie
function getLevelsFileName() {
  // Verwende window.currentCategory
  switch(window.currentCategory) {
    case "Tageslevel": return "data/levels_tages.json";
    case "Bonuslevel": return "data/levels_bonus.json";
    case "Anatomie": return "data/levels_anatomie.json";
    case "Physiologie": return "data/levels_physiologie.json";
    case "Innere Medizin": return "data/levels_innere_medizin.json";
    case "Augenheilkunde": return "data/levels_augenheilkunde.json";
    case "Unfallchirurgie": return "data/levels_unfallchirurgie.json";
    case "Allgemeinchirurgie": return "data/levels_allgemeinchirurgie.json";
    case "Anästhesie": return "data/levels_anästhesie.json";
    case "Gynäkologie": return "data/levels_gyn.json";
    case "Neurologie": return "data/levels_neurologie.json";
    case "Orthopädie": return "data/levels_orthopädie.json";
    case "Pädiatrie": return "data/levels_ped.json";
    case "Zahnmedizin": return "data/levels_zahnmedizin.json";
    default: return "data/levels_tages.json";
  }
}

// Level initialisieren: Lade das JSON der aktuellen Kategorie
function initGame() {
  let fileName = getLevelsFileName();
  console.log("Loading JSON for category:", window.currentCategory, "File:", fileName);
  fetch(fileName)
    .then(response => response.json())
    .then(levels => {
      levelsData = levels;
      if (window.currentCategory === "Tageslevel") {
        let maxId = Math.max(...levelsData.map(l => l.id));
        let today = new Date().getDate();
        let levelId = Math.min(today, maxId);
        let level = levelsData.find(l => l.id == levelId);
        if (level) {
          currentMode = "daily";
          loadLevelObject(level);
        } else {
          console.error("Kein Level mit id", levelId, "in", fileName);
        }
      } else {
        currentMode = (window.currentCategory === "Bonuslevel") ? "bonus" : "daily";
        let randomIndex = Math.floor(Math.random() * levelsData.length);
        let level = levelsData[randomIndex];
        loadLevelObject(level);
      }
    })
    .catch(err => {
      console.error("Fehler beim Laden der Level-Daten:", err);
    });
}

function loadLevelObject(level) {
  lives = 7;
  document.getElementById('lives-count').textContent = lives + " ❤️";
  renderGameArea(level);
  initDraggableBlocks(level);
}

function renderGameArea(level) {
  const gameArea = document.getElementById('game-area');
  gameArea.innerHTML = "";
  remainingSlots = 0;
  
  let maxX = 0, maxY = 0;
  level.blocks.forEach(block => {
    maxX = Math.max(maxX, block.x);
    maxY = Math.max(maxY, block.y);
  });
  gameArea.style.width = (maxX * cellSize) + "px";
  gameArea.style.height = (maxY * cellSize) + "px";
  
  level.blocks.forEach((block, idx) => {
    const blockDiv = document.createElement('div');
    blockDiv.classList.add('game-block');
    blockDiv.style.left = ((block.x - 1) * cellSize + offset) + 'px';
    blockDiv.style.top = ((block.y - 1) * cellSize + offset) + 'px';
    blockDiv.dataset.category = block.category;
    blockDiv.dataset.name = block.name;
    blockDiv.dataset.index = idx;
    
    if (block.visible) {
      blockDiv.innerHTML = `<span class="block-icon">${block.icon}</span>
                            <span class="block-name">${block.name}</span>`;
      blockDiv.style.cursor = 'default';
    } else {
      blockDiv.classList.add('empty-slot');
      blockDiv.addEventListener('dragover', allowDrop);
      blockDiv.addEventListener('drop', dropBlock);
      remainingSlots++;
    }
    gameArea.appendChild(blockDiv);
  });
  
  drawConnections(level);
}

function initDraggableBlocks(level) {
  const container = document.getElementById('blocks-container');
  container.innerHTML = "";
  level.blocks.forEach((block, idx) => {
    if (!block.visible) {
      const blockDiv = document.createElement('div');
      blockDiv.classList.add('draggable-block');
      blockDiv.draggable = true;
      blockDiv.dataset.category = block.category;
      blockDiv.dataset.name = block.name;
      blockDiv.dataset.index = idx;
      blockDiv.innerHTML = `<span class="block-icon">${block.icon}</span>
                            <span class="block-category">${block.category}</span>`;
      blockDiv.addEventListener('dragstart', dragBlock);
      container.appendChild(blockDiv);
    }
  });
}

function dragBlock(ev) {
  ev.dataTransfer.setData("text/plain", JSON.stringify({
    category: ev.target.dataset.category,
    name: ev.target.dataset.name,
    icon: ev.target.querySelector('.block-icon').textContent,
    index: ev.target.dataset.index
  }));
}

function allowDrop(ev) {
  ev.preventDefault();
}

function dropBlock(ev) {
  ev.preventDefault();
  const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
  const targetEl = ev.target.closest('.empty-slot');
  const targetCategory = targetEl.dataset.category;
  
  if (data.category === targetCategory) {
    targetEl.classList.remove('empty-slot');
    targetEl.classList.add('correct');
    targetEl.innerHTML = `<span class="block-icon">${data.icon}</span>
                          <span class="block-name">${data.name}</span>`;
    removeDraggableBlock(data.index);
    remainingSlots--;
    checkLevelComplete();
  } else {
    targetEl.classList.add('incorrect');
    setTimeout(() => { targetEl.classList.remove('incorrect'); }, 1000);
    lives--;
    document.getElementById('lives-count').textContent = lives + " ❤️";
    if (lives <= 0) {
      endLevel(false);
    }
  }
}

function removeDraggableBlock(index) {
  const container = document.getElementById('blocks-container');
  const blocks = container.getElementsByClassName('draggable-block');
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].dataset.index === index.toString()) {
      container.removeChild(blocks[i]);
      break;
    }
  }
}

function checkLevelComplete() {
  if (remainingSlots === 0) {
    endLevel(true);
  }
}

function endLevel(success) {
  const resultPopup = document.getElementById('result-popup');
  const resultTitle = document.getElementById('result-title');
  const resultMessage = document.getElementById('result-message');
  
  if (success) {
    if (window.currentCategory === "Tageslevel") {
      resultTitle.textContent = "Tageslevel erfolgreich gelöst!";
      resultMessage.textContent = "Es gibt täglich ein neues Level. Möchtest du zusätzlich ein Bonuslevel spielen?";
      document.getElementById('result-next').textContent = "Bonuslevel spielen";
      currentMode = "bonus";
    } else if (window.currentCategory === "Bonuslevel") {
      resultTitle.textContent = "Bonuslevel erfolgreich gelöst!";
      resultMessage.textContent = "Bonuslevel kannst du beliebig oft spielen. Willst du ein weiteres Bonuslevel ausprobieren?";
      document.getElementById('result-next').textContent = "Nächstes Bonuslevel spielen";
    } else {
      resultTitle.textContent = `${window.currentCategory} Level erfolgreich gelöst!`;
      resultMessage.textContent = `Möchtest du ein weiteres Level aus der Fachrichtung ${window.currentCategory} spielen?`;
      document.getElementById('result-next').textContent = "Weiter spielen";
    }
  } else {
    resultTitle.textContent = "Level leider verloren!";
    resultMessage.textContent = "Du hast alle deine Leben verloren. Bitte versuche es noch einmal.";
    document.getElementById('result-next').textContent = "Nochmal spielen";
  }
  
  if (typeof loadAdWeiter === 'function') {
    loadAdWeiter();
  }
  
  resultPopup.style.display = 'flex';
}

function drawConnections(level) {
  const gameArea = document.getElementById('game-area');
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", gameArea.style.width);
  svg.setAttribute("height", gameArea.style.height);
  svg.style.position = "absolute";
  svg.style.top = 0;
  svg.style.left = 0;
  svg.style.zIndex = 0;
  
  let posMap = {};
  level.blocks.forEach(block => {
    const cx = (block.x - 1) * cellSize + offset + blockSize / 2;
    const cy = (block.y - 1) * cellSize + offset + blockSize / 2;
    posMap[`${block.x}-${block.y}`] = { cx, cy };
  });
  
  for (let key in posMap) {
    let [x, y] = key.split('-').map(Number);
    let current = posMap[key];
    let rightKey = `${x+1}-${y}`;
    if (posMap[rightKey]) {
      let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", current.cx);
      line.setAttribute("y1", current.cy);
      line.setAttribute("x2", posMap[rightKey].cx);
      line.setAttribute("y2", posMap[rightKey].cy);
      line.setAttribute("stroke", "#aaa");
      line.setAttribute("stroke-dasharray", "4,2");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);
    }
    let bottomKey = `${x}-${y+1}`;
    if (posMap[bottomKey]) {
      let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", current.cx);
      line.setAttribute("y1", current.cy);
      line.setAttribute("x2", posMap[bottomKey].cx);
      line.setAttribute("y2", posMap[bottomKey].cy);
      line.setAttribute("stroke", "#aaa");
      line.setAttribute("stroke-dasharray", "4,2");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);
    }
  }
  gameArea.insertBefore(svg, gameArea.firstChild);
}

// Beim Klick auf "Weiter" im Ergebnis-Popup wird ein neues Level geladen
document.getElementById('result-next').addEventListener('click', function() {
  document.getElementById('result-popup').style.display = 'none';
  initGame();
});
