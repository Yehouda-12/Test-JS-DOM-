let gameState = {
  players: [
    { total: 0, current: 0, name: "שחקן 1" },
    { total: 0, current: 0, name: "שחקן 2" },
  ],
  currentPlayer:  0,
  gameActive: true,
  gameMode: "pvp",
  rolling: false,
};


const diceFaces = {
  1: [{ x: 50, y: 50 }],
  2: [
    { x: 25, y: 25 },
    { x: 75, y: 75 },
  ],
  3: [
    { x: 25, y: 25 },
    { x: 50, y: 50 },
    { x: 75, y: 75 },
  ],
  4: [
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 25, y: 75 },
    { x: 75, y: 75 },
  ],
  5: [
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 50, y: 50 },
    { x: 25, y: 75 },
    { x: 75, y: 75 },
  ],
  6: [
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 25, y: 50 },
    { x: 75, y: 50 },
    { x: 25, y: 75 },
    { x: 75, y: 75 },
  ],
};
export function updateDisplay() {
  document.getElementById("player1Total").textContent =
    gameState.players[0].total;
  document.getElementById("player1Current").textContent =
    gameState.players[0].current;
  document.getElementById("player2Total").textContent =
    gameState.players[1].total;
  document.getElementById("player2Current").textContent =
    gameState.players[1].current;

  const player1Card = document.getElementById("player1Card");
  const player2Card = document.getElementById("player2Card");

  if (gameState.currentPlayer === 0) {

    player1Card.classList.add("active");
    player2Card.classList.remove("active");
    player1Card.querySelector(".current-turn").textContent = "תורך!";
    player2Card.querySelector(".current-turn").textContent = "המתן...";
  } else {
    player1Card.classList.remove("active");
    player2Card.classList.add("active");
    player1Card.querySelector(".current-turn").textContent = "המתן...";
    player2Card.querySelector(".current-turn").textContent = "תורך!";
  }
}

function showMessage(text, type = "info") {
  const messageEl = document.getElementById("resultMessage");
  messageEl.textContent = text;
  messageEl.className = `result-message ${type}`;
  messageEl.style.display = "block";
}

function drawDice(number, numDice) {
  const dice = document.querySelectorAll(".dice");
  const face = dice[numDice].querySelector('.dice-face');
  face.innerHTML = ''

  const dots = diceFaces[number];
  dots.forEach((dot) => {
    const dotEl = document.createElement("span");
    dotEl.className = "dot";
    dotEl.style.left = `${dot.x}%`;
    dotEl.style.top = `${dot.y}%`;
    face.appendChild(dotEl);
  });
}

async function rollDice(numDice) {
  if (!gameState.gameActive || gameState.rolling) return;

  gameState.rolling = true;
  const dice = document.querySelectorAll(".dice");
  dice[numDice].classList.add("rolling");

  const result = Math.floor(Math.random() * 6) + 1;
  drawDice(result, numDice);

  dice[numDice].classList.remove("rolling");
  gameState.rolling = false;

 
  return result;
}

document.getElementById("rollBtn").addEventListener("click", async () => {
  if (!gameState.gameActive || gameState.rolling) return;

  document.getElementById("resultMessage").textContent = "";

  const roll1 = await rollDice(0);
  const roll2 = await rollDice(1);

  if (roll1 === roll2) {
    gameState.players[gameState.currentPlayer].current = 0;
    showMessage("equal you lost");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    switchPlayer();
  } else {
    gameState.players[gameState.currentPlayer].current += roll1 + roll2;
    updateDisplay();
    showMessage(` הטלת ${roll1 + roll2}!`, "info");
  }
  
});

async function switchPlayer() {
  gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
  updateDisplay();
  document.getElementById("resultMessage").textContent = "";
}

document.getElementById("holdBtn").addEventListener("click", () => {
  if (!gameState.gameActive || gameState.rolling) return;

  const player = gameState.players[gameState.currentPlayer];

 

  player.total += player.current;
  player.current = 0;

  updateDisplay();

  if (player.total >= 50) {
    endGame();}
    else{

    showMessage(`✅ נשמר! ${player.total} נקודות סה"כ.`, "success");
    setTimeout(() => {
      switchPlayer();
    }, 1000);}
  
});




function endGame() {
  gameState.gameActive = false;

  const winner = gameState.players[gameState.currentPlayer];
  const winnerName = gameState.currentPlayer === 0 ? "שחקן 1" : "שחקן 2";

  showMessage(`🎉 ${winnerName} ניצח עם ${winner.total} נקודות!`, "success");
}

updateDisplay();
drawDice(1,0);
drawDice(1,1);
