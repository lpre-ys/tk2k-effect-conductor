import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../util/renderWithProviders";
import { HSVColorConfig } from "./HSVColorConfig";

const DEFAULT_CONFIG = {
  min: 0,
  max: 100,
  isHsv: true,
};

test("has Header", () => {
  renderWithProviders(<HSVColorConfig config={DEFAULT_CONFIG} />);

  const target = screen.getByText("HSVカラー");
  expect(target).toBeInTheDocument();
});

describe("Min Max", () => {
  test("has Min input", () => {
    const config = Object.assign({}, DEFAULT_CONFIG);
    config.min = 22;
    renderWithProviders(<HSVColorConfig config={config} />);

    const target = screen.getByTestId("color-range-input-number-hsv-min");
    expect(target).toBeInTheDocument();
    expect(target).toHaveValue(22);
  });
  test("has Max input", () => {
    const config = Object.assign({}, DEFAULT_CONFIG);
    config.max = 135;
    renderWithProviders(<HSVColorConfig config={config} />);

    const target = screen.getByTestId("color-range-input-number-hsv-max");
    expect(target).toBeInTheDocument();
    expect(target).toHaveValue(135);
  });
  test("change Min, then call updateMin", () => {
    const updateMin = jest.fn();
    renderWithProviders(
      <HSVColorConfig config={DEFAULT_CONFIG} updateMin={updateMin} />
    );

    const target = screen.getByTestId("color-range-input-number-hsv-min");
    userEvent.clear(target);
    userEvent.type(target, "11");

    expect(updateMin).toBeCalledWith(11);
  });
  test("change Max, then call updateMax", () => {
    const updateMax = jest.fn();
    renderWithProviders(
      <HSVColorConfig config={DEFAULT_CONFIG} updateMax={updateMax} />
    );

    const target = screen.getByTestId("color-range-input-number-hsv-max");
    userEvent.clear(target);
    userEvent.type(target, "33");

    expect(updateMax).toBeCalledWith(33);
  });
  test("Min input range is 0-200", () => {
    renderWithProviders(<HSVColorConfig config={DEFAULT_CONFIG} />);

    const target = screen.getByTestId("color-range-input-number-hsv-min");

    expect(target).toHaveAttribute("min", "0");
    expect(target).toHaveAttribute("max", "200");
  });
  test("Max input range is 0-200", () => {
    renderWithProviders(<HSVColorConfig config={DEFAULT_CONFIG} />);

    const target = screen.getByTestId("color-range-input-number-hsv-max");

    expect(target).toHaveAttribute("min", "0");
    expect(target).toHaveAttribute("max", "200");
  });
});

describe("HSV params", () => {
  test('has Hue input', () => {
    renderWithProviders(<HSVColorConfig config={DEFAULT_CONFIG} />);
    const target = screen.getByText('H. 色相');

    expect(target).toBeInTheDocument();
  });
  test('has Satulation input', () => {
    renderWithProviders(<HSVColorConfig config={DEFAULT_CONFIG} />);
    const target = screen.getByText('S. 彩度');

    expect(target).toBeInTheDocument();
  });
  test('has Value input', () => {
    renderWithProviders(<HSVColorConfig config={DEFAULT_CONFIG} />);
    const target = screen.getByText('V. 明度');

    expect(target).toBeInTheDocument();
  });
});
