import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Info from "./Info";

test("msg is empty, then no content", () => {
  render(<Info msg="" />);

  const target = screen.queryByText("INFO");

  expect(target).not.toBeInTheDocument();
});

test("has msg, then has content", () => {
  render(<Info msg="test" />);

  const target = screen.queryByText("INFO");

  expect(target).toBeInTheDocument();
});

test("has msg, show msg", () => {
  render(<Info msg="テストメッセージ" />);

  const target = screen.getByText("テストメッセージ");

  expect(target).toBeInTheDocument();
});

test("click close icon, then delete msg", () => {
  const mockFn = jest.fn();
  render(<Info msg="テストメッセージ" setMsg={mockFn} />);

  const target = screen.getByTestId("info-close-icon");
  userEvent.click(target);

  expect(mockFn).toBeCalledWith("");
});
