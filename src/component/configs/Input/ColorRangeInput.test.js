import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorRangeInput from "./ColorRangeInput";

describe("input:number", () => {
  test("has number input form", () => {
    render(<ColorRangeInput setVal={jest.fn()} />);

    const target = screen.getByRole("spinbutton");
    expect(target).toBeInTheDocument();
  });
  test("min is props.min", () => {
    render(<ColorRangeInput setVal={jest.fn()} min={42} />);

    const target = screen.getByRole("spinbutton");
    expect(target.getAttribute("min")).toBe("42");
  });
  test("max is props.max", () => {
    render(<ColorRangeInput setVal={jest.fn()} max={123} />);

    const target = screen.getByRole("spinbutton");
    expect(target.getAttribute("max")).toBe("123");
  });
  describe("value", () => {
    test("INIT, then props.value", () => {
      render(<ColorRangeInput setVal={jest.fn()} value={85} />);

      const target = screen.getByRole("spinbutton");
      expect(target).toHaveValue(85);
    });
    test("change, then value is changed", () => {
      render(<ColorRangeInput setVal={jest.fn()} value={85} />);

      const target = screen.getByRole("spinbutton");
      expect(target).toHaveValue(85);

      fireEvent.change(target, { target: { value: "27" } });
      expect(target).toHaveValue(27);
    });
    test("props.name exists, then input.name is props.name", () => {
      render(
        <ColorRangeInput setVal={jest.fn()} value={85} name="testFormName" />
      );
      const target = screen.getByRole("spinbutton");
      expect(target.getAttribute("name")).toBe("testFormName");
    });
  });
});
describe("input:range", () => {
  test("focused, then show Range", () => {
    render(<ColorRangeInput setVal={jest.fn()} />);

    fireEvent.focus(screen.getByRole("spinbutton"));

    const target = screen.getByRole("slider");
    expect(target).toBeInTheDocument();
  });
  test("min is props.min", () => {
    render(<ColorRangeInput setVal={jest.fn()} min={23} />);

    fireEvent.focus(screen.getByRole("spinbutton"));

    const target = screen.getByRole("slider");
    expect(target.getAttribute("min")).toBe("23");
  });
  test("max is props.max", () => {
    render(<ColorRangeInput setVal={jest.fn()} max={94} />);

    fireEvent.focus(screen.getByRole("spinbutton"));

    const target = screen.getByRole("slider");
    expect(target.getAttribute("max")).toBe("94");
  });
  describe("value", () => {
    test("INIT, then props.value", () => {
      render(<ColorRangeInput setVal={jest.fn()} value={85} />);

      fireEvent.focus(screen.getByRole("spinbutton"));

      const target = screen.getByRole("slider");
      expect(target).toHaveValue("85");
    });
    test("change, then value is changed", () => {
      render(<ColorRangeInput setVal={jest.fn()} value={85} />);
      fireEvent.focus(screen.getByRole("spinbutton"));

      const target = screen.getByRole("slider");
      expect(target).toHaveValue("85");

      fireEvent.change(target, { target: { value: "27" } });
      expect(target).toHaveValue("27");
    });
    test("props.name exists, then input.name is null", () => {
      render(
        <ColorRangeInput setVal={jest.fn()} value={85} name="testFormName" />
      );
      fireEvent.focus(screen.getByRole("spinbutton"));

      const target = screen.getByRole("slider");
      expect(target.getAttribute("name")).toBeNull();
    });
  });
});

describe("focus", () => {
  test("INIT, then Range is hidden", () => {
    render(<ColorRangeInput setVal={jest.fn()} />);

    const target = screen.queryByRole("slider");
    expect(target).not.toBeInTheDocument();
  });
  test("focus Number, then Range is show", () => {
    render(<ColorRangeInput setVal={jest.fn()} />);

    userEvent.click(screen.getByRole("spinbutton"));

    const target = screen.getByRole("slider");
    expect(target).toBeInTheDocument();
  });
  test("focus Number to Other, then Range is hide", () => {
    render(
      <>
        <ColorRangeInput setVal={jest.fn()} />
        <input type="text" name="dummy" />
      </>
    );

    userEvent.click(screen.getByRole("spinbutton"));
    expect(screen.getByRole("slider")).toBeInTheDocument();

    userEvent.click(screen.getByRole("textbox"));
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });
  test("focus Number to Range, then Range is show", () => {
    render(
      <>
        <ColorRangeInput setVal={jest.fn()} />
        <input type="text" name="dummy" />
      </>
    );
    userEvent.click(screen.getByRole("spinbutton"));
    expect(screen.getByRole("slider")).toBeInTheDocument();
    userEvent.click(screen.getByRole("slider"));
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });
  test.skip("focus Range to Other, then Range is hide", () => {
    render(
      <>
        <ColorRangeInput setVal={jest.fn()} />
        <input type="text" name="dummy" />
      </>
    );
    userEvent.click(screen.getByRole("spinbutton"));
    expect(screen.getByRole("slider")).toBeInTheDocument();
    userEvent.click(screen.getByRole("slider"));
    expect(screen.getByRole("slider")).toBeInTheDocument();

    userEvent.click(screen.getByRole("textbox"));
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });
});

describe('update', () => {
  test('change Number, then call setVal', () => {
    const setVal = jest.fn();
    render(<ColorRangeInput setVal={setVal} value={42} />);

    const target = screen.getByRole('spinbutton');
    fireEvent.change(target, { target: { value: 11 } });

    expect(setVal).toBeCalledWith("11");
  });
  test('change Range and Draging, then not call setVal', () => {
    const setVal = jest.fn();

    render(<ColorRangeInput setVal={setVal} value={42} />);
    userEvent.click(screen.getByRole("spinbutton"));

    const target = screen.getByRole('slider');
    fireEvent.mouseDown(target);
    fireEvent.change(target, { target: { value: 22 } });

    expect(setVal).not.toBeCalledWith("22");
  });
  test('change Range and Dragend, then call setVal', () => {
    const setVal = jest.fn();

    render(<ColorRangeInput setVal={setVal} value={42} />);
    userEvent.click(screen.getByRole("spinbutton"));

    const target = screen.getByRole('slider');
    fireEvent.mouseDown(target);
    fireEvent.change(target, { target: { value: 33 } });
    fireEvent.mouseUp(target);

    expect(setVal).toBeCalledWith("33");
  });
});