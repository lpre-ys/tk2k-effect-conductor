import reducer, {
  updateFromTo,
  updateCycle,
  updateIsRoundTrip,
  updateEasing,
  updateEasingOptions,
} from "../slice/celListSlice";

const baseParam = {
  from: 0, to: 0, cycle: 0, isRoundTrip: false, easing: "easeLinear", easingAdd: "",
};

const baseState = {
  celIndex: 0,
  drawKey: 0,
  list: [{
    x: { ...baseParam },
    y: { ...baseParam },
  }],
};

describe("updateFromTo", () => {
  test("単層（x）の from/to が更新される", () => {
    const state = reducer(baseState, updateFromTo({ type: "x", from: 10, to: 20 }));
    expect(state.list[0].x.from).toBe(10);
    expect(state.list[0].x.to).toBe(20);
  });
  test("他のパラメータ（y）は変わらない", () => {
    const state = reducer(baseState, updateFromTo({ type: "x", from: 10, to: 20 }));
    expect(state.list[0].y.from).toBe(0);
  });
  test("trig 層（x.trig.amp）の from/to が更新される", () => {
    const stateWithTrig = {
      ...baseState,
      list: [{
        x: { ...baseParam, trig: { amp: { from: 0, to: 0 }, center: {}, cycle: {}, start: {} } },
      }],
    };
    const state = reducer(stateWithTrig, updateFromTo({ type: "x.trig.amp", from: 50, to: 100 }));
    expect(state.list[0].x.trig.amp.from).toBe(50);
    expect(state.list[0].x.trig.amp.to).toBe(100);
  });
});

describe("updateCycle", () => {
  test("単層（x）の cycle が更新される", () => {
    const state = reducer(baseState, updateCycle({ type: "x", value: 5 }));
    expect(state.list[0].x.cycle).toBe(5);
  });
  test("trig 層（x.trig.amp）の cycle が更新される", () => {
    const stateWithTrig = {
      ...baseState,
      list: [{
        x: { ...baseParam, trig: { amp: { cycle: 0 }, center: {}, cycle: {}, start: {} } },
      }],
    };
    const state = reducer(stateWithTrig, updateCycle({ type: "x.trig.amp", value: 3 }));
    expect(state.list[0].x.trig.amp.cycle).toBe(3);
  });
});

describe("updateIsRoundTrip", () => {
  test("単層（x）の isRoundTrip が更新される", () => {
    const state = reducer(baseState, updateIsRoundTrip({ type: "x", value: true }));
    expect(state.list[0].x.isRoundTrip).toBe(true);
  });
  test("trig 層（x.trig.amp）の isRoundTrip が更新される", () => {
    const stateWithTrig = {
      ...baseState,
      list: [{
        x: { ...baseParam, trig: { amp: { isRoundTrip: false }, center: {}, cycle: {}, start: {} } },
      }],
    };
    const state = reducer(stateWithTrig, updateIsRoundTrip({ type: "x.trig.amp", value: true }));
    expect(state.list[0].x.trig.amp.isRoundTrip).toBe(true);
  });
});

describe("updateEasing", () => {
  test("通常 easing が更新される", () => {
    const state = reducer(baseState, updateEasing({ type: "x", easing: "easeInOut", easingAdd: "" }));
    expect(state.list[0].x.easing).toBe("easeInOut");
  });
  test("easingAdd が更新される", () => {
    const state = reducer(baseState, updateEasing({ type: "x", easing: "easePoly", easingAdd: "In" }));
    expect(state.list[0].x.easingAdd).toBe("In");
  });
  test("sin 指定で trig オブジェクトが自動生成される", () => {
    const state = reducer(baseState, updateEasing({ type: "x", easing: "sin", easingAdd: "" }));
    expect(state.list[0].x.easing).toBe("sin");
    expect(state.list[0].x.trig).toBeDefined();
    expect(state.list[0].x.trig.center).toBeDefined();
  });
  test("trig 層（x.trig.amp）の easing が更新される", () => {
    const stateWithTrig = {
      ...baseState,
      list: [{
        x: { ...baseParam, trig: { amp: { easing: "easeLinear", easingAdd: "" }, center: {}, cycle: {}, start: {} } },
      }],
    };
    const state = reducer(stateWithTrig, updateEasing({ type: "x.trig.amp", easing: "easeInOut", easingAdd: "" }));
    expect(state.list[0].x.trig.amp.easing).toBe("easeInOut");
  });
});

describe("updateEasingOptions", () => {
  test("easingOptions が未存在のとき作成される", () => {
    const state = reducer(baseState, updateEasingOptions({
      type: "x", easing: "easePoly", value: { exponent: 3 },
    }));
    expect(state.list[0].x.easingOptions).toBeDefined();
    expect(state.list[0].x.easingOptions.easePoly).toEqual({ exponent: 3 });
  });
  test("既存の easingOptions に追記される", () => {
    const stateWithOptions = {
      ...baseState,
      list: [{
        x: { ...baseParam, easingOptions: { easeBack: { overshoot: 1.7 } } },
      }],
    };
    const state = reducer(stateWithOptions, updateEasingOptions({
      type: "x", easing: "easePoly", value: { exponent: 2 },
    }));
    expect(state.list[0].x.easingOptions.easeBack).toEqual({ overshoot: 1.7 });
    expect(state.list[0].x.easingOptions.easePoly).toEqual({ exponent: 2 });
  });
});
