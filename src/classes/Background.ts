// eslint-disable-next-line import/extensions
import Sprite from './Sprite';

class Background extends Sprite {
  x: number
  y: number
  width: number
  height: number
  color: string
  
  constructor(x: number, y: number, width: number, height: number, color = '#f59a1b') {
    super(x, y, width, height, color);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export default Background;
