import { render, screen } from "@testing-library/react";
import { Options } from "./Options";

describe('visible', () => {
  test("isOption true, then show component", () => {
    render(<Options isOption={true} />);

    const target = screen.getByTestId("configs-timing-options");
    expect(target).toBeInTheDocument();
  });
  test("isOption false, then hide component", () => {
    render(<Options isOption={false} />);

    const target = screen.queryByTestId("configs-timing-options");
    expect(target).not.toBeInTheDocument();
  });
})