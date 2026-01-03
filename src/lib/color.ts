import { BackgroundStyle, backgroundTextures } from "@/types/businessCard";

type RGB = { r: number; g: number; b: number };

const clamp255 = (n: number) => Math.max(0, Math.min(255, n));

export const hexToRgb = (hex: string): RGB | null => {
  const normalized = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(normalized)) return null;

  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b };
};

export const rgbToHex = ({ r, g, b }: RGB): string => {
  const toHex = (n: number) => clamp255(Math.round(n)).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const srgbToLinear = (v: number) => {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

export const relativeLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  const R = srgbToLinear(rgb.r);
  const G = srgbToLinear(rgb.g);
  const B = srgbToLinear(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

export const contrastRatio = (hexA: string, hexB: string): number => {
  const L1 = relativeLuminance(hexA);
  const L2 = relativeLuminance(hexB);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const extractHexColors = (css: string): string[] => {
  const matches = css.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
  return matches ? matches.map((m) => m.toLowerCase()) : [];
};

export const averageHex = (hexes: string[]): string | null => {
  const rgbs = hexes
    .map(hexToRgb)
    .filter((v): v is RGB => Boolean(v));
  if (!rgbs.length) return null;

  const sum = rgbs.reduce(
    (acc, cur) => ({ r: acc.r + cur.r, g: acc.g + cur.g, b: acc.b + cur.b }),
    { r: 0, g: 0, b: 0 }
  );
  return rgbToHex({ r: sum.r / rgbs.length, g: sum.g / rgbs.length, b: sum.b / rgbs.length });
};

export const getBackgroundSampleHex = (background: BackgroundStyle): string => {
  if (background.texture === "custom-photo") {
    // We don't have a reliable average color for user photos.
    return "#ffffff";
  }

  const texture = backgroundTextures.find((t) => t.value === background.texture);
  if (!texture) return "#ffffff";

  const preview = texture.preview;
  if (preview.trim().startsWith("#")) return preview;

  const hexes = extractHexColors(preview);
  return averageHex(hexes) ?? "#ffffff";
};

export const pickBestTextColor = (backgroundHex: string, candidates: string[]) => {
  if (!candidates.length) return "#000000";
  return candidates.reduce((best, cur) =>
    contrastRatio(cur, backgroundHex) > contrastRatio(best, backgroundHex) ? cur : best
  );
};

export const filterReadableColors = (
  backgroundHex: string,
  colors: string[],
  minContrast = 4.5
): string[] => {
  return colors
    .filter((c) => contrastRatio(c, backgroundHex) >= minContrast)
    .sort((a, b) => contrastRatio(b, backgroundHex) - contrastRatio(a, backgroundHex));
};
