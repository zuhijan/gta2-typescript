import './style.css';
import {Player} from './player.ts';
import {Projectile} from './projectile.ts';
import {Enemy} from './enemy.ts';
import {distanceBetweenPoints} from './utilities.ts';

const canvas = document.querySelector('canvas');
const context = canvas?.getContext('2d');

if (!canvas) {
  throw new Error('canvas not found');
}

if (!context) {
  throw new Error('Failed to get 2D context');
}

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

let player: Player;
let projectiles: Projectile[] = [];
let enemies: Enemy[] = [];

const startGame = () => {
  init();
  animate();
  spawnEnemies();
};

const init = () => {
  const movementLimits = {
    minX: 0,
    maxX: canvas.width,
    minY: 0,
    maxY: canvas.height,
  };
  player = new Player(canvas.width / 2, canvas.height / 2, context, movementLimits);
  addEventListener('click', createProjectile);
};

const createProjectile = (event: MouseEvent) => {
  const currentPosition = {x: player.x, y: player.y};
  const targetPosition = {x: event.clientX, y: event.clientY};
  projectiles.push(new Projectile(currentPosition, targetPosition, context));
};

const projectileInsideWindow = (projectile: Projectile) => {
  return (
    projectile.currentPosition.x + projectile.radius > 0 &&
    projectile.currentPosition.x - projectile.radius < canvas.width &&
    projectile.currentPosition.y + projectile.radius > 0 &&
    projectile.currentPosition.y - projectile.radius < canvas.height
  );
};

const checkHittingEnemy = (enemy: Enemy) => {
  projectiles.some((projectile) => {
    const distance = distanceBetweenPoints(projectile.currentPosition, enemy);
    if (distance - enemy.radius - projectile.radius > 0) return false;

    // removeProjctileByIndex(index);
    enemy.health--;
    return true;
  });
};

const animate = () => {
  requestAnimationFrame(animate);

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (player.isImageLoaded) {
    projectiles = projectiles.filter(projectileInsideWindow);
    enemies.forEach((enemy) => checkHittingEnemy(enemy));
    projectiles.forEach((projectile) => projectile.update());
    player.update();
    enemies.forEach((enemy) => enemy.update());
  }
};

const spawnEnemies = () => {
  enemies.push(new Enemy(canvas.width, canvas.height, context, player));
};

startGame();
