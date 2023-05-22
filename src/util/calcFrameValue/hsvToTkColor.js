import chroma from "chroma-js";

export default function hsvToTkColor(hue, sat, val, min, max) {
  const [r, g, b] = chroma.hsv([hue, sat / 100, val / 100]).rgb();
  const red = valueToRate(min, max, r);
  const green = valueToRate(min, max, g);
  const blue = valueToRate(min, max, b);

  return { red, green, blue };
}

function valueToRate(min, max, value) {
  const range = max - min;
  value = parseInt(value);
  return Math.round((value / 255) * range) + min;
}
