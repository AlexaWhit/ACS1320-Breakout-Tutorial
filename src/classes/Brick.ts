// eslint-disable-next-line import/extensions
import Sprite from './Sprite';

class Brick extends Sprite {
  x: number
  y: number
  width: number
  height: number
  color: string
  status: boolean
  
  constructor(x: number, y: number, width = 55, height = 20, color = '#0095DD') {
    super(x, y, width, height, color); // pass arguments to Sprite!
    this.status = true; // adds a new property
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = '#35fc03';
    ctx.fill();
    ctx.closePath();
  }
}

export default Brick;
