import { render, screen } from "@testing-library/react";
import EasingConfig from "./EasingConfig";
import userEvent from "@testing-library/user-event";

test("Option list is const easingList", () => {
  render(<EasingConfig type="test" config={{ easing: "easeLinear" }} />);

  const target = screen.getAllByRole("option");
  expect(target).toHaveLength(13); // Easing x 10, Other x 3
});

test("config.easing is fixed, then not has addSelect", () => {
  render(<EasingConfig type="test" config={{ easing: "fixed" }} />);

  const target = screen.queryByTestId("from-to-easing-select-add");
  expect(target).not.toBeInTheDocument();
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

test("Change Add, then call update", () => {
  const mockFn = jest.fn();
  render(
    <EasingConfig
      config={{ easing: "easeCubic", easingAdd: "All", test: 456 }}
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

describe("Add select", () => {
  test("config.easing is easeLiner, then hide addSelect", () => {
    render(<EasingConfig type="test" config={{ easing: "easeLinear" }} />);

    const target = screen.queryByTestId("from-to-easing-select-add");
    expect(target).not.toBeInTheDocument();
  });
  test("config.easing is easeBack, then show addSelect", () => {
    render(<EasingConfig type="test" config={{ easing: "easeBack" }} />);

    const target = screen.queryByTestId("from-to-easing-select-add");
    expect(target).toBeInTheDocument();
  });
  test("config.easing is sin, then hide addSelect", () => {
    render(<EasingConfig type="test" config={{ easing: "sin" }} />);

    const target = screen.queryByTestId("from-to-easing-select-add");
    expect(target).not.toBeInTheDocument();
  });
  test("config.easing is cos, then hide addSelect", () => {
    render(<EasingConfig type="test" config={{ easing: "cos" }} />);

    const target = screen.queryByTestId("from-to-easing-select-add");
    expect(target).not.toBeInTheDocument();
  });
  test("config.easing is fixed, then hide addSelect", () => {
    render(<EasingConfig type="test" config={{ easing: "fixed" }} />);

    const target = screen.queryByTestId("from-to-easing-select-add");
    expect(target).not.toBeInTheDocument();
  });
});
describe("SinCos option", () => {
  test("type includes 'trig', then hide sin/cos option", () => {
    render(
      <EasingConfig type="test.trig.test" config={{ easing: "easeLinear" }} />
    );

    const targetSin = screen.queryByText("sin");
    expect(targetSin).not.toBeInTheDocument();
    const targetCos = screen.queryByText("cos");
    expect(targetCos).not.toBeInTheDocument();
  });
  test("type not includes 'trig', then show sin/cos option", () => {
    render(
      <EasingConfig type="test.test.test" config={{ easing: "easeLinear" }} />
    );

    const targetSin = screen.queryByText("sin");
    expect(targetSin).toBeInTheDocument();
    const targetCos = screen.queryByText("cos");
    expect(targetCos).toBeInTheDocument();
  });
});
