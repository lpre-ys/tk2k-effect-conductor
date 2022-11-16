import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import makeTransparentImage from "../../util/makeTransparentImage";
import { TrColorView } from "./TrColorView";

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

jest.mock("../../util/makeTransparentImage");

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
    const mockMake = makeTransparentImage;
    beforeEach(() => {
      mockMake.mockReset();
      mockMake.mockResolvedValue({
        transparent: "transparent-image",
        maxPage: 42,
        trColor: "test-trcolor",
      });
    });
    test("R change to trColor.r", async () => {
      const mockFn = jest.fn();
      render(
        <TrColorView
          image="testimage.png"
          trColor={{ r: 11, g: 22, b: 33 }}
          changeTrColor={mockFn}
        />
      );

      userEvent.click(screen.getByTestId("trcv-label-wrapper"));
      const target = screen.getByTestId("trcv-input-r");

      fireEvent.change(target, { target: { value: 4 } });

      await waitFor(() => {
        expect(mockMake).toBeCalledWith("testimage.png", {
          r: 4,
          g: 22,
          b: 33,
        });
      });
      await waitFor(() => {
        expect(mockFn).toBeCalledWith("transparent-image", "test-trcolor");
      });
    });
    test("G change to trColor.g", async () => {
      const mockFn = jest.fn();
      render(
        <TrColorView
          image="testimage.png"
          trColor={{ r: 11, g: 22, b: 33 }}
          changeTrColor={mockFn}
        />
      );

      userEvent.click(screen.getByTestId("trcv-label-wrapper"));
      const target = screen.getByTestId("trcv-input-g");

      fireEvent.change(target, { target: { value: 6 } });

      await waitFor(() => {
        expect(mockMake).toBeCalledWith("testimage.png", {
          r: 11,
          g: 6,
          b: 33,
        });
      });
      await waitFor(() => {
        expect(mockFn).toBeCalledWith("transparent-image", "test-trcolor");
      });
    });
    test("B change to trColor.g", async () => {
      const mockFn = jest.fn();
      render(
        <TrColorView
          image="testimage.png"
          trColor={{ r: 11, g: 22, b: 33 }}
          changeTrColor={mockFn}
        />
      );

      userEvent.click(screen.getByTestId("trcv-label-wrapper"));
      const target = screen.getByTestId("trcv-input-b");

      fireEvent.change(target, { target: { value: 8 } });

      await waitFor(() => {
        expect(mockMake).toBeCalledWith("testimage.png", {
          r: 11,
          g: 22,
          b: 8,
        });
      });
      await waitFor(() => {
        expect(mockFn).toBeCalledWith("transparent-image", "test-trcolor");
      });
    });
  });
});
