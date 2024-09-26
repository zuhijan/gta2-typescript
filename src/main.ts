import './style.css';
import {Player} from './player.ts';

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

let player = new Player(canvas.width / 2, canvas.height / 2, context);

const animate = () => {
  requestAnimationFrame(animate);

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (player.isImageLoaded) {
    player.drawImage();
  }
};

animate();
