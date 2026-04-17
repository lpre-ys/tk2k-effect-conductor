import reducer, {
  resetPlayer,
  loadPlayer,
  setBgImage,
  setBgColor,
  setZoom,
} from "./playerSlice";

test("return initial state", () => {
  const state = reducer(undefined, { type: undefined });
  expect(state).toEqual({
    bgImage: null,
    bgColor: "transparent",
    zoom: 2,
  });
});

describe("setBgImage", () => {
  test("bgImage をセットできる", () => {
    const state = reducer(undefined, setBgImage("bg.png"));
    expect(state.bgImage).toBe("bg.png");
  });
  test("null をセットできる", () => {
    const state = reducer({ bgImage: "bg.png", bgColor: "transparent", zoom: 2 }, setBgImage(null));
    expect(state.bgImage).toBeNull();
  });
});

describe("setBgColor", () => {
  test("bgColor をセットできる", () => {
    const state = reducer(undefined, setBgColor("#ff0000"));
    expect(state.bgColor).toBe("#ff0000");
  });
});

describe("setZoom", () => {
  test("zoom をセットできる", () => {
    const state = reducer(undefined, setZoom(4));
    expect(state.zoom).toBe(4);
  });
  test("文字列の数値もパースされる", () => {
    const state = reducer(undefined, setZoom("3"));
    expect(state.zoom).toBe(3);
  });
});

describe("loadPlayer", () => {
  test("全フィールドをまとめてロードできる", () => {
    const payload = { bgImage: "bg.png", bgColor: "#000000", zoom: 4 };
    const state = reducer(undefined, loadPlayer(payload));
    expect(state).toMatchObject(payload);
  });
});

describe("resetPlayer", () => {
  test("初期状態に戻る", () => {
    const modified = { bgImage: "bg.png", bgColor: "#000000", zoom: 4 };
    const state = reducer(modified, resetPlayer());
    expect(state).toEqual({ bgImage: null, bgColor: "transparent", zoom: 2 });
  });
});
