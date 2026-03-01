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

  const h = parseInt(hsl[1]);
  const s = parseInt(hsl[2]) / 100;
  const l = parseInt(hsl[3]) / 100;

  const {r, g, b} = hslToRgb(h, s, l);
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  return hsp <= 127.5;
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  // chroma
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hPrime = h / 60;
  // intermediate value
  const x = c * (1 - Math.abs(hPrime % 2 - 1));
  // match lightness
  const m = l - c / 2;

  let r: number = 0,
      g: number = 0,
      b: number = 0;
  if (hPrime <= 1) {
    r = c;
    g = x;
  }
  else if (hPrime <= 2) {
    r = x;
    g = c;
  }
  else if (hPrime <= 3) {
    g = c;
    b = x;
  }
  else if (hPrime <= 4) {
    g = x;
    b = c;
  }
  else if (hPrime <= 5) {
    r = x;
    b = c;
  }
  else if (hPrime <= 6) {
    r = c;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
};
