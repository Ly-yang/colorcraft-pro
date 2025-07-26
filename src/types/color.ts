export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface ColorFormat {
  hex: string;
  rgb: RGBColor;
  hsl: HSLColor;
}

export type PaletteType = 'complementary' | 'triadic' | 'monochromatic' | 'analogous' | 'tetradic';

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  type: PaletteType;
  createdAt: Date;
}

export interface ColorHistory {
  color: string;
  timestamp: Date;
}
