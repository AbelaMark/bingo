const cardsGrid = document.getElementById("cardsGrid");
const playerCardDiv = document.getElementById("playerCard");
const gameStatus = document.getElementById("gameStatus");
const previousCallsDiv = document.getElementById("previousCalls");

// Simulate current game state
let currentGameActive = true;

// Store previous called numbers
let previousCalls = [];

// Generate 1-400 cartelas
for (let i = 1; i <= 400; i++) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerText = i;

  card.addEventListener("click", () => {
    if (currentGameActive) {
      alert("⏳ Wait until the current game finishes");
      return;
    }

    document.querySelectorAll(".cards-grid .card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");

    generatePlayerCard(i);
  });

  cardsGrid.appendChild(card);
}

// Generate 5x5 cartela
function generatePlayerCard(cardId) {
  playerCardDiv.innerHTML = "";
  gameStatus.innerText = `Your Cartela: ${cardId}`;

  // Generate 25 unique random numbers
  let numbers = new Set();
  while (numbers.size < 25) {
    numbers.add(Math.floor(Math.random() * 75) + 1);
  }

  numbers.forEach(num => {
    const cell = document.createElement("div");
    cell.className = "card-number";
    cell.innerText = num;

    // Click to mark number (simulate called)
    cell.addEventListener("click", () => {
      cell.classList.toggle("marked");
      addToPreviousCalls(num);
    });

    playerCardDiv.appendChild(cell);
  });
}

// Add number to previous calls
function addToPreviousCalls(num) {
  if (!previousCalls.includes(num)) {
    previousCalls.push(num);

    const callDiv = document.createElement("div");
    callDiv.className = "call-number";
    callDiv.innerText = num;
    previousCallsDiv.appendChild(callDiv);
  }
}

// Simulate current game finishing after 5 seconds
setTimeout(() => {
  currentGameActive = false;
  gameStatus.innerText = "Select a cartela to start the next game";
}, 5000);
