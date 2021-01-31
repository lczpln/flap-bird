// Canvas config
var canvas = document.createElement('canvas');
var canvasWidth = 240;
var canvasHeight = 420;

canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.style.maxWidth = "100%";
canvas.style.maxHeight = "100%";
canvas.style.borderRadius = "5px";
canvas.style.background = "url(/src/assets/background.png)";
canvas.style.backgroundSize = "cover";
canvas.style.backgroundRepeat = "no-repeat";
canvas.tabIndex = 1;

// Create canvas context
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;

// Save game loop interval
var gameLoop;

// Create bird ,set up src and bird configs
var bird = new Image();
bird.src = "/src/assets/bird.png";

var birdFlap = 8;
var birdGravity = 0.6;

var birdX = birdDY = 0;

// Player score
var score = bestScore = 0;

// Game config
var interval = birdSize = pipeWidth = topPipeBottomY = 24;

var birdY = pipeGap = 100;

var pipeX = canvasWidth;

// Functions
function drawText(ctx, text, size, align, posx, posy) {
  ctx.fillStyle = "orange";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";
  ctx.textAlign = align;
  ctx.font = `${size}px Fira Code`;
  ctx.strokeText(text, posx, posy);
  ctx.fillText(text, posx, posy);
  ctx.stroke();
  ctx.fill();
}


function drawPipe(ctx, posx, posy, w, y) {
  var pipeColor = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
  pipeColor.addColorStop(0, "#03c04a");
  pipeColor.addColorStop(1, "green");

  ctx.fillStyle = pipeColor;
  ctx.shadowColor = "rgba(0, 0, 0, 0.24)";
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 6
  ctx.shadowBlur = 4;
  ctx.strokeRect(posx, posy, w, y);
  ctx.fillRect(posx, posy, w, y);
  ctx.stroke();
  ctx.fill();
}

function setControlsToPlay() {
  canvas.onclick = () => (birdDY = birdFlap);

  canvas.onkeydown = (e) => {
    if (e.key !== "ArrowUp" && e.key !== "w" && e.key !== " ") return;
    e.preventDefault();
    return (birdDY = birdFlap)
  }
}

function setControlsToStart() {
  canvas.onclick = () => start();

  canvas.onkeydown = (e) => {
    if (e.key !== "ArrowUp" && e.key !== "w" && e.key !== " ") return;
    e.preventDefault();
    return start();
  }
}

function applyBirdGravity() {
  birdY -= birdDY -= birdGravity;
}

function drawBirdNewPosition() {
  ctx.drawImage(bird, birdX, birdY, birdSize * (524 / 374), birdSize);
}

function applyPipeMovement() {
  pipeX -= 6;
}

function createNewPipe() {
  if (pipeX < -pipeWidth) {
    pipeX = canvasWidth;

    topPipeBottomY = Math.floor((canvasHeight / 2) * Math.random());
  }
}

function playerAddScore() {
  score++;
  bestScore = bestScore < score ? score : bestScore; // New best score?
}

function birdCheckColision() {
  if (((birdY < topPipeBottomY || birdY > topPipeBottomY + pipeGap) && (pipeX < birdSize * (524 / 374)) || birdY > canvasHeight)) {
    resetGame();
  }
}

function showWelcomeMessage() {
  drawText(ctx, "Click to Start!", 16, "center", canvasWidth / 2, canvasHeight / 2);
  drawText(ctx, `Best score: ${bestScore}`, 12, "center", canvasWidth / 2, canvasHeight / 2 + 20);
}

function start() {
  setControlsToPlay();

  gameLoop = setInterval(() => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // cleanup

    applyBirdGravity();

    drawBirdNewPosition()

    applyPipeMovement();

    createNewPipe();

    drawPipe(ctx, pipeX, 0, pipeWidth, topPipeBottomY); // draw top pipe
    drawPipe(ctx, pipeX, topPipeBottomY + pipeGap, pipeWidth, canvasHeight); // drawn bottom pipe

    drawText(ctx, `score: ${score}`, 12, "right", canvasWidth - 5, 15) // draw score 
    drawText(ctx, `best score: ${bestScore}`, 12, "right", canvasWidth - 5, 30) // draw best score 

    playerAddScore();

    birdCheckColision();
  }, interval)
}

function resetGame() {
  clearInterval(gameLoop);

  birdDY = 0;
  birdY = 200;
  pipeX = canvasWidth;
  score = 0;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  setControlsToStart();

  showWelcomeMessage();
}

document.body.appendChild(canvas);
canvas.focus();
resetGame();