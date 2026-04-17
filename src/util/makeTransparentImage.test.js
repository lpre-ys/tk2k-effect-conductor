import { normalize5Bit, normalize6Bit } from "./makeTransparentImage";

describe("normalize5Bit", () => {
  test("0 → 0", () => {
    expect(normalize5Bit(0)).toBe(0);
  });
  test("255 → 255", () => {
    expect(normalize5Bit(255)).toBe(255);
  });
  test("128 → 132（量子化誤差あり）", () => {
    expect(normalize5Bit(128)).toBe(132);
  });
  test("8 → 8（5bit境界値はそのまま）", () => {
    expect(normalize5Bit(8)).toBe(8);
  });
});

describe("normalize6Bit", () => {
  test("0 → 0", () => {
    expect(normalize6Bit(0)).toBe(0);
  });
  test("255 → 255", () => {
    expect(normalize6Bit(255)).toBe(255);
  });
  test("128 → 130（量子化誤差あり）", () => {
    expect(normalize6Bit(128)).toBe(130);
  });
  test("4 → 4（6bit境界値はそのまま）", () => {
    expect(normalize6Bit(4)).toBe(4);
  });
});
