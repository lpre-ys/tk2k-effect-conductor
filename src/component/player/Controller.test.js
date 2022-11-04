import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Controller from "./Controller";

describe("Play / Pause", () => {
  describe("Play", () => {
    test("if not is runnning, then show play button", () => {
      render(<Controller isRunning={false} maxFrame={10} globalFrame={0} />);

      const target = screen.queryByTitle("play");
      expect(target).toBeInTheDocument();
    });
    test("if runnning, then hide play button", () => {
      render(<Controller isRunning={true} maxFrame={10} globalFrame={0} />);

      const target = screen.queryByTitle("play");
      expect(target).not.toBeInTheDocument();
    });
    test("click, then call playAnimation", () => {
      const mockFn = jest.fn();
      render(
        <Controller
          isRunning={false}
          maxFrame={10}
          globalFrame={0}
          playAnimation={mockFn}
        />
      );

      const target = screen.getByTitle("play");
      userEvent.click(target);

      expect(mockFn).toBeCalled();
    });
  });
  describe("Pause", () => {
    test("if not is runnning, then hide pause button", () => {
      render(<Controller isRunning={false} maxFrame={10} globalFrame={0} />);

      const target = screen.queryByTitle("pause");
      expect(target).not.toBeInTheDocument();
    });
    test("if runnning, then show pause button", () => {
      render(<Controller isRunning={true} maxFrame={10} globalFrame={0} />);

      const target = screen.queryByTitle("pause");
      expect(target).toBeInTheDocument();
    });
    test("click, then call stopAnimation", () => {
      const mockFn = jest.fn();
      render(
        <Controller
          isRunning={true}
          maxFrame={10}
          globalFrame={0}
          stopAnimation={mockFn}
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
    render(<Controller isRepeat={true} maxFrame={10} globalFrame={0} />);

    const target = screen.queryByTitle("repeat");
    expect(target).toBeInTheDocument();
    expect(target).toHaveStyle({ color: "#424242" });
  });
  test("is not repeat, then style is Off", () => {
    render(<Controller isRepeat={false} maxFrame={10} globalFrame={0} />);

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
        maxFrame={10}
        globalFrame={0}
        setIsRepeat={mockSet}
        stopAnimation={mockStop}
      />
    );

    const target = screen.getByTitle("repeat");
    userEvent.click(target);

    expect(mockSet).toBeCalledWith(true);
    expect(mockStop).toBeCalledWith();
  });
});

describe("Prev / Next", () => {
  test("click prev, then call changeConfig with globalFrame -1", () => {
    const mockFn = jest.fn();
    render(<Controller maxFrame={10} globalFrame={3} changeConfig={mockFn} />);

    const target = screen.getByTitle("prev");
    userEvent.click(target);

    expect(mockFn).toBeCalledWith('globalFrame', 2);
  });
  test("click next, then call changeConfig with globalFrame +1", () => {
    const mockFn = jest.fn();
    render(<Controller maxFrame={10} globalFrame={3} changeConfig={mockFn} />);

    const target = screen.getByTitle("next");
    userEvent.click(target);

    expect(mockFn).toBeCalledWith('globalFrame', 4);
  });
});

describe("frame", () => {
  test("change, then call changeConfig with globalFrame value - 1", () => {
    const mockFn = jest.fn();
    render(<Controller maxFrame={10} globalFrame={0} changeConfig={mockFn} />);

    const target = screen.getByTestId("controller-frame");
    fireEvent.change(target, { target: { value: "7" } });

    expect(mockFn).toBeCalledWith('globalFrame', 6);
  });
});

describe("maxFrame", () => {
  test("change, then call changeConfig with maxFrame and value", () => {
    const mockFn = jest.fn();
    render(
      <Controller
        maxFrame={10}
        globalFrame={0}
        changeConfig={mockFn}
      />
    );

    const target = screen.getByTestId("controller-max-frame");
    fireEvent.change(target, { target: { value: "30" } });

    expect(mockFn).toBeCalledWith("maxFrame", "30");
  });
});
