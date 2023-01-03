import reducer, {
  addCel,
  copyCel,
  resetCelList,
  setCelIndex,
} from "./celListSlice";

test("return Initial state", () => {
  const state = reducer(undefined, { type: undefined });
  expect(state).toMatchObject({ celIndex: 0 });
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
