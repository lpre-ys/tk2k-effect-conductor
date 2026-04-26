import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FRAME_SIZE, TIMELINE_HEIGHT } from "../../util/const";
import { calculateFrameAfterDrag } from "../../util/frameUtil";
import { TimeCelView } from "./TimeCelView";

const defaultConfig = {
  frame: { start: 1, volume: 10, isHideLast: false },
};

describe("isSelected", () => {
  test("index = celIndex, then has active (green) style", () => {
    render(
      <TimeCelView
        index={1}
        celIndex={1}
        selectedIndices={[1]}
        config={defaultConfig}
      />
    );

    const target = screen.getByTestId("time-cel-view");
    expect(target).toHaveStyle({ border: "1px solid #388e3c" });
  });
  test("index != celIndex, then not active style", () => {
    render(
      <TimeCelView
        index={1}
        celIndex={2}
        selectedIndices={[2]}
        config={defaultConfig}
      />
    );

    const target = screen.getByTestId("time-cel-view");
    expect(target).not.toHaveStyle({ border: "1px solid #388e3c" });
  });
  test("index in selectedIndices but not celIndex, then has secondary (blue) style", () => {
    render(
      <TimeCelView
        index={1}
        celIndex={2}
        selectedIndices={[1, 2]}
        config={defaultConfig}
      />
    );

    const target = screen.getByTestId("time-cel-view");
    expect(target).toHaveStyle({ border: "1px solid #1565c0" });
  });
  test("index not in selectedIndices and not celIndex, then no selection style", () => {
    render(
      <TimeCelView
        index={0}
        celIndex={2}
        selectedIndices={[1, 2]}
        config={defaultConfig}
      />
    );

    const target = screen.getByTestId("time-cel-view");
    expect(target).not.toHaveStyle({ border: "1px solid #388e3c" });
    expect(target).not.toHaveStyle({ border: "1px solid #1565c0" });
  });
});

// * 一旦、座標系のテストは無し。
describe("onClick", () => {
  test("index: 1, Clicked, then call setCelIndex(1)", () => {
    const mockFn = vi.fn();
    render(
      <TimeCelView
        index={1}
        celIndex={2}
        selectedIndices={[2]}
        config={defaultConfig}
        setCelIndex={mockFn}
      />
    );

    userEvent.click(screen.getByTestId("time-cel-view"));

    expect(mockFn).toBeCalledWith(1);
  });
  test("index: 42, Clicked, then call setCelIndex(42)", () => {
    const mockFn = vi.fn();
    render(
      <TimeCelView
        index={42}
        celIndex={1}
        selectedIndices={[1]}
        config={defaultConfig}
        setCelIndex={mockFn}
      />
    );

    userEvent.click(screen.getByTestId("time-cel-view"));

    expect(mockFn).toBeCalledWith(42);
  });
  test("Ctrl+Click, then call toggleSelectIndex", () => {
    const mockToggle = vi.fn();
    const mockSetCelIndex = vi.fn();
    render(
      <TimeCelView
        index={1}
        celIndex={0}
        selectedIndices={[0]}
        config={defaultConfig}
        setCelIndex={mockSetCelIndex}
        toggleSelectIndex={mockToggle}
      />
    );

    userEvent.click(screen.getByTestId("time-cel-view"), { ctrlKey: true });

    expect(mockToggle).toBeCalledWith(1);
    expect(mockSetCelIndex).not.toBeCalled();
  });
});

describe("calculateFrameAfterDrag", () => {
  describe("MOVE", () => {
    test("通常移動", () => {
      expect(calculateFrameAfterDrag("move", 5, 10, 3)).toEqual({ start: 8, volume: 10 });
    });
    test("start が 1 未満にはならない", () => {
      expect(calculateFrameAfterDrag("move", 1, 10, -5)).toEqual({ start: 1, volume: 10 });
    });
  });
  describe("RESIZE_LEFT", () => {
    test("左端を右に縮小", () => {
      expect(calculateFrameAfterDrag("resize-left", 5, 10, 2)).toEqual({ start: 7, volume: 8 });
    });
    test("end を超えて縮小できない（volume 最低 1）", () => {
      expect(calculateFrameAfterDrag("resize-left", 5, 10, 20)).toEqual({ start: 14, volume: 1 });
    });
    test("start が 1 未満にはならない", () => {
      expect(calculateFrameAfterDrag("resize-left", 3, 10, -5)).toEqual({ start: 1, volume: 12 });
    });
  });
  describe("RESIZE_RIGHT", () => {
    test("右端を右に拡張", () => {
      expect(calculateFrameAfterDrag("resize-right", 5, 10, 3)).toEqual({ start: 5, volume: 13 });
    });
    test("volume が 1 未満にはならない", () => {
      expect(calculateFrameAfterDrag("resize-right", 5, 10, -20)).toEqual({ start: 5, volume: 1 });
    });
  });
  test("不明な type はそのまま返す", () => {
    expect(calculateFrameAfterDrag("unknown", 5, 10, 3)).toEqual({ start: 5, volume: 10 });
  });
});

const dragConfig = {
  frame: { start: 5, volume: 10, isHideLast: false, isLoopBack: false },
};

describe("drag", () => {
  test("水平ドラッグで updateFrameMultiple が選択中インデックス全体で呼ばれる", () => {
    const mockUpdateFrameMultiple = vi.fn();
    render(
      <TimeCelView
        index={0}
        celIndex={0}
        selectedIndices={[0, 2]}
        config={dragConfig}
        setCelIndex={vi.fn()}
        setActiveIndex={vi.fn()}
        updateFrameMultiple={mockUpdateFrameMultiple}
        moveCelGroup={vi.fn()}
        maxFrame={20}
        listLength={3}
      />
    );

    const bar = screen.getByTestId("time-cel-view");
    fireEvent.mouseDown(bar, { clientX: 100, clientY: 100 });
    // deltaX=21 (>8 px threshold) → offsetFrame=Math.round(21/FRAME_SIZE)=1
    fireEvent.mouseMove(document, { clientX: 121, clientY: 100 });
    fireEvent.mouseUp(document);

    expect(mockUpdateFrameMultiple).toBeCalledWith({
      indices: [0, 2],
      offsetFrame: 1,
      type: "move",
    });
  });

  test("左ハンドルドラッグで updateFrameMultiple が呼ばれる（RESIZE_LEFT）", () => {
    const mockUpdateFrameMultiple = vi.fn();
    render(
      <TimeCelView
        index={0}
        celIndex={0}
        selectedIndices={[0]}
        config={dragConfig}
        setCelIndex={vi.fn()}
        setActiveIndex={vi.fn()}
        updateFrameMultiple={mockUpdateFrameMultiple}
        moveCelGroup={vi.fn()}
        maxFrame={20}
        listLength={3}
      />
    );

    const handle = screen.getByTestId("time-cel-handle-left");
    fireEvent.mouseDown(handle, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 121, clientY: 100 });
    fireEvent.mouseUp(document);

    expect(mockUpdateFrameMultiple).toBeCalledWith({
      indices: [0],
      offsetFrame: 1,
      type: "resize-left",
    });
  });

  test("右ハンドルドラッグで updateFrameMultiple が呼ばれる（RESIZE_RIGHT）", () => {
    const mockUpdateFrameMultiple = vi.fn();
    render(
      <TimeCelView
        index={0}
        celIndex={0}
        selectedIndices={[0]}
        config={dragConfig}
        setCelIndex={vi.fn()}
        setActiveIndex={vi.fn()}
        updateFrameMultiple={mockUpdateFrameMultiple}
        moveCelGroup={vi.fn()}
        maxFrame={20}
        listLength={3}
      />
    );

    const handle = screen.getByTestId("time-cel-handle-right");
    fireEvent.mouseDown(handle, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(document, { clientX: 121, clientY: 100 });
    fireEvent.mouseUp(document);

    expect(mockUpdateFrameMultiple).toBeCalledWith({
      indices: [0],
      offsetFrame: 1,
      type: "resize-right",
    });
  });

  test("縦ドラッグで moveCelGroup(delta) が呼ばれる", () => {
    const mockMoveCelGroup = vi.fn();
    render(
      <TimeCelView
        index={0}
        celIndex={0}
        selectedIndices={[0]}
        config={dragConfig}
        setCelIndex={vi.fn()}
        setActiveIndex={vi.fn()}
        updateFrameMultiple={vi.fn()}
        moveCelGroup={mockMoveCelGroup}
        maxFrame={20}
        listLength={3}
      />
    );

    const bar = screen.getByTestId("time-cel-view");
    fireEvent.mouseDown(bar, { clientX: 100, clientY: 100 });
    // deltaY=29 (>8 px threshold) → offsetRows=Math.round(29/TIMELINE_HEIGHT)=1
    fireEvent.mouseMove(document, { clientX: 100, clientY: 129 });
    fireEvent.mouseUp(document);

    expect(mockMoveCelGroup).toBeCalledWith(1);
  });
});

describe("isLoopBack", () => {
  test("isLoopBack=false のとき、バーは 1 つ", () => {
    render(
      <TimeCelView
        index={0}
        celIndex={0}
        selectedIndices={[0]}
        config={{ frame: { start: 5, volume: 5, isHideLast: false, isLoopBack: false } }}
        maxFrame={20}
        setCelIndex={vi.fn()}
      />
    );
    expect(screen.getAllByTestId("time-cel-view")).toHaveLength(1);
  });

  test("isLoopBack=true で末尾を超えない場合、バーは 1 つ", () => {
    render(
      <TimeCelView
        index={0}
        celIndex={0}
        selectedIndices={[0]}
        config={{ frame: { start: 5, volume: 5, isHideLast: false, isLoopBack: true } }}
        maxFrame={20}
        setCelIndex={vi.fn()}
      />
    );
    expect(screen.getAllByTestId("time-cel-view")).toHaveLength(1);
  });

  test("isLoopBack=true で末尾を超える場合、バーが 2 つ描画される", () => {
    render(
      <TimeCelView
        index={0}
        celIndex={0}
        selectedIndices={[0]}
        config={{ frame: { start: 15, volume: 10, isHideLast: false, isLoopBack: true } }}
        maxFrame={20}
        setCelIndex={vi.fn()}
      />
    );
    expect(screen.getAllByTestId("time-cel-view")).toHaveLength(2);
  });

  test("isLoopBack=true で volume > maxFrame のとき、左バーは描画されない", () => {
    render(
      <TimeCelView
        index={0}
        celIndex={0}
        selectedIndices={[0]}
        config={{ frame: { start: 5, volume: 25, isHideLast: false, isLoopBack: true } }}
        maxFrame={20}
        setCelIndex={vi.fn()}
      />
    );
    expect(screen.getAllByTestId("time-cel-view")).toHaveLength(1);
  });
});

describe("isHideLast", () => {
  test("not HideLast, then inside Width is outside Width - 2", () => {
    render(
      <TimeCelView
        index={1}
        celIndex={1}
        selectedIndices={[1]}
        config={defaultConfig}
      />
    );

    const outside = screen.getByTestId("time-cel-view");
    const inside = screen.getByTestId("time-cel-view-inside");

    const width = getComputedStyle(outside).width.replace("px", "");

    expect(inside).toHaveStyle({
      width: `${width - 2}px`,
    });
  });
  test("HideLast, then inside Width is outside Width - 2 - (FRAMESIZE - 5)", () => {
    const config = Object.assign({}, defaultConfig);
    config.frame = { ...defaultConfig.frame, isHideLast: true };
    render(
      <TimeCelView
        index={1}
        celIndex={1}
        selectedIndices={[1]}
        config={config}
      />
    );

    const outside = screen.getByTestId("time-cel-view");
    const inside = screen.getByTestId("time-cel-view-inside");

    const width = getComputedStyle(outside).width.replace("px", "");

    expect(inside).toHaveStyle({
      width: `${width - 2 - (FRAME_SIZE - 5)}px`,
    });
  });
});
