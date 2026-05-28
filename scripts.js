/////////////////////////////////////////////////////
//////////       PLAYER STATUS      /////////////////
/////////////////////////////////////////////////////

const playerStatus = window.ravenwood.playerStatus;

/////////////////////////////////////////////////////
//////////       DOM ELEMENTS      ///////////////
/////////////////////////////////////////////////////

const spookCount = document.querySelector("#spook-count");
const spooksPerSecond = document.querySelector("#spook-rate-per-second span");
const spooksPerClick = document.querySelector("#spook-rate-per-click span");
const collectButton = document.querySelector("#collect-spooks-button");
const relicsSection = document.querySelector("#relics-section");
const relicList = document.querySelector(".relic-list");
// const relicCardTemplate = document.querySelector("#relic-card-template");

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
  const RelicList = new window.ravenwood.views.RelicList(relics, relicList);
  RelicList.render();
  linkRelicButtons();
}

/////////////////////////////////////////////////////
//////////     RELIC BUTTON STATE    ///////////////
/////////////////////////////////////////////////////

/**
 * This function decides if a relic button should be disabled
 * A relic is disabled if the player does not have enough currency
 * A relic is also disabled if the player already owns the maximum amount
 */
function getRelicDisabled(relic) {
  const relicCost = getRelicCost(relic);
  const relicOwned = getRelicOwned(relic);
  const playerCurrency = playerStatus[relic.currency];
  let relicButtonDisabled = "";

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

/**
 * Updates the current relic cards without rebuilding them

 * Needed because loadig the relics makes tooltops flicker, and not loading  the relics
 * maskes the relic buttons not update when the player has enough currency..
 */
function updateRelicButtonStates() {
  const relicBuyButtons = document.querySelectorAll(".relic-buy-button");

  for (
    let buttonIndex = 0;
    buttonIndex < relicBuyButtons.length;
    buttonIndex = buttonIndex + 1
  ) {
    const relicBuyButton = relicBuyButtons[buttonIndex];
    const relicId = relicBuyButton.dataset.relicId; // Get the relic id from the butons data attribute
    const relic = getRelic(relicId);
    const relicCard = relicBuyButton.closest(".relic-card"); // Gets the relic card element that is the parent of the button
    const relicButtonDisabled = getRelicDisabled(relic); // Checks if the relic should be disabled

    if (relicButtonDisabled === "disabled") {
      relicBuyButton.disabled = true;
      relicCard.classList.add("inactive");
    } else {
      relicBuyButton.disabled = false;
      relicCard.classList.remove("inactive");
    }
  }
}

/////////////////////////////////////////////////////
//////////       RELIC PURCHASING    ///////////////
/////////////////////////////////////////////////////

/**
 * This function links each relic buy button to the buyRelic function.
 * After the relic cards are added to the page, this function finds
 * all the relic buttons and adds a click event to each one
 */
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
/**
 * This function runs when a relic buy button is clicked
 * It gets the relic id from the button
 * Then it finds that relic in the JSON data
 * Then it tries to buy that relic.
 */
function buyRelic(event) {
  const relicButton = event.target;
  const relicId = relicButton.dataset.relicId;
  const relic = getRelic(relicId);

  buyRelicItem(relic);
}

/**
 * This function finds one relic from the JSON data
 * It receives a relic id
 * Then it looks through all the relics until it finds the matching relic
 */
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

/**
 * This function tries to buy a relic
 * 1. It checks if the player has enough currency
 * 2. It checks if the relic has a maximum amount
 * 3. If the player can buy the relic, it finishes the purchase
 */
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

/**
 * This function finishes a relic purchase
 * 1. It subtracts the relic cost from the player's currency
 * 2. It adds one to the amount owned for that relic
 * 3. Then it applies the relic effect and updates the display
 */
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

/**
 * This function applies the effect of a relic
 */
function useRelicEffect(relic) {
  if (relic.effectType === "clickPower") {
    playerStatus.spooksPerClick =
      playerStatus.spooksPerClick + relic.effectValue;
  }

  // NEW EFFECT TYPE: SPOOKS PER SECOND
  if (relic.effectType === "spooksPerSecond") {
    playerStatus.spooksPerSecond =
      playerStatus.spooksPerSecond + relic.effectValue;
  }
}

/////////////////////////////////////////////////////
//////////     SPOOKS PER SECOND     /////////////// //
/////////////////////////////////////////////////////

/**
 * This function gives the player automatic spooks
 * It uses the player's current spooksPerSecond value
 */
function collectSpooksPerSecond() {
  if (playerStatus.spooksPerSecond > 0) {
    playerStatus.spooks = playerStatus.spooks + playerStatus.spooksPerSecond;

    updateSpookCounterDisplay();
    updateRelicButtonStates();
  }
}

setInterval(collectSpooksPerSecond, 1000);

/**
 * This function gets how many of a relic the player owns
 * If the player does not own that relic yet
 * it returns 0.
 */
function getRelicOwned(relic) {
  let relicOwned = playerStatus.ownedRelics[relic.id];

  if (relicOwned === undefined) {
    relicOwned = 0;
  }

  return relicOwned;
}

/**
 * This function gets the current cost of a relic
 * The cost starts with the baseCost from the JSON file
 * Every time the player buys the relic, the cost goes up
 * using the costMultiplier from the JSON file
 */
function getRelicCost(relic) {
  const relicOwned = getRelicOwned(relic);
  const relicCost = relic.baseCost * Math.pow(relic.costMultiplier, relicOwned);
  const roundedRelicCost = Math.floor(relicCost);

  return roundedRelicCost;
}
