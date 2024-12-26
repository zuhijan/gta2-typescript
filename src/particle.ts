export class Particle {
  radius: number = Math.random() + 2;
  color: string = '#920101';
  velocity = {
    x: (Math.random() - 0.5) * Math.random() * 5,
    y: (Math.random() - 0.5) * Math.random() * 5,
  };
  alpha = 1;
  friction = 0.99;

  constructor(
    public x: number,
    public y: number,
    public context: CanvasRenderingContext2D,
  ) {
    this.x = x;
    this.y = y;
    this.context = context;
  }

  draw() {
    this.context.save();
    this.context.globalAlpha = this.alpha;
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.04;
  }
}
