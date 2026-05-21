export const FAVICON_SIZES = [16, 32, 48] as const;

export const FAVICON_PACK_IMAGES = [
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
] as const;

export const DEFAULT_COLOR = "#ffffff";

export const SUPPORTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);
