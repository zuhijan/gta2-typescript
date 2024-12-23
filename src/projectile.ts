import {cosBetweenTwoPoints, sinBetweenTwoPoints} from './utilities.ts';

export type Point = {x: number; y: number};

export class Projectile {
  radius: number = 3;
  color: string = '#810000';
  velocity: Point;

  constructor(
    public currentPosition: Point,
    public targetPosition: Point,
    public context: CanvasRenderingContext2D,
  ) {
    this.currentPosition = currentPosition;
    this.targetPosition = targetPosition;
    this.context = context;

    this.velocity = {
      x: cosBetweenTwoPoints(targetPosition, currentPosition) * 15,
      y: sinBetweenTwoPoints(targetPosition, currentPosition) * 15,
    };
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, Math.PI * 2);
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  update() {
    this.draw();
    this.currentPosition.x += this.velocity.x;
    this.currentPosition.y += this.velocity.y;
  }
}
