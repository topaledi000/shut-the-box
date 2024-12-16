// Global Variables
const die1 = document.getElementById("die1");
const die2 = document.getElementById("die2");
const rollDiceButton = document.getElementById("rollDice");
const individualDiceButton = document.getElementById("individualDice");
const sumDiceButton = document.getElementById("sumDice");
const endTurnButton = document.getElementById("endTurn");
const startGameButton = document.getElementById("startGame");
const player1Input = document.getElementById("player1Input");
const player2Input = document.getElementById("player2Input");

const boxes = Array(10).fill(0);

let currentTurn = 1;
let currentRound = 1;
let player1Points = 0;
let player2Points = 0;
let diceValue1 = 0;
let diceValue2 = 0;

// Initialize the game board
function initializeBoard() {
    const board = document.getElementById("boxes");
    board.innerHTML = ""; // Clear existing boxes
    for (let i = 1; i <= 9; i++) {
        const box = document.createElement("div");
        box.id = `box${i}`;
        box.className = "box";
        box.textContent = i;
        board.appendChild(box);
    }
}

// Utility functions
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function shut(boxNumber) {
    const box = document.getElementById(`box${boxNumber}`);
    box.classList.add("shut");
    box.textContent = "X";
    boxes[boxNumber] = "X";
}

// START GAME button: Event Listener
startGameButton.addEventListener("click", () => {
    const player1Name = player1Input.value.trim();
    const player2Name = player2Input.value.trim();

    if (!player1Name || !player2Name) {
        alert("Please enter both player names!");
        player1Input.focus();
        return;
    }

    document.getElementById("player1Name").textContent = player1Name + " (Player 1)";
    document.getElementById("player2Name").textContent = player2Name + " (Player 2)";

    document.getElementById("playerSection").style.display = "none";
    document.getElementById("gameBoard").style.display = "block";
    document.getElementById("scorecard").style.display = "block";

    rollDiceButton.disabled = false;
    initializeBoard();
});

// Roll Dice button: Event listener
rollDiceButton.addEventListener("click", () => {
    diceValue1 = rollDice();
    diceValue2 = rollDice();

    die1.src = `dice${diceValue1}.png`;
    die2.src = `dice${diceValue2}.png`;

    const sum = diceValue1 + diceValue2;
    individualDiceButton.disabled =
        diceValue1 === diceValue2 ||
        boxes[diceValue1] === "X" ||
        boxes[diceValue2] === "X";
    sumDiceButton.disabled = sum > 9 || boxes[sum] === "X";
    endTurnButton.disabled = !individualDiceButton.disabled && !sumDiceButton.disabled;
    rollDiceButton.disabled = true;
});

// Function to handle shutting boxes for Individual Dice
individualDiceButton.addEventListener("click", () => {
    shut(diceValue1);
    shut(diceValue2);

    boxes[0] += diceValue1 + diceValue2;

    individualDiceButton.disabled = true;
    sumDiceButton.disabled = true;
    rollDiceButton.disabled = false;
});

// Function to handle shutting a box for Sum of the Dice
sumDiceButton.addEventListener("click", () => {
    const sum = diceValue1 + diceValue2;
    shut(sum);
    boxes[0] += sum;
    individualDiceButton.disabled = true;
    sumDiceButton.disabled = true;
    rollDiceButton.disabled = false;
});

// Function to handle End Turn
endTurnButton.addEventListener("click", () => {
    const roundPoints = 45 - boxes[0]; // Points = 45 - sum of shut boxes

    if (currentTurn === 1) {
        player1Points += roundPoints;

        const row = buildRow(currentRound, roundPoints);
        document.querySelector("tbody").appendChild(row);

        currentTurn = 2;
        document.getElementById("turnDisplay").textContent = `Player 2's Turn`;
    } else {
        player2Points += roundPoints;

        const p2Cell = document.querySelector(`#round${currentRound} .p2Pts`);
        p2Cell.textContent = roundPoints;

        currentTurn = 1;
        currentRound++;
        document.getElementById("turnDisplay").textContent = `Player 1's Turn`;
        document.getElementById("roundDisplay").textContent = `Round ${currentRound}`;
    }

    resetBoard();

    if (currentRound > 5) {
        gameOver();
    } else {
        rollDiceButton.disabled = false;
        endTurnButton.disabled = true;
    }
});

// Function: to build a row in the Scorecard table
function buildRow(round, player1Points) {
    const row = document.createElement("tr");
    row.id = `round${round}`;

    const roundCell = document.createElement("th");
    roundCell.textContent = `Round ${round}`;
    row.appendChild(roundCell);

    const p1Cell = document.createElement("td");
    p1Cell.className = "p1Pts";
    p1Cell.textContent = player1Points;
    row.appendChild(p1Cell);

    const p2Cell = document.createElement("td");
    p2Cell.className = "p2Pts";
    row.appendChild(p2Cell);

    return row;
}

// Reset the board for the next turn
function resetBoard() {
    boxes.fill(0);
    const boardBoxes = document.querySelectorAll(".box");
    boardBoxes.forEach((box, index) => {
        if (index > -1) { // Skip index 0 (used for scoring)
            box.classList.remove("shut");
            box.textContent = index+1;
        }
    });
}

// Game Over Function
function gameOver() {
    document.getElementById("gameBoard").style.display = "none";
    document.getElementById("winnerSection").style.display = "block";

    const winnerMessage = document.querySelector(".winner-message");

    if (player1Points < player2Points) {
        winnerMessage.textContent = `Player 1 Wins with ${player1Points} points! Player 2 scored ${player2Points}.`;
    } else if (player2Points < player1Points) {
        winnerMessage.textContent = `Player 2 Wins with ${player2Points} points! Player 1 scored ${player1Points}.`;
    } else {
        winnerMessage.textContent = `It's a tie! One more round to determine the winner.`;
        currentRound++;
        currentTurn = 1;
        resetBoard();
        document.getElementById("gameBoard").style.display = "block";
        document.getElementById("winnerSection").style.display = "none";
        document.getElementById("roundDisplay").textContent = `Round ${currentRound}`;
        document.getElementById("turnDisplay").textContent = `Player 1's Turn`;
        return;
    }

    // Adds "Play Again" button functionality
    document.getElementById("playAgain").addEventListener("click", () => {
        restartGame();
    });
}

// Restart Game Function
function restartGame() {
    player1Points = 0;
    player2Points = 0;
    currentRound = 1;
    currentTurn = 1;

    boxes.fill(0);

    document.querySelector("tbody").innerHTML = ""; // Clear scorecard rows
    document.getElementById("playerSection").style.display = "block";
    document.getElementById("gameBoard").style.display = "none";
    document.getElementById("scorecard").style.display = "none";
    document.getElementById("winnerSection").style.display = "none";

    rollDiceButton.disabled = true;
    individualDiceButton.disabled = true;
    sumDiceButton.disabled = true;
    endTurnButton.disabled = true;

    initializeBoard();
}
