const state = {
  view: {
    scoreBox: document.querySelector(".score-points"),
    cardInfield: document.querySelector(".card-infield"),
    cardSprites: {
      avatar: document.getElementById("card-img"),
      name: document.getElementById("card-name"),
      type: document.getElementById("card-type"),
    },
    fieldCards: {
      player: document.getElementById("player-field-card"),
      computer: document.getElementById("computer-field-card"),
    },
  },
  playerSides: {
    player: "player-cards",
    playerBOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },
  values: {
    playerScore: 0,
    computerScore: 0,
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImgs = "./src/assets/icons/";
const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImgs}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImgs}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImgs}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function hideCarcDetails() {
  state.view.cardSprites.avatar.src = "";
  state.view.cardSprites.name.innerText = "";
  state.view.cardSprites.type.innerText = "";
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.view.fieldCards.player.style.display = "block";
  state.view.fieldCards.computer.style.display = "block";

  await hideCarcDetails();

  state.view.fieldCards.player.src = cardData[cardId].img;

  state.view.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.view.scoreBox.innerText = `Win: ${state.values.playerScore} | Lose: ${state.values.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Draw!";
  let playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = "Win!";
    await playAudio("win");
    state.values.playerScore++;
  }

  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = "Lost!";
    await playAudio("lose");
    state.values.computerScore++;
  }

  return duelResults;
}

async function removeAllCardsImages() {
  let { computerBOX, playerBOX } = state.playerSides;

  let imgElements = computerBOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  cards = state.playerSides.playerBOX;

  imgElements = playerBOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(id) {
  state.view.cardSprites.avatar.src = cardData[id].img;
  state.view.cardSprites.name.innerText = cardData[id].name;
  state.view.cardSprites.avatar.src = cardData[id].img;
  state.view.cardSprites.type.innerText = `Attribute: ${cardData[id].type}`;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", `${pathImgs}card-back.png`);
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }
  return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImg = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImg);
  }
}

async function resetDuel() {
  state.view.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.view.fieldCards.player.style.display = "none";
  state.view.fieldCards.computer.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

function init() {
  state.view.cardInfield.style.display = "block";

  drawCards(5, state.playerSides.player);
  drawCards(5, state.playerSides.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();
