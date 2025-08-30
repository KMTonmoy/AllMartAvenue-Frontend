import { PixelCrop } from '@/types/image-crop';

export const canvasPreview = (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  rotation = 0,
) => {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotation * Math.PI / 180;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // Move to the center of the image
  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
  ctx.rotate(rotateRads);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.restore();
};