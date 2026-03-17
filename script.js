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

  let nums = new Set();

  while (nums.size < 25) {
    nums.add(Math.floor(Math.random() * 75) + 1);
  }

  let arr = Array.from(nums);

  arr.forEach((n, i) => {
    const div = document.createElement("div");

    if (i === 12) {
      div.innerText = "*";
      div.classList.add("marked");
      playerNumbers.push("FREE");
    } else {
      div.innerText = n;
      playerNumbers.push(n);
    }

    playerCardDiv.appendChild(div);
  });
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

 gameInterval = setInterval(callNumber, 2000);
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
  for (let i = 0; i < cells.length; i++) {
    if (playerNumbers[i] === num) {
      cells[i].classList.add("marked");
    }
  }

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
  winnerPopup.classList.add("hidden");

  // reset variables
  numbers = [];
  calledNumbers = [];
  previousCallsDiv.innerHTML = "";
  callCount.innerText = 0;

  // regenerate board
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

  generateCard();

  // restart countdown
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
