// ------------------
// Global Variables
// ------------------
const numbersDiv = document.getElementById("numbers");
const callText = document.getElementById("call");

let calledNumbers = [];
let playerCard = [];

// ------------------
// Generate Player Bingo Card (5x5)
// ------------------
function generateCard() {
  playerCard = [];
  const grid = document.createElement("div");
  grid.className = "player-card";
  document.body.appendChild(grid);

  const columns = { B: [], I: [], N: [], G: [], O: [] };

  // Generate numbers per column ranges
  columns.B = getRandomNumbers(1, 15, 5);
  columns.I = getRandomNumbers(16, 30, 5);
  columns.N = getRandomNumbers(31, 45, 5);
  columns.G = getRandomNumbers(46, 60, 5);
  columns.O = getRandomNumbers(61, 75, 5);

  // Build card grid
  for (let i = 0; i < 5; i++) {
    for (const col of ["B","I","N","G","O"]) {
      const div = document.createElement("div");
      div.className = "card-number";
      div.innerText = columns[col][i];
      div.dataset.number = columns[col][i];
      div.addEventListener("click", () => selectNumber(div));
      grid.appendChild(div);

      playerCard.push({
        number: columns[col][i],
        element: div,
        marked: false
      });
    }
  }

  // Optional: middle free space
  const freeIndex = 12; // center
  playerCard[freeIndex].element.innerText = "FREE";
  playerCard[freeIndex].marked = true;
  playerCard[freeIndex].element.classList.add("marked");
}

// Helper: get random numbers without repetition
function getRandomNumbers(min, max, count) {
  const arr = [];
  while(arr.length < count){
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if(!arr.includes(num)) arr.push(num);
  }
  return arr;
}

// ------------------
// Mark number when clicked
// ------------------
function selectNumber(div){
  const num = parseInt(div.dataset.number);
  if(calledNumbers.includes(num)){
    div.classList.add("marked");
    const cell = playerCard.find(c => c.number === num);
    if(cell) cell.marked = true;

    // Check for Bingo
    if(checkBingo()){
      alert("🎉 BINGO! You win!");
    }
  } else {
    alert("This number hasn't been called yet!");
  }
}

// ------------------
// Check for Bingo (rows, columns, diagonals)
// ------------------
function checkBingo(){
  const gridSize = 5;
  let bingo = false;

  // Rows
  for(let r=0; r<gridSize; r++){
    let row = true;
    for(let c=0; c<gridSize; c++){
      if(!playerCard[r*gridSize + c].marked) row=false;
    }
    if(row) bingo=true;
  }

  // Columns
  for(let c=0; c<gridSize; c++){
    let col = true;
    for(let r=0; r<gridSize; r++){
      if(!playerCard[r*gridSize + c].marked) col=false;
    }
    if(col) bingo=true;
  }

  // Diagonals
  let diag1=true, diag2=true;
  for(let i=0;i<gridSize;i++){
    if(!playerCard[i*gridSize + i].marked) diag1=false;
    if(!playerCard[i*gridSize + (gridSize-1-i)].marked) diag2=false;
  }
  if(diag1 || diag2) bingo=true;

  return bingo;
}

// ------------------
// Call numbers like before
// ------------------
function getLetter(num) {
  if (num <= 15) return "B";
  if (num <= 30) return "I";
  if (num <= 45) return "N";
  if (num <= 60) return "G";
  return "O";
}

function callNumber() {
  if (calledNumbers.length >= 75) return;

  let num;
  do {
    num = Math.floor(Math.random() * 75) + 1;
  } while (calledNumbers.includes(num));

  calledNumbers.push(num);

  const letter = getLetter(num);
  const callText = document.getElementById("call");
  callText.innerText = `${letter}-${num}`;

  // Highlight number on main grid
  const element = document.getElementById("num-" + num);
  if (element) element.classList.add("active");

  // Highlight on player card if exists
  const cell = playerCard.find(c => c.number === num);
  if(cell) cell.element.classList.add("called");

  // Add to recent calls
  addRecent(`${letter}${num}`);
}

function addRecent(text) {
  const recentDiv = document.querySelector(".recent");
  const span = document.createElement("span");
  span.innerText = text;
  recentDiv.prepend(span);
  if (recentDiv.children.length > 6) recentDiv.removeChild(recentDiv.lastChild);
}

// ------------------
// Initialize
// ------------------
generateCard();
setInterval(callNumber, 3000);
