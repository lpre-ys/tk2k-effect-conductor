import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../util/renderWithProviders";
import { ParameterConfig } from "./ParameterConfig";

test("type Fixed then show ConstConfig", () => {
  renderWithProviders(<ParameterConfig config={{ easing: "fixed" }} />);

  const target = screen.getByTestId("const-config-params-from");
  expect(target).toBeInTheDocument();
});
test("type Easing then show FromToConfig", () => {
  renderWithProviders(<ParameterConfig config={{ easing: "easeLinear" }} />);

  const target = screen.getByTestId("from-to-config-from");
  expect(target).toBeInTheDocument();
});
