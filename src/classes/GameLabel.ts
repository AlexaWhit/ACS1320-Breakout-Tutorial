// eslint-disable-next-line import/extensions
import Sprite from './Sprite';

class GameLabel extends Sprite {
  x: number
  y: number
  text: string
  value: number
  color: string
  font: string
  align: string

  constructor(x: number, y: number, text: string, value: number, color = '#03fcf8', font = '16px Arial') {
    // call super with properties as you would initialize sprite
    super(x, y, 0, 0, color);
    // define the new properties here on this: this.text and this.font
    this.text = text;
    this.color = color;
    this.value = value;
    this.font = font;
  }

  render(ctx: any) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.fillText(`${this.text}${this.value}`, this.x, this.y);
  }
}

export default GameLabel;
