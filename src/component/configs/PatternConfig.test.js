import { fireEvent, render, screen } from "@testing-library/react";
import { PatternConfig } from "./PatternConfig";
// import userEvent from "@testing-library/user-event";

jest.mock("./Pattern/PatternImage", () => ({ config }) => {
  return (
    <div data-testid="mock-pattern-image">
      <p data-testid="pattern-image-start">{config.start}</p>
      <p data-testid="pattern-image-end">{config.end}</p>
    </div>
  );
});
describe("PatternImage", () => {
  test("has PatternImage", () => {
    render(<PatternConfig config={{ start: 1, end: 1 }} />);

    const target = screen.getByTestId("mock-pattern-image");
    expect(target).toBeInTheDocument();
  });
  test("config is props.config", () => {
    render(<PatternConfig config={{ start: 4, end: 7 }} />);

    const start = screen.getByTestId("pattern-image-start");
    expect(start).toHaveTextContent(4);
    const end = screen.getByTestId("pattern-image-end");
    expect(end).toHaveTextContent(7);
  });
});

describe("Start", () => {
  test("default value is config.start", () => {
    render(<PatternConfig config={{ start: 11, end: 15 }} />);

    const target = screen.getByTestId("pattern-config-start");
    expect(target).toHaveValue(11);
  });
  test("then call update and update value", () => {
    const mockFn = jest.fn();
    render(<PatternConfig config={{ start: 1, end: 25 }} update={mockFn} />);

    const start = screen.getByTestId("pattern-config-start");
    fireEvent.change(start, { target: { value: 7 } });

    expect(mockFn).toBeCalledWith({ start: 7, end: 25 });
    expect(start).toHaveValue(7);
  });
  describe("Validation", () => {
    test("start is Not Number, then not call handlar, but update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 1, end: 25 }} update={mockFn} />);

      const start = screen.getByTestId("pattern-config-start");
      fireEvent.change(start, { target: { value: "" } });

      expect(mockFn).not.toBeCalled();
      expect(start).toHaveValue(null);
    });
    test("start is 0, then not call update, but update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 1, end: 25 }} update={mockFn} />);

      const start = screen.getByTestId("pattern-config-start");
      fireEvent.change(start, { target: { value: 0 } });

      expect(mockFn).not.toBeCalled();
      expect(start).toHaveValue(0);
    });
    test("start is 1, then call update, and update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 3, end: 25 }} update={mockFn} />);

      const start = screen.getByTestId("pattern-config-start");
      fireEvent.change(start, { target: { value: 1 } });

      expect(mockFn).toBeCalled();
      expect(start).toHaveValue(1);
    });
    test("start is 25, then call update, and update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 1, end: 25 }} update={mockFn} />);

      const start = screen.getByTestId("pattern-config-start");
      fireEvent.change(start, { target: { value: 25 } });

      expect(mockFn).toBeCalled();
      expect(start).toHaveValue(25);
    });
    test("start is 26, then not call update, but update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 1, end: 25 }} update={mockFn} />);

      const start = screen.getByTestId("pattern-config-start");
      fireEvent.change(start, { target: { value: 26 } });

      expect(mockFn).not.toBeCalled();
      expect(start).toHaveValue(26);
    });
    test("start is 2, end is 1, then call update, and update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 1, end: 1 }} update={mockFn} />);

      const start = screen.getByTestId("pattern-config-start");
      fireEvent.change(start, { target: { value: 2 } });

      expect(mockFn).toBeCalled();
      expect(start).toHaveValue(2);
    });
  });
});

describe("End", () => {
  test("default value is config.end", () => {
    render(<PatternConfig config={{ start: 11, end: 15 }} />);

    const target = screen.getByTestId("pattern-config-end");
    expect(target).toHaveValue(15);
  });
  test("then call update and update value", () => {
    const mockFn = jest.fn();
    render(<PatternConfig config={{ start: 1, end: 25 }} update={mockFn} />);

    const end = screen.getByTestId("pattern-config-end");
    fireEvent.change(end, { target: { value: 14 } });

    expect(mockFn).toBeCalledWith({ start: 1, end: 14 });
    expect(end).toHaveValue(14);
  });
  describe("Validation", () => {
    test("end is Not Number, then not call handlar, but update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 1, end: 25 }} update={mockFn} />);

      const end = screen.getByTestId("pattern-config-end");
      fireEvent.change(end, { target: { value: "" } });

      expect(mockFn).not.toBeCalled();
      expect(end).toHaveValue(null);
    });
    test("end is 0, then not call update, but update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 1, end: 25 }} update={mockFn} />);

      const end = screen.getByTestId("pattern-config-end");
      fireEvent.change(end, { target: { value: 0 } });

      expect(mockFn).not.toBeCalled();
      expect(end).toHaveValue(0);
    });
    test("end is 1, then call update, and update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 1, end: 25 }} update={mockFn} />);

      const end = screen.getByTestId("pattern-config-end");
      fireEvent.change(end, { target: { value: 1 } });

      expect(mockFn).toBeCalled();
      expect(end).toHaveValue(1);
    });
    test("end is 25, then call update, and update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 1, end: 20 }} update={mockFn} />);

      const end = screen.getByTestId("pattern-config-end");
      fireEvent.change(end, { target: { value: 25 } });

      expect(mockFn).toBeCalled();
      expect(end).toHaveValue(25);
    });
    test("end is 26, then not call update, but update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 1, end: 25 }} update={mockFn} />);

      const end = screen.getByTestId("pattern-config-end");
      fireEvent.change(end, { target: { value: 26 } });

      expect(mockFn).not.toBeCalled();
      expect(end).toHaveValue(26);
    });
    test("start is 2, end is 1, then call update, and update value", () => {
      const mockFn = jest.fn();
      render(<PatternConfig config={{ start: 2, end: 2 }} update={mockFn} />);

      const end = screen.getByTestId("pattern-config-end");
      fireEvent.change(end, { target: { value: 1 } });

      expect(mockFn).toBeCalled();
      expect(end).toHaveValue(1);
    });
  });
});

describe("view Error", () => {
  const update = jest.fn();
  describe("Header", () => {
    test("start is Error, then show icon", () => {
      render(
        <PatternConfig config={{ start: 1, end: 25 }} update={update} />
      );

      fireEvent.change(screen.getByTestId("pattern-config-start"), {
        target: { value: "" },
      });

      const target = screen.getByTestId("pattern-config-icon");
      expect(target).toBeInTheDocument();
    });
    test("end is Error, then show icon", () => {
      render(
        <PatternConfig config={{ start: 1, end: 25 }} update={update} />
      );

      fireEvent.change(screen.getByTestId("pattern-config-end"), {
        target: { value: "" },
      });

      const target = screen.getByTestId("pattern-config-icon");
      expect(target).toBeInTheDocument();
    });
    test("no Error, then show icon", () => {
      render(
        <PatternConfig config={{ start: 1, end: 25 }} update={update} />
      );

      fireEvent.change(screen.getByTestId("pattern-config-start"), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByTestId("pattern-config-end"), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByTestId("pattern-config-start"), {
        target: { value: "2" },
      });
      fireEvent.change(screen.getByTestId("pattern-config-end"), {
        target: { value: "6" },
      });

      const target = screen.queryByTestId("pattern-config-icon");
      expect(target).toBeNull();
    });
    test("icon click, then values reset to config", () => {
      render(
        <PatternConfig config={{ start: 5, end: 12 }} update={update} />
      );

      const start = screen.getByTestId("pattern-config-start");
      fireEvent.change(start, { target: { value: "" } });
      const end = screen.getByTestId("pattern-config-end");
      fireEvent.change(end, { target: { value: "" } });

      const icon = screen.queryByTestId("pattern-config-icon");
      fireEvent.click(icon);

      expect(start).toHaveValue(5);
      expect(end).toHaveValue(12);
    });
  });
  test("start is Error, then has error style", () => {
    render(<PatternConfig config={{ start: 1, end: 25 }} update={update} />);

    const target = screen.getByTestId("pattern-config-start");
    fireEvent.change(target, { target: { value: "" } });

    expect(target).toHaveStyle({
      color: "#b71c1c"
    });
  });
  test("end is Error, then has error style", () => {
    render(<PatternConfig config={{ start: 1, end: 25 }} update={update} />);

    const target = screen.getByTestId("pattern-config-end");
    fireEvent.change(target, { target: { value: "" } });

    expect(target).toHaveStyle({
      color: "#b71c1c"
    });
  });
});
