import reducer, {
  updateHSVMax,
  updateHSVMin,
  setIsHsv,
} from "../slice/celListSlice";

const baseState = {
  celIndex: 0,
  drawKey: 0,
  list: [
    { hsv: { min: 0, max: 100, isHsv: false } },
    { hsv: { min: 10, max: 90, isHsv: true } },
  ],
};

describe("updateHSVMax", () => {
  test("celIndex のセルの max が更新される", () => {
    const state = reducer(baseState, updateHSVMax(80));
    expect(state.list[0].hsv.max).toBe(80);
  });
  test("他のセルは変わらない", () => {
    const state = reducer(baseState, updateHSVMax(80));
    expect(state.list[1].hsv.max).toBe(90);
  });
  test("celIndex が 1 のとき list[1] が更新される", () => {
    const state = reducer({ ...baseState, celIndex: 1 }, updateHSVMax(50));
    expect(state.list[1].hsv.max).toBe(50);
    expect(state.list[0].hsv.max).toBe(100);
  });
});

describe("updateHSVMin", () => {
  test("celIndex のセルの min が更新される", () => {
    const state = reducer(baseState, updateHSVMin(20));
    expect(state.list[0].hsv.min).toBe(20);
  });
  test("他のセルは変わらない", () => {
    const state = reducer(baseState, updateHSVMin(20));
    expect(state.list[1].hsv.min).toBe(10);
  });
});

describe("setIsHsv", () => {
  test("celIndex のセルの isHsv が true に更新される", () => {
    const state = reducer(baseState, setIsHsv(true));
    expect(state.list[0].hsv.isHsv).toBe(true);
  });
  test("celIndex のセルの isHsv が false に更新される", () => {
    const state = reducer({ ...baseState, celIndex: 1 }, setIsHsv(false));
    expect(state.list[1].hsv.isHsv).toBe(false);
  });
  test("他のセルは変わらない", () => {
    const state = reducer(baseState, setIsHsv(true));
    expect(state.list[1].hsv.isHsv).toBe(true);
  });
});
