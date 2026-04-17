import reducer, {
  loadOriginalImage,
  changeTrColor,
  changeBgColor,
  loadMaterial,
  resetMaterial,
} from "./materialSlice";

test("return initial state", () => {
  const state = reducer(undefined, { type: undefined });
  expect(state).toMatchObject({
    originalImage: null,
    trImage: null,
    maxPage: 0,
    trColor: { r: 0, g: 0, b: 0 },
    bgColor: "transparent",
  });
  expect(typeof state.key).toBe("number");
});

describe("loadOriginalImage", () => {
  test("各フィールドがセットされる", () => {
    const payload = {
      dataUrl: "data:image/png;base64,abc",
      transparent: "data:image/png;base64,def",
      maxPage: 10,
      trColor: { r: 0, g: 255, b: 0 },
    };
    const state = reducer(undefined, loadOriginalImage(payload));
    expect(state.originalImage).toBe(payload.dataUrl);
    expect(state.trImage).toBe(payload.transparent);
    expect(state.maxPage).toBe(10);
    expect(state.trColor).toEqual({ r: 0, g: 255, b: 0 });
  });

  test("key が更新される", () => {
    const initial = reducer(undefined, { type: undefined });
    const oldKey = initial.key;
    const next = reducer(initial, loadOriginalImage({
      dataUrl: "data:image/png;base64,abc",
      transparent: "data:image/png;base64,def",
      maxPage: 5,
      trColor: { r: 0, g: 0, b: 0 },
    }));
    expect(next.key).not.toBe(oldKey);
  });
});

describe("changeTrColor", () => {
  test("trImage と trColor が更新される", () => {
    const state = reducer(undefined, changeTrColor({
      transparent: "data:image/png;base64,new",
      trColor: { r: 255, g: 0, b: 0 },
    }));
    expect(state.trImage).toBe("data:image/png;base64,new");
    expect(state.trColor).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe("changeBgColor", () => {
  test("bgColor が更新される", () => {
    const state = reducer(undefined, changeBgColor("#ff0000"));
    expect(state.bgColor).toBe("#ff0000");
  });
});

describe("loadMaterial", () => {
  test("フィールドをまとめてロードできる", () => {
    const payload = {
      originalImage: "data:image/png;base64,abc",
      trImage: "data:image/png;base64,def",
      maxPage: 5,
      trColor: { r: 0, g: 128, b: 0 },
      bgColor: "#ffffff",
    };
    const state = reducer(undefined, loadMaterial(payload));
    expect(state).toMatchObject(payload);
  });
});

describe("resetMaterial", () => {
  test("初期状態に戻る", () => {
    const modified = {
      key: 999,
      originalImage: "data:image/png;base64,abc",
      trImage: "data:image/png;base64,def",
      maxPage: 10,
      trColor: { r: 255, g: 0, b: 0 },
      bgColor: "#000000",
    };
    const state = reducer(modified, resetMaterial());
    expect(state).toMatchObject({
      originalImage: null,
      trImage: null,
      maxPage: 0,
      trColor: { r: 0, g: 0, b: 0 },
      bgColor: "transparent",
    });
  });
});
