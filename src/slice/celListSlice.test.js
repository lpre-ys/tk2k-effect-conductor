import reducer, {
  addCel,
  copyCel,
  loadCelList,
  resetCelList,
  setCelIndex,
  setCelName,
  moveCel,
  updateFromTo,
  updateEasing,
  updateCycle,
  updateIsRoundTrip,
  updateEasingOptions,
} from "./celListSlice";

test("return Initial state", () => {
  const state = reducer(undefined, { type: undefined });
  expect(state).toMatchObject({ celIndex: 0 });
});

describe("loadCelList", () => {
  test("Ver1.0.2 add parameter", () => {
    const data = {
      celIndex: 0,
      drawKey: Date.now(),
      list: [],
    };
    data.list.push(
      { frame: {} },
      { name: "test", frame: { isHideLast: true } },
      { frame: { isLoopBack: true } },
      { name: "", frame: { isLoopBack: true } }
    );
    const state = reducer(undefined, loadCelList(data));
    expect(state.list).toHaveLength(4);
    expect(state.list[0].name).toBe("セル1");
    expect(state.list[1].name).toBe("test");
    expect(state.list[2].name).toBe("セル3");
    expect(state.list[3].name).toBe("");
    expect(state.list[0].frame).toMatchObject({ isLoopBack: false });
    expect(state.list[1].frame).toMatchObject({
      isLoopBack: false,
      isHideLast: true,
    });
    expect(state.list[2].frame).toMatchObject({ isLoopBack: true });
    expect(state.list[3].frame).toMatchObject({ isLoopBack: true });
  });
  test("Ver1.1.0 add parameter", () => {
    const data = {
      celIndex: 0,
      drawKey: Date.now(),
      list: [],
    };
    data.list.push(
      {
        pattern: {
          start: 3,
          end: 5,
          isRoundTrip: true,
          align: "center",
          customPattern: [2, 2, 4],
          isCustom: true,
        },
      },
      {
        pattern: {
          start: 4,
          end: 6,
          isRoundTrip: false,
        },
      }
    );
    const state = reducer(undefined, loadCelList(data));
    expect(state.list).toHaveLength(2);
    expect(state.list[0]).toMatchObject({
      pattern: {
        start: 3,
        end: 5,
        isRoundTrip: true,
        align: "center",
        customPattern: [2, 2, 4],
        isCustom: true,
      },
    });
    expect(state.list[1]).toMatchObject({
      pattern: {
        start: 4,
        end: 6,
        isRoundTrip: false,
      },
    });
    expect(state.list[1].pattern.align).toBe("loop");
    expect(state.list[1].pattern.customPattern).toEqual([]);
    expect(state.list[1].pattern.isCustom).toBe(false);
  });
});
describe("setCelName", () => {
  test("index is 0, then set list[0].name", () => {
    const old = {
      celIndex: 0,
      list: [{ name: "test1" }, { name: "test2" }, { name: "test3" }],
    };
    const state = reducer(old, setCelName("更新テスト"));

    expect(state.list[0].name).toBe("更新テスト");
    expect(state.list[1].name).toBe("test2");
    expect(state.list[2].name).toBe("test3");
  });
  test("index is 1, then set list[1].name", () => {
    const old = {
      celIndex: 1,
      list: [{ name: "test1" }, { name: "test2" }, { name: "test3" }],
    };
    const state = reducer(old, setCelName("更新テスト"));

    expect(state.list[0].name).toBe("test1");
    expect(state.list[1].name).toBe("更新テスト");
    expect(state.list[2].name).toBe("test3");
  });
  test("index is 2, then set list[2].name", () => {
    const old = {
      celIndex: 2,
      list: [{ name: "test1" }, { name: "test2" }, { name: "test3" }],
    };
    const state = reducer(old, setCelName("更新テスト"));

    expect(state.list[0].name).toBe("test1");
    expect(state.list[1].name).toBe("test2");
    expect(state.list[2].name).toBe("更新テスト");
  });
});
test("resetCelList, then update drawKey", () => {
  const old = reducer(undefined, { type: undefined });
  const state = reducer(old, resetCelList());
  expect(state.drawKey).not.toBe(old.drawKey);
});

test("setCelIndex, update celIndex", () => {
  const old = reducer(undefined, { type: undefined });
  const state = reducer(old, setCelIndex(3));
  expect(state.celIndex).toBe(3);
});

describe("addCel", () => {
  test("then list length +1", () => {
    const old = reducer(undefined, { type: undefined });
    const state = reducer(old, addCel({ volume: 10, start: 1 }));

    expect(state.list).toHaveLength(2);
  });
  test("added cel frame config is parameter", () => {
    const old = reducer(undefined, { type: undefined });
    const state = reducer(old, addCel({ volume: 10, start: 3 }));

    expect(state.list[1].frame).toMatchObject({
      start: 3,
      volume: 10,
    });
  });
  test("celIndex is old +1", () => {
    const old = {
      celIndex: 3,
      list: [],
    };
    const state = reducer(old, addCel({ volume: 10, start: 1 }));

    expect(state.celIndex).toBe(4);
  });
});

describe("copy", () => {
  test("then list length +1", () => {
    const old = reducer(undefined, { type: undefined });
    const state = reducer(old, copyCel());

    expect(state.list).toHaveLength(2);
  });
  test("added cel frame config is parameter", () => {
    const old = reducer(undefined, { type: undefined });
    const state = reducer(old, copyCel());

    expect(state.list[1].frame).toMatchObject({
      start: 1,
      volume: 20,
    });
  });
  test("celIndex is old +1", () => {
    const old = reducer(undefined, { type: undefined });
    const state = reducer(old, copyCel());

    expect(state.celIndex).toBe(1);
  });
});

describe("moveCel", () => {
  describe("list.length", () => {
    test("length is 0, then noop", () => {
      const data = {
        celIndex: 0,
        list: [],
      };
      const state = reducer(data, moveCel(0));
      expect(state.list).toEqual([]);
      expect(state.celIndex).toBe(0);
    });
    test("length is 1, then noop", () => {
      const data = {
        celIndex: 0,
        list: [1],
      };
      const state = reducer(data, moveCel(0));
      expect(state.list).toEqual([1]);
      expect(state.celIndex).toBe(0);
    });
    test("length is 2, then move", () => {
      const data = {
        celIndex: 1,
        list: [1, 2],
      };
      const state = reducer(data, moveCel(0));
      expect(state.list).toEqual([2, 1]);
      expect(state.celIndex).toBe(0);
    });
  });
  describe("target", () => {
    const list = [1, 2, 3, 4, 5];
    test("celIndex is 2, target is -1, then noop", () => {
      const data = {
        celIndex: 2,
        list: [...list],
      };
      const state = reducer(data, moveCel(-1));
      expect(state.list).toEqual([1, 2, 3, 4, 5]);
      expect(state.celIndex).toBe(2);
    });
    test("celIndex is 2, target is 0, then 3, 1, 2, 4, 5", () => {
      const data = {
        celIndex: 2,
        list: [...list],
      };
      const state = reducer(data, moveCel(0));
      expect(state.list).toEqual([3, 1, 2, 4, 5]);
      expect(state.celIndex).toBe(0);
    });
    test("celIndex is 2, target is 1, then 1, 3, 2, 4, 5", () => {
      const data = {
        celIndex: 2,
        list: [...list],
      };
      const state = reducer(data, moveCel(1));
      expect(state.list).toEqual([1, 3, 2, 4, 5]);
      expect(state.celIndex).toBe(1);
    });
    test("celIndex is 2, target is 2, then noop", () => {
      const data = {
        celIndex: 2,
        list: [...list],
      };
      const state = reducer(data, moveCel(2));
      expect(state.list).toEqual([1, 2, 3, 4, 5]);
      expect(state.celIndex).toBe(2);
    });
    test("celIndex is 2, target is 3, then 1, 2, 4, 3, 5", () => {
      const data = {
        celIndex: 2,
        list: [...list],
      };
      const state = reducer(data, moveCel(3));
      expect(state.list).toEqual([1, 2, 4, 3, 5]);
      expect(state.celIndex).toBe(3);
    });
    test("celIndex is 2, target is 4, then 1, 2, 4, 5, 3", () => {
      const data = {
        celIndex: 2,
        list: [...list],
      };
      const state = reducer(data, moveCel(4));
      expect(state.list).toEqual([1, 2, 4, 5, 3]);
      expect(state.celIndex).toBe(4);
    });
    test("celIndex is 2, target is 5, then noop", () => {
      const data = {
        celIndex: 2,
        list: [...list],
      };
      const state = reducer(data, moveCel(5));
      expect(state.list).toEqual([1, 2, 3, 4, 5]);
      expect(state.celIndex).toBe(2);
    });
  });
});
describe("updateFromTo", () => {
  let baseState;
  beforeEach(() => {
    baseState = reducer({}, resetCelList());
    baseState = reducer(baseState, addCel({ volume: 10, start: 0 }));
  });
  test("target is scale, then update from and to", () => {
    const state = reducer(
      baseState,
      updateFromTo({
        type: "scale",
        from: 12,
        to: 34,
      })
    );

    expect(state.list).toHaveLength(2);
    expect(state.list[1]).toHaveProperty("scale");

    const target = state.list[1].scale;

    expect(target.from).toBe(12);
    expect(target.to).toBe(34);

    // その他は変更なし
    expect(target.cycle).toBe(0);
    expect(target.isRoundTrip).toBe(false);
    expect(target.easing).toBe("easeLinear");
    expect(target.easingAdd).toBe("");
  });
  test("target is y.trig.amp, then update from and to", () => {
    // 一度easingをsinにして、trig系のパラメータを作る
    let state = reducer(
      baseState,
      updateEasing({
        type: "y",
        easing: "sin",
      })
    );
    state = reducer(
      state,
      updateFromTo({
        type: "y.trig.amp",
        from: 12,
        to: 34,
      })
    );

    expect(state.list).toHaveLength(2);
    expect(state.list[1]).toHaveProperty("y.trig.amp");

    const target = state.list[1].y.trig.amp;

    expect(target.from).toBe(12);
    expect(target.to).toBe(34);
  });
});
describe("updateCycle", () => {
  let baseState;
  beforeEach(() => {
    baseState = reducer({}, resetCelList());
    baseState = reducer(baseState, addCel({ volume: 10, start: 0 }));
  });
  test("target is x, then update cycle", () => {
    const state = reducer(
      baseState,
      updateCycle({
        type: "x",
        value: 7,
      })
    );

    expect(state.list).toHaveLength(2);
    expect(state.list[1]).toHaveProperty("x");

    const target = state.list[1].x;

    expect(target.cycle).toBe(7);

    // その他は変更なし
    expect(target.from).toBe(0);
    expect(target.to).toBe(0);
    expect(target.isRoundTrip).toBe(false);
    expect(target.easing).toBe("easeLinear");
    expect(target.easingAdd).toBe("");
  });
  test("target is x.trig.cycle, then update cycle", () => {
    // 一度easingをsinにして、trig系のパラメータを作る
    let state = reducer(
      baseState,
      updateEasing({
        type: "x",
        easing: "sin",
      })
    );
    state = reducer(
      state,
      updateCycle({
        type: "x.trig.cycle",
        value: 7,
      })
    );

    expect(state.list).toHaveLength(2);
    expect(state.list[1]).toHaveProperty("x.trig.cycle");

    const target = state.list[1].x.trig.cycle;

    expect(target.cycle).toBe(7);

    // その他は変更なし
    expect(target.from).toBe(0);
    expect(target.to).toBe(0);
    expect(target.isRoundTrip).toBe(false);
    expect(target.easing).toBe("fixed");
    expect(target.easingAdd).toBe("");
  });
});
describe("updateIsRoundTrip", () => {
  let baseState;
  beforeEach(() => {
    baseState = reducer({}, resetCelList());
    baseState = reducer(baseState, addCel({ volume: 10, start: 0 }));
  });
  test("target is opacity, then update cycle", () => {
    const state = reducer(
      baseState,
      updateIsRoundTrip({
        type: "opacity",
        value: true,
      })
    );

    expect(state.list).toHaveLength(2);
    expect(state.list[1]).toHaveProperty("opacity");

    const target = state.list[1].opacity;
    expect(target.isRoundTrip).toBe(true);

    // その他は変更なし
    expect(target.from).toBe(0);
    expect(target.to).toBe(0);
    expect(target.cycle).toBe(0);
    expect(target.easing).toBe("easeLinear");
    expect(target.easingAdd).toBe("");
  });
  test("target is opacity.trig.start, then update isRoundTrip", () => {
    // 一度easingをsinにして、trig系のパラメータを作る
    let state = reducer(
      baseState,
      updateEasing({
        type: "opacity",
        easing: "sin",
      })
    );
    state = reducer(
      state,
      updateIsRoundTrip({
        type: "opacity.trig.start",
        value: true,
      })
    );

    expect(state.list).toHaveLength(2);
    expect(state.list[1]).toHaveProperty("opacity.trig.start");

    const target = state.list[1].opacity.trig.start;
    expect(target.isRoundTrip).toBe(true);

    // その他は変更なし
    expect(target.from).toBe(0);
    expect(target.to).toBe(0);
    expect(target.cycle).toBe(0);
    expect(target.easing).toBe("fixed");
    expect(target.easingAdd).toBe("");
  });
});
describe("updateEasing", () => {
  let baseState;
  beforeEach(() => {
    baseState = reducer({}, resetCelList());
    baseState = reducer(baseState, addCel({ volume: 10, start: 0 }));
  });
  test("target is opacity, then update easing, easingAdd", () => {
    const state = reducer(
      baseState,
      updateEasing({
        type: "opacity",
        easing: "easePoly",
        easingAdd: "In",
      })
    );

    expect(state.list).toHaveLength(2);
    expect(state.list[1]).toHaveProperty("opacity");

    const target = state.list[1].opacity;

    expect(target.easing).toBe("easePoly");
    expect(target.easingAdd).toBe("In");

    // その他は変更なし
    expect(target.from).toBe(0);
    expect(target.to).toBe(0);
    expect(target.cycle).toBe(0);
    expect(target.isRoundTrip).toBe(false);
  });
  test("action.easingAdd is undefined, then easingAdd is empty string", () => {
    const state = reducer(
      baseState,
      updateEasing({
        type: "opacity",
        easing: "fixed",
      })
    );

    expect(state.list).toHaveLength(2);
    expect(state.list[1]).toHaveProperty("opacity");

    const target = state.list[1].opacity;

    expect(target.easing).toBe("fixed");
    expect(target.easingAdd).toBe("");

    // その他は変更なし
    expect(target.from).toBe(0);
    expect(target.to).toBe(0);
    expect(target.cycle).toBe(0);
    expect(target.isRoundTrip).toBe(false);
  });
  test("target is opacity.trig.amp, then update easing, easingAdd", () => {
    let state = reducer(
      baseState,
      updateEasing({
        type: "opacity",
        easing: "sin",
      })
    );
    state = reducer(
      state,
      updateEasing({
        type: "opacity.trig.amp",
        easing: "easeElastic",
        easingAdd: "All",
      })
    );

    expect(state.list).toHaveLength(2);
    expect(state.list[1]).toHaveProperty("opacity.trig.amp");

    const target = state.list[1].opacity.trig.amp;

    expect(target.easing).toBe("easeElastic");
    expect(target.easingAdd).toBe("All");

    // その他は変更なし
    expect(target.from).toBe(100);
    expect(target.to).toBe(100);
    expect(target.cycle).toBe(0);
    expect(target.isRoundTrip).toBe(false);

    const parent = state.list[1].opacity;
    // 親も変更なし
    expect(parent.from).toBe(0);
    expect(parent.to).toBe(0);
    expect(parent.cycle).toBe(0);
    expect(parent.isRoundTrip).toBe(false);
    expect(parent.easing).toBe("sin");
    expect(parent.easingAdd).toBe("");
  });
  describe("trig", () => {
    test("easing is easeLinear and trig is undefined, then noop trig", () => {
      const state = reducer(
        baseState,
        updateEasing({
          type: "y",
          easing: "easeLinear",
        })
      );
      expect(state.list).toHaveLength(2);
      expect(state.list[1].y).not.toHaveProperty("trig");
    });
    test("easing is sin and trig is undefined, then create it", () => {
      const state = reducer(
        baseState,
        updateEasing({
          type: "y",
          easing: "sin",
        })
      );

      expect(state.list).toHaveLength(2);
      expect(state.list[1].y).toHaveProperty("trig");
      expect(state.list[1].y.trig).toHaveProperty("center");
      expect(state.list[1].y.trig).toHaveProperty("amp");
      expect(state.list[1].y.trig).toHaveProperty("cycle");
      expect(state.list[1].y.trig).toHaveProperty("start");
    });
    test("easing is cos and trig is undefined, then create it", () => {
      const state = reducer(
        baseState,
        updateEasing({
          type: "y",
          easing: "cos",
        })
      );

      expect(state.list).toHaveLength(2);
      expect(state.list[1].y).toHaveProperty("trig");
      expect(state.list[1].y.trig).toHaveProperty("center");
      expect(state.list[1].y.trig).toHaveProperty("amp");
      expect(state.list[1].y.trig).toHaveProperty("cycle");
      expect(state.list[1].y.trig).toHaveProperty("start");
    });
    test("easing is cos and trig is Object, then noop", () => {
      // まずは一度sinにして作る
      let state = reducer(
        baseState,
        updateEasing({
          type: "y",
          easing: "sin",
        })
      );
      // 適当な値で更新
      state = reducer(
        state,
        updateEasing({
          type: "y.trig.amp",
          easing: "easeBack",
          easingAdd: "Out",
        })
      );
      // sin -> cosへ変更
      state = reducer(state, updateEasing({ type: "y", easing: "cos" }));

      expect(state.list).toHaveLength(2);
      expect(state.list[1]).toHaveProperty("y.trig.amp");

      const target = state.list[1].y.trig.amp;
      expect(target.easing).toBe("easeBack");
      expect(target.easingAdd).toBe("Out");
    });
    describe("init trig parameter", () => {
      test("center is copy from state.parent", () => {
        let preState = reducer(
          baseState,
          updateFromTo({
            type: "y",
            from: 10,
            to: 25,
          })
        );
        preState = reducer(
          preState,
          updateEasing({
            type: "y",
            easing: "easeBack",
            easingAdd: "Out",
          })
        );
        preState = reducer(preState, updateCycle({ type: "y", value: 3 }));
        preState = reducer(
          preState,
          updateIsRoundTrip({ type: "y", value: true })
        );
        const state = reducer(
          preState,
          updateEasing({
            type: "y",
            easing: "sin",
          })
        );

        expect(state.list[1]).toHaveProperty("y.trig.center");
        const target = state.list[1].y.trig.center;

        expect(target.from).toBe(10);
        expect(target.to).toBe(25);
        expect(target.cycle).toBe(3);
        expect(target.isRoundTrip).toBe(true);
        expect(target.easing).toBe("easeBack");
        expect(target.easingAdd).toBe("Out");
      });
      test.each([
        ["amp", 100, "easeLinear"],
        ["cycle", 0, "fixed"],
        ["start", 0, "fixed"],
      ])(
        "%s is FromTo: %i, Easing: %s, other is default",
        (name, value, easing) => {
          const state = reducer(
            baseState,
            updateEasing({ type: "y", easing: "sin" })
          );

          expect(state.list[1].y.trig).toHaveProperty(name);
          const target = state.list[1].y.trig[name];
          expect(target.from).toBe(value);
          expect(target.to).toBe(value);
          expect(target.cycle).toBe(0);
          expect(target.isRoundTrip).toBe(false);
          expect(target.easing).toBe(easing);
          expect(target.easingAdd).toBe("");
        }
      );
    });
  });
});
describe("updateEasingOptions", () => {
  let baseState;
  beforeEach(() => {
    baseState = reducer({}, resetCelList());
  });
  test("first update, then create easingOptions object", () => {
    const state = reducer(
      baseState,
      updateEasingOptions({
        type: "x",
        easing: "easePoly",
        value: { exponent: 3.5 },
      })
    );

    expect(state.list[0]).toHaveProperty("x.easingOptions");

    const target = state.list[0].x.easingOptions;
    expect(target).toHaveProperty("easePoly.exponent");
    expect(target.easePoly.exponent).toBe(3.5);
  });
  test("2nd update, then not create easingOptions object", () => {
    let state = reducer(
      baseState,
      updateEasingOptions({
        type: "x",
        easing: "easePoly",
        value: { exponent: 3.5 },
      })
    );
    state = reducer(
      state,
      updateEasingOptions({
        type: "x",
        easing: "easeBack",
        value: { overshoot: 1.0 },
      })
    );

    expect(state.list[0]).toHaveProperty("x.easingOptions");

    const target = state.list[0].x.easingOptions;
    expect(target).toHaveProperty("easeBack.overshoot");
    expect(target.easeBack.overshoot).toBe(1.0);
    expect(target).toHaveProperty("easePoly.exponent");
    expect(target.easePoly.exponent).toBe(3.5);
  });
  test('target is x.trig.amp, then update x.trig.amp.easingOptions', () => {
    // まず、Easingをsinにして、trigオブジェクトを作っておく
    let state = reducer(
      baseState,
      updateEasing({
        type: "x",
        easing: "sin",
      })
    );

    state = reducer(
      state,
      updateEasingOptions({
        type: "x.trig.amp",
        easing: "easePoly",
        value: { exponent: 3.5 },
      })
    );
    expect(state.list[0]).toHaveProperty("x.trig.amp.easingOptions");

    const target = state.list[0].x.trig.amp.easingOptions;
    expect(target).toHaveProperty("easePoly.exponent");
    expect(target.easePoly.exponent).toBe(3.5);
  })
});
