import type { BackgroundMode, LoadedImage, Offset } from "../types";

export function getImageTransform(
  image: LoadedImage,
  editorSize: number,
  zoom: number,
  offset: Offset,
) {
  const baseScale = editorSize / Math.max(image.width, image.height);
  const scale = baseScale * zoom;
  const width = image.width * scale;
  const height = image.height * scale;

  return {
    height,
    width,
    x: (editorSize - width) / 2 + offset.x,
    y: (editorSize - height) / 2 + offset.y,
  };
}

export function loadImageFile(file: File) {
  const url = URL.createObjectURL(file);

  return new Promise<LoadedImage>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        element: image,
        height: image.naturalHeight,
        name: file.name,
        url,
        width: image.naturalWidth,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image failed to load"));
    };
    image.src = url;
  });
}

export function normalizeHexColor(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

  if (!match) {
    return null;
  }

  const hex = match[1];

  if (hex.length === 3) {
    return `#${hex
      .split("")
      .map((digit) => digit + digit)
      .join("")
      .toLowerCase()}`;
  }

  return `#${hex.toLowerCase()}`;
}

export function renderFaviconPng({
  backgroundColor,
  backgroundMode,
  editorSize,
  image,
  offset,
  size,
  zoom,
}: {
  backgroundColor: string;
  backgroundMode: BackgroundMode;
  editorSize: number;
  image: LoadedImage;
  offset: Offset;
  size: number;
  zoom: number;
}) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  if (!context) {
    return Promise.reject(new Error("Canvas is not available"));
  }

  if (backgroundMode === "color") {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, size, size);
  } else {
    context.clearRect(0, 0, size, size);
  }

  const transform = getImageTransform(image, editorSize, zoom, offset);
  const ratio = size / editorSize;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image.element,
    transform.x * ratio,
    transform.y * ratio,
    transform.width * ratio,
    transform.height * ratio,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("PNG generation failed"));
      }
    }, "image/png");
  });
}
