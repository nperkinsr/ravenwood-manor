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

let gameData = {};

async function loadGameData() {
  const jsonFile = await fetch("data.json");
  const jsonData = await jsonFile.json();

  jsonObjects = jsonData;
}

loadGameData();
