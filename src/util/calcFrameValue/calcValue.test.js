import calcValue from "./calcValue";

let config;
let frameConfig;
beforeEach(() => {
  config = {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  };
  frameConfig = {
    start: 0,
    volume: 0,
    isHideLast: false,
    isLoopBack: false,
  };
});

describe("easeLinear", () => {
  beforeEach(() => {
    config.easing = "easeLinear";
  });
  describe("from is 0, to is 100", () => {
    beforeEach(() => {
      config.from = 0;
      config.to = 100;
    });
    describe("frameConfig.volume is 10", () => {
      beforeEach(() => {
        frameConfig.volume = 10;
      });
      test.each([
        [0, 0],
        [1, 11],
        [8, 89],
        [9, 100],
      ])("localFrame is %i, then return %i", (frame, ex) => {
        const result = calcValue(frame, config, frameConfig);
        expect(result).toBe(ex);
      });
    });
    describe("frameConfig.volume is 20", () => {
      beforeEach(() => {
        frameConfig.volume = 20;
      });
      test.each([
        [0, 0],
        [1, 5],
        [18, 95],
        [19, 100],
      ])("localFrame is %i, then return %i", (frame, ex) => {
        const result = calcValue(frame, config, frameConfig);
        expect(result).toBe(ex);
      });
    });
  });
});
describe("fixed", () => {
  beforeEach(() => {
    config.easing = "fixed";
  });
  describe("from is 0, to is 100", () => {
    beforeEach(() => {
      config.from = 0;
      config.to = 100;
      frameConfig.volume = 10;
    });
    test.each([
      [0, 0],
      [1, 0],
      [8, 0],
      [9, 0],
    ])("localFrame is %i, then return %i", (frame, ex) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(ex);
    });
  });
});
describe("easePolyIn, from is 0, to is 100, frameConfig.volume is 10", () => {
  beforeEach(() => {
    config.easing = "easePoly";
    config.easingAdd = "In";
    config.from = 0;
    config.to = 100;
    frameConfig.volume = 10;
  });
  describe("no Option params", () => {
    beforeEach(() => {
      delete config.easingOptions;
    });
    test.each([
      [0, 0],
      [1, 0],
      [5, 17],
      [8, 70],
      [9, 100],
    ])("localFrame is %i, then return %i", (frame, ex) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(ex);
    });
  });
  describe("Options.exponent is 1 then equal easeLinear", () => {
    beforeEach(() => {
      config.easingOptions = {
        easePoly: {
          exponent: 1,
        },
      };
    });
    test.each([
      [0, 0],
      [1, 11],
      [8, 89],
      [9, 100],
    ])("localFrame is %i, then return %i", (frame, ex) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(ex);
    });
  });
  describe("Options.exponent is 3 then equal default", () => {
    beforeEach(() => {
      config.easingOptions = {
        easePoly: {
          exponent: 3,
        },
      };
    });
    test.each([
      [0, 0],
      [1, 0],
      [5, 17],
      [8, 70],
      [9, 100],
    ])("localFrame is %i, then return %i", (frame, ex) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(ex);
    });
  });
});

describe("easeBackIn, from is 0, to is 100, frameConfig.volume is 10", () => {
  beforeEach(() => {
    config.easing = "easeBack";
    config.easingAdd = "In";
    config.from = 0;
    config.to = 100;
    frameConfig.volume = 10;
  });
  describe("no Option params", () => {
    beforeEach(() => {
      delete config.easingOptions;
    });
    test.each([
      [0, 0],
      [1, -2],
      [2, -5],
      [3, -9],
      [9, 100],
    ])("localFrame is %i, then return %i", (frame, ex) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(ex);
    });
  });
  describe("Options.overshoot is 1.70158 then equal default", () => {
    beforeEach(() => {
      config.easingOptions = {
        easeBack: {
          overshoot: 1.70158,
        },
      };
    });
    test.each([
      [0, 0],
      [1, -2],
      [2, -5],
      [3, -9],
      [9, 100],
    ])("localFrame is %i, then return %i", (frame, ex) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(ex);
    });
  });
  describe("Options.overshoot is 1.0 then small move", () => {
    beforeEach(() => {
      config.easingOptions = {
        easeBack: {
          overshoot: 1.0,
        },
      };
    });
    test.each([
      [0, 0],
      [1, -1],
      [2, -3],
      [3, -4],
      [9, 100],
    ])("localFrame is %i, then return %i", (frame, ex) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(ex);
    });
  });
  describe("Options.overshoot is 3.0 then big move", () => {
    beforeEach(() => {
      config.easingOptions = {
        easeBack: {
          overshoot: 3.0,
        },
      };
    });
    test.each([
      [0, 0],
      [1, -3],
      [2, -10],
      [3, -19],
      [9, 100],
    ])("localFrame is %i, then return %i", (frame, ex) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(ex);
    });
  });
});
describe("easeElasticIn, from is 0, to is 100, frameConfig.volume is 20", () => {
  beforeEach(() => {
    config.easing = "easeElastic";
    config.easingAdd = "In";
    config.from = 0;
    config.to = 100;
    frameConfig.volume = 20;
  });
  describe("no Option params", () => {
    beforeEach(() => {
      delete config.easingOptions;
    });
    test.each([
      [0, 0],
      [1, 0],
      [6, -0],
      [7, 1],
      [8, 2],
      [9, 0],
      [10, -3],
      [11, -4],
      [12, 1],
      [13, 11],
      [14, 12],
      [15, -7],
      [16, -33],
      [17, -29],
      [18, 31],
      [19, 100],
    ])("localFrame is %i, then return %i", (frame, ex) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(ex);
    });
  });
  describe("amplitude", () => {
    describe("is 1.0, then equal default", () => {
      beforeEach(() => {
        config.easingOptions = {
          easeElastic: {
            amplitude: 1.0,
          },
        };
      });
      test.each([
        [0, 0],
        [1, 0],
        [6, -0],
        [7, 1],
        [8, 2],
        [9, 0],
        [10, -3],
        [11, -4],
        [12, 1],
        [13, 11],
        [14, 12],
        [15, -7],
        [16, -33],
        [17, -29],
        [18, 31],
        [19, 100],
      ])("localFrame is %i, then return %i", (frame, ex) => {
        const result = calcValue(frame, config, frameConfig);
        expect(result).toBe(ex);
      });
    });
    describe("is 2.0", () => {
      beforeEach(() => {
        config.easingOptions = {
          easeElastic: {
            amplitude: 2.0,
          },
        };
      });
      test.each([
        [0, 0],
        [1, 0],
        [6, 1],
        [7, 2],
        [8, 0],
        [9, -4],
        [10, -6],
        [15, -45],
        [16, -42],
        [17, 39],
        [18, 139],
        [19, 100],
      ])("localFrame is %i, then return %i", (frame, ex) => {
        const result = calcValue(frame, config, frameConfig);
        expect(result).toBe(ex);
      });
    });
  });
  describe("period", () => {
    describe("is 0.3, then equal default", () => {
      beforeEach(() => {
        config.easingOptions = {
          easeElastic: {
            period: 0.3,
          },
        };
      });
      test.each([
        [0, 0],
        [1, 0],
        [6, -0],
        [7, 1],
        [8, 2],
        [9, 0],
        [10, -3],
        [11, -4],
        [12, 1],
        [13, 11],
        [14, 12],
        [15, -7],
        [16, -33],
        [17, -29],
        [18, 31],
        [19, 100],
      ])("localFrame is %i, then return %i", (frame, ex) => {
        const result = calcValue(frame, config, frameConfig);
        expect(result).toBe(ex);
      });
    });
    describe("is 0.5", () => {
      beforeEach(() => {
        config.easingOptions = {
          easeElastic: {
            amplitude: 0.5,
          },
        };
      });
      test.each([
        [0, 0],
        [1, 0],
        [6, -0],
        [7, 1],
        [8, 2],
        [9, 0],
        [10, -3],
        [15, -7],
        [16, -33],
        [17, -29],
        [18, 31],
        [19, 100],
      ])("localFrame is %i, then return %i", (frame, ex) => {
        const result = calcValue(frame, config, frameConfig);
        expect(result).toBe(ex);
      });
    });
  });
});

describe("cycle", () => {
  beforeEach(() => {
    config.easing = "easeLinear";
    config.from = 0;
    config.to = 100;
    frameConfig.volume = 20;
  });
  describe("cycle is 1", () => {
    beforeEach(() => {
      config.cycle = 1;
    });
    test.each([0, 1, 18, 19])("localFrame is %i, then return 0", (frame) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(0);
    });
  });
});

describe("isRoundTrip", () => {
  beforeEach(() => {
    config.easing = "easeLinear";
    config.from = 0;
    config.to = 100;
    config.isRoundTrip = true;
    frameConfig.volume = 20;
  });
  describe("cycle is 5", () => {
    beforeEach(() => {
      config.cycle = 5;
    });
    test.each([
      [0, 0],
      [1, 25],
      [3, 75],
      [4, 100],
      [5, 100],
      [6, 75],
      [8, 25],
      [9, 0],
      [18, 25],
      [19, 0],
    ])("localFrame is %i, then return %i", (frame, ex) => {
      const result = calcValue(frame, config, frameConfig);
      expect(result).toBe(ex);
    });
  });
  describe("cycle is 0", () => {
    describe("volume is 20", () => {
      beforeEach(() => {
        frameConfig.volume = 20;
      });
      test.each([
        [0, 0],
        [1, 11],
        [8, 89],
        [9, 100],
        [10, 100],
        [11, 89],
        [18, 11],
        [19, 0],
      ])("localFrame is %i, then return %i", (frame, ex) => {
        const result = calcValue(frame, config, frameConfig);
        expect(result).toBe(ex);
      });
    });
    describe("volume is 19", () => {
      beforeEach(() => {
        frameConfig.volume = 19;
      });
      test.each([
        [0, 0],
        [1, 11],
        [8, 89],
        [9, 100],
        [10, 89],
        [17, 11],
        [18, 0],
      ])("localFrame is %i, then return %i", (frame, ex) => {
        const result = calcValue(frame, config, frameConfig);
        expect(result).toBe(ex);
      });
    });
  });
});
