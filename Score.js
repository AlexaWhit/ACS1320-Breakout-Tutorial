class Score {
  constructor(x, y, score = 0, color = '#03fcf8', font = '16px Arial') {
    this.x = x;
    this.y = y;
    this.score = score;
    this.color = color;
    this.font = font;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Score: ${this.score}`, this.x, this.y);
  }
}
export default Score;
