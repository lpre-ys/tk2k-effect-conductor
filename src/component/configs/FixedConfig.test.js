import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../util/renderWithProviders";
import { FixedConfig } from "./FixedConfig";

const defaultConfig = {
  from: 0,
  to: 0,
  cycle: 0,
  isRoundTrip: false,
  easing: "easeLinear",
  easingAdd: "",
};

test("init value is config.from", () => {
  renderWithProviders(<FixedConfig type="x" config={{ from: 3, to: 6 }} />);

  const target = screen.getByTestId("const-config-params-from");
  expect(target).toBeInTheDocument();
});
describe("Form", () => {
  test("change to Number, then value is update and call update", () => {
    const mockFn = jest.fn();
    renderWithProviders(
      <FixedConfig type="x" config={{ from: 3, to: 6 }} updateFromTo={mockFn} />
    );
    const target = screen.getByTestId("const-config-params-from");

    fireEvent.change(target, { target: { value: 8 } });
    expect(target).toHaveValue(8);
    expect(mockFn).toBeCalledWith("x", 8, 6);
    // マイナスもOK
    fireEvent.change(target, { target: { value: -111 } });
    expect(target).toHaveValue(-111);
    expect(mockFn).toBeCalledWith("x", -111, 6);
  });
  test("change to empty, then value is empty and not call update", () => {
    const mockFn = jest.fn();
    renderWithProviders(
      <FixedConfig type="x" config={{ from: 3, to: 6 }} updateFromTo={mockFn} />
    );
    const target = screen.getByTestId("const-config-params-from");

    fireEvent.change(target, { target: { value: "" } });
    expect(target).not.toHaveValue();
    expect(mockFn).not.toBeCalled();
  });
});
describe("Header", () => {
  test("Text is props.name", () => {
    renderWithProviders(
      <FixedConfig type="x" config={defaultConfig} name="テストネーム" />
    );

    const target = screen.getByRole("heading");
    expect(target).toHaveTextContent("テストネーム");
  });
  describe("Error icon", () => {
    test("no Error, then not show Error icon", () => {
      renderWithProviders(
        <FixedConfig type="x" config={defaultConfig} name="テストネーム" />
      );

      const target = screen.queryByTestId("config-header-icon-error");
      expect(target).not.toBeInTheDocument();
    });
    test("from Error, then show Error icon", () => {
      renderWithProviders(
        <FixedConfig type="x" config={defaultConfig} name="テストネーム" />
      );

      fireEvent.change(screen.getByTestId("const-config-params-from"), {
        target: { value: "" },
      });

      const target = screen.queryByTestId("config-header-icon-error");
      expect(target).toBeInTheDocument();
    });
    test("ckick Icon, then reset value to config", () => {
      renderWithProviders(
        <FixedConfig
          type="x"
          config={{ from: 12, to: 34 }}
          name="テストネーム"
        />
      );

      const from = screen.getByTestId("const-config-params-from");
      fireEvent.change(from, { target: { value: "" } });

      const icon = screen.getByTestId("config-header-icon-error");
      userEvent.click(icon);

      expect(icon).not.toBeInTheDocument();
      expect(from).toHaveValue(12);
    });
  });
});
describe("isSub", () => {
  describe("not sub", () => {
    test("wrapper do not have sub style", () => {
      renderWithProviders(<FixedConfig type="x" config={{ from: 3, to: 6 }} />);

      const target = screen.getByTestId("const-config-params-wrapper");
      expect(target).not.toHaveStyle({ fontSize: "0.9em" });
    });
    test("input do not have sub style", () => {
      renderWithProviders(<FixedConfig type="x" config={{ from: 3, to: 6 }} />);

      const target = screen.getByTestId("const-config-params-from");
      expect(target).not.toHaveStyle({ marginRight: "71px" });
    });
  });
  describe('is sub', () => {
    test("wrapper have sub style", () => {
      renderWithProviders(<FixedConfig isSub={true} type="x" config={{ from: 3, to: 6 }} />);

      const target = screen.getByTestId("const-config-params-wrapper");
      expect(target).toHaveStyle({ fontSize: "0.9em" });
    });
    test("input have sub style", () => {
      renderWithProviders(<FixedConfig isSub={true} type="x" config={{ from: 3, to: 6 }} />);

      const target = screen.getByTestId("const-config-params-from");
      expect(target).toHaveStyle({ marginRight: "71px" });
    });

  })
});
