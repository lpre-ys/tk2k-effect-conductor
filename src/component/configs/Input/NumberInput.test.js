import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumberInput from "./NumberInput";

test("type is x, then show input", () => {
  render(<NumberInput type="x" />);

  const target = screen.getByTestId("number-input");
  expect(target).toBeInTheDocument();
});
describe("type is red", () => {
  test("show ColorRangeInput", () => {
    render(<NumberInput type="red" setVal={jest.fn()} />);

    const target = screen.getByTestId("color-range-input-number");
    expect(target).toBeInTheDocument();
  });
  test("range has red style", () => {
    render(<NumberInput type="red" setVal={jest.fn()} />);

    userEvent.click(screen.getByRole("spinbutton"));

    const target = screen.getByRole("slider");
    expect(target).toHaveStyle({ backgroundColor: "#ffcdd2" });
  });
});
describe("type is green", () => {
  test("show ColorRangeInput", () => {
    render(<NumberInput type="green" setVal={jest.fn()} />);

    const target = screen.getByTestId("color-range-input-number");
    expect(target).toBeInTheDocument();
  });
  test("range has green style", () => {
    render(<NumberInput type="green" setVal={jest.fn()} />);

    userEvent.click(screen.getByRole("spinbutton"));

    const target = screen.getByRole("slider");
    expect(target).toHaveStyle({ backgroundColor: "#c8e6c9" });
  });
});
describe("type is blue", () => {
  test("show ColorRangeInput", () => {
    render(<NumberInput type="blue" setVal={jest.fn()} />);

    const target = screen.getByTestId("color-range-input-number");
    expect(target).toBeInTheDocument();
  });
  test("range has blue style", () => {
    render(<NumberInput type="blue" setVal={jest.fn()} />);

    userEvent.click(screen.getByRole("spinbutton"));

    const target = screen.getByRole("slider");
    expect(target).toHaveStyle({ backgroundColor: "#c5cae9" });
  });
});
describe("type is tkSat", () => {
  test("show ColorRangeInput", () => {
    render(<NumberInput type="tkSat" setVal={jest.fn()} />);

    const target = screen.getByTestId("color-range-input-number");
    expect(target).toBeInTheDocument();
  });
  test("range has normal style", () => {
    render(<NumberInput type="tkSat" setVal={jest.fn()} />);

    userEvent.click(screen.getByRole("spinbutton"));

    const target = screen.getByRole("slider");
    expect(target).toHaveStyle({ backgroundColor: "#e0e0e0" });
  });
});
