const { body } = document;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const width = 500;
const height = 700;
const screenWidth = window.screen.width;
const canvasPosition = screenWidth / 2 - width / 2;
const isMobile = window.matchMedia(`(max-width: 500px)`);
const gameOverElement = document.createElement("div");

// paddle styles
const paddleHeight = 10;
const paddleWidth = 50;
const paddleGap = 25;
const paddleBottomX = 225;
const paddleTopX = 225;

// ball styles
const ballRadius = 5;
let ballX = 250;
let ballY = 350;

// game variables
let ballSpeedX;
let ballSpeedY;
let trajectoryX;
let computerSpeed;

// Score
let playerScore = 0;
let computerScore = 0;
const winningScore = 10;
let isGameOver = true;
let isNewGame = true;

// mobile setting
if (isMobile.matches) {
  ballSpeedY = -2;
  ballSpeedX = ballSpeedY;
  computerSpeed = 4;
} else {
  ballSpeedY = -1;
  ballSpeedX = ballSpeedY;
}

function createCanvas() {
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);
  renderCanvas();
}

function renderCanvas() {
  //   console.log("hi");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "white";

  //   player paddle
  ctx.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight);

  //   computer paddle
  ctx.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);

  //   center line
  ctx.beginPath();
  ctx.setLineDash([5]);
  ctx.moveTo(0, 350);
  ctx.lineTo(500, 350);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.closePath();

  //  ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  //   score
  ctx.font = "30px Helvetica";
  ctx.fillText(playerScore, 20, canvas.height / 2 + 50);
  ctx.fillText(computerScore, 20, canvas.height / 2 - 50);
}

createCanvas();
