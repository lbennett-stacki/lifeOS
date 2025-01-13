export class Rgb {
  constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number,
  ) {}

  toCssString() {
    const args = [this.r, this.g, this.b];
    return `rgb(${args.join(',')})`;
  }

  static hexToRgb(hex: string) {
    const hexValue = hex.replace('#', '');
    const r = parseInt(hexValue.substring(0, 2), 16);
    const g = parseInt(hexValue.substring(2, 4), 16);
    const b = parseInt(hexValue.substring(4, 6), 16);

    return new Rgb(r, g, b);
  }
}

export class Rgba extends Rgb {
  constructor(
    r: number,
    b: number,
    g: number,
    public readonly a: number,
  ) {
    super(r, g, b);
  }

  toCssString() {
    const args = [this.r, this.g, this.b, this.a];
    return `rgb(${args.join(',')})`;
  }

  static rgbToRgba(rgb: Rgb, a: number) {
    return new Rgba(rgb.r, rgb.g, rgb.b, a);
  }

  static hexToRgba(hex: string, a: number) {
    const rgb = Rgb.hexToRgb(hex);

    return Rgba.rgbToRgba(rgb, a);
  }
}
