import merge from "deepmerge";
import getDataByLocalFrame from "./getDataByLocalFrame";

const DEFAULT_CEL_CONFIG = {
  x: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  y: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  scale: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  opacity: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  red: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "fixed",
    easingAdd: "",
  },
  green: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "fixed",
    easingAdd: "",
  },
  blue: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "fixed",
    easingAdd: "",
  },
  tkSat: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "fixed",
    easingAdd: "",
  },
  frame: { start: 1, volume: 20, isLoopBack: false, isHideLast: false }, // 20: INIT_MAX_FRAME
  pattern: { start: 1, end: 1, isRoundTrip: false, align: "loop" },
  hsv: { min: 0, max: 100, isHsv: false },
};

const FROM_TO_CEL_CONFIG = {
  x: {
    from: 10,
    to: 20,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  y: {
    from: 30,
    to: 40,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  scale: {
    from: 50,
    to: 60,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  opacity: {
    from: 70,
    to: 80,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  red: {
    from: 90,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  green: {
    from: 110,
    to: 120,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  blue: {
    from: 130,
    to: 140,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  tkSat: {
    from: 150,
    to: 160,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  hsv: {
    min: 100,
    max: 200,
    isHsv: false,
  },
  hue: {
    from: 0,
    to: 120,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  sat: {
    from: 100,
    to: 50,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  val: {
    from: 100,
    to: 50,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  frame: { start: 1, volume: 20 }, // 20: INIT_MAX_FRAME
  pattern: { start: 9, end: 10, isRoundTrip: false },
};
describe("FromTo start", () => {
  test("params by from", () => {
    const result = getDataByLocalFrame(0, FROM_TO_CEL_CONFIG);

    expect(result).toMatchObject({
      x: 10,
      y: 30,
      scale: 50,
      opacity: 70,
    });
  });
  test("HSV mode OFF, then color by rgb.from", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.hsv.isHsv = false;
    const result = getDataByLocalFrame(0, config);

    expect(result).toMatchObject({
      red: 90,
      green: 110,
      blue: 130,
      tkSat: 150,
    });
  });
  test("HSV mode ON, then color by hsv.from", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.hsv.isHsv = true;
    const result = getDataByLocalFrame(0, config);

    expect(result).toMatchObject({
      red: 200,
      green: 100,
      blue: 100,
      tkSat: 150,
    });
  });
});

describe("FromTo end", () => {
  test("params by to", () => {
    const result = getDataByLocalFrame(19, FROM_TO_CEL_CONFIG);

    expect(result).toMatchObject({
      x: 20,
      y: 40,
      scale: 60,
      opacity: 80,
    });
  });
  test("HSV mode OFF, then color by rgb.to", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.hsv.isHsv = false;
    const result = getDataByLocalFrame(19, config);

    expect(result).toMatchObject({
      red: 100,
      green: 120,
      blue: 140,
      tkSat: 160,
    });
  });
  test("HSV mode ON, then color by hsv.to", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.hsv.isHsv = true;
    const result = getDataByLocalFrame(19, config);

    expect(result).toMatchObject({
      red: 125,
      green: 150,
      blue: 125,
      tkSat: 160,
    });
  });
});

describe("pattern", () => {
  test("start is 1, end is 1, localFrame is 0, then pageIndex is 0", () => {
    const config = merge({}, DEFAULT_CEL_CONFIG);
    config.pattern.start = 1;
    config.pattern.end = 1;

    const { pageIndex } = getDataByLocalFrame(0, config);

    expect(pageIndex).toBe(0);
  });
  test("start is 1, end is 1, localFrame is 1, then pageIndex is 0", () => {
    const config = merge({}, DEFAULT_CEL_CONFIG);
    config.pattern.start = 1;
    config.pattern.end = 1;

    const { pageIndex } = getDataByLocalFrame(1, config);

    expect(pageIndex).toBe(0);
  });
  test("start is 2, end is 2, localFrame is 0, then pageIndex is 1", () => {
    const config = merge({}, DEFAULT_CEL_CONFIG);
    config.pattern.start = 2;
    config.pattern.end = 2;

    const { pageIndex } = getDataByLocalFrame(0, config);

    expect(pageIndex).toBe(1);
  });
  describe("one way", () => {
    test("start is 1, end is 2, then pageIndex is 0-1 loop", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 2;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 1 });
    });
    test("start is 3, end is 6, then pageIndex is 2-5 loop", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 3;
      config.pattern.end = 6;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 3 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 4 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 5 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 3 });
      expect(getDataByLocalFrame(6, config)).toMatchObject({ pageIndex: 4 });
      expect(getDataByLocalFrame(7, config)).toMatchObject({ pageIndex: 5 });
    });
  });
  describe("round trip", () => {
    test("start is 1, end is 2, then pageIndex is 0-1 loop", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 2;
      config.pattern.isRoundTrip = true;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 1 });
    });
    test("start is 1, end is 5, then pageIndex is 01234321 loop", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 5;
      config.pattern.isRoundTrip = true;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 3 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 4 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 3 });
      expect(getDataByLocalFrame(6, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(7, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(8, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(9, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(10, config)).toMatchObject({ pageIndex: 2 });
    });
    test("start is 3, end is 6, then pageIndex is 234543 loop", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 3;
      config.pattern.end = 6;
      config.pattern.isRoundTrip = true;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 3 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 4 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 5 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 4 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 3 });
      expect(getDataByLocalFrame(6, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(7, config)).toMatchObject({ pageIndex: 3 });
    });
  });
  describe("center", () => {
    test("start is 1, end is 3, volume is 5, then: 0, 0, 1, 2, 2", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = "center";
      config.frame.volume = 5;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 2 });
    });
    test("start is 1, end is 3, volume is 6, then: 0, 0, 0, 1, 2, 2", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = "center";
      config.frame.volume = 6;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 2 });
    });
  });
  describe("start", () => {
    describe("start is 1, end is 3, volume is 5", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      beforeEach(() => {
        config.pattern.start = 1;
        config.pattern.end = 3;
        config.pattern.align = "start";
        config.frame.volume = 5;
      });
      test.each([
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 2],
        [4, 2],
      ])("localFrame is %i, then return %i", (frame, ex) => {
        const { pageIndex } = getDataByLocalFrame(frame, config);
        expect(pageIndex).toBe(ex);
      });
    });
  });
  describe("end", () => {
    describe("start is 1, end is 3, volume is 5", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      beforeEach(() => {
        config.pattern.start = 1;
        config.pattern.end = 3;
        config.pattern.align = "end";
        config.frame.volume = 5;
      });
      test.each([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 1],
        [4, 2],
      ])("localFrame is %i, then return %i", (frame, ex) => {
        const { pageIndex } = getDataByLocalFrame(frame, config);
        expect(pageIndex).toBe(ex);
      });
    });
  });
  describe("even", () => {
    test("start is 1, end is 3, volume is 6, then: 0, 0, 1, 1, 2, 2", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = "even";
      config.frame.volume = 6;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 2 });
    });
    test("start is 1, end is 3, volume is 7, then: 0, 0, 0, 1, 1, 2, 2", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = "even";
      config.frame.volume = 7;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(6, config)).toMatchObject({ pageIndex: 2 });
    });
    test("start is 1, end is 3, volume is 8, then: 0, 0, 0, 1, 1, 1, 2, 2", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = "even";
      config.frame.volume = 8;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(6, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(7, config)).toMatchObject({ pageIndex: 2 });
    });
    test("start is 1, end is 3, volume is 9, then: 0, 0, 0, 1, 1, 1, 2, 2, 2", () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = "even";
      config.frame.volume = 9;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(6, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(7, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(8, config)).toMatchObject({ pageIndex: 2 });
    });
  });
});

describe("only 1 Frame", () => {
  test("pageIndex is config.pattern.start - 1", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 8 });
  });
  test("x is config.x.start", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ x: 10 });
  });
  test("y is config.y.start", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ y: 30 });
  });
  test("scale is config.scale.start", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ scale: 50 });
  });
  test("opacity is config.opacity.start", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ opacity: 70 });
  });
  test("tkSat is config.tkSat.start", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ tkSat: 150 });
  });
  describe("HSV mode OFF", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    config.hsv.isHsv = false;
    test("red is red.from", () => {
      expect(getDataByLocalFrame(5, config)).toMatchObject({ red: 90 });
    });
    test("green is green.from", () => {
      expect(getDataByLocalFrame(5, config)).toMatchObject({ green: 110 });
    });
    test("blue is blue.from", () => {
      expect(getDataByLocalFrame(5, config)).toMatchObject({ blue: 130 });
    });
  });
  describe("HSV mode ON", () => {
    const config = merge({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    config.hsv.isHsv = true;
    test("red is calced by hsv.from", () => {
      expect(getDataByLocalFrame(5, config)).toMatchObject({ red: 200 });
    });
    test("green is calced by hsv.from", () => {
      expect(getDataByLocalFrame(5, config)).toMatchObject({ green: 100 });
    });
    test("blue is calced by hsv.from", () => {
      expect(getDataByLocalFrame(5, config)).toMatchObject({ blue: 100 });
    });
  });
});
