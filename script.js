const numbersDiv = document.getElementById("numbers");

// Generate 1–75
for (let i = 1; i <= 75; i++) {
  const div = document.createElement("div");
  div.className = "number";
  div.innerText = i;

  numbersDiv.appendChild(div);
}
