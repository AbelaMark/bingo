const socket = io();
const bingoGrid = document.getElementById("bingoGrid");
const currentCallDiv = document.getElementById("currentCall");
const previousCallsDiv = document.getElementById("previousCalls");
const statusDiv = document.getElementById("status");
const callCount = document.getElementById("callCount");
const playerCardDiv = document.getElementById("playerCard");
const winnerPopup = document.getElementById("winnerPopup");
const winnerCardDiv = document.getElementById("winnerCard");
const countdownResetDiv = document.getElementById("countdownReset");
const cartelaGrid = document.getElementById("cartelaGrid");
const cartelaScreen = document.getElementById("cartelaScreen");
const mainGame = document.querySelector(".main");

mainGame.style.display = "none";


let playerNumbers = [];
let gameInterval;

let numbers = [];
let calledNumbers = [];
let gameStarted = false;
let timer = 20;

// generate 1–400
for (let i = 1; i <= 400; i++) {
  const div = document.createElement("div");
  div.className = "cartela-item";
  div.innerText = i;

  div.onclick = () => selectCartela(i);

  cartelaGrid.appendChild(div);
}

// Generate 1–75 board
let num = 1;
for (let col = 0; col < 5; col++) {
  for (let row = 0; row < 15; row++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = num;
    cell.id = "num-" + num;

    bingoGrid.appendChild(cell);
    numbers.push(num);
    num++;
  }
}

// Generate player card
function generateCard() {
  playerCardDiv.innerHTML = "";
  playerNumbers = [];

  const ranges = [
    [1, 15],   // B
    [16, 30],  // I
    [31, 45],  // N
    [46, 60],  // G
    [61, 75]   // O
  ];

  let grid = [];

  // Generate numbers per column
  for (let col = 0; col < 5; col++) {
    let nums = new Set();

    while (nums.size < 5) {
      let rand =
        Math.floor(Math.random() * (ranges[col][1] - ranges[col][0] + 1)) +
        ranges[col][0];
      nums.add(rand);
    }

    grid.push(Array.from(nums));
  }

  // Build 5x5 card (row by row)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const div = document.createElement("div");

      let value;
      let index = row * 5 + col; // 🔥 correct index

      // Center FREE cell
      if (row === 2 && col === 2) {
        div.innerText = "*";
        div.classList.add("marked");
        playerNumbers.push("FREE");
      } else {
        value = grid[col][row];
        div.innerText = value;
        playerNumbers.push(value);
      }

      // 🔥 CLICK TO MARK (ONLY IF CALLED)
      div.addEventListener("click", () => {
        let cellValue = playerNumbers[index];

        if (cellValue === "FREE") return;

        if (calledNumbers.includes(cellValue)) {
          div.classList.toggle("marked");
        } else {
          alert("❌ This number is not called yet!");
        }
      });

      playerCardDiv.appendChild(div);
    }
  }
}

generateCard();

// Countdown
let countdown = setInterval(() => {
  timer--;
  statusDiv.innerText = "WAITING (" + timer + "s)";

  if (timer === 0) {
    clearInterval(countdown);
    startGame();
  }
}, 1000);

// Start game
function startGame() {
  gameStarted = true;
  statusDiv.innerText = "STARTED";


}

// Call number
function callNumber() {
  if (numbers.length === 0) return;

  const randIndex = Math.floor(Math.random() * numbers.length);
  const num = numbers.splice(randIndex, 1)[0];

  calledNumbers.push(num);
  callCount.innerText = calledNumbers.length;

  currentCallDiv.innerText = getLetter(num) + "-" + num;

  document.getElementById("num-" + num)?.classList.add("called");

  const prev = document.createElement("div");
  prev.innerText = getLetter(num) + num;
  previousCallsDiv.appendChild(prev);

  // MARK PLAYER CARD
  const cells = playerCardDiv.children;


}

function checkWin() {
  const cells = playerCardDiv.children;

  // check rows only (5 rows)
  for (let row = 0; row < 5; row++) {
    let win = true;

    for (let col = 0; col < 5; col++) {
      let index = row * 5 + col;
      if (!cells[index].classList.contains("marked")) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }

  return false;
}

function showWinner(name) {
  gameStarted = false;

  clearInterval(gameInterval); // stop calling numbers

  winnerPopup.classList.remove("hidden");

  document.getElementById("winnerName").innerText = name;

  // copy card
  winnerCardDiv.innerHTML = playerCardDiv.innerHTML;

  startResetCountdown();
}

function resetGame() {
  winnerPopup.classList.add("hidden"); // 👈 VERY IMPORTANT

  mainGame.style.display = "none";
  cartelaScreen.style.display = "block";

  // reset values
  numbers = [];
  calledNumbers = [];
  previousCallsDiv.innerHTML = "";
  callCount.innerText = 0;

  bingoGrid.innerHTML = "";

  let num = 1;
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 15; row++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerText = num;
      cell.id = "num-" + num;

      bingoGrid.appendChild(cell);
      numbers.push(num);
      num++;
    }
  }
}
// Get BINGO letter
function getLetter(num) {
  if (num <= 15) return "B";
  if (num <= 30) return "I";
  if (num <= 45) return "N";
  if (num <= 60) return "G";
  return "O";
}

document.querySelector(".bingo-btn").addEventListener("click", () => {
  if (!gameStarted) return;

  if (checkWin()) {
    showWinner("You"); // later replace with real name
  } else {
    alert("❌ Not a valid BINGO!");
  }
});

function selectCartela(num) {
  cartelaScreen.style.display = "none";
  mainGame.style.display = "flex";

  generateCard(); // your card logic

  startWaiting();
}

function startWaiting() {
  timer = 20;
  statusDiv.innerText = "WAITING (20s)";

  let countdown = setInterval(() => {
    timer--;
    statusDiv.innerText = "WAITING (" + timer + "s)";

    if (timer === 0) {
      clearInterval(countdown);
      startGame();
    }
  }, 1000);
}

function startResetCountdown() {
  let time = 10;
  countdownResetDiv.innerText = time;

  const interval = setInterval(() => {
    time--;
    countdownResetDiv.innerText = time;

    if (time <= 0) {
      clearInterval(interval);

      // 🔥 CLOSE POPUP + RESET
      resetGame();
    }
  }, 1000);
}

socket.emit("joinGame", {
  name: "Player_" + Math.floor(Math.random() * 1000)
});

socket.on("gameState", (game) => {
  document.getElementById("players").innerText = game.players.length;
});

socket.on("numberCalled", (num) => {
  calledNumbers.push(num);

  callCount.innerText = calledNumbers.length;

  currentCallDiv.innerText = getLetter(num) + "-" + num;

  document.getElementById("num-" + num)?.classList.add("called");

  const prev = document.createElement("div");
  prev.innerText = getLetter(num) + num;
  previousCallsDiv.appendChild(prev);
});
