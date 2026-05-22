export const DEFAULT_BACKGROUND_COLOR = "#ffffff";

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
