import isShowCel from "./isShowCel";

const defaultConfig = {
  start: 1,
  volume: 10,
  isHideLast: false,
};

describe("start is 3", () => {
  const config = Object.assign({}, defaultConfig);
  config.start = 3;
  test("frame is 1, then false", () => {
    expect(isShowCel(1, config)).toBe(false);
  });
  test("frame is 2, then true", () => {
    expect(isShowCel(2, config)).toBe(true);
  });
});

describe("volume is 3", () => {
  const config = Object.assign({}, defaultConfig);
  config.volume = 3;
  test("frame is 2, then true", () => {
    expect(isShowCel(2, config)).toBe(true);
  });
  test("frame is 3, then false", () => {
    expect(isShowCel(3, config)).toBe(false);
  });
});

describe("volume is 3, isHideLast", () => {
  const config = Object.assign({}, defaultConfig);
  config.volume = 3;
  config.isHideLast = true;
  test("frame is 1, then true", () => {
    expect(isShowCel(1, config)).toBe(true);
  });
  test("frame is 2, then false", () => {
    expect(isShowCel(2, config)).toBe(false);
  });
  test("frame is 3, then false", () => {
    expect(isShowCel(3, config)).toBe(false);
  });
});
