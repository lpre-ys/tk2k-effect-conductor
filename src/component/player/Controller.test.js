import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Controller } from "./Controller";

describe("Play / Pause", () => {
  describe("Play", () => {
    test("if not is runnning, then show play button", () => {
      render(<Controller isRunning={false} frame={0} maxFrame={10} />);

      const target = screen.queryByTitle("play");
      expect(target).toBeInTheDocument();
    });
    test("if runnning, then hide play button", () => {
      render(<Controller isRunning={true} frame={0} maxFrame={10} />);

      const target = screen.queryByTitle("play");
      expect(target).not.toBeInTheDocument();
    });
    test("click, then call playAnimation", () => {
      const mockFn = jest.fn();
      render(
        <Controller
          isRunning={false}
          playAnimation={mockFn}
          frame={0}
          maxFrame={10}
        />
      );

      const target = screen.getByTitle("play");
      userEvent.click(target);

      expect(mockFn).toBeCalled();
    });
  });
  describe("Pause", () => {
    test("if not is runnning, then hide pause button", () => {
      render(<Controller isRunning={false} frame={0} maxFrame={10} />);

      const target = screen.queryByTitle("pause");
      expect(target).not.toBeInTheDocument();
    });
    test("if runnning, then show pause button", () => {
      render(<Controller isRunning={true} frame={0} maxFrame={10} />);

      const target = screen.queryByTitle("pause");
      expect(target).toBeInTheDocument();
    });
    test("click, then call stopAnimation", () => {
      const mockFn = jest.fn();
      render(
        <Controller
          isRunning={true}
          stopAnimation={mockFn}
          frame={0}
          maxFrame={10}
        />
      );

      const target = screen.getByTitle("pause");
      userEvent.click(target);

      expect(mockFn).toBeCalled();
    });
  });
});
describe("repeat", () => {
  test("is repeat, then style is On", () => {
    render(<Controller isRepeat={true} frame={0} maxFrame={10} />);

    const target = screen.queryByTitle("repeat");
    expect(target).toBeInTheDocument();
    expect(target).toHaveStyle({ color: "#fafafa" });
  });
  test("is not repeat, then style is Off", () => {
    render(<Controller isRepeat={false} frame={0} maxFrame={10} />);

    const target = screen.queryByTitle("repeat");
    expect(target).toBeInTheDocument();
    expect(target).toHaveStyle({ color: "#eeeeee" });
  });
  test("click, then call setIsRepeat and stopAnimation", () => {
    const mockSet = jest.fn();
    const mockStop = jest.fn();
    render(
      <Controller
        isRepeat={false}
        setIsRepeat={mockSet}
        stopAnimation={mockStop}
        frame={0}
        maxFrame={10}
      />
    );

    const target = screen.getByTitle("repeat");
    userEvent.click(target);

    expect(mockSet).toBeCalledWith(true);
    expect(mockStop).toBeCalledWith();
  });
});

describe("Prev / Next", () => {
  test("click prev, then setFrame -1", () => {
    const mockFn = jest.fn();
    render(<Controller frame={3} maxFrame={10} setFrame={mockFn} />);

    const target = screen.getByTitle("prev");
    userEvent.click(target);

    expect(mockFn).toBeCalledWith(2);
  });
  test("click next, then setFrame +1", () => {
    const mockFn = jest.fn();
    render(<Controller frame={3} maxFrame={10} setFrame={mockFn} />);

    const target = screen.getByTitle("next");
    userEvent.click(target);

    expect(mockFn).toBeCalledWith(4);
  });
});

describe("frame", () => {
  test("change, then setFrane: value - 1", () => {
    const mockFn = jest.fn();
    render(<Controller frame={3} maxFrame={10} setFrame={mockFn} />);

    const target = screen.getByTestId("controller-frame");
    fireEvent.change(target, { target: { value: "7" } });

    expect(mockFn).toBeCalledWith(6);
  });
});

describe("maxFrame", () => {
  test("change, then setMaxFrame: value", () => {
    const mockFn = jest.fn();
    render(<Controller frame={3} maxFrame={10} setMaxFrame={mockFn} />);

    const target = screen.getByTestId("controller-max-frame");
    fireEvent.change(target, { target: { value: "30" } });

    expect(mockFn).toBeCalledWith("30");
  });
});
