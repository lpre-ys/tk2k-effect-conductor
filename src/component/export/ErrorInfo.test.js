import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorInfo from "./ErrorInfo";
test('INIT, then show content', () => {
  render(<ErrorInfo />);

  const target = screen.getByTestId('export-error-info');
  expect(target).toBeInTheDocument();
});

test('click close button, then hide content', () => {
  render(<ErrorInfo />);

  const target = screen.getByTestId('export-error-info');
  expect(target).toBeInTheDocument();

  userEvent.click(screen.getByTestId('export-error-info-close'));
  expect(target).not.toBeInTheDocument();
});