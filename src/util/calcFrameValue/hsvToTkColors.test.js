import hsvToTkColor from "./hsvToTkColor";

describe("white(MAX)", () => {
  test("max 100, then return 100, 100, 100", () => {
    const result = hsvToTkColor(0, 0, 100, 0, 100);
    expect(result).toEqual({ red: 100, green: 100, blue: 100 });
  });
  test("max 200, then return 200, 200, 200", () => {
    const result = hsvToTkColor(0, 0, 100, 0, 200);
    expect(result).toEqual({ red: 200, green: 200, blue: 200 });
  });
  test("max 0, then return 0, 0, 0", () => {
    const result = hsvToTkColor(0, 0, 100, 0, 0);
    expect(result).toEqual({ red: 0, green: 0, blue: 0 });
  });
});

describe("black(MIN)", () => {
  test("min 0, then return 0, 0, 0", () => {
    const result = hsvToTkColor(0, 0, 0, 0, 200);
    expect(result).toEqual({ red: 0, green: 0, blue: 0 });
  });
  test("min 100, then return 100, 100, 100", () => {
    const result = hsvToTkColor(0, 0, 0, 100, 200);
    expect(result).toEqual({ red: 100, green: 100, blue: 100 });
  });
  test("min 200, then return 200, 200, 200", () => {
    const result = hsvToTkColor(0, 0, 0, 200, 200);
    expect(result).toEqual({ red: 200, green: 200, blue: 200 });
  });
});

describe("50% gray", () => {
  test("min 0, max 100, then return 50, 50, 50", () => {
    const result = hsvToTkColor(0, 0, 50, 0, 100);
    expect(result).toEqual({ red: 50, green: 50, blue: 50 });
  });
  test("min 100, max 200, then return 150, 150, 150", () => {
    const result = hsvToTkColor(0, 0, 50, 100, 200);
    expect(result).toEqual({ red: 150, green: 150, blue: 150 });
  });
});

test("Red, min 0, max 100, then return 100, 0, 0", () => {
  const result = hsvToTkColor(0, 100, 100, 0, 100);
  expect(result).toEqual({ red: 100, green: 0, blue: 0 });
});
test("Green, min 0, max 100, then return 0, 100, 0", () => {
  const result = hsvToTkColor(120, 100, 100, 0, 100);
  expect(result).toEqual({ red: 0, green: 100, blue: 0 });
});
test("Blue, min 0, max 100, then return 0, 0, 100", () => {
  const result = hsvToTkColor(240, 100, 100, 0, 100);
  expect(result).toEqual({ red: 0, green: 0, blue: 100 });
});

test("hsv(157, 42, 85), min 0, max 100, then return 49, 85, 71", () => {
  const result = hsvToTkColor(157, 42, 85, 0, 100);
  expect(result).toEqual({ red: 49, green: 85, blue: 71 });
});
