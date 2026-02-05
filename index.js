import { drawDice, endGame, gameState, rollDice, showMessage, switchPlayer, updateDisplay } from "./utils.js";






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





updateDisplay();
drawDice(1,0);
drawDice(1,1);
