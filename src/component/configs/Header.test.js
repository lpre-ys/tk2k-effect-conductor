import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

test("style is props.color", () => {
  render(<Header color={{ color: "red" }} />);

  const target = screen.getByTestId("config-header-icon-right");
  expect(target).toHaveStyle({ color: "red" });
});

test("isOption true, then show AngleDown", () => {
  render(<Header isOption={true} />);

  const target = screen.getByTestId("config-header-icon-down");
  expect(target).toBeInTheDocument();
});
test("isOption false, then show AngleRight", () => {
  render(<Header isOption={false} />);

  const target = screen.getByTestId("config-header-icon-right");
  expect(target).toBeInTheDocument();
});

test("isValid true, then no error icon", () => {
  render(<Header isValid={true} />);

  const target = screen.queryByTestId("config-header-icon-error");
  expect(target).not.toBeInTheDocument();
});
test("isValid false, then show error icon", () => {
  render(<Header isValid={false} />);

  const target = screen.queryByTestId("config-header-icon-error");
  expect(target).toBeInTheDocument();
});
