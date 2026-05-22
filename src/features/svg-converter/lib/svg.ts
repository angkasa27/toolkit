import type { LoadedSvg, OutputFormat, SvgDimensions } from "../types";

const MAX_DIMENSION = 8192;
const MIN_DIMENSION = 1;
const FALLBACK_DIMENSIONS: SvgDimensions = {
  height: 512,
  width: 512,
};

export function clampDimension(value: number) {
  if (!Number.isFinite(value)) {
    return MIN_DIMENSION;
  }

  return Math.min(MAX_DIMENSION, Math.max(MIN_DIMENSION, Math.round(value)));
}

export function getAspectRatio(dimensions: SvgDimensions) {
  return dimensions.width / dimensions.height;
}

export function getHeightFromWidth(width: number, ratio: number) {
  return clampDimension(width / ratio);
}

export function getWidthFromHeight(height: number, ratio: number) {
  return clampDimension(height * ratio);
}

export async function loadSvgFile(file: File) {
  if (file.type && file.type !== "image/svg+xml") {
    throw new Error("Use an SVG file.");
  }

  if (!file.name.toLowerCase().endsWith(".svg")) {
    throw new Error("Use an SVG file.");
  }

  const text = await file.text();
  const dimensions = parseSvgDimensions(text);
  const url = createSvgObjectUrl(text);

  return {
    dimensions,
    fileName: file.name,
    text,
    url,
  } satisfies LoadedSvg;
}

export function parseSvgDimensions(text: string): SvgDimensions {
  const document = new DOMParser().parseFromString(text, "image/svg+xml");
  const parserError = document.querySelector("parsererror");
  const svg = document.documentElement;

  if (parserError || svg.nodeName.toLowerCase() !== "svg") {
    throw new Error("That file is not a valid SVG.");
  }

  const width = parseSvgLength(svg.getAttribute("width"));
  const height = parseSvgLength(svg.getAttribute("height"));

  if (width && height) {
    return { height, width };
  }

  const viewBox = parseViewBox(svg.getAttribute("viewBox"));

  if (viewBox) {
    return viewBox;
  }

  return FALLBACK_DIMENSIONS;
}

export function createSvgObjectUrl(text: string) {
  return URL.createObjectURL(
    new Blob([text], {
      type: "image/svg+xml;charset=utf-8",
    }),
  );
}

export async function renderSvgToBlob({
  backgroundColor,
  format,
  height,
  svgText,
  transparent,
  width,
}: {
  backgroundColor: string;
  format: OutputFormat;
  height: number;
  svgText: string;
  transparent: boolean;
  width: number;
}) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = clampDimension(width);
  canvas.height = clampDimension(height);

  if (!context) {
    throw new Error("Canvas is not available.");
  }

  const imageUrl = createSvgObjectUrl(svgText);

  try {
    const image = await loadImage(imageUrl);
    const hasTransparentBackground = format === "png" && transparent;

    if (hasTransparentBackground) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await canvasToBlob(
      canvas,
      format === "png" ? "image/png" : "image/jpeg",
      format === "jpg" ? 0.92 : undefined,
    );
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export function getDownloadName(fileName: string, format: OutputFormat) {
  const baseName = fileName
    .replace(/\.svg$/i, "")
    .trim()
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "converted"}.${format}`;
}

function parseSvgLength(value: string | null) {
  if (!value || value.trim().endsWith("%")) {
    return null;
  }

  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseViewBox(value: string | null): SvgDimensions | null {
  if (!value) {
    return null;
  }

  const parts = value
    .trim()
    .split(/[\s,]+/)
    .map((part) => Number.parseFloat(part));

  const width = parts[2];
  const height = parts[3];

  if (
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width > 0 &&
    height > 0
  ) {
    return { height, width };
  }

  return null;
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not render that SVG."));
    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Could not export the image."));
        }
      },
      type,
      quality,
    );
  });
}
