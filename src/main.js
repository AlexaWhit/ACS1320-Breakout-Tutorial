/* eslint-disable import/extensions */
import Background from './classes/Background.js';
import Ball from './classes/Ball.js';
import Bricks from './classes/Bricks.js';
import GameLabel from './classes/GameLabel.js';
import Paddle from './classes/Paddle.js';

// Game is rendered on HTML <canvas>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const x = canvas.width / 2;
const y = canvas.height - 30;

// Keep track of ball touching wall/bricks by tracking radius
const ballRadius = 10;

// Paddle variables
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Brick variables
const brickRowCount = 4;
const brickColumnCount = 7;

// Score variable (start with 0)
const score = 0;

// Lives variable (start with 3)
const lives = 3;

// Instances of new objects
const ball = new Ball('pink', x, y);
const paddle = new Paddle(paddleX, canvas.height - 10);
const trackScore = new GameLabel(8, 20, 'Score: ', score);
const trackLives = new GameLabel(canvas.width - 65, 20, 'Lives: ', lives);
const background = new Background(0, 0, canvas.width, canvas.height);
const gameBricks = new Bricks();

// Add two variable for storing information on whether the left or right control button is pressed
let rightPressed = false;
let leftPressed = false;

// When we press a key down, this information is stored in a variable. The relevant variable in
// each case is set to true. When the key is released, the variable is set back to false.
function keyDownHandler({ key }) {
  if (key === 'Right' || key === 'ArrowRight') {
    rightPressed = true;
  } else if (key === 'Left' || key === 'ArrowLeft') {
    leftPressed = true;
  }
}
// Most browsers use ArrowRight and ArrowLeft for the left/right cursor keys, but we need to
// also include Right and Left checks to support IE/Edge browsers.
function keyUpHandler({ key }) {
  if (key === 'Right' || key === 'ArrowRight') {
    rightPressed = false;
  } else if (key === 'Left' || key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// Update paddle position based on pointer coordinates
function mouseMoveHandler({ clientX }) {
  const relativeX = clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.moveBy(relativeX - paddleWidth / 2);
  }
}

const { addEventListener } = document;

addEventListener('keydown', keyDownHandler, false);
addEventListener('keyup', keyUpHandler, false);
addEventListener('mousemove', mouseMoveHandler, false);

// Func to move the paddle
function paddleMove() {
  if (rightPressed && paddle.x < canvas.width - paddleWidth) {
    paddle.moveTo(7);
  } else if (leftPressed && paddle.x > 0) {
    paddle.moveTo(-7);
  }
}

// Func to detect collision bw ball and brick
function collisionDetection() {
  for (let c = 0; c < gameBricks.cols; c += 1) {
    for (let r = 0; r < gameBricks.rows; r += 1) {
      const b = gameBricks.bricks[c][r];
      if (b.status === true) {
        if (
          ball.x > b.x
          && ball.x < b.x + gameBricks.brickWidth
          && ball.y > b.y
          && ball.y < b.y + gameBricks.brickHeight
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          trackScore.value += 1;
          ball.randColor();
          // Display winning message is all bricks gone
          if (trackScore.value === brickRowCount * brickColumnCount) {
            // eslint-disable-next-line no-alert
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Func to draw all parts of the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.render(ctx);
  gameBricks.render(ctx);
  ball.render(ctx);
  ball.moveTo();
  paddle.render(ctx);
  trackScore.render(ctx);
  trackLives.render(ctx);
  collisionDetection();
  if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
    ball.dx = -ball.dx;
    ball.randColor();
  }
  if (ball.y + ball.dy < ballRadius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ballRadius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
      ball.randColor();
    } else {
      // Decrease # of lives until 0
      // Also resest ball & paddle when player begins new life
      trackLives.value -= 1;
      if (!trackLives.value) {
        // eslint-disable-next-line no-alert
        alert('GAME OVER');
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = 2;
        ball.dy = -2;
        paddleX = (canvas.width - paddle.width) / 2;
      }
    }
  }
  paddleMove();
  requestAnimationFrame(draw);
}

draw();
