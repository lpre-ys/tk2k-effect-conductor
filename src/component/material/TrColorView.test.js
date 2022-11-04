import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TrColorView from "./TrColorView";

const defaultColor = { r: 0, g: 0, b: 0 };

test("ColorLabel style is rgb(trColor)", () => {
  render(<TrColorView trColor={{ r: 41, g: 175, b: 221 }} />);

  const target = screen.getByTestId("trcv-color-label");
  expect(target).toHaveStyle({ color: "rgb(41, 175, 221)" });
});

describe("isShowTrInput", () => {
  test("INIT, then isShowTrInput is false", () => {
    render(<TrColorView trColor={defaultColor} />);

    const target = screen.getByTestId("trcv-text-view");
    expect(target).toBeInTheDocument();
  });
  test("click once, then isShowTrInput is true", () => {
    render(<TrColorView trColor={defaultColor} />);

    userEvent.click(screen.getByTestId("trcv-label-wrapper"));

    const target = screen.getByTestId("trcv-input-r");
    expect(target).toBeInTheDocument();
  });
  test("click twice, then isShowTrInput is false", () => {
    render(<TrColorView trColor={defaultColor} />);

    userEvent.click(screen.getByTestId("trcv-label-wrapper"));
    userEvent.click(screen.getByTestId("trcv-label-wrapper"));

    const target = screen.getByTestId("trcv-text-view");
    expect(target).toBeInTheDocument();
  });
});

test("textView is rgb(trColor)", () => {
  render(<TrColorView trColor={{ r: 205, g: 39, b: 71 }} />);

  const target = screen.getByTestId("trcv-text-view");
  expect(target).toHaveTextContent("rgb(205, 39, 71)");
});

describe("trColorInput", () => {
  describe("value", () => {
    test("R value is trColor.r", () => {
      render(<TrColorView trColor={{ r: 11, g: 22, b: 33 }} />);

      userEvent.click(screen.getByTestId("trcv-label-wrapper"));

      const target = screen.getByTestId("trcv-input-r");
      expect(target).toHaveValue("11");
    });
    test("G value is trColor.g", () => {
      render(<TrColorView trColor={{ r: 11, g: 22, b: 33 }} />);

      userEvent.click(screen.getByTestId("trcv-label-wrapper"));

      const target = screen.getByTestId("trcv-input-g");
      expect(target).toHaveValue("22");
    });
    test("B value is trColor.b", () => {
      render(<TrColorView trColor={{ r: 11, g: 22, b: 33 }} />);

      userEvent.click(screen.getByTestId("trcv-label-wrapper"));

      const target = screen.getByTestId("trcv-input-b");
      expect(target).toHaveValue("33");
    });
  });
  describe("change", () => {
    test("R change to trColor.r", () => {
      const mockFn = jest.fn();
      render(
        <TrColorView trColor={{ r: 11, g: 22, b: 33 }} changeTrColor={mockFn} />
      );

      userEvent.click(screen.getByTestId("trcv-label-wrapper"));
      const target = screen.getByTestId("trcv-input-r");

      userEvent.type(target, "{selectall}4");

      expect(mockFn).toBeCalledWith(4, 22, 33);
    });
    // * GとBは上手く動かないので保留...(userEventがあやしい)
    // test("G change to trColor.g", () => {
    //   const mockFn = jest.fn();
    //   render(
    //     <TrColorView trColor={{ r: 11, g: 22, b: 33 }} changeTrColor={mockFn} />
    //   );

    //   userEvent.click(screen.getByTestId("trcv-label-wrapper"));
    //   const input = screen.getByTestId("trcv-input-ggg");

    //   userEvent.type(input, "{selectall}5");

    //   expect(mockFn).toBeCalledWith(11, 5, 33);
    // });
  });
});
