import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimeCelView } from "./TimeCelView";

const defaultConfig = {
  frame: { start: 1, volume: 10 },
};

describe("isSelected", () => {
  test("index = celIndex, then has Selected Style", () => {
    render(<TimeCelView index={1} celIndex={1} config={defaultConfig} />);

    const target = screen.getByTestId("time-cel-view");
    expect(target).toHaveStyle({
      background: "rgba(165, 214, 167, 0.7)",
    });
  });
  test("index != celIndex, then not Selected Style", () => {
    render(<TimeCelView index={1} celIndex={2} config={defaultConfig} />);

    const target = screen.getByTestId("time-cel-view");
    expect(target).not.toHaveStyle({
      background: "rgba(165, 214, 167, 0.7)",
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