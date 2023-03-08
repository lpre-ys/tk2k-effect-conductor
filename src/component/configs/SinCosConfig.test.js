import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SinCosConfig from "./SinCosConfig";

const DEFAULT_CONFIG = {
  easing: "sin",
  trig: {
    center: {
      from: 0,
      to: 0,
      cycle: 0,
      isRoundTrip: false,
      easing: "easeLinear",
      easingAdd: "",
    },
    amp: {
      from: 100,
      to: 100,
      cycle: 0,
      isRoundTrip: false,
      easing: "easeLinear",
      easingAdd: "",
    },
    cycle: {
      from: 0,
      to: 0,
      cycle: 0,
      isRoundTrip: false,
      easing: "fixed",
      easingAdd: "",
    },
    start: {
      from: 0,
      to: 0,
      cycle: 0,
      isRoundTrip: false,
      easing: "fixed",
      easingAdd: "",
    },
  },
};

describe("title", () => {
  test("easing is sin, then title is sin", () => {
    render(<SinCosConfig type="x" config={{ easing: "sin" }} />);

    const target = screen.getByTestId("sincos-config-title");
    expect(target.textContent).toBe("A+Bsin((2π/C)t+D)");
  });
  test("easing is cos, then title is cos", () => {
    render(<SinCosConfig type="x" config={{ easing: "cos" }} />);

    const target = screen.getByTestId("sincos-config-title");
    expect(target.textContent).toBe("A+Bcos((2π/C)t+D)");
  });
});

test("has EasingConfig for main", () => {
  render(<SinCosConfig type="x" config={DEFAULT_CONFIG} />);

  // sin Optionがある≒メイン用のEasingConfigがある
  const target = screen.getByText("sin");
  expect(target).toBeInTheDocument();
});

describe("options", () => {
  test("INIT then hide Options", () => {
    render(<SinCosConfig type="x" config={DEFAULT_CONFIG} />);

    const target = screen.queryByTestId("sincos-config-options");
    expect(target).not.toBeInTheDocument();
  });
  test("click Header, then show Options", () => {
    render(<SinCosConfig type="x" config={DEFAULT_CONFIG} />);

    userEvent.click(screen.getByRole("heading", { level: 2 }));

    const target = screen.queryByTestId("sincos-config-options");
    expect(target).toBeInTheDocument();
  });
  test("Options has center params", () => {
    render(<SinCosConfig type="x" config={DEFAULT_CONFIG} />);

    userEvent.click(screen.getByRole("heading", { level: 2 }));

    const target = screen.getByText("A. 中心");
    expect(target).toBeInTheDocument();
  });
  test("Options has amp params", () => {
    render(<SinCosConfig type="x" config={DEFAULT_CONFIG} />);

    userEvent.click(screen.getByRole("heading", { level: 2 }));

    const target = screen.getByText("B. 振幅");
    expect(target).toBeInTheDocument();
  });
  test("Options has cycle params", () => {
    render(<SinCosConfig type="x" config={DEFAULT_CONFIG} />);

    userEvent.click(screen.getByRole("heading", { level: 2 }));

    const target = screen.getByText("C. 周期");
    expect(target).toBeInTheDocument();
  });
  test("Options has start params", () => {
    render(<SinCosConfig type="x" config={DEFAULT_CONFIG} />);

    userEvent.click(screen.getByRole("heading", { level: 2 }));

    const target = screen.getByText("D. 開始角度");
    expect(target).toBeInTheDocument();
  });
  test("start params has note", () => {
    render(<SinCosConfig type="x" config={DEFAULT_CONFIG} />);

    userEvent.click(screen.getByRole("heading", { level: 2 }));

    const target = screen.getByText("※単位: 度");
    expect(target).toBeInTheDocument();
  });
});
