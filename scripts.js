/////////////////////////////////////////////////////
//////////       PLAYER STATUS      /////////////////
/////////////////////////////////////////////////////

const playerStatus = {
  spooks: 0,
  spooksPerSecond: 0,
  spooksPerClick: 1,
  gold: 0,
  decay: 0,
  ectoplasm: 0,
  ownedRelics: {},
  graveyardUnlocked: false,
  graveyardLevel: null,
};

/////////////////////////////////////////////////////
//////////       DOM ELEMENTS      ///////////////
/////////////////////////////////////////////////////

const spookCount = document.querySelector("#spook-count");
const spooksPerSecond = document.querySelector("#spook-rate-per-second span");
const spooksPerClick = document.querySelector("#spook-rate-per-click span");
const collectButton = document.querySelector("#collect-spooks-button");
const relicsSection = document.querySelector("#relics-section");
const relicList = document.querySelector(".relic-list");

/////////////////////////////////////////////////////
//////////       COUNTER DISPLAY      ///////////////
/////////////////////////////////////////////////////

function updateSpookCounterDisplay() {
  spookCount.textContent = playerStatus.spooks;
  spooksPerSecond.textContent = playerStatus.spooksPerSecond;
  spooksPerClick.textContent = playerStatus.spooksPerClick;
}

/////////////////////////////////////////////////////
//////////       COLLECT SPOOKS      ////////////////
/////////////////////////////////////////////////////

function collectSpooks() {
  playerStatus.spooks = playerStatus.spooks + playerStatus.spooksPerClick;

  updateSpookCounterDisplay();
}

collectButton.addEventListener("click", collectSpooks);

/////////////////////////////////////////////////////
//////////          JSON FILE        ////////////////
/////////////////////////////////////////////////////

let jsonObjects = {};

async function loadGameData() {
  const jsonFile = await fetch("data.json");
  const jsonData = await jsonFile.json();

  jsonObjects = jsonData;
  loadRelics();
}

loadGameData();

/////////////////////////////////////////////////////
//////////           RELICS          ////////////////
/////////////////////////////////////////////////////

function loadRelics() {
  const relics = jsonObjects.relics;

  relicList.innerHTML = "";

  for (let relicIndex = 0; relicIndex < relics.length; relicIndex++) {
    const relic = relics[relicIndex];
    let relicMaxOwnedText = ""; // Ths an empty string for maxOwned text

    // Check if maxOwned is defined for the relic
    if (relic.maxOwned !== undefined) {
      relicMaxOwnedText = `<span>0/${relic.maxOwned}</span>`; // Display "0/maxOwned" if maxOwned is defined
    }

    // The template to create the relics card HTML and add it to the relic list
    relicList.innerHTML += `
  <article class="relic-card">
    <img class="relic-image" src="${relic.image}">
    
    <div class="relic-content">
      <h3 class="relic-name">${relic.name}</h3>

      <div class="relic-meta">
        <span>${relic.baseCost} ${relic.currency}</span>
        ${relicMaxOwnedText}
      </div>

      <p class="relic-description">
        ${relic.description}
      </p>
    </div>

    <button class="relic-buy-button" type="button">
      Buy
    </button>
  </article>
`;
  }
}
