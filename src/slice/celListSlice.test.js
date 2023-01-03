import reducer, {
  addCel,
  copyCel,
  loadCelList,
  resetCelList,
  setCelIndex,
  setCelName,
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
      { name: "test2", frame: { isLoopBack: true } }
    );
    const state = reducer(undefined, loadCelList(data));
    expect(state.list).toHaveLength(4);
    expect(state.list[0].name).toBe("セル1");
    expect(state.list[1].name).toBe("test");
    expect(state.list[2].name).toBe("セル3");
    expect(state.list[3].name).toBe("test2");
    expect(state.list[0].frame).toMatchObject({ isLoopBack: false });
    expect(state.list[1].frame).toMatchObject({
      isLoopBack: false,
      isHideLast: true,
    });
    expect(state.list[2].frame).toMatchObject({ isLoopBack: true });
    expect(state.list[3].frame).toMatchObject({ isLoopBack: true });
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
