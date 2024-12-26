import './style.css';
import {Player} from './player.ts';
import {Projectile} from './projectile.ts';
import {Enemy} from './enemy.ts';
import {distanceBetweenPoints} from './utilities.ts';
import {Particle} from './particle.ts';

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
const wastedElement: HTMLImageElement | null = document.querySelector('.wasted');
const scoreElement = document.querySelector('#score');

let player: Player;
let projectiles: Projectile[] = [];
let enemies: Enemy[] = [];
let particles: Particle[] = [];
let animationId: number;
let spawnIntervalId: number;
let countIntervalId: number;
let score: number = 0;

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

const removeProjectileByIndex = (index: number) => {
  projectiles.splice(index, 1);
};

const increaseScore = () => {
  score += 250;
  if (scoreElement) {
    scoreElement.innerHTML = score.toString();
  }
};

const checkHittingEnemy = (enemy: Enemy) => {
  projectiles.some((projectile, index) => {
    const distance = distanceBetweenPoints(projectile.currentPosition, enemy);
    if (distance - enemy.radius - projectile.radius > 0) return false;

    removeProjectileByIndex(index);
    enemy.health--;

    if (enemy.health < 1) {
      increaseScore();
      enemy.createExplosion(particles);
    }

    return true;
  });
};

const checkHittingPlayer = (enemy: Enemy) => {
  const distance = distanceBetweenPoints(player, enemy);
  return distance - enemy.radius - player.radius < 0;
};

const spawnEnemies = () => {
  let countOfSpawnEnemies = 1;

  countIntervalId = setInterval(() => countOfSpawnEnemies++, 30000);
  spawnIntervalId = setInterval(() => spawnCountEnemies(countOfSpawnEnemies), 1000);
};

const spawnCountEnemies = (count: number) => {
  for (let i = 0; i < count; i++) {
    enemies.push(new Enemy(canvas.width, canvas.height, context, player));
  }
};

const animate = () => {
  animationId = requestAnimationFrame(animate);

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (player.isImageLoaded) {
    particles = particles.filter((particle) => particle.alpha > 0);
    projectiles = projectiles.filter(projectileInsideWindow);
    enemies.forEach((enemy) => checkHittingEnemy(enemy));
    enemies = enemies.filter((enemy) => enemy.health > 0);
    const isGameOver = enemies.some(checkHittingPlayer);

    if (isGameOver) {
      if (wastedElement) {
        wastedElement.style.display = 'block';
      }
      clearInterval(countIntervalId);
      clearInterval(spawnIntervalId);
      cancelAnimationFrame(animationId);
    }

    particles.forEach((particle) => particle.update());
    projectiles.forEach((projectile) => projectile.update());
    player.update();
    enemies.forEach((enemy) => enemy.update());
  }
};

startGame();
