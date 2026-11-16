// this file is always the first javascript to be loaded
// initialise our ravenwood namespace where we will store all our game data and functions
window.ravenwood = window.ravenwood || {
  templates: {}, // add the object to store HTML templates so we don't risk it being undefined in the template file
  views: {},
  playerStatus: {
    spooks: 0,
    spooksPerSecond: 0,
    spooksPerClick: 1,
    gold: 0,
    decay: 0,
    ectoplasm: 0,
    ownedRelics: {},
    graveyardUnlocked: false,
    graveyardLevel: null,
  },
};

async function loadGameData() {
  // this function will load our game data from the JSON file and store it in our ravenwood namespace
  const jsonFile = await fetch("data.json");
  const jsonData = await jsonFile.json();

  window.ravenwood.gameData = jsonData; // store the game data in our ravenwood namespace so we can access it from anywhere in our code
}

loadGameData(); // call the function to load the game data when the page loads
