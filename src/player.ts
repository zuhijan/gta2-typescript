import playerImage from './assets/player.png';

export class Player {
  image: HTMLImageElement;
  imageWidth: number;
  imageHeight: number;
  isImageLoaded: boolean = false;

  constructor(
    public x: number = 0,
    public y: number = 0,
    public context: CanvasRenderingContext2D,
  ) {
    this.x = x;
    this.y = y;
    this.context = context;

    this.image = new Image();
    this.image.src = playerImage;
    this.imageWidth = 50;
    this.imageHeight = 50;

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

    this.context.drawImage(
      this.image,
      0,
      0,
      this.imageWidth,
      this.imageHeight,
      this.x - this.imageWidth / 2,
      this.y - this.imageHeight / 2,
      this.imageWidth,
      this.imageHeight,
    );
  }
}
