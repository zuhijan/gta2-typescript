import {Player} from './player.ts';
import enemyOne from './assets/enemy_1.png';
import enemyTwo from './assets/enemy_2.png';
import {cosBetweenTwoPoints, sinBetweenTwoPoints} from './utilities.ts';
import {Point} from './projectile.ts';

export class Enemy {
  radius: number = 15;
  x: number = 0;
  y: number = 0;
  image: HTMLImageElement;
  imageWidth: number = 50;
  imageHeight: number = 60;
  imageTick: number = 0;
  velocity?: Point;
  health: number = 1;

  constructor(
    public canvasWidth: number,
    public canvasHeight: number,
    public context: CanvasRenderingContext2D,
    public player: Player,
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.context = context;
    this.player = player;

    if (Math.random() < 0.5) {
      this.x = Math.random() < 0.5 ? 0 - this.radius : canvasWidth + this.radius;
      this.y = Math.random() * canvasHeight;
    } else {
      this.x = Math.random() * canvasWidth;
      this.x = Math.random() < 0.5 ? 0 - this.radius : canvasHeight + this.radius;
    }

    this.image = new Image();
    this.image.src = Math.random() < 0.5 ? enemyOne : enemyTwo;
  }

  drawImg() {
    const imageTickLimit = 18;
    const subX = this.imageTick > imageTickLimit ? this.imageWidth : 0;
    this.imageTick++;
    if (this.imageTick > imageTickLimit * 2) this.imageTick = 0;

    this.context.drawImage(
      this.image,
      subX,
      0,
      this.imageWidth,
      this.imageHeight,
      this.x - this.imageWidth / 2,
      this.y - this.imageHeight / 2,
      this.imageWidth,
      this.imageHeight,
    );
  }

  draw() {
    this.context.save();
    let angle = Math.atan2(this.player.y - this.y, this.player.x - this.x);
    this.context.translate(this.x, this.y);
    this.context.rotate(angle + Math.PI / 2);
    this.context.translate(-this.x, -this.y);
    this.drawImg();
    this.context.restore();
  }

  update() {
    this.draw();
    this.velocity = {
      x: cosBetweenTwoPoints({x: this.player.x, y: this.player.y}, {x: this.x, y: this.y}) * 2,
      y: sinBetweenTwoPoints({x: this.player.x, y: this.player.y}, {x: this.x, y: this.y}) * 2,
    };
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
