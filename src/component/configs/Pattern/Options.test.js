import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Options } from "./Options";

describe("visible", () => {
  test("isOption true, then show component", () => {
    render(<Options isOption={true} />);

    const target = screen.getByTestId("configs-pattern-options");
    expect(target).toBeInTheDocument();
  });
  test("isOption false, then hide component", () => {
    render(<Options isOption={false} />);

    const target = screen.queryByTestId("configs-pattern-options");
    expect(target).not.toBeInTheDocument();
  });
});
describe("isCustom", () => {
  describe("true", () => {
    test("then button label is ON", () => {
      render(<Options isOption={true} isCustom={true} />);

      const target = screen.getByText(/ON/);
      expect(target).toBeInTheDocument();
    });
    test("then show textarea", () => {
      render(<Options isOption={true} isCustom={true} />);

      const target = screen.getByTestId("configs-pattern-options-textarea");
      expect(target).toBeInTheDocument();
    });
  });
  describe("false", () => {
    test("then button label is OFF", () => {
      render(<Options isOption={true} isCustom={false} />);

      const target = screen.getByText(/OFF/);
      expect(target).toBeInTheDocument();
    });
    test("then hide textarea", () => {
      render(<Options isOption={true} isCustom={false} />);

      const target = screen.queryByTestId("configs-pattern-options-textarea");
      expect(target).not.toBeInTheDocument();
    });
  });
  test("button click, then call setIsCustom", () => {
    const fn = jest.fn();
    render(<Options isOption={true} isCustom={true} setIsCustom={fn} />);

    const button = screen.getByRole("button");
    userEvent.click(button);

    expect(fn).toBeCalledWith(false);
  });
});
describe("customPattern", () => {
  test("textarea value is customPattern", () => {
    render(<Options isOption={true} isCustom={true} customPattern="test1" />);

    const target = screen.getByRole("textbox");
    expect(target).toHaveValue("test1");
  });
  test("textarea on change, then call setCustomPattern", () => {
    const fn = jest.fn();
    render(
      <Options
        isOption={true}
        isCustom={true}
        customPattern="test2"
        setCustomPattern={fn}
      />
    );

    const target = screen.getByRole("textbox");
    fireEvent.change(target, { target: { value: "test3" } });

    expect(fn).toBeCalledWith("test3");
  });
});
