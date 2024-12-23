import playerImage from './assets/player.png';

enum KEY_CODES {
  ARROW_UP = 'ArrowUp',
  KEY_W = 'KeyW',
  ARROW_DOWN = 'ArrowDown',
  KEY_S = 'KeyS',
  ARROW_LEFT = 'ArrowLeft',
  KEY_A = 'KeyA',
  ARROW_RIGHT = 'ArrowRight',
  KEY_D = 'KeyD',
}

type MoveDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const MOVE_KEYS_CODES: Record<MoveDirection, KEY_CODES[]> = {
  UP: [KEY_CODES.ARROW_UP, KEY_CODES.KEY_W],
  DOWN: [KEY_CODES.ARROW_DOWN, KEY_CODES.KEY_S],
  LEFT: [KEY_CODES.ARROW_LEFT, KEY_CODES.KEY_A],
  RIGHT: [KEY_CODES.ARROW_RIGHT, KEY_CODES.KEY_D],
} as const;

const ALL_MOVE_KEY_CODES = Object.values(MOVE_KEYS_CODES).flat();

export class Player {
  image: HTMLImageElement;
  imageWidth: number = 50;
  imageHeight: number = 50;
  isImageLoaded: boolean = false;
  cursorPosition: {x: number; y: number} = {
    x: 0,
    y: 0,
  };
  keyMap: Map<string, boolean>;
  velocity: number = 3;
  isMoving: boolean = false;
  imageTick: number = 0;
  radius: number = 15;

  constructor(
    public x: number = 0,
    public y: number = 0,
    public context: CanvasRenderingContext2D,
    public movementLimits: {
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    },
  ) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.movementLimits = {
      minX: movementLimits.minX + this.radius,
      maxX: movementLimits.maxX - this.radius,
      minY: movementLimits.minY + this.radius,
      maxY: movementLimits.maxY - this.radius,
    };

    document.addEventListener('mousemove', (event) => {
      this.cursorPosition.x = event.clientX;
      this.cursorPosition.y = event.clientY;
    });

    this.keyMap = new Map();
    document.addEventListener('keydown', (event) => {
      this.keyMap.set(event.code, true);
    });
    document.addEventListener('keyup', (event) => {
      this.keyMap.delete(event.code);
    });

    this.image = new Image();
    this.image.src = playerImage;

    this.image.onload = () => {
      this.isImageLoaded = true;
      this.drawImage(); // Можно сразу нарисовать изображение после загрузки
    };

    this.image.onerror = () => {
      console.error('Failed to load the image');
    };
  }

  drawImage() {
    if (!this.isImageLoaded) {
      console.warn('Image not loaded yet');
      return; // Если изображение не загружено, просто выходим
    }
    const imageTickLimit = 18;
    let subX;
    if (!this.isMoving) {
      subX = 0;
      this.imageTick = 0;
    } else {
      subX = this.imageTick > imageTickLimit ? this.imageWidth * 2 : this.imageWidth;
      this.imageTick++;
    }

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
    let angle = Math.atan2(this.cursorPosition.y - this.y, this.cursorPosition.x - this.x);
    this.context.translate(this.x, this.y);
    this.context.rotate(angle + Math.PI / 2);
    this.context.translate(-this.x, -this.y);
    this.drawImage();
    this.context.restore();
  }

  update() {
    this.draw();
    this.isMoving = this.shouldMove(ALL_MOVE_KEY_CODES);
    this.updatePosition();
    this.checkPositionLimitAndUpdate();
  }

  updatePosition() {
    if (this.shouldMove(MOVE_KEYS_CODES.UP)) this.y -= this.velocity;
    if (this.shouldMove(MOVE_KEYS_CODES.DOWN)) this.y += this.velocity;
    if (this.shouldMove(MOVE_KEYS_CODES.LEFT)) this.x -= this.velocity;
    if (this.shouldMove(MOVE_KEYS_CODES.RIGHT)) this.x += this.velocity;
  }

  checkPositionLimitAndUpdate() {
    if (this.x < this.movementLimits.minX) this.x = this.movementLimits.minX;
    if (this.x > this.movementLimits.maxX) this.x = this.movementLimits.maxX;
    if (this.y < this.movementLimits.minY) this.y = this.movementLimits.minY;
    if (this.y > this.movementLimits.maxY) this.y = this.movementLimits.maxY;
  }

  shouldMove(keys: KEY_CODES[]) {
    return keys.some((key) => this.keyMap.get(key));
  }
}
