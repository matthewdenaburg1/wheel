/**
 * Generates an HSL color string.
 * @param angle The angle for the hue.
 * @returns An HSL color string.
 */
export const getHslColor = (angle: number): string => {
  return `hsl(${Math.floor(angle)}, 100%, 45%)`;
};

/**
 * Determines if a given HSL color is "dark".
 * @param hslColor The HSL color string.
 * @returns True if the color is dark, false otherwise.
 * @see https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
 */
export const isColorDark = (hslColor: string): boolean => {
  const hsl = hslColor.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%/);
  if (!hsl) {
    return false; // Default to not dark if parsing fails
  }

  const h = parseInt(hsl[1], 10);
  const s = parseInt(hsl[2], 10) / 100;
  const l = parseInt(hsl[3], 10) / 100;

  // Simplified HSP calculation for HSL
  const r = l + s * Math.min(l, 1 - l) * Math.cos((h - 0) / 30);
  const g = l + s * Math.min(l, 1 - l) * Math.cos((h - 120) / 30);
  const b = l + s * Math.min(l, 1 - l) * Math.cos((h - 240) / 30);

  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  return hsp <= 0.5;
};
