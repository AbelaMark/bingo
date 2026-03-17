const bingoGrid = document.getElementById("bingoGrid");
const currentCallDiv = document.getElementById("currentCall");
const previousCallsDiv = document.getElementById("previousCalls");
const statusDiv = document.getElementById("status");
const callCount = document.getElementById("callCount");
const playerCardDiv = document.getElementById("playerCard");

let numbers = [];
let calledNumbers = [];
let gameStarted = false;
let timer = 20;

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
  let nums = new Set();

  while (nums.size < 25) {
    nums.add(Math.floor(Math.random() * 75) + 1);
  }

  let arr = Array.from(nums);

  arr.forEach((n, i) => {
    const div = document.createElement("div");
    div.innerText = (i === 12) ? "*" : n;

    if (i === 12) div.classList.add("marked");

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

  setInterval(callNumber, 2000);
}

// Call number
function callNumber() {
  if (numbers.length === 0) return;

  const randIndex = Math.floor(Math.random() * numbers.length);
  const num = numbers.splice(randIndex, 1)[0];

  calledNumbers.push(num);
  callCount.innerText = calledNumbers.length;

  // Display current call
  currentCallDiv.innerText = getLetter(num) + "-" + num;

  // Highlight board
  document.getElementById("num-" + num)?.classList.add("called");

  // Add to previous calls
  const prev = document.createElement("div");
  prev.innerText = getLetter(num) + num;
  previousCallsDiv.appendChild(prev);
}

// Get BINGO letter
function getLetter(num) {
  if (num <= 15) return "B";
  if (num <= 30) return "I";
  if (num <= 45) return "N";
  if (num <= 60) return "G";
  return "O";
}
