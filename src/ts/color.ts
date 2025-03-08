/**
 * Represents a color.
 */
class Color {
  private colorString: string;

  /**
   * Create a new color.
   * @param {string} color the color - hex or rgb.
   */
  constructor(color: string) {
    this.colorString = color;
  }

  fromRGB(color: string): string {
    const rgb = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    let r: number,
        g: number,
        b: number;
    r = parseInt(rgb[1]);
    g = parseInt(rgb[2]);
    b = parseInt(rgb[3]);

    return Color.fromRGBHelper(r, g, b);
  }

  /**
   * Convert HSL color to RGB.
   * @param {string} color - The HSL color string.
   * @returns {string} The RGB color string.
   * @see https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
   */
  fromHSL(color: string): string {
    const hsl = color.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%/);
    const h = parseInt(hsl[1]);
    const s = parseInt(hsl[2]) / 100;
    const l = parseInt(hsl[3]) / 100;

    // chroma
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hPrime = h / 60;
    // intermediate value
    const x = c * (1 - Math.abs(hPrime % 2 - 1));
    // match lightness
    const m = l - c / 2;

    let r: number,
        g: number,
        b: number;
    if (hPrime <= 1) {
      r = c;
      g = x;
      b = 0;
    }
    else if (hPrime <= 2) {
      r = x;
      g = c;
      b = 0;
    }
    else if (hPrime <= 3) {
      r = 0;
      g = c;
      b = x;
    }
    else if (hPrime <= 4) {
      r = 0;
      g = x;
      b = c;
    }
    else if (hPrime <= 5) {
      r = x;
      g = 0;
      b = c;
    }
    else if (hPrime <= 6) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return Color.fromRGBHelper(r, g, b);
  }

  toString(): string {
    return this.colorString;
  }

  /**
   * Determine if this color could be considered "dark".
   * @returns True if the color is dark, false otherwise.
   * @see https://alienryderflex.com/hsp.html
   * @see https://awik.io/determine-color-bright-dark-using-javascript/
   */
  get isDark(): boolean {
    const rgb = parseInt(this.colorString.slice(1), 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;

    const hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    return hsp <= 127.5;
  }

  static fromRGBHelper(red: number, green: number, blue: number): string {
    const colorString = [red, green, blue].map((color) => {
      return ('0' + color.toString(16)).slice(-2);
    }).join('').toUpperCase();

    return `#${colorString}`;
  }
}

export default Color;
