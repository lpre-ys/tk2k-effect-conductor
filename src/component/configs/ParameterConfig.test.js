import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../util/renderWithProviders";
import { ParameterConfig } from "./ParameterConfig";

test("type Fixed then show FixedConfig", () => {
  renderWithProviders(
    <ParameterConfig type="x" easing="fixed" />
  );

  const target = screen.getByTestId("number-input-fixed");
  expect(target).toBeInTheDocument();
});
test("type Sin then show SinCosConfig", () => {
  renderWithProviders(
    <ParameterConfig type="y" easing="sin" />
  );

  const target = screen.getByTestId("sincos-config-wrapper");
  expect(target).toBeInTheDocument();
});
test("type Cos then show SinCosConfig", () => {
  renderWithProviders(
    <ParameterConfig type="scale" easing="cos" />
  );

  const target = screen.getByTestId("sincos-config-wrapper");
  expect(target).toBeInTheDocument();
});
test("type Easing then show FromToConfig", () => {
  renderWithProviders(
    <ParameterConfig type="opacity" easing="easeLinear" />
  );

  const target = screen.getByTestId("number-input-from");
  expect(target).toBeInTheDocument();
});

// update
test("type Fixed, change value, then update Value", () => {
  renderWithProviders(
    <ParameterConfig type="x" easing="fixed" />
  );

  const target = screen.getByTestId("number-input-fixed");
  expect(target).toHaveValue(0);  // xの初期値は0

  userEvent.clear(target);
  userEvent.type(target, "7");

  expect(target).toHaveValue(7);
});