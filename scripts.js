/////////////////////////////////////////////////////
//////////       PLAYER STATUS      /////////////////
/////////////////////////////////////////////////////

const playerStatus = {
  spooks: 0,
  spooksPerSecond: 0,
  spooksPerClick: 1,
};

/////////////////////////////////////////////////////
//////////       DOM ELEMENTS      ///////////////
/////////////////////////////////////////////////////

const spookCount = document.querySelector("#spook-count");
const spooksPerSecond = document.querySelector("#spook-rate-per-second span");
const spooksPerClick = document.querySelector("#spook-rate-per-click span");

/////////////////////////////////////////////////////
//////////       COUNTER DISPLAY      ///////////////
/////////////////////////////////////////////////////

function updateSpookCounterDisplay() {
  spookCount.textContent = playerStatus.spooks;
  spooksPerSecond.textContent = playerStatus.spooksPerSecond;
  spooksPerClick.textContent = playerStatus.spooksPerClick;
}

updateSpookCounterDisplay();

/////////////////////////////////////////////////////
//////////       COLLECT SPOOKS      ////////////////
/////////////////////////////////////////////////////

const collectButton = document.querySelector("#collect-spooks-button");

function collectSpooks() {
  playerStatus.spooks = playerStatus.spooks + playerStatus.spooksPerClick;

  updateSpookCounterDisplay();
}

collectButton.addEventListener("click", collectSpooks);
