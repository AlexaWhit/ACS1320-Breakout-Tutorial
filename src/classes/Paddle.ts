// eslint-disable-next-line import/extensions
import Sprite from './Sprite';

class Paddle extends Sprite {
  dx: number
  x: number
  y: number
  width: number
  height: number
  color: string

  constructor(x: number, y: number, width: number = 75, height = 10, color = '#fc03b6') {
    super(x, y, width, height, color);
  }

  moveTo(dx: number) {
    this.x += dx;
  }

  moveBy(x: number) {
    this.x = x;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export default Paddle;
