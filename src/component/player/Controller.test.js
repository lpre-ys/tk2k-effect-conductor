import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch } from "react-redux";
import { setFrame } from "../../slice/frameSlice";
import { renderWithProviders } from "../../util/renderWithProviders";
import Controller from "./Controller";

describe("Play / Pause", () => {
  describe("Play", () => {
    test("if not is runnning, then show play button", () => {
      renderWithProviders(<Controller isRunning={false} />);

      const target = screen.queryByTitle("play");
      expect(target).toBeInTheDocument();
    });
    test("if runnning, then hide play button", () => {
      renderWithProviders(<Controller isRunning={true} />);

      const target = screen.queryByTitle("play");
      expect(target).not.toBeInTheDocument();
    });
    test("click, then call playAnimation", () => {
      const mockFn = jest.fn();
      renderWithProviders(
        <Controller isRunning={false} playAnimation={mockFn} />
      );

      const target = screen.getByTitle("play");
      userEvent.click(target);

      expect(mockFn).toBeCalled();
    });
  });
  describe("Pause", () => {
    test("if not is runnning, then hide pause button", () => {
      renderWithProviders(<Controller isRunning={false} />);

      const target = screen.queryByTitle("pause");
      expect(target).not.toBeInTheDocument();
    });
    test("if runnning, then show pause button", () => {
      renderWithProviders(<Controller isRunning={true} />);

      const target = screen.queryByTitle("pause");
      expect(target).toBeInTheDocument();
    });
    test("click, then call stopAnimation", () => {
      const mockFn = jest.fn();
      renderWithProviders(
        <Controller isRunning={true} stopAnimation={mockFn} />
      );

      const target = screen.getByTitle("pause");
      userEvent.click(target);

      expect(mockFn).toBeCalled();
    });
  });
});
describe("repeat", () => {
  test("is repeat, then style is On", () => {
    renderWithProviders(<Controller isRepeat={true} />);

    const target = screen.queryByTitle("repeat");
    expect(target).toBeInTheDocument();
    expect(target).toHaveStyle({ color: "#fafafa" });
  });
  test("is not repeat, then style is Off", () => {
    renderWithProviders(<Controller isRepeat={false} />);

    const target = screen.queryByTitle("repeat");
    expect(target).toBeInTheDocument();
    expect(target).toHaveStyle({ color: "#eeeeee" });
  });
  test("click, then call setIsRepeat and stopAnimation", () => {
    const mockSet = jest.fn();
    const mockStop = jest.fn();
    renderWithProviders(
      <Controller
        isRepeat={false}
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
  test("click prev, then frame -1", () => {
    renderWithProviders(<Controller />);

    // 一旦3にしておく
    const input = screen.getByTestId("controller-frame");
    fireEvent.change(input, { target: { value: "3" } });

    const target = screen.getByTitle("prev");
    userEvent.click(target);

    expect(input).toHaveValue(2);
  });
  test("click next, then frame +1", () => {
    renderWithProviders(<Controller />);

    // 一旦3にしておく
    const input = screen.getByTestId("controller-frame");
    fireEvent.change(input, { target: { value: "3" } });

    const target = screen.getByTitle("next");
    userEvent.click(target);

    expect(input).toHaveValue(4);
  });
});

describe("frame", () => {
  test("change, then set Value", () => {
    renderWithProviders(<Controller />);

    const target = screen.getByTestId("controller-frame");
    fireEvent.change(target, { target: { value: "7" } });

    expect(target).toHaveValue(7);
  });
});

describe("maxFrame", () => {
  test("change, then set value", () => {
    renderWithProviders(<Controller />);

    const target = screen.getByTestId("controller-max-frame");
    fireEvent.change(target, { target: { value: "30" } });

    expect(target).toHaveValue(30);
  });
});
