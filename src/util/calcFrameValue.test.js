import getDataByLocalFrame from "./calcFrameValue";

describe("pattern", () => {
  test("start is 1, end is 1, localFrame is 0, then pageIndex is 0", () => {
    const config = Object.assign({}, DEFAULT_CEL_CONFIG);
    config.pattern.start = 1;
    config.pattern.end = 1;

    const { pageIndex } = getDataByLocalFrame(0, config);

    expect(pageIndex).toBe(0);
  });
  test("start is 1, end is 1, localFrame is 1, then pageIndex is 0", () => {
    const config = Object.assign({}, DEFAULT_CEL_CONFIG);
    config.pattern.start = 1;
    config.pattern.end = 1;

    const { pageIndex } = getDataByLocalFrame(1, config);

    expect(pageIndex).toBe(0);
  });
  test("start is 2, end is 2, localFrame is 0, then pageIndex is 1", () => {
    const config = Object.assign({}, DEFAULT_CEL_CONFIG);
    config.pattern.start = 2;
    config.pattern.end = 2;

    const { pageIndex } = getDataByLocalFrame(0, config);

    expect(pageIndex).toBe(1);
  });
  describe("one way", () => {
    test("start is 1, end is 2, then pageIndex is 0-1 loop", () => {
      const config = Object.assign({}, DEFAULT_CEL_CONFIG);
      config.pattern.start = 1;
      config.pattern.end = 2;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 1 });
    });
    test("start is 3, end is 6, then pageIndex is 2-5 loop", () => {
      const config = Object.assign({}, DEFAULT_CEL_CONFIG);
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
      const config = Object.assign({}, DEFAULT_CEL_CONFIG);
      config.pattern.start = 1;
      config.pattern.end = 2;
      config.pattern.isRoundTrip = true;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 1 });
    });
    test("start is 1, end is 5, then pageIndex is 01234321 loop", () => {
      const config = Object.assign({}, DEFAULT_CEL_CONFIG);
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
      const config = Object.assign({}, DEFAULT_CEL_CONFIG);
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
});

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
  frame: { start: 1, volume: 20 }, // 20: INIT_MAX_FRAME
  pattern: { start: 1, end: 1, isRoundTrip: false },
};
