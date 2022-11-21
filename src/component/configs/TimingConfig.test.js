import { fireEvent, render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import { TimingConfig } from "./TimingConfig";

const update = jest.fn();

// * Start
describe("Start", () => {
  test("default value is config.start", () => {
    render(<TimingConfig config={{ start: 42, volume: 10 }} />);

    const target = screen.getByTestId("timing-start");
    expect(target).toHaveValue(42);
  });
  describe("Error", () => {
    test("invalid, then show error", () => {
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={update} />
      );

      fireEvent.change(screen.getByTestId("timing-start"), {
        target: { value: "a" },
      });

      expect(screen.getByTestId("timing-start")).toHaveStyle({
        color: "#b71c1c",
      });
    });
    test("valid, then not show error style", () => {
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={update} />
      );

      fireEvent.change(screen.getByTestId("timing-start"), {
        target: { value: "10" },
      });

      expect(screen.getByTestId("timing-start")).not.toHaveStyle({
        color: "#b71c1c",
      });
    });
    test("invalid to valid, then not show error style", () => {
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={update} />
      );

      const target = screen.getByTestId("timing-start");

      fireEvent.change(target, {
        target: { value: "aaa" },
      });
      fireEvent.change(target, {
        target: { value: "10" },
      });

      expect(target).not.toHaveStyle({
        color: "#b71c1c",
      });
    });
  });
  describe("link End", () => {
    test("set valid value, then calc End value", () => {
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={update} />
      );

      fireEvent.change(screen.getByTestId("timing-start"), {
        target: { value: "5" },
      });

      expect(screen.getByTestId("timing-end")).toHaveValue("14");
    });
    test("set valid value, then reset End error", () => {
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={update} />
      );

      fireEvent.change(screen.getByTestId("timing-end"), {
        target: { value: "a" },
      });
      fireEvent.change(screen.getByTestId("timing-volume"), {
        target: { value: "b" },
      });
      fireEvent.change(screen.getByTestId("timing-start"), {
        target: { value: "0" },
      });

      expect(screen.getByTestId("timing-end")).not.toHaveStyle({
        color: "#b71c1c",
      });
      expect(screen.getByTestId("timing-volume")).toHaveStyle({
        color: "#b71c1c",
      });
    });
  });
  describe("validation", () => {
    test("changeTo 0, then call update", () => {
      const mockFn = jest.fn();
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={mockFn} />
      );

      fireEvent.change(screen.getByTestId("timing-start"), {
        target: { value: 0 },
      });

      expect(mockFn).toBeCalledWith({ start: 0, volume: 10 });
    });
    test("changeTo 1, then call update", () => {
      const mockFn = jest.fn();
      render(
        <TimingConfig config={{ start: 2, volume: 10 }} update={mockFn} />
      );

      fireEvent.change(screen.getByTestId("timing-start"), {
        target: { value: 1 },
      });

      expect(mockFn).toBeCalledWith({ start: 1, volume: 10 });
    });
    test("changeTo NaN, then noop", () => {
      const mockFn = jest.fn();
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={mockFn} />
      );

      fireEvent.change(screen.getByTestId("timing-start"), {
        target: { value: "a" },
      });

      expect(mockFn).not.toBeCalled();
    });
  });
});

// * End
describe("End", () => {
  test("value is config.start + config.volume - 1", () => {
    render(<TimingConfig config={{ start: 2, volume: 10 }} />);

    const target = screen.getByTestId("timing-end");
    expect(target).toHaveValue("11");
  });
  test("form is disabled", () => {
    render(<TimingConfig config={{ start: 2, volume: 10 }} />);

    const target = screen.getByTestId("timing-end");
    expect(target).toBeDisabled();
  })
});

// * Volume
describe("Volume", () => {
  test("default value is config.volume", () => {
    render(<TimingConfig config={{ start: 2, volume: 10 }} />);

    const target = screen.getByTestId("timing-volume");
    expect(target).toHaveValue(10);
  });
  describe("Error", () => {
    test("invalid, then show error", () => {
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={update} />
      );

      const target = screen.getByTestId("timing-volume");
      fireEvent.change(target, {
        target: { value: "a" },
      });

      expect(target).toHaveStyle({
        color: "#b71c1c",
      });
    });
    test("valid, then not show error style", () => {
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={update} />
      );

      const target = screen.getByTestId("timing-volume");
      fireEvent.change(target, {
        target: { value: "10" },
      });

      expect(target).not.toHaveStyle({
        color: "#b71c1c",
      });
    });
    test("invalid to valid, then not show error style", () => {
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={update} />
      );
      const target = screen.getByTestId("timing-end");

      fireEvent.change(target, {
        target: { value: "aaa" },
      });
      fireEvent.change(target, {
        target: { value: "10" },
      });

      expect(target).not.toHaveStyle({
        color: "#b71c1c",
      });
    });
  });
  test("set valid value, then no reset Other error.", () => {
    render(<TimingConfig config={{ start: 1, volume: 10 }} update={update} />);

    fireEvent.change(screen.getByTestId("timing-start"), {
      target: { value: "a" },
    });
    fireEvent.change(screen.getByTestId("timing-volume"), {
      target: { value: "0" },
    });

    expect(screen.getByTestId("timing-start")).toHaveStyle({
      color: "#b71c1c",
    });
  });
  describe("validation", () => {
    test("changeTo 0, then noop", () => {
      const mockFn = jest.fn();
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={mockFn} />
      );

      fireEvent.change(screen.getByTestId("timing-volume"), {
        target: { value: 0 },
      });

      expect(mockFn).not.toBeCalled();
    });
    test("changeTo 1, then call update", () => {
      const mockFn = jest.fn();
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={mockFn} />
      );

      fireEvent.change(screen.getByTestId("timing-volume"), {
        target: { value: 1 },
      });

      expect(mockFn).toBeCalledWith({ start: 1, volume: 1 });
    });
    test("changeTo NaN, then noop", () => {
      const mockFn = jest.fn();
      render(
        <TimingConfig config={{ start: 1, volume: 10 }} update={mockFn} />
      );

      fireEvent.change(screen.getByTestId("timing-volume"), {
        target: { value: "a" },
      });

      expect(mockFn).not.toBeCalled();
    });
  });
});
describe("Header icon", () => {
  test("if Start is invalid, then show Icon", () => {
    render(<TimingConfig config={{ start: 1, volume: 10 }} update={update} />);

    fireEvent.change(screen.getByTestId("timing-start"), {
      target: { value: "a" },
    });

    const target = screen.getByTestId("timing-config-icon");
    expect(target).toBeInTheDocument();
  });
  test("if Volume is invalid, then show Icon", () => {
    render(<TimingConfig config={{ start: 1, volume: 10 }} update={update} />);

    fireEvent.change(screen.getByTestId("timing-volume"), {
      target: { value: "a" },
    });

    const target = screen.getByTestId("timing-config-icon");
    expect(target).toBeInTheDocument();
  });
  test("if All valid, then not show Icon", () => {
    render(<TimingConfig config={{ start: 1, volume: 10 }} update={update} />);

    const target = screen.queryByTestId("timing-config-icon");
    expect(target).toBeNull();
  });
});
