import {Point} from './projectile.ts';

export const distanceBetweenPoints = (p1: Point, p2: Point) => {
  const xDiff = p1.x - p2.x;
  const yDiff = p1.y - p2.y;
  return Math.hypot(xDiff, yDiff);
};

export const cosBetweenTwoPoints = (p1: Point, p2: Point) => {
  const xDiff = p1.x - p2.x;
  return xDiff / distanceBetweenPoints(p1, p2);
};

export const sinBetweenTwoPoints = (p1: Point, p2: Point) => {
  const yDiff = p1.y - p2.y;
  return yDiff / distanceBetweenPoints(p1, p2);
};
