import reducer, {
  setTitle,
  setImage,
  setTarget,
  setYLine,
  clearRawEffect,
  loadInfo,
  loadFromTk2k,
  resetInfo,
} from "./infoSlice";

test("return initial state", () => {
  const state = reducer(undefined, { type: undefined });
  expect(state).toEqual({
    title: "",
    image: "",
    rawEffect: false,
    target: 0,
    yLine: 1,
  });
});

describe("setTitle", () => {
  test("title をセットできる", () => {
    const state = reducer(undefined, setTitle("テストアニメ"));
    expect(state.title).toBe("テストアニメ");
  });
});

describe("setImage", () => {
  test("image をセットできる", () => {
    const state = reducer(undefined, setImage("effect.png"));
    expect(state.image).toBe("effect.png");
  });
});

describe("setTarget", () => {
  test("target をセットできる", () => {
    const state = reducer(undefined, setTarget(1));
    expect(state.target).toBe(1);
  });
});

describe("setYLine", () => {
  test("yLine をセットできる", () => {
    const state = reducer(undefined, setYLine(2));
    expect(state.yLine).toBe(2);
  });
});

describe("clearRawEffect", () => {
  test("rawEffect を false にする", () => {
    const state = reducer({ title: "", image: "", rawEffect: true, target: 0, yLine: 1 }, clearRawEffect());
    expect(state.rawEffect).toBe(false);
  });
});

describe("loadInfo", () => {
  test("全フィールドをまとめてロードできる", () => {
    const payload = { title: "読込", image: "a.png", rawEffect: true, target: 1, yLine: 0 };
    const state = reducer(undefined, loadInfo(payload));
    expect(state).toMatchObject(payload);
  });
});

describe("loadFromTk2k", () => {
  test("clipData のフィールドをマッピングしてロードできる", () => {
    const clipData = {
      title: "ツクールから",
      material: "battle.png",
      target: 1,
      yLine: 2,
      rawEffect: true,
    };
    const state = reducer(undefined, loadFromTk2k(clipData));
    expect(state.title).toBe("ツクールから");
    expect(state.image).toBe("battle.png");
    expect(state.target).toBe(1);
    expect(state.yLine).toBe(2);
    expect(state.rawEffect).toBe(true);
  });
});

describe("resetInfo", () => {
  test("初期状態に戻る", () => {
    const modified = { title: "変更済み", image: "a.png", rawEffect: true, target: 1, yLine: 0 };
    const state = reducer(modified, resetInfo());
    expect(state).toEqual({ title: "", image: "", rawEffect: false, target: 0, yLine: 1 });
  });
});
