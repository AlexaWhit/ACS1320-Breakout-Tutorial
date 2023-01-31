// eslint-disable-next-line import/extensions
import Brick from './Brick.js';

class Bricks {
  constructor(rows = 4, cols = 6) {
    this.rows = rows;
    this.cols = cols;
    this.bricks = [];
    this.brickWidth = 65;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffset = 25;
    this.setup();
  }

  setup() {
    for (let c = 0; c < this.cols; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        const brickX = (c * (this.brickWidth + this.brickPadding)) + this.brickOffset;
        const brickY = (r * (this.brickHeight + this.brickPadding)) + this.brickOffset;
        this.bricks[c][r] = new Brick(brickX, brickY);
      }
    }
  }

  render(ctx) {
    for (let c = 0; c < this.cols; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        const brick = this.bricks[c][r];
        if (this.bricks[c][r].status === true) {
          brick.render(ctx);
        }
      }
    }
  }
}

export default Bricks;
