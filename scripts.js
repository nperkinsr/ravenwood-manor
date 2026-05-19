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
  loadRelics();
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

  for (
    let relicIndex = 0;
    relicIndex < relics.length;
    relicIndex = relicIndex + 1
  ) {
    const relic = relics[relicIndex];
    const relicCost = getRelicCost(relic);
    const relicOwned = getRelicOwned(relic);
    const relicButtonDisabled = getRelicDisabled(relic);
    let relicCostText = `${relicCost} ${relic.currency}`;
    let relicDisabledClass = "";
    let relicMaxOwnedText = ""; // This is an empty string for maxOwned text

    if (relicButtonDisabled === "disabled") {
      relicDisabledClass = "inactive";
    }

    // Check if maxOwned is defined for the relic
    if (relic.maxOwned !== undefined) {
      relicMaxOwnedText = `<span>${relicOwned}/${relic.maxOwned}</span>`; // Display "owned/maxOwned" if maxOwned is defined

      if (relicOwned >= relic.maxOwned) {
        relicCostText = "Maxed";
      }
    }

    // The template to create the relics card HTML and add it to the relic list
    relicList.innerHTML =
      relicList.innerHTML +
      `
  <article class="relic-card ${relicDisabledClass}">
    <img class="relic-image" src="${relic.image}">
    
    <div class="relic-content">
      <h3 class="relic-name">${relic.name}</h3>

      <div class="relic-meta">
        <span>${relicCostText}</span>
        ${relicMaxOwnedText}
      </div>

      <p class="relic-description">
        ${relic.description}
      </p>
    </div>

    <button class="relic-buy-button" type="button" data-relic-id="${relic.id}" ${relicButtonDisabled}>
      Buy
    </button>
  </article>
`;
  }

  linkRelicButtons();
}

/////////////////////////////////////////////////////
//////////     RELIC BUTTON STATE    ///////////////
/////////////////////////////////////////////////////

// So, by default they are enabled, but then if the player doesnt have enough to buy it, or if they have maxed it, then they are shown as disabled.
function getRelicDisabled(relic) {
  const relicCost = getRelicCost(relic);
  const relicOwned = getRelicOwned(relic);
  const playerCurrency = playerStatus[relic.currency];
  var relicButtonDisabled = "";

  if (playerCurrency < relicCost) {
    relicButtonDisabled = "disabled";
  }

  if (relic.maxOwned !== undefined) {
    if (relicOwned >= relic.maxOwned) {
      relicButtonDisabled = "disabled";
    }
  }

  return relicButtonDisabled;
}

/////////////////////////////////////////////////////
//////////       RELIC PURCHASING    ///////////////
/////////////////////////////////////////////////////

// This function connects the relic buy buttons to the buyRelic function
function linkRelicButtons() {
  const relicBuyButtons = document.querySelectorAll(".relic-buy-button");

  for (
    let buttonIndex = 0;
    buttonIndex < relicBuyButtons.length;
    buttonIndex = buttonIndex + 1
  ) {
    const relicBuyButton = relicBuyButtons[buttonIndex];

    relicBuyButton.addEventListener("click", buyRelic);
  }
}
// When a relic buy button is clicked it gets the relic id from the button data attribute, finds the corresponding relic object and then attempts to buy it
function buyRelic(event) {
  const relicButton = event.target;
  const relicId = relicButton.dataset.relicId;
  const relic = getRelic(relicId);

  buyRelicItem(relic);
}

// This is to find the relic object that matches the relic id from the data of the button that was clicked
function getRelic(relicId) {
  const relics = jsonObjects.relics;
  let matchingRelic = {};

  for (
    let relicIndex = 0;
    relicIndex < relics.length;
    relicIndex = relicIndex + 1
  ) {
    const relic = relics[relicIndex];

    if (relic.id === relicId) {
      matchingRelic = relic;
    }
  }

  return matchingRelic;
}

// Checks if the player has enough currency to buy the thing, and if yes then it applies the effect of relic and updates all the stuff
function buyRelicItem(relic) {
  const relicCost = getRelicCost(relic);
  const relicOwned = getRelicOwned(relic);

  if (playerStatus[relic.currency] >= relicCost) {
    if (relic.maxOwned === undefined) {
      finishRelicBuy(relic, relicCost, relicOwned);
    }

    if (relic.maxOwned !== undefined) {
      if (relicOwned < relic.maxOwned) {
        finishRelicBuy(relic, relicCost, relicOwned);
      }
    }
  }
}

// When player succesfully buys relic, this updates the player status substracting currency, adding to relic owned, and applies effect of relic, then updates displays
function finishRelicBuy(relic, relicCost, relicOwned) {
  playerStatus[relic.currency] = playerStatus[relic.currency] - relicCost;
  playerStatus.ownedRelics[relic.id] = relicOwned + 1;

  useRelicEffect(relic);
  updateSpookCounterDisplay();
  loadRelics();
}

/////////////////////////////////////////////////////
//////////        RELIC EFFECTS      ///////////////
/////////////////////////////////////////////////////

// This function applies the effect of the relic to the player status (In this case it checks if the effect type is click power and if yes then it adds the effect value to the spooks per click)
function useRelicEffect(relic) {
  if (relic.effectType === "clickPower") {
    playerStatus.spooksPerClick =
      playerStatus.spooksPerClick + relic.effectValue;
  }
}

// This function gets how many of the relic the player owns, if they dont own any it shows 0
function getRelicOwned(relic) {
  let relicOwned = playerStatus.ownedRelics[relic.id];

  if (relicOwned === undefined) {
    relicOwned = 0;
  }

  return relicOwned;
}

// Calculates the cost of the relic based on: baseCost * (costMultiplier ** relicOwned), and then rounds it down to the nearest whole number
function getRelicCost(relic) {
  const relicOwned = getRelicOwned(relic);
  const relicCost = relic.baseCost * Math.pow(relic.costMultiplier, relicOwned);
  const roundedRelicCost = Math.floor(relicCost);

  return roundedRelicCost;
}
