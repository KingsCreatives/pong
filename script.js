const { body } = document;
const gameCanvas = document.createElement("canvas");
const gameContext = gameCanvas.getContext("2d");
const canvasWidth = 500;
const canvasHeight = 700;
const screenWidth = window.screen.width;
const canvasXPosition = screenWidth / 2 - canvasWidth / 2;
const isMobileDevice = window.matchMedia("(max-width: 600px)");
const endGameElement = document.createElement("div");

const paddleHeight = 10;
const paddleWidth = 50;
const paddleOffset = 25;
let playerPaddleX = 225;
let computerPaddleX = 225;
let playerHasMoved = false;
let ballHitsPaddle = false;

let ballX = 250;
let ballY = 350;
const ballRadius = 5;

let ballSpeedY;
let ballSpeedX;
let ballTrajectoryX;
let computerPaddleSpeed;

if (isMobileDevice.matches) {
  ballSpeedY = -2;
  ballSpeedX = ballSpeedY;
  computerPaddleSpeed = 4;
} else {
  ballSpeedY = -1;
  ballSpeedX = ballSpeedY;
  computerPaddleSpeed = 3;
}

let playerPoints = 0;
let computerPoints = 0;
const maxPoints = 7;
let gameIsOver = true;
let newGame = true;

function drawCanvas() {
  gameContext.fillStyle = "black";
  gameContext.fillRect(0, 0, canvasWidth, canvasHeight);

  gameContext.fillStyle = "white";
  gameContext.fillRect(
    playerPaddleX,
    canvasHeight - 20,
    paddleWidth,
    paddleHeight
  );
  gameContext.fillRect(computerPaddleX, 10, paddleWidth, paddleHeight);

  gameContext.beginPath();
  gameContext.setLineDash([4]);
  gameContext.moveTo(0, 350);
  gameContext.lineTo(500, 350);
  gameContext.strokeStyle = "grey";
  gameContext.stroke();

  gameContext.beginPath();
  gameContext.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  gameContext.fillStyle = "white";
  gameContext.fill();

  gameContext.font = "32px Courier New";
  gameContext.fillText(playerPoints, 20, gameCanvas.height / 2 + 50);
  gameContext.fillText(computerPoints, 20, gameCanvas.height / 2 - 30);
}

function initializeCanvas() {
  gameCanvas.width = canvasWidth;
  gameCanvas.height = canvasHeight;
  body.appendChild(gameCanvas);
  drawCanvas();
}

function resetBall() {
  ballX = canvasWidth / 2;
  ballY = canvasHeight / 2;
  ballSpeedY = -3;
  ballHitsPaddle = false;
}

function moveBall() {
  ballY += -ballSpeedY;
  if (playerHasMoved && ballHitsPaddle) {
    ballX += ballSpeedX;
  }
}

function checkBallBoundaries() {
  if (ballX < 0 && ballSpeedX < 0) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballX > canvasWidth && ballSpeedX > 0) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY > canvasHeight - paddleOffset) {
    if (ballX > playerPaddleX && ballX < playerPaddleX + paddleWidth) {
      ballHitsPaddle = true;
      if (playerHasMoved) {
        ballSpeedY -= 1;
        if (ballSpeedY < -5) {
          ballSpeedY = -5;
          computerPaddleSpeed = 6;
        }
      }
      ballSpeedY = -ballSpeedY;
      ballTrajectoryX = ballX - (playerPaddleX + paddleOffset);
      ballSpeedX = ballTrajectoryX * 0.3;
    } else if (ballY > canvasHeight) {
      resetBall();
      computerPoints++;
    }
  }
  if (ballY < paddleOffset) {
    if (ballX > computerPaddleX && ballX < computerPaddleX + paddleWidth) {
      if (playerHasMoved) {
        ballSpeedY += 1;
        if (ballSpeedY > 5) {
          ballSpeedY = 5;
        }
      }
      ballSpeedY = -ballSpeedY;
    } else if (ballY < 0) {
      resetBall();
      playerPoints++;
    }
  }
}

function computerMovement() {
  if (playerHasMoved) {
    if (computerPaddleX + paddleOffset < ballX) {
      computerPaddleX += computerPaddleSpeed;
    } else {
      computerPaddleX -= computerPaddleSpeed;
    }
  }
}

function displayEndGame(winner) {
  gameCanvas.hidden = true;
  endGameElement.textContent = "";
  endGameElement.classList.add("game-over-container");
  const title = document.createElement("h1");
  title.textContent = `${winner} Wins!`;
  const playAgainButton = document.createElement("button");
  playAgainButton.setAttribute("onclick", "startNewGame()");
  playAgainButton.textContent = "Play Again";
  endGameElement.append(title, playAgainButton);
  body.appendChild(endGameElement);
}

function checkGameOver() {
  if (playerPoints === maxPoints || computerPoints === maxPoints) {
    gameIsOver = true;
    const winner = playerPoints === maxPoints ? "Player" : "Computer";
    displayEndGame(winner);
  }
}

function animate() {
  drawCanvas();
  moveBall();
  checkBallBoundaries();
  computerMovement();
  checkGameOver();
  if (!gameIsOver) {
    window.requestAnimationFrame(animate);
  }
}

function startNewGame() {
  if (gameIsOver && !newGame) {
    body.removeChild(endGameElement);
    gameCanvas.hidden = false;
  }
  gameIsOver = false;
  newGame = false;
  playerPoints = 0;
  computerPoints = 0;
  resetBall();
  initializeCanvas();
  animate();
  gameCanvas.addEventListener("mousemove", (e) => {
    playerHasMoved = true;
    playerPaddleX = e.clientX - canvasXPosition - paddleOffset;
    if (playerPaddleX < paddleOffset) {
      playerPaddleX = 0;
    }
    if (playerPaddleX > canvasWidth - paddleWidth) {
      playerPaddleX = canvasWidth - paddleWidth;
    }
    gameCanvas.style.cursor = "none";
  });
}

startNewGame();
