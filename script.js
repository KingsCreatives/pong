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
const paddleDifference = 25;
let paddleBottomX = 225;
let paddleTopX = 225;
let playerMoved = false;
let paddleContact = false;

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

function computerAI() {
  if (playerMoved) {
    if (paddleTopX + paddleDifference < ballX) {
      paddleTopX += computerSpeed;
    } else {
      paddleTopX -= computerSpeed;
    }
  }
}

function createCanvas() {
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);
  renderCanvas();
}

function animate() {
  renderCanvas();
  ballMove();
  ballBoundaries();
  computerAI();
  window.requestAnimationFrame(animate)
}

function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  ballSpeedY = -3;
  paddleContact = false;
}

function ballMove() {
  ballY += -ballSpeedY;

  if (playerMoved && paddleContact) {
    ballX += ballSpeedX;
  }
}

function ballBoundaries() {
  if (ballX < 0 && ballSpeedX < 0) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballX > width && ballSpeedX > 0) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballY > height - paddleDifference) {
    if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
      paddleContact = true;

      if (playerMoved) {
        ballSpeedY -= 1;

        if (ballSpeedY < -5) {
          ballSpeedY = -5;
          computerSpeed = 6;
        }
      }
      ballSpeedY = -ballSpeedY;
      trajectoryX = ballX - (paddleBottomX + paddleDifference);
      ballSpeedX = trajectoryX * 0.3;
    } else if (ballY > height) {
      ballReset();
      computerScore++;
    }
  }
  // Bounce off computer paddle (top)
  if (ballY < paddleDifference) {
    if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
      // Add Speed on Hit
      if (playerMoved) {
        ballSpeedY += 1;
        // Max Speed
        if (ballSpeedY > 5) {
          ballSpeedY = 5;
        }
      }
      ballSpeedY = -ballSpeedY;
    } else if (ballY < 0) {
      // Reset Ball, add to Player Score
      ballReset();
      playerScore++;
    }
  }
}

// start game
function startGame() {
  playerScore = 0;
  computerScore = 0;

  ballReset();
  createCanvas();
  animate()

  canvas.addEventListener("mouseover", (e) => {
    playerMoved = true;

    paddleBottomX = e.clientX - canvasPosition - paddleDifference;

    if (paddleBottomX < paddleDifference) {
      paddleBottomX = 0;
    }
    if (paddleBottomX > width - paddleWidth) {
      paddleBottomX = width - paddleWidth;
    }

    canvas.style.cursor = "none";
  });
}

// start game on page load
startGame();
