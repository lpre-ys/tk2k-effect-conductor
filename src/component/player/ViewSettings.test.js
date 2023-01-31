import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ViewSettings } from "./ViewSettings";

jest.mock("react-color", () => {
  return {
    __esModule: true,
    SketchPicker: () => {
      return <div data-testid="mock-sketch-picker"></div>;
    },
  };
});

const handler = jest.fn();

describe("bg color", () => {
  test("INIT then value is props.bgColor", () => {
    render(
      <ViewSettings
        bgColor="white"
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
      />
    );

    const target = screen.getByTestId("colorpicker-color");

    expect(target).toBeInTheDocument();
    expect(target).toHaveStyle({ backgroundColor: "white" });
  });

  test("has ColorPicker component", () => {
    render(
      <ViewSettings
        bgColor="white"
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
      />
    );
    const target = screen.getByTestId("colorpicker-component");

    expect(target).toBeInTheDocument();
  });
  test("ColorPicker.label is 背景色", () => {
    render(
      <ViewSettings
        bgColor="white"
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
      />
    );
    const target = screen.getByText(/背景色/);

    expect(target).toBeInTheDocument();
  });
  test("ColorPicker.color is bgColor", () => {
    render(
      <ViewSettings
        bgColor="green"
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
      />
    );
    const target = screen.getByTestId("colorpicker-color");
    expect(target).toHaveStyle({ backgroundColor: "green" });
  });
  test("ColorPicker.setColor is setBgColor", () => {
    const mockFn = jest.fn();
    render(
      <ViewSettings
        bgColor="transparent"
        setBgColor={mockFn}
        setBgImage={handler}
        setIsShowCelBorder={handler}
      />
    );

    userEvent.click(screen.getByTestId("colorpicker-color"));

    expect(mockFn).toBeCalledWith("#FFFFFF");
  });
});

describe("bg image", () => {
  test("INIT has file input", () => {
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
      />
    );

    const target = screen.getByTestId("drop-player-bg-image");

    expect(target).toBeInTheDocument();
  });
  test("drop file, then call setBgImage with image", async () => {
    const mockFn = jest.fn();
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={mockFn}
        setIsShowCelBorder={handler}
      />
    );

    const target = screen.getByTestId("drop-player-bg-image");
    const file = new File(["test"], "testBgImage.png", { type: "image/png" });
    userEvent.upload(target, file);

    await waitFor(() => {
      expect(mockFn).toBeCalledWith("data:image/png;base64,dGVzdA==");
    });
  });
  test("reset, then call setBgImage with null", () => {
    const mockFn = jest.fn();
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={mockFn}
        setIsShowCelBorder={handler}
      />
    );
    const target = screen.getByText("クリア");
    userEvent.click(target);

    expect(mockFn).toBeCalledWith(null);
  });
});

describe("show Border", () => {
  test("INIT props.isShowCelborder is false, then not checked", () => {
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
        isShowCelBorder={false}
      />
    );

    const target = screen.getByLabelText("枠表示:");

    expect(target).not.toBeChecked();
  });
  test("INIT props.isShowCelborder is true, then checked", () => {
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
        isShowCelBorder={true}
      />
    );

    const target = screen.getByLabelText("枠表示:");

    expect(target).toBeChecked();
  });
  test("not checked and click, then call setIsShowCelBorder with true", () => {
    const mockFn = jest.fn();
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={mockFn}
        isShowCelBorder={false}
      />
    );

    const target = screen.getByLabelText("枠表示:");

    userEvent.click(target);

    expect(mockFn).toBeCalledWith(true);
  });
  test("checked and click, then call setIsShowCelBorder with false", () => {
    const mockFn = jest.fn();
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={mockFn}
        isShowCelBorder={true}
      />
    );

    const target = screen.getByLabelText("枠表示:");

    userEvent.click(target);

    expect(mockFn).toBeCalledWith(false);
  });
});

describe("zoom", () => {
  test("label is ズーム", () => {
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
        isShowCelBorder={true}
      />
    );
    const target = screen.getByLabelText(/ズーム/);

    expect(target).toBeInTheDocument();
  });
  test("options is 2x, 1x", () => {
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
        isShowCelBorder={true}
      />
    );
    const targets = screen.getAllByRole("option");

    expect(targets).toHaveLength(2);
    expect(targets[0]).toHaveTextContent("2x");
    expect(targets[1]).toHaveTextContent("1x");
  });
  test("selected is props.zoom", () => {
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
        isShowCelBorder={true}
        zoom={1}
      />
    );
    const target = screen.getByRole("option", {
      selected: true,
    });

    expect(target).toHaveTextContent("1x");
  });
  test("change, then call setZoom", () => {
    const mockFn = jest.fn();
    render(
      <ViewSettings
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
        isShowCelBorder={true}
        zoom={1}
        setZoom={mockFn}
      />
    );

    userEvent.selectOptions(screen.getByRole("combobox"), ["2"]);

    expect(mockFn).toBeCalledWith("2");
  });
});
