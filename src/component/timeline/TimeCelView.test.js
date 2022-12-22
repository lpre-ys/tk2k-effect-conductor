import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FRAME_SIZE } from "../../util/const";
import { TimeCelView } from "./TimeCelView";

const defaultConfig = {
  frame: { start: 1, volume: 10, isHideLast: false },
};

describe("isSelected", () => {
  test("index = celIndex, then has Selected Style", () => {
    render(<TimeCelView index={1} celIndex={1} config={defaultConfig} />);

    const target = screen.getByTestId("time-cel-view");
    expect(target).toHaveStyle({
      border: "1px solid #388e3c",
    });
  });
  test("index != celIndex, then not Selected Style", () => {
    render(<TimeCelView index={1} celIndex={2} config={defaultConfig} />);

    const target = screen.getByTestId("time-cel-view");
    expect(target).not.toHaveStyle({
      border: "1px solid #388e3c",
    });
  });
});

// * 一旦、座標系のテストは無し。
describe("onClick", () => {
  test("index: 1, Clicked, then call setCelIndex(1)", () => {
    const mockFn = jest.fn();
    render(
      <TimeCelView
        index={1}
        celIndex={2}
        config={defaultConfig}
        setCelIndex={mockFn}
      />
    );

    userEvent.click(screen.getByTestId("time-cel-view"));

    expect(mockFn).toBeCalledWith("1");
  });
  test("index: 42, Clicked, then call setCelIndex(42)", () => {
    const mockFn = jest.fn();
    render(
      <TimeCelView
        index={42}
        celIndex={1}
        config={defaultConfig}
        setCelIndex={mockFn}
      />
    );

    userEvent.click(screen.getByTestId("time-cel-view"));

    expect(mockFn).toBeCalledWith("42");
  });
});

describe("isHideLast", () => {
  test("not HideLast, then inside Width is outside Width - 2", () => {
    render(<TimeCelView index={1} celIndex={1} config={defaultConfig} />);

    const outside = screen.getByTestId("time-cel-view");
    const inside = screen.getByTestId("time-cel-view-inside");

    const width = getComputedStyle(outside).width.replace("px", "");

    expect(inside).toHaveStyle({
      width: `${width - 2}px`,
    });
  });
  test("HideLast, then inside Width is outside Width - 2 - (FRAMESIZE - 5)", () => {
    const config = Object.assign({}, defaultConfig);
    config.frame.isHideLast = true;
    render(<TimeCelView index={1} celIndex={1} config={config} />);

    const outside = screen.getByTestId("time-cel-view");
    const inside = screen.getByTestId("time-cel-view-inside");

    const width = getComputedStyle(outside).width.replace("px", "");

    expect(inside).toHaveStyle({
      width: `${width - 2 - (FRAME_SIZE - 5)}px`,
    });
  });
});
