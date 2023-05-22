import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TargetTab from "./TargetTab";

test("show 2 tabs", () => {
  render(<TargetTab />);

  const targets = screen.getAllByTestId("target-tab");
  expect(targets).toHaveLength(2);
});

test("click '基本' tab, then setTarget normal", () => {
  const setTarget = jest.fn();
  render(<TargetTab setTarget={setTarget} />);

  userEvent.click(screen.getByText('基本'));

  expect(setTarget).toBeCalledWith('normal');
});

test("click '色調' tab, then setTarget color", () => {
  const setTarget = jest.fn();
  render(<TargetTab setTarget={setTarget} />);

  userEvent.click(screen.getByText('色調'));

  expect(setTarget).toBeCalledWith('color');
});

test("target is normal, then only 1st tab has selected style", () => {
  render(<TargetTab target="normal" />);

  const targets = screen.getAllByTestId('target-tab');
  expect(targets[0]).toHaveStyle({ "background": "white" });
  expect(targets[1]).not.toHaveStyle({ "background": "white" });
})

test("target is color, then only 2nd tab has selected style", () => {
  render(<TargetTab target="color" />);

  const targets = screen.getAllByTestId('target-tab');
  expect(targets[0]).not.toHaveStyle({ "background": "white" });
  expect(targets[1]).toHaveStyle({ "background": "white" });
})