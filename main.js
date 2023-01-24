import Ball from './Ball.js';
import Brick from './Brick.js';
import Lives from './Lives.js';
import Paddle from './Paddle.js';
import Score from './Score.js';
import Background from './Background.js';

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
const brickWidth = 52;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Loop through the rows and columns and create the new bricks
// Array of columns and rows of bricks
const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Score variable (start with 0)
const score = 0;

// Lives variable (start with 3)
const lives = 3;

// Instances of new objects
const ball = new Ball('red', x, y);
const paddle = new Paddle(paddleX, canvas.height - 10);
const trackScore = new Score(8, 20, score);
const trackLives = new Lives(canvas.width - 65, 20, lives);
const background = new Background(0, 0, canvas.width, canvas.height);

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
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      const { x: brickX, y: brickY, status } = b;
      if (status === 1) {
        if (
          ball.x > brickX
          && ball.x < brickX + brickWidth
          && ball.y > brickY
          && ball.y < brickY + brickHeight
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          trackScore.score += 1;
          ball.randColor();
          // Display winning message is all bricks gone
          if (trackScore.score === brickRowCount * brickColumnCount) {
            // eslint-disable-next-line no-alert
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Func to loop through all bricks in array and draw
// them on the screen
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      // if status is 1, draw it, but if 0 then it was hit by bll
      if (bricks[c][r].status === 1) {
        // Each brick can be placed in its correct place row and column, with
        // padding bw each brick, drawn at an offset from the L and top canvas edges
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        const brick = new Brick(brickX, brickY);
        brick.render(ctx);
      }
    }
  }
}

// Func to draw all parts of the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.render(ctx);
  drawBricks();
  ball.render(ctx);
  ball.move();
  paddle.render(ctx);
  trackScore.render(ctx);
  trackLives.render(ctx);
  collisionDetection();
  // The ball should bounce right after if touches the wall,
  // not when it's already halfway in the wall, so let's adjust our
  // statements a bit to include that. When the distance between the center of the ball
  // and the edge of the wall is exactly the same as the radius of the ball, it will change
  // the movement direction. Subtracting the radius from one edge's width and adding
  // it onto the other gives us the impression of the proper collision detection —
  // the ball bounces off the walls as it should do.
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
      trackLives.lives -= 1;
      if (!trackLives.lives) {
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
