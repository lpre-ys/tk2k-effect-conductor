import calcFrameValue, {
  getDataByLocalFrame,
  calcLocalFrame,
} from "./calcFrameValue";

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
  frame: { start: 1, volume: 20, isLoopBack: false, isHideLast: false }, // 20: INIT_MAX_FRAME
  pattern: { start: 1, end: 1, isRoundTrip: false, align: 'loop' },
};

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
  describe('center', () => {
    test('start is 1, end is 3, volume is 5, then: 0, 0, 1, 2, 2', () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = 'center';
      config.frame.volume = 5;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 2 });
    });
    test('start is 1, end is 3, volume is 6, then: 0, 0, 0, 1, 2, 2', () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = 'center';
      config.frame.volume = 6;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 2 });
    });
  });
  describe('even', () => {
    test('start is 1, end is 3, volume is 6, then: 0, 0, 1, 1, 2, 2', () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = 'even';
      config.frame.volume = 6;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 2 });
    });
    test('start is 1, end is 3, volume is 7, then: 0, 0, 0, 1, 1, 2, 2', () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = 'even';
      config.frame.volume = 7;

      expect(getDataByLocalFrame(0, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(1, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(2, config)).toMatchObject({ pageIndex: 0 });
      expect(getDataByLocalFrame(3, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(4, config)).toMatchObject({ pageIndex: 1 });
      expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 2 });
      expect(getDataByLocalFrame(6, config)).toMatchObject({ pageIndex: 2 });
    });
    test('start is 1, end is 3, volume is 8, then: 0, 0, 0, 1, 1, 1, 2, 2', () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = 'even';
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
    test('start is 1, end is 3, volume is 9, then: 0, 0, 0, 1, 1, 1, 2, 2, 2', () => {
      const config = JSON.parse(JSON.stringify(DEFAULT_CEL_CONFIG));
      config.pattern.start = 1;
      config.pattern.end = 3;
      config.pattern.align = 'even';
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
    frame: { start: 1, volume: 20 }, // 20: INIT_MAX_FRAME
    pattern: { start: 9, end: 10, isRoundTrip: false },
  };

  test("pageIndex is config.pattern.start - 1", () => {
    const config = Object.assign({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ pageIndex: 8 });
  });
  test("x is config.x.start", () => {
    const config = Object.assign({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ x: 10 });
  });
  test("y is config.y.start", () => {
    const config = Object.assign({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ y: 30 });
  });
  test("scale is config.scale.start", () => {
    const config = Object.assign({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ scale: 50 });
  });
  test("opacity is config.opacity.start", () => {
    const config = Object.assign({}, FROM_TO_CEL_CONFIG);
    config.frame.volume = 1;
    expect(getDataByLocalFrame(5, config)).toMatchObject({ opacity: 70 });
  });
});

describe("calcLocalFrame", () => {
  describe("maxFrame is 10, not isLoopBack, volume is 5", () => {
    const defaultConfig = {
      start: 1,
      volume: 5,
      isHideLast: false,
      isLoopBack: false,
    };
    describe("minus start", () => {
      test("start is -1, frame is 0, then localFrame is 2", () => {
        defaultConfig.start = -1;
        const result = calcLocalFrame(0, 10, defaultConfig);
        expect(result).toBe(2);
      });
      test("start is -1, frame is 9, then localFrame is 11", () => {
        defaultConfig.start = -1;
        const result = calcLocalFrame(9, 10, defaultConfig);
        expect(result).toBe(11);
      });
    });
    test("start is 1, frame is 0, then localFrame is 0", () => {
      defaultConfig.start = 1;
      const result = calcLocalFrame(0, 10, defaultConfig);
      expect(result).toBe(0);
    });
    test("start is 1, frame is 1, then localFrame is 1", () => {
      defaultConfig.start = 1;
      const result = calcLocalFrame(1, 10, defaultConfig);
      expect(result).toBe(1);
    });
    test("start is 2, frame is 0, then localFrame is -1", () => {
      defaultConfig.start = 2;
      const result = calcLocalFrame(0, 10, defaultConfig);
      expect(result).toBe(-1);
    });
    test("start is 2, frame is 1, then localFrame is 0", () => {
      defaultConfig.start = 2;
      const result = calcLocalFrame(1, 10, defaultConfig);
      expect(result).toBe(0);
    });
    test("start is 2, frame is 2, then localFrame is 1", () => {
      defaultConfig.start = 2;
      const result = calcLocalFrame(2, 10, defaultConfig);
      expect(result).toBe(1);
    });
    test("start is 7, frame is 9, then localFrame is 3", () => {
      defaultConfig.start = 7;
      const result = calcLocalFrame(9, 10, defaultConfig);
      expect(result).toBe(3);
    });
    test("start is 7, frame is 0, then localFrame is -6", () => {
      defaultConfig.start = 7;
      const result = calcLocalFrame(0, 10, defaultConfig);
      expect(result).toBe(-6);
    });
    test("start is 7, frame is 1, then localFrame is -5", () => {
      defaultConfig.start = 7;
      const result = calcLocalFrame(1, 10, defaultConfig);
      expect(result).toBe(-5);
    });
  });
  describe("maxFrame is 10, isLoopBack, volume is 5", () => {
    const defaultConfig = {
      start: 1,
      volume: 5,
      isHideLast: false,
      isLoopBack: true,
    };
    describe("minus start", () => {
      test("start is -1, frame is 0, then localFrame is 2", () => {
        defaultConfig.start = -1;
        const result = calcLocalFrame(0, 10, defaultConfig);
        expect(result).toBe(2);
      });
      test("start is -1, frame is 1, then localFrame is 3", () => {
        defaultConfig.start = -1;
        const result = calcLocalFrame(1, 10, defaultConfig);
        expect(result).toBe(3);
      });
      test("start is -1, frame is 8, then localFrame is 0", () => {
        defaultConfig.start = -1;
        const result = calcLocalFrame(8, 10, defaultConfig);
        expect(result).toBe(0);
      });
      test("start is -1, frame is 9, then localFrame is 1", () => {
        defaultConfig.start = -1;
        const result = calcLocalFrame(9, 10, defaultConfig);
        expect(result).toBe(1);
      });
      test("start is -2, frame is 9, then localFrame is 2", () => {
        defaultConfig.start = -2;
        const result = calcLocalFrame(9, 10, defaultConfig);
        expect(result).toBe(2);
      });
      test("start is -21, frame is 9, then localFrame is 1", () => {
        defaultConfig.start = -21;
        const result = calcLocalFrame(9, 10, defaultConfig);
        expect(result).toBe(1);
      });
    });
    test("start is 1, frame is 0, then localFrame is 0", () => {
      defaultConfig.start = 1;
      const result = calcLocalFrame(0, 10, defaultConfig);
      expect(result).toBe(0);
    });
    test("start is 1, frame is 1, then localFrame is 1", () => {
      defaultConfig.start = 1;
      const result = calcLocalFrame(1, 10, defaultConfig);
      expect(result).toBe(1);
    });
    test("start is 2, frame is 0, then localFrame is 9", () => {
      defaultConfig.start = 2;
      const result = calcLocalFrame(0, 10, defaultConfig);
      expect(result).toBe(9);
    });
    test("start is 2, frame is 1, then localFrame is 0", () => {
      defaultConfig.start = 2;
      const result = calcLocalFrame(1, 10, defaultConfig);
      expect(result).toBe(0);
    });
    test("start is 2, frame is 2, then localFrame is 1", () => {
      defaultConfig.start = 2;
      const result = calcLocalFrame(2, 10, defaultConfig);
      expect(result).toBe(1);
    });
    test("start is 7, frame is 9, then localFrame is 3", () => {
      defaultConfig.start = 7;
      const result = calcLocalFrame(9, 10, defaultConfig);
      expect(result).toBe(3);
    });
    test("start is 7, frame is 0, then localFrame is 4", () => {
      defaultConfig.start = 7;
      const result = calcLocalFrame(0, 10, defaultConfig);
      expect(result).toBe(4);
    });
    test("start is 7, frame is 1, then localFrame is 5", () => {
      defaultConfig.start = 7;
      const result = calcLocalFrame(1, 10, defaultConfig);
      expect(result).toBe(5);
    });
    test("start is 10, frame is 0, then localFrame is 1", () => {
      defaultConfig.start = 10;
      const result = calcLocalFrame(0, 10, defaultConfig);
      expect(result).toBe(1);
    });
    test("start is 11, frame is 0, then localFrame is 0", () => {
      defaultConfig.start = 11;
      const result = calcLocalFrame(0, 10, defaultConfig);
      expect(result).toBe(0);
    });
    test("start is 20, frame is 0, then localFrame is 1", () => {
      defaultConfig.start = 20;
      const result = calcLocalFrame(0, 10, defaultConfig);
      expect(result).toBe(1);
    });
    test("start is 21, frame is 0, then localFrame is 0", () => {
      defaultConfig.start = 21;
      const result = calcLocalFrame(0, 10, defaultConfig);
      expect(result).toBe(0);
    });
  });
});

describe("calcFrameValue", () => {
  describe("volume: 10, maxFrame: 20, isLoopBack: FALSE", () => {
    const cel = Object.assign({}, DEFAULT_CEL_CONFIG);
    const MAX_FRAME = 20;
    beforeEach(() => {
      cel.frame.volume = 10;
      cel.frame.isLoopBack = false;
      cel.pattern.start = 1;
      cel.pattern.end = 10;
    });
    describe("isHideLast is FALSE", () => {
      beforeEach(() => {
        cel.frame.isHideLast = false;
      });
      describe("start is 5", () => {
        beforeEach(() => {
          cel.frame.start = 5;
        });
        test("frame is 0, then return false", () => {
          const result = calcFrameValue(0, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 3, then return false", () => {
          const result = calcFrameValue(3, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 4, then return calcedData", () => {
          const result = calcFrameValue(4, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(0);
        });
        test("frame is 13, then return calcedData", () => {
          const result = calcFrameValue(13, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(9);
        });
        test("frame is 14, then return false", () => {
          const result = calcFrameValue(14, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
      describe("start is 15", () => {
        beforeEach(() => {
          cel.frame.start = 15;
        });
        test("frame is 0, then return false", () => {
          const result = calcFrameValue(0, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 13, then return false", () => {
          const result = calcFrameValue(13, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 14, then return calcedData", () => {
          const result = calcFrameValue(14, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(0);
        });
        test("frame is 19, then return calcedData", () => {
          const result = calcFrameValue(19, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(5);
        });
        test("frame is 20, then return false", () => {
          const result = calcFrameValue(20, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
      describe("start is ―1", () => {
        beforeEach(() => {
          cel.frame.start = -1;
        });
        test("frame is -1, then return false", () => {
          const result = calcFrameValue(-1, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 0, then return calcedData", () => {
          const result = calcFrameValue(0, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(2);
        });
        test("frame is 7, then return calcedData", () => {
          const result = calcFrameValue(7, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(9);
        });
        test("frame is 8, then return false", () => {
          const result = calcFrameValue(8, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 19, then return false", () => {
          const result = calcFrameValue(19, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 20, then return false", () => {
          const result = calcFrameValue(20, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
    });
    describe("isHideLast is TRUE", () => {
      beforeEach(() => {
        cel.frame.isHideLast = true;
      });
      describe("start is 5", () => {
        beforeEach(() => {
          cel.frame.start = 5;
        });
        test("frame is 12, then return calcedData", () => {
          const result = calcFrameValue(12, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(8);
        });
        test("frame is 13, then return calcedData", () => {
          const result = calcFrameValue(13, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 14, then return false", () => {
          const result = calcFrameValue(14, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
      describe("start is 15", () => {
        beforeEach(() => {
          cel.frame.start = 15;
        });
        test("frame is 19, then return calcedData", () => {
          const result = calcFrameValue(19, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(5);
        });
        test("frame is 20, then return false", () => {
          const result = calcFrameValue(20, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
      describe("start is ―1", () => {
        beforeEach(() => {
          cel.frame.start = -1;
        });
        test("frame is 6, then return calcedData", () => {
          const result = calcFrameValue(6, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(8);
        });
        test("frame is 7, then return false", () => {
          const result = calcFrameValue(7, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 8, then return false", () => {
          const result = calcFrameValue(8, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
    });
  });

  describe("volume: 10, maxFrame: 20, isLoopBack: TRUE", () => {
    const cel = Object.assign({}, DEFAULT_CEL_CONFIG);
    const MAX_FRAME = 20;
    beforeEach(() => {
      cel.frame.volume = 10;
      cel.frame.isLoopBack = true;
      cel.pattern.start = 1;
      cel.pattern.end = 10;
    });
    describe("isHideLast is FALSE", () => {
      beforeEach(() => {
        cel.frame.isHideLast = false;
      });
      describe("start is 5", () => {
        beforeEach(() => {
          cel.frame.start = 5;
        });
        test("frame is 0, then return false", () => {
          const result = calcFrameValue(0, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 3, then return false", () => {
          const result = calcFrameValue(3, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 4, then return calcedData", () => {
          const result = calcFrameValue(4, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(0);
        });
        test("frame is 13, then return calcedData", () => {
          const result = calcFrameValue(13, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(9);
        });
        test("frame is 14, then return false", () => {
          const result = calcFrameValue(14, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 19, then return false", () => {
          const result = calcFrameValue(19, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
      describe("start is 15", () => {
        beforeEach(() => {
          cel.frame.start = 15;
        });
        test("frame is 0, then return calcedData", () => {
          const result = calcFrameValue(0, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(6);
        });
        test("frame is 3, then return calcedData", () => {
          const result = calcFrameValue(3, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(9);
        });
        test("frame is 4, then return false", () => {
          const result = calcFrameValue(4, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 13, then return false", () => {
          const result = calcFrameValue(13, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 14, then return calcedData", () => {
          const result = calcFrameValue(14, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(0);
        });
        test("frame is 19, then return calcedData", () => {
          const result = calcFrameValue(19, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(5);
        });
        test("frame is 20, then return false", () => {
          const result = calcFrameValue(20, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
      describe("start is ―1", () => {
        beforeEach(() => {
          cel.frame.start = -1;
        });
        test("frame is -1, then return false", () => {
          const result = calcFrameValue(-1, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 0, then return calcedData", () => {
          const result = calcFrameValue(0, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(2);
        });
        test("frame is 7, then return calcedData", () => {
          const result = calcFrameValue(7, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(9);
        });
        test("frame is 8, then return false", () => {
          const result = calcFrameValue(8, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 17, then return false", () => {
          const result = calcFrameValue(17, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 18, then return calcedData", () => {
          const result = calcFrameValue(18, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(0);
        });
        test("frame is 19, then return calcedData", () => {
          const result = calcFrameValue(19, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(1);
        });
        test("frame is 20, then return false", () => {
          const result = calcFrameValue(20, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
    });
    describe("isHideLast is TRUE", () => {
      beforeEach(() => {
        cel.frame.isHideLast = true;
      });
      describe("start is 5", () => {
        beforeEach(() => {
          cel.frame.start = 5;
        });
        test("frame is 12, then return calcedData", () => {
          const result = calcFrameValue(12, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(8);
        });
        test("frame is 13, then return calcedData", () => {
          const result = calcFrameValue(13, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 14, then return false", () => {
          const result = calcFrameValue(14, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
      describe("start is 15", () => {
        beforeEach(() => {
          cel.frame.start = 15;
        });
        test("frame is 2, then return calcedData", () => {
          const result = calcFrameValue(2, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(8);
        });
        test("frame is 3, then return false", () => {
          const result = calcFrameValue(3, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 4, then return false", () => {
          const result = calcFrameValue(4, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });

        test("frame is 19, then return calcedData", () => {
          const result = calcFrameValue(19, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(5);
        });
        test("frame is 20, then return false", () => {
          const result = calcFrameValue(20, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
      describe("start is ―1", () => {
        beforeEach(() => {
          cel.frame.start = -1;
        });
        test("frame is 6, then return calcedData", () => {
          const result = calcFrameValue(6, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(8);
        });
        test("frame is 7, then return false", () => {
          const result = calcFrameValue(7, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 8, then return false", () => {
          const result = calcFrameValue(8, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
        test("frame is 18, then return calcedData", () => {
          const result = calcFrameValue(18, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(0);
        });
        test("frame is 19, then return calcedData", () => {
          const result = calcFrameValue(19, MAX_FRAME, cel);
          expect(result).toBeTruthy();
          expect(result.pageIndex).toBe(1);
        });
        test("frame is 20, then return false", () => {
          const result = calcFrameValue(20, MAX_FRAME, cel);
          expect(result).toBeFalsy();
        });
      });
    });
  });
});
