import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../util/renderWithProviders";
import { FromToConfig } from "./FromToConfig";

const defaultConfig = {
  from: 0,
  to: 0,
  cycle: 0,
  isRoundTrip: false,
  easing: "easeLinear",
  easingAdd: "",
};

test("has EasingConfig component", () => {
  renderWithProviders(<FromToConfig type="x" config={defaultConfig} />);

  const target = screen.getByTestId("from-to-easing");
  expect(target).toBeInTheDocument();
});

describe("Options", () => {
  test("INIT, then no component", () => {
    renderWithProviders(<FromToConfig type="x" config={defaultConfig} />);

    const target = screen.queryByTestId("from-to-options");
    expect(target).not.toBeInTheDocument();
  });
  test("click header once, then has component", () => {
    renderWithProviders(<FromToConfig type="x" config={defaultConfig} />);

    const header = screen.getByRole("heading");
    userEvent.click(header);

    const target = screen.queryByTestId("from-to-options");
    expect(target).toBeInTheDocument();
  });
  test("click header twice, then no component", () => {
    renderWithProviders(<FromToConfig type="x" config={defaultConfig} />);

    const header = screen.getByRole("heading");
    userEvent.click(header);
    userEvent.click(header);

    const target = screen.queryByTestId("from-to-options");
    expect(target).not.toBeInTheDocument();
  });

});

describe("From", () => {
  test("init value is config.from", () => {
    renderWithProviders(<FromToConfig type="x" config={{ from: 3, to: 6 }} />);

    const target = screen.getByTestId("from-to-config-from");
    expect(target).toHaveValue(3);
  });
  test("change to Number, then value is update and call update", () => {
    const mockFn = jest.fn();
    renderWithProviders(
      <FromToConfig type="x" config={{ from: 3, to: 6 }} update={mockFn} />
    );
    const target = screen.getByTestId("from-to-config-from");

    fireEvent.change(target, { target: { value: 8 } });
    expect(target).toHaveValue(8);
    expect(mockFn).toBeCalledWith("x", { from: 8, to: 6 });
    // マイナスもOK
    fireEvent.change(target, { target: { value: -111 } });
    expect(target).toHaveValue(-111);
    expect(mockFn).toBeCalledWith("x", { from: -111, to: 6 });
  });
  test("change to empty, then value is empty and not call update", () => {
    const mockFn = jest.fn();
    renderWithProviders(
      <FromToConfig type="x" config={{ from: 3, to: 6 }} update={mockFn} />
    );
    const target = screen.getByTestId("from-to-config-from");

    fireEvent.change(target, { target: { value: "" } });
    expect(target).not.toHaveValue();
    expect(mockFn).not.toBeCalled();
  });
});

describe("To", () => {
  test("init value is config.to", () => {
    renderWithProviders(<FromToConfig type="x" config={{ from: 3, to: 6 }} />);

    const target = screen.getByTestId("from-to-config-to");
    expect(target).toHaveValue(6);
  });
  test("change to Number, then value is update and call update", () => {
    const mockFn = jest.fn();
    renderWithProviders(
      <FromToConfig type="x" config={{ from: 3, to: 6 }} update={mockFn} />
    );
    const target = screen.getByTestId("from-to-config-to");

    fireEvent.change(target, { target: { value: 2 } });
    expect(target).toHaveValue(2);
    expect(mockFn).toBeCalledWith("x", { from: 3, to: 2 });
    // マイナスもOK
    fireEvent.change(target, { target: { value: -29 } });
    expect(target).toHaveValue(-29);
    expect(mockFn).toBeCalledWith("x", { from: 3, to: -29 });
  });
  test("change to empty, then value is empty and not call update", () => {
    const mockFn = jest.fn();
    renderWithProviders(
      <FromToConfig type="x" config={{ from: 3, to: 6 }} update={mockFn} />
    );
    const target = screen.getByTestId("from-to-config-to");

    fireEvent.change(target, { target: { value: "" } });
    expect(target).not.toHaveValue();
    expect(mockFn).not.toBeCalled();
  });
});

describe("Header", () => {
  test("Text is props.name", () => {
    renderWithProviders(<FromToConfig type="x" config={defaultConfig} name="テストネーム" />);

    const target = screen.getByRole("heading");
    expect(target).toHaveTextContent("テストネーム");
  });
  describe('Angle icon', () => {
    test('No Cycle and No RoundTrip, then header icon is gray', () => {
      renderWithProviders(<FromToConfig type="x" config={defaultConfig} />);

      const target = screen.getByTestId('config-header-icon-right');
      expect(target).toHaveStyle({ color: '#9e9e9e' });
    });
    test('has Cycle, then header icon is blue', () => {
      const config = Object.assign({}, defaultConfig);
      config.cycle = 3;
      renderWithProviders(<FromToConfig type="x" config={config} />);

      const target = screen.getByTestId('config-header-icon-right');
      expect(target).toHaveStyle({ color: '#00838F' });
    });
    test('on RoundTrip, then header icon is blue', () => {
      const config = Object.assign({}, defaultConfig);
      config.isRoundTrip = true;
      renderWithProviders(<FromToConfig type="x" config={config} />);

      const target = screen.getByTestId('config-header-icon-right');
      expect(target).toHaveStyle({ color: '#00838F' });
    });
    test("not show Option, then show Rignt icon", () => {
      renderWithProviders(<FromToConfig type="x" config={defaultConfig} name="テストネーム" />);

      const target = screen.getByTestId("config-header-icon-right");
      expect(target).toBeInTheDocument();
    });
    test("show Option, then show Down icon", () => {
      renderWithProviders(<FromToConfig type="x" config={defaultConfig} name="テストネーム" />);

      userEvent.click(screen.getByRole("heading"));

      const target = screen.getByTestId("config-header-icon-down");
      expect(target).toBeInTheDocument();
    });
  });
  describe("Error icon", () => {
    test("no Error, then not show Error icon", () => {
      renderWithProviders(<FromToConfig type="x" config={defaultConfig} name="テストネーム" />);

      const target = screen.queryByTestId("config-header-icon-error");
      expect(target).not.toBeInTheDocument();
    });
    test("from Error, then show Error icon", () => {
      renderWithProviders(<FromToConfig type="x" config={defaultConfig} name="テストネーム" />);

      fireEvent.change(screen.getByTestId("from-to-config-from"), {
        target: { value: "" },
      });

      const target = screen.queryByTestId("config-header-icon-error");
      expect(target).toBeInTheDocument();
    });
    test("to Error, then show Error icon", () => {
      renderWithProviders(<FromToConfig type="x" config={defaultConfig} name="テストネーム" />);

      fireEvent.change(screen.getByTestId("from-to-config-to"), {
        target: { value: "" },
      });

      const target = screen.queryByTestId("config-header-icon-error");
      expect(target).toBeInTheDocument();
    });
    test("ckick Icon, then reset value to config", () => {
      renderWithProviders(
        <FromToConfig type="x" config={{ from: 12, to: 34 }} name="テストネーム" />
      );

      const from = screen.getByTestId("from-to-config-from");
      const to = screen.getByTestId("from-to-config-to");
      fireEvent.change(from, { target: { value: "" } });
      fireEvent.change(to, { target: { value: "" } });

      const icon = screen.getByTestId("config-header-icon-error");
      userEvent.click(icon);

      expect(icon).not.toBeInTheDocument();
      expect(from).toHaveValue(12);
      expect(to).toHaveValue(34);
    });
    test("ckick Icon, then not change isOption", () => {
      renderWithProviders(
        <FromToConfig type="x" config={defaultConfig} name="テストネーム" />
      );

      const from = screen.getByTestId("from-to-config-from");
      fireEvent.change(from, { target: { value: "" } });

      const icon = screen.getByTestId("config-header-icon-error");
      userEvent.click(icon);

      const target = screen.queryByTestId("from-to-options");
      expect(target).not.toBeInTheDocument();
    });

  });
});
