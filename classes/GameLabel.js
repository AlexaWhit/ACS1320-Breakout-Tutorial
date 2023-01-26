// eslint-disable-next-line import/extensions
import Sprite from './Sprite.js';

class GameLabel extends Sprite {
  constructor(x, y, text, value, color = '#03fcf8', font = '16px Arial') {
    // call super with properties as you would initialize sprite
    super(x, y, 0, 0, color);
    // define the new properties here on this: this.text and this.font
    this.text = text;
    this.color = color;
    this.value = value;
    this.font = font;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.fillText(`${this.text}${this.value}`, this.x, this.y);
  }
}

export default GameLabel;
