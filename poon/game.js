const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 10;

// Ball settings
const BALL_SIZE = 16;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = 6;
let ballSpeedY = 4;

// Left paddle (player)
let leftPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Right paddle (AI)
let rightPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
const AI_SPEED = 5;

// Score
let leftScore = 0;
let rightScore = 0;

// Helper: clamp value
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddleY = clamp(mouseY - PADDLE_HEIGHT / 2, 0, HEIGHT - PADDLE_HEIGHT);
});

// Draw everything on canvas
function draw() {
  // Clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw center line
  ctx.strokeStyle = '#fff3';
  ctx.beginPath();
  ctx.setLineDash([12, 12]);
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(PADDLE_MARGIN, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, 2 * Math.PI);
  ctx.fillStyle = '#0ff';
  ctx.fill();

  // Draw score
  ctx.font = 'bold 40px monospace';
  ctx.fillStyle = '#fff';
  ctx.fillText(leftScore, WIDTH / 2 - 80, 60);
  ctx.fillText(rightScore, WIDTH / 2 + 40, 60);
}

// Ball movement and collision
function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top and bottom wall collision
  if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
    ballSpeedY = -ballSpeedY;
    ballY = clamp(ballY, 0, HEIGHT - BALL_SIZE);
  }

  // Left paddle collision
  if (
    ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
    ballY + BALL_SIZE > leftPaddleY &&
    ballY < leftPaddleY + PADDLE_HEIGHT
  ) {
    ballSpeedX = Math.abs(ballSpeedX);
    // Add some paddle "spin"
    let hitPos = (ballY + BALL_SIZE / 2) - (leftPaddleY + PADDLE_HEIGHT / 2);
    ballSpeedY += hitPos * 0.15;
  }

  // Right paddle collision (AI)
  if (
    ballX + BALL_SIZE >= WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
    ballY + BALL_SIZE > rightPaddleY &&
    ballY < rightPaddleY + PADDLE_HEIGHT
  ) {
    ballSpeedX = -Math.abs(ballSpeedX);
    let hitPos = (ballY + BALL_SIZE / 2) - (rightPaddleY + PADDLE_HEIGHT / 2);
    ballSpeedY += hitPos * 0.15;
  }

  // Left / Right wall (score)
  if (ballX < 0) {
    rightScore++;
    resetBall(-1);
  }
  if (ballX > WIDTH) {
    leftScore++;
    resetBall(1);
  }
}

// AI paddle movement
function updateAI() {
  let targetY = ballY + BALL_SIZE / 2 - PADDLE_HEIGHT / 2;
  if (rightPaddleY < targetY) {
    rightPaddleY += AI_SPEED;
  } else if (rightPaddleY > targetY) {
    rightPaddleY -= AI_SPEED;
  }
  rightPaddleY = clamp(rightPaddleY, 0, HEIGHT - PADDLE_HEIGHT);
}

// Reset ball after score
function resetBall(direction) {
  ballX = WIDTH / 2 - BALL_SIZE / 2;
  ballY = HEIGHT / 2 - BALL_SIZE / 2;
  ballSpeedX = (direction >= 0 ? 1 : -1) * (5 + Math.random() * 2);
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
}

// Main game loop
function gameLoop() {
  updateBall();
  updateAI();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();