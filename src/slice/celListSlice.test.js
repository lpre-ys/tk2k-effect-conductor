import reducer, {
  addCel,
  copyCel,
  loadCelList,
  resetCelList,
  setCelIndex,
  setCelName,
  moveCel,
} from "./celListSlice";

test("return Initial state", () => {
  const state = reducer(undefined, { type: undefined });
  expect(state).toMatchObject({ celIndex: 0 });
});

describe("loadCelList", () => {
  test("change check", () => {
    // TODO
  });
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
    expect(state.list[1].pattern.align).toBe('loop');
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
