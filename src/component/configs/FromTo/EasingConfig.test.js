import { render, screen } from "@testing-library/react";
import EasingConfig from "./EasingConfig";
import userEvent from "@testing-library/user-event";

test("Option list is const easingList", () => {
  render(<EasingConfig config={{ easing: "easeLinear" }} />);

  const target = screen.getAllByRole("option");
  expect(target).toHaveLength(10);
});

test("config.easing is easeLiner, then not has addSelect", () => {
  render(<EasingConfig config={{ easing: "easeLinear" }} />);

  const target = screen.queryByTestId("from-to-easing-select-add");
  expect(target).not.toBeInTheDocument();
});
test("config.easing is easeBack, then has addSelect", () => {
  render(<EasingConfig config={{ easing: "easeBack" }} />);

  const target = screen.queryByTestId("from-to-easing-select-add");
  expect(target).toBeInTheDocument();
});

test("change Easing, then new Config add is In and call update", () => {
  const mockFn = jest.fn();
  render(
    <EasingConfig
      config={{ easing: "easeLinear", test: 123 }}
      type="ABC"
      update={mockFn}
    />
  );

  const target = screen.getByTestId("from-to-easing-select");
  userEvent.selectOptions(target, "easeCircle");

  expect(mockFn).toBeCalledWith("ABC", {
    easing: "easeCircle",
    easingAdd: "In",
    test: 123,
  });
});

test('Change Add, then call update', () => {
  const mockFn = jest.fn();
  render(
    <EasingConfig
      config={{ easing: "easeCubic", easingAdd: 'All', test: 456 }}
      type="DEF"
      update={mockFn}
    />
  );

  const target = screen.getByTestId("from-to-easing-select-add");
  userEvent.selectOptions(target, "Out");

  expect(mockFn).toBeCalledWith("DEF", {
    easing: "easeCubic",
    easingAdd: "Out",
    test: 456,
  });
});