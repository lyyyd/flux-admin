import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const filePath = resolve("app", "theme.css");
let content = readFileSync(filePath, "utf8");

const hslRegex =
  /hsl\(\s*([0-9]+(?:\.[0-9]+)?)\s+([0-9]+(?:\.[0-9]+)?)%\s+([0-9]+(?:\.[0-9]+)?)%\s*\)/g;

const toLinear = (c) => {
  if (c <= 0.04045) {
    return c / 12.92;
  }
  return ((c + 0.055) / 1.055) ** 2.4;
};

const cbrt = (value) => {
  return value < 0 ? -Math.cbrt(-value) : Math.cbrt(value);
};

const hslToRgb = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hPrime = (h % 360) / 60;
  const x = c * (1 - Math.abs((hPrime % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hPrime >= 0 && hPrime < 1) {
    r1 = c;
    g1 = x;
  } else if (hPrime >= 1 && hPrime < 2) {
    r1 = x;
    g1 = c;
  } else if (hPrime >= 2 && hPrime < 3) {
    g1 = c;
    b1 = x;
  } else if (hPrime >= 3 && hPrime < 4) {
    g1 = x;
    b1 = c;
  } else if (hPrime >= 4 && hPrime < 5) {
    r1 = x;
    b1 = c;
  } else if (hPrime >= 5 && hPrime < 6) {
    r1 = c;
    b1 = x;
  }

  const m = l - c / 2;

  return [r1 + m, g1 + m, b1 + m];
};

const rgbToOklch = (r, g, b) => {
  const rl = toLinear(r);
  const gl = toLinear(g);
  const bl = toLinear(b);

  const l = 0.412165612 * rl + 0.536275208 * gl + 0.0514575653 * bl;
  const m = 0.211859107 * rl + 0.6807189584 * gl + 0.107406579 * bl;
  const s = 0.0883097947 * rl + 0.2818474174 * gl + 0.6302613616 * bl;

  const l_ = cbrt(l);
  const m_ = cbrt(m);
  const s_ = cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  let h = Math.atan2(b_, a) * (180 / Math.PI);
  if (h < 0) {
    h += 360;
  }

  return [L, C, h];
};

content = content.replace(hslRegex, (match, h, s, l) => {
  const [r, g, b] = hslToRgb(
    parseFloat(h),
    parseFloat(s) / 100,
    parseFloat(l) / 100
  );
  const [L, C, H] = rgbToOklch(r, g, b);
  const format = (val, digits) => Number(val.toFixed(digits)).toString();
  const LFormatted = format(L, 4);
  const CFormatted = format(C, 4);
  const HFormatted = format(H, 1);
  return `oklch(${LFormatted} ${CFormatted} ${HFormatted})`;
});

writeFileSync(filePath, content);
console.log("Converted HSL values to OKLCH in", filePath);
