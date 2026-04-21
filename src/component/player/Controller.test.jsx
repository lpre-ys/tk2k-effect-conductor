import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Controller } from "./Controller";

beforeAll(() => {
  window.requestAnimationFrame = vi.fn();
  window.cancelAnimationFrame = vi.fn();
});

beforeEach(() => {
  window.requestAnimationFrame.mockReset();
  window.cancelAnimationFrame.mockReset();
});

describe("Play / Pause", () => {
  describe("Play", () => {
    test("INIT, then show play button", () => {
      render(<Controller frame={0} maxFrame={10} />);

      const target = screen.queryByTitle("play");
      expect(target).toBeInTheDocument();
    });
    test("click, then call playAnimation", () => {
      render(<Controller frame={0} maxFrame={10} />);

      const target = screen.getByTitle("play");
      userEvent.click(target);

      expect(window.requestAnimationFrame).toBeCalledTimes(1);
    });
    test("if runnning, then hide play button", () => {
      render(<Controller frame={0} maxFrame={10} />);

      // play
      const target = screen.getByTitle("play");
      userEvent.click(target);

      expect(screen.queryByTitle("play")).not.toBeInTheDocument();
    });
  });
  describe("Pause", () => {
    test("INIT, then hide pause button", () => {
      render(<Controller frame={0} maxFrame={10} />);

      const target = screen.queryByTitle("pause");
      expect(target).not.toBeInTheDocument();
    });
    test("if runnning, then show pause button", () => {
      render(<Controller frame={0} maxFrame={10} />);

      const play = screen.getByTitle("play");
      userEvent.click(play);

      const target = screen.queryByTitle("pause");
      expect(target).toBeInTheDocument();
    });
    test("click, then call stopAnimation", () => {
      render(<Controller frame={0} maxFrame={10} />);

      const play = screen.getByTitle("play");
      userEvent.click(play);

      const target = screen.getByTitle("pause");
      userEvent.click(target);

      expect(window.cancelAnimationFrame).toBeCalledTimes(1);
    });
  });
});
describe("repeat", () => {
  test("INIT, then style is Off", () => {
    render(<Controller frame={0} maxFrame={10} />);

    const target = screen.queryByTitle("repeat");
    expect(target).toBeInTheDocument();
    expect(target).toHaveStyle({ color: "#eeeeee" });
  });
  test("click once, then style is On", () => {
    render(<Controller frame={0} maxFrame={10} />);

    const repeat = screen.getByTitle("repeat");
    userEvent.click(repeat);

    const target = screen.queryByTitle("repeat");
    expect(target).toBeInTheDocument();
    expect(target).toHaveStyle({ color: "#fafafa" });
  });
  test("click twice, then style is Off", () => {
    render(<Controller frame={0} maxFrame={10} />);

    const repeat = screen.getByTitle("repeat");
    userEvent.click(repeat);
    userEvent.click(repeat);

    const target = screen.queryByTitle("repeat");
    expect(target).toBeInTheDocument();
    expect(target).toHaveStyle({ color: "#eeeeee" });
  });
  test("click, then call stopAnimation", () => {
    render(<Controller frame={0} maxFrame={10} />);

    const target = screen.getByTitle("repeat");
    userEvent.click(target);

    expect(window.cancelAnimationFrame).toBeCalledTimes(1);
  });
});

describe("Prev / Next", () => {
  test("click prev, then call prevFrame", () => {
    const mockFn = vi.fn();
    render(<Controller frame={3} maxFrame={10} prevFrame={mockFn} />);

    const target = screen.getByTitle("prev");
    userEvent.click(target);

    expect(mockFn).toBeCalledTimes(1);
  });
  test("click prev, then call stopAnimation", () => {
    const mockFn = vi.fn();
    render(<Controller frame={3} maxFrame={10} prevFrame={mockFn} />);

    const target = screen.getByTitle("prev");
    userEvent.click(target);

    expect(window.cancelAnimationFrame).toBeCalledTimes(1);
  });
  test("click next, then call nextFrame", () => {
    const mockFn = vi.fn();
    render(<Controller frame={3} maxFrame={10} nextFrame={mockFn} />);

    const target = screen.getByTitle("next");
    userEvent.click(target);

    expect(mockFn).toBeCalledTimes(1);
  });
  test("click next, then call stopAnimation", () => {
    const mockFn = vi.fn();
    render(<Controller frame={3} maxFrame={10} nextFrame={mockFn} />);

    const target = screen.getByTitle("next");
    userEvent.click(target);

    expect(window.cancelAnimationFrame).toBeCalledTimes(1);
  });
});

describe("frame", () => {
  test("change, then setFrane: value - 1", () => {
    const mockFn = vi.fn();
    render(<Controller frame={3} maxFrame={10} setFrame={mockFn} />);

    const target = screen.getByTestId("controller-frame");
    fireEvent.change(target, { target: { value: "7" } });

    expect(mockFn).toBeCalledWith(6);
  });
});

describe("maxFrame", () => {
  test("change, then setMaxFrame: value", () => {
    const mockFn = vi.fn();
    render(<Controller frame={3} maxFrame={10} setMaxFrame={mockFn} />);

    const target = screen.getByTestId("controller-max-frame");
    fireEvent.change(target, { target: { value: "30" } });

    expect(mockFn).toBeCalledWith("30");
  });
});

describe("2回目の再生", () => {
  test("1回目停止後に再生しても timeCounter がリセットされており即時フレームスキップしない", () => {
    let animationCallback;
    window.requestAnimationFrame.mockImplementation((cb) => {
      animationCallback = cb;
      return 1;
    });

    const mockSetFrame = vi.fn();
    render(<Controller frame={0} maxFrame={20} setFrame={mockSetFrame} />);

    // 1回目の再生 - prevTimeStamp を 1000 に設定
    userEvent.click(screen.getByTitle("play"));
    act(() => { animationCallback(1000); });

    // 停止
    userEvent.click(screen.getByTitle("pause"));

    // 2回目の再生（6000ms 後を模倣）
    mockSetFrame.mockClear();
    userEvent.click(screen.getByTitle("play"));
    // リセット済みなら prevTimestamp=undefined → delta=0 → フレーム進まない
    // リセット未実施なら 6000-1000=5000ms → 150フレーム分スキップ
    act(() => { animationCallback(6000); });

    expect(mockSetFrame).not.toBeCalled();
  });
});

describe("handleKeyDown", () => {
  describe("Left key down", () => {
    test("then call prevFrame", () => {
      const mockFn = vi.fn();
      render(<Controller frame={3} maxFrame={10} prevFrame={mockFn} />);

      userEvent.keyboard("{arrowleft}");

      expect(mockFn).toBeCalledTimes(1);
    });
    test("then call stopAnimation", () => {
      const mockFn = vi.fn();
      render(<Controller frame={3} maxFrame={10} prevFrame={mockFn} />);

      userEvent.keyboard("{arrowleft}");

      expect(window.cancelAnimationFrame).toBeCalledTimes(1);
    });
  });
  describe("Right key down", () => {
    test("then call nextFrame", () => {
      const mockFn = vi.fn();
      render(<Controller frame={3} maxFrame={10} nextFrame={mockFn} />);

      userEvent.keyboard("{arrowright}");

      expect(mockFn).toBeCalledTimes(1);
    });
    test("then call stopAnimation", () => {
      const mockFn = vi.fn();
      render(<Controller frame={3} maxFrame={10} nextFrame={mockFn} />);

      userEvent.keyboard("{arrowright}");

      expect(window.cancelAnimationFrame).toBeCalledTimes(1);
    });
  });

  test("Space key down, target tag is BUTTON, then noop", () => {
    render(<Controller frame={3} maxFrame={10} />);
    fireEvent.keyDown(document, {
      target: { tagName: "BUTTON" },
      key: " ",
    });

    expect(window.requestAnimationFrame).not.toBeCalled();
  });
  test("Space key down, target tag is not BUTTON, then call Playpause", () => {
    render(<Controller frame={3} maxFrame={10} />);
    fireEvent.keyDown(document, {
      target: { tagName: "test" },
      key: " ",
    });

    expect(window.requestAnimationFrame).toBeCalled();
  });
  test("Space key down while running, then call stopAnimation", () => {
    render(<Controller frame={3} maxFrame={10} />);

    // 再生開始
    const play = screen.getByTitle("play");
    userEvent.click(play);

    // スペースキーで停止
    fireEvent.keyDown(document, {
      target: { tagName: "test" },
      key: " ",
    });

    expect(window.cancelAnimationFrame).toBeCalledTimes(1);
  });
});
