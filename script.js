function startGame() {

let number = Math.floor(Math.random() * 75) + 1;

document.getElementById("number").innerHTML =
"Next Number: " + number;

}