import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewSettings from "./ViewSettings";

const handler = jest.fn();

describe("bg color", () => {
  test("INIT then value is props.background", () => {
    render(
      <ViewSettings
        background="testbgcolor"
        setBgColor={handler}
        setBgImage={handler}
        setIsShowCelBorder={handler}
      />
    );

    const target = screen.getByLabelText("背景色:");

    expect(target).toBeInTheDocument();
    expect(target).toHaveValue("testbgcolor");
  });

  test("change, then call setBgColor with value", () => {
    const mockFn = jest.fn();
    render(
      <ViewSettings
        background="testbgcolor"
        setBgColor={mockFn}
        setBgImage={handler}
        setIsShowCelBorder={handler}
      />
    );

    const target = screen.getByLabelText("背景色:");

    fireEvent.change(target, { target: { value: "testchange" } });

    expect(mockFn).toBeCalledWith("testchange");
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
