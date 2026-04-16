import reducer, {
  setFrame,
  setMaxFrame,
  nextFrame,
  prevFrame,
  loadFrameConfig,
  resetFrameConfig,
} from "./frameSlice";

test("return initial state", () => {
  const state = reducer(undefined, { type: undefined });
  expect(state).toEqual({ frame: 0, maxFrame: 20 });
});

describe("setFrame", () => {
  test("通常の値をセットできる", () => {
    const state = reducer({ frame: 0, maxFrame: 20 }, setFrame(5));
    expect(state.frame).toBe(5);
  });

  test("0をセットできる", () => {
    const state = reducer({ frame: 5, maxFrame: 20 }, setFrame(0));
    expect(state.frame).toBe(0);
  });

  test("負の値は無視される", () => {
    const state = reducer({ frame: 5, maxFrame: 20 }, setFrame(-1));
    expect(state.frame).toBe(5);
  });

  test("maxFrame と同じ値は無視される", () => {
    const state = reducer({ frame: 5, maxFrame: 20 }, setFrame(20));
    expect(state.frame).toBe(5);
  });

  test("maxFrame を超える値は無視される", () => {
    const state = reducer({ frame: 5, maxFrame: 20 }, setFrame(99));
    expect(state.frame).toBe(5);
  });

  test("maxFrame - 1 はセットできる", () => {
    const state = reducer({ frame: 0, maxFrame: 20 }, setFrame(19));
    expect(state.frame).toBe(19);
  });
});

describe("setMaxFrame", () => {
  test("maxFrame をセットできる", () => {
    const state = reducer({ frame: 0, maxFrame: 20 }, setMaxFrame(30));
    expect(state.maxFrame).toBe(30);
  });

  test("文字列の数値もパースされる", () => {
    const state = reducer({ frame: 0, maxFrame: 20 }, setMaxFrame("50"));
    expect(state.maxFrame).toBe(50);
  });

  test("99 を超える値は 99 にクランプされる", () => {
    const state = reducer({ frame: 0, maxFrame: 20 }, setMaxFrame(100));
    expect(state.maxFrame).toBe(99);
  });

  test("1 未満の値は 1 にクランプされる", () => {
    const state = reducer({ frame: 0, maxFrame: 20 }, setMaxFrame(0));
    expect(state.maxFrame).toBe(1);
  });
});

describe("nextFrame", () => {
  test("フレームが進む", () => {
    const state = reducer({ frame: 3, maxFrame: 20 }, nextFrame());
    expect(state.frame).toBe(4);
  });

  test("maxFrame に達したら 0 に戻る", () => {
    const state = reducer({ frame: 19, maxFrame: 20 }, nextFrame());
    expect(state.frame).toBe(0);
  });
});

describe("prevFrame", () => {
  test("フレームが戻る", () => {
    const state = reducer({ frame: 5, maxFrame: 20 }, prevFrame());
    expect(state.frame).toBe(4);
  });

  test("0 から戻ると maxFrame - 1 になる", () => {
    const state = reducer({ frame: 0, maxFrame: 20 }, prevFrame());
    expect(state.frame).toBe(19);
  });
});

describe("loadFrameConfig", () => {
  test("文字列の数値もパースされる", () => {
    const state = reducer(
      undefined,
      loadFrameConfig({ frame: "3", maxFrame: "15" })
    );
    expect(state.frame).toBe(3);
    expect(state.maxFrame).toBe(15);
  });
});

describe("resetFrameConfig", () => {
  test("初期状態に戻る", () => {
    const state = reducer({ frame: 10, maxFrame: 50 }, resetFrameConfig());
    expect(state).toEqual({ frame: 0, maxFrame: 20 });
  });
});
