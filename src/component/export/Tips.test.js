import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tips from "./Tips";

test("has icon button", () => {
  render(<Tips />);

  const target = screen.getByTestId("export-tips-icon");
  expect(target).toBeInTheDocument();
});

test("INIT, then hide dialog", () => {
  render(<Tips />);

  const target = screen.getByTestId("export-tips-dialog");
  expect(target).toBeInTheDocument();
  expect(target).toHaveStyle({ display: "none" });
});

test("hover icon, then show dialog", () => {
  render(<Tips />);

  const target = screen.getByTestId("export-tips-dialog");
  const icon = screen.getByTestId("export-tips-icon");

  expect(target).toHaveStyle({ display: "none" });

  userEvent.hover(icon);
  expect(target).toHaveStyle({ display: "block" });
});

test("unhover icon, then hide dialog", () => {
  render(<Tips />);

  const target = screen.getByTestId("export-tips-dialog");
  const icon = screen.getByTestId("export-tips-icon");

  expect(target).toHaveStyle({ display: "none" });

  userEvent.hover(icon);
  expect(target).toHaveStyle({ display: "block" });

  userEvent.unhover(icon);
  expect(target).toHaveStyle({ display: "none" });
});
