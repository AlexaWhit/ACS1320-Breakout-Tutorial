class Lives {
  constructor(x, y, lives = 0, color = '#03fcf8', font = '16px Arial') {
    this.x = x;
    this.y = y;
    this.lives = lives;
    this.color = color;
    this.font = font;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Lives: ${this.lives}`, this.x, this.y);
  }
}
export default Lives;
