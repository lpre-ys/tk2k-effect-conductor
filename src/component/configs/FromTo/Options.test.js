import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Options } from "./Options";
// import userEvent from "@testing-library/user-event";
const defaultConfig = {
  cycle: 0,
  isRoundTrip: false,
};

describe("Visible", () => {
  test("not visible, then empty", () => {
    render(<Options isOption={false} config={defaultConfig} />);

    const target = screen.queryByTestId("from-to-options");
    expect(target).not.toBeInTheDocument();
  });
  test("is visible, then show Options", () => {
    render(<Options isOption={true} config={defaultConfig} />);

    const target = screen.queryByTestId("from-to-options");
    expect(target).toBeInTheDocument();
  });
});

describe("Cycle", () => {
  test("init value is config.cycle", () => {
    render(
      <Options isOption={true} config={{ cycle: 45, isRoundTrip: false }} />
    );

    const target = screen.getByTestId("from-to-options-cycle");
    expect(target).toHaveValue(45);
  });
  test("cycle is 0, then empty", () => {
    render(
      <Options isOption={true} config={{ cycle: 0, isRoundTrip: false }} />
    );

    const target = screen.getByTestId("from-to-options-cycle");
    expect(target).not.toHaveValue();
  });
  test("change valid value, call update with type", () => {
    const mockFn = jest.fn();
    render(
      <Options
        isOption={true}
        type="testType"
        config={{ cycle: 0, isRoundTrip: false }}
        updateCycle={mockFn}
      />
    );

    const target = screen.getByTestId("from-to-options-cycle");
    fireEvent.change(target, { target: { value: "16" } });
    expect(mockFn).toBeCalledWith("testType", 16);
  });
  describe("Input", () => {
    test("is Empty, then config is 0", () => {
      const mockFn = jest.fn();
      render(
        <Options
          isOption={true}
          type="test"
          config={{ cycle: 3, isRoundTrip: false }}
          updateCycle={mockFn}
        />
      );

      const target = screen.getByTestId("from-to-options-cycle");
      fireEvent.change(target, { target: { value: "" } });

      expect(mockFn).toBeCalledWith("test", 0);
    });
    test("is -1, then config is 0", () => {
      const mockFn = jest.fn();
      render(
        <Options
          isOption={true}
          type="test"
          config={{ cycle: 3, isRoundTrip: false }}
          updateCycle={mockFn}
        />
      );

      const target = screen.getByTestId("from-to-options-cycle");
      fireEvent.change(target, { target: { value: -1 } });

      expect(mockFn).toBeCalledWith("test", 0);
    });
    test("is 0, then config is 0", () => {
      const mockFn = jest.fn();
      render(
        <Options
          isOption={true}
          type="test"
          config={{ cycle: 3, isRoundTrip: false }}
          updateCycle={mockFn}
        />
      );

      const target = screen.getByTestId("from-to-options-cycle");
      fireEvent.change(target, { target: { value: 0 } });

      expect(mockFn).toBeCalledWith("test", 0);
    });
    test("is 1, then config is 1", () => {
      const mockFn = jest.fn();
      render(
        <Options
          isOption={true}
          type="test"
          config={{ cycle: 3, isRoundTrip: false }}
          updateCycle={mockFn}
        />
      );

      const target = screen.getByTestId("from-to-options-cycle");
      fireEvent.change(target, { target: { value: 1 } });

      expect(mockFn).toBeCalledWith("test", 1);
    });
  });
});

describe("RoundTrip", () => {
  test("config.isRoundTrip is false, then not checked", () => {
    render(
      <Options isOption={true} config={{ cycle: 0, isRoundTrip: false }} />
    );

    const target = screen.getByTestId("from-to-options-round-trip");
    expect(target).not.toBeChecked();
  });
  test("config.isRoundTrip is true, then checked", () => {
    render(
      <Options isOption={true} config={{ cycle: 0, isRoundTrip: true }} />
    );
    const target = screen.getByTestId("from-to-options-round-trip");
    expect(target).toBeChecked();
  });
  test("change to True, then call update", () => {
    const mockFn = jest.fn();
    render(
      <Options
        isOption={true}
        config={{ cycle: 0, isRoundTrip: false }}
        type="test"
        updateIsRoundTrip={mockFn}
      />
    );

    const target = screen.getByTestId("from-to-options-round-trip");
    userEvent.click(target);
    expect(mockFn).toBeCalledWith("test", true);
  });
  test("change to False, then call update", () => {
    const mockFn = jest.fn();
    render(
      <Options
        isOption={true}
        config={{ cycle: 0, isRoundTrip: true }}
        type="test"
        updateIsRoundTrip={mockFn}
      />
    );

    const target = screen.getByTestId("from-to-options-round-trip");
    userEvent.click(target);
    expect(mockFn).toBeCalledWith("test", false);
  });
});
