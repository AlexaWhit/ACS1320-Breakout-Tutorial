const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ballRadius = 10;
// Add a paddle
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
// Add brick variables
const brickRowCount = 4;
const brickColumnCount = 7;
const brickWidth = 52;
const brickHeight = 20;
const brickPadding = 10;
// So bricks won't start being drawn right from edge of canvas
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let color = '#0095DD';
let score = 0;
let lives = 3;

const bricks = [];
// Loop through the rows and columns and create the new bricks
// eslint-disable-next-line no-plusplus
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Func to choose random hex color for ball
function randColor() {
  return (
    `#${
      (Math.floor(Math.random() * 0x1000000) + 0x1000000)
        .toString(16)
        .substr(1)}`
  );
}

// Add two variable for storing information on whether the left or right control button
// is pressed
let rightPressed = false;
let leftPressed = false;

// When we press a key down, this information is stored in a variable. The relevant variable in
// each case is set to true. When the key is released, the variable is set back to false.
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}
// Most browsers use ArrowRight and ArrowLeft for the left/right cursor keys, but we need to
// also include Right and Left checks to support IE/Edge browsers.
function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// Update paddle position based on pointer coordinates
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// Add 2 event listeners for keydown and keyup events. We want to run some code to handle
// the paddle movement when the buttons are pressed.
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
// Add listener for mouse movement
document.addEventListener('mousemove', mouseMoveHandler, false);

// When the keydown event is fired on any of the keys on your keyboard (when they are pressed),
// the keyDownHandler() function will be executed.

// Func to detect collision bw ball and brick
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x
          && x < b.x + brickWidth
          && y > b.y
          && y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score += 1;
          // Display winning message is all bricks gone
          if (score === brickRowCount * brickColumnCount) {
            // eslint-disable-next-line no-alert
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Func to keep & update score
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#cd12de';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// Func to keep and update lives
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#FF5F1F';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    color = randColor();
  }
  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    color = randColor();
  }
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
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
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#35fc03';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Function that will draw the paddle on the screen
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight,
  );
  ctx.fillStyle = '#fc03b6';
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  // The ball should bounce right after if touches the wall,
  // not when it's already halfway in the wall, so let's adjust our
  // statements a bit to include that. When the distance between the center of the ball
  // and the edge of the wall is exactly the same as the radius of the ball, it will change
  // the movement direction. Subtracting the radius from one edge's width and adding
  // it onto the other gives us the impression of the proper collision detection —
  // the ball bounces off the walls as it should do.
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      // Decrease # of livse until 0
      // Also resest ball & paddle when player begins new life
      lives -= 1;
      if (!lives) {
        // eslint-disable-next-line no-alert
        alert('GAME OVER');
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
