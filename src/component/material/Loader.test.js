import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import makeTransparentImage from "../../util/makeTransparentImage";
import { Loader } from "./Loader";

test("Loader has message", () => {
  render(<Loader />);
  const message = screen.getByText("Drag & Drop or Click");
  expect(message).toBeInTheDocument();
});

jest.mock("../../util/makeTransparentImage");
const mockMake = makeTransparentImage;

describe("loadImage", () => {
  beforeEach(() => {
    mockMake.mockReset();
  });
  describe("makeTransparentImage is resolved", () => {
    test("then call loadOriginalImage", async () => {
      mockMake.mockResolvedValue({
        transparent: "transparent-image",
        maxPage: 42,
        trColor: "test-trcolor",
      });
      const mockFn = jest.fn();
      render(<Loader loadOriginalImage={mockFn} />);

      const file = new File(["testUp"], "testUp.png", { type: "image/png" });
      const input = screen.getByTestId("drop-input");

      userEvent.upload(input, file);

      await waitFor(() => {
        expect(mockFn).toBeCalledWith({
          dataUrl: "data:image/png;base64,dGVzdFVw",
          transparent: "transparent-image",
          maxPage: 42,
          trColor: "test-trcolor",
        });
      });
    });
    test("then call setImageName", async () => {
      mockMake.mockResolvedValue({});
      const mockFn = jest.fn();
      render(<Loader setImageName={mockFn} loadOriginalImage={jest.fn()} />);

      const file = new File(["testUp"], "テスト画像name.png", {
        type: "image/png",
      });
      const input = screen.getByTestId("drop-input");

      userEvent.upload(input, file);

      await waitFor(() => {
        expect(mockFn).toBeCalledWith("テスト画像name");
      });
    });
    test("then setMsg empty", async () => {
      mockMake.mockResolvedValue({});
      const mockFn = jest.fn();
      render(
        <Loader
          setImageName={jest.fn()}
          loadOriginalImage={jest.fn()}
          setMsg={mockFn}
        />
      );

      const file = new File(["testUp"], "テスト画像name.png", {
        type: "image/png",
      });
      const input = screen.getByTestId("drop-input");

      userEvent.upload(input, file);

      await waitFor(() => {
        expect(mockFn).toBeCalledWith("");
      });
    });
  });
  describe("reject", () => {
    test("then no call loadOriginalImage", async () => {
      mockMake.mockRejectedValue();
      const mockFn = jest.fn();
      render(<Loader loadOriginalImage={mockFn} setMsg={mockFn} />);

      const file = new File(["testUp"], "testUp.png", { type: "image/png" });
      const input = screen.getByTestId("drop-input");

      userEvent.upload(input, file);

      await waitFor(() => {
        expect(mockFn).not.toBeCalled();
      });
    });
    test("then no call setImageName", async () => {
      mockMake.mockRejectedValue();
      const mockFn = jest.fn();
      render(<Loader setImageName={mockFn} setMsg={mockFn} />);

      const file = new File(["testUp"], "testUp.png", { type: "image/png" });
      const input = screen.getByTestId("drop-input");

      userEvent.upload(input, file);

      await waitFor(() => {
        expect(mockFn).not.toBeCalled();
      });
    });
    test("Error is width, then setMsg Width Error Msg", async () => {
      mockMake.mockRejectedValue(new Error("width"));
      const mockFn = jest.fn();
      render(<Loader setMsg={mockFn} />);

      const file = new File(["testUp"], "testUp.png", { type: "image/png" });
      const input = screen.getByTestId("drop-input");

      userEvent.upload(input, file);

      await waitFor(() => {
        expect(mockFn).toBeCalledWith("素材画像の横幅が正しくないようです。");
      });
    });
    test("Error is height, then setMsg Height Error Msg", async () => {
      mockMake.mockRejectedValue(new Error("height"));
      const mockFn = jest.fn();
      render(<Loader setMsg={mockFn} />);

      const file = new File(["testUp"], "testUp.png", { type: "image/png" });
      const input = screen.getByTestId("drop-input");

      userEvent.upload(input, file);

      await waitFor(() => {
        expect(mockFn).toBeCalledWith("素材画像の縦幅が正しくないようです。");
      });
    });
  });
});

describe("dropzone settings", () => {
  beforeEach(() => {
    mockMake.mockReset();
    mockMake.mockResolvedValue({
      transparent: "transparent-image",
      maxPage: 42,
      trColor: "test-trcolor",
    });
  });
  test("Loader loaded png file, then call loadImage", async () => {
    const mockFn = jest.fn();
    render(
      <Loader
        loadOriginalImage={mockFn}
        setImageName={jest.fn()}
        setMsg={jest.fn()}
      />
    );

    const file = new File(["testUp"], "testUp.png", { type: "image/png" });
    const input = screen.getByTestId("drop-input");

    userEvent.upload(input, file);

    await waitFor(() => {
      expect(mockFn).toBeCalled();
    });
  });

  test("Loader loaded multi png file, then noop", async () => {
    const mockFn = jest.fn();
    render(
      <Loader
        loadOriginalImage={mockFn}
        setImageName={jest.fn()}
        setMsg={jest.fn()}
      />
    );

    const files = [
      new File(["testUp1"], "testUp2.png", { type: "image/png" }),
      new File(["testUp2"], "testUp1.png", { type: "image/png" }),
    ];
    const input = screen.getByTestId("drop-input");

    userEvent.upload(input, files);
    await waitFor(() => {
      expect(mockFn).not.toBeCalled();
    });
  });

  test("Loader loaded bmp, then call loadImage", async () => {
    const mockFn = jest.fn();
    render(
      <Loader
        loadOriginalImage={mockFn}
        setImageName={jest.fn()}
        setMsg={jest.fn()}
      />
    );

    const file = new File(["testUpBmp"], "testUp.bmp", { type: "image/bmp" });
    const input = screen.getByTestId("drop-input");

    userEvent.upload(input, file);

    await waitFor(() => {
      expect(mockFn).toBeCalled();
    });
  });

  test("Loader loaded gif, then noop", async () => {
    const mockFn = jest.fn();
    render(
      <Loader
        loadOriginalImage={mockFn}
        setImageName={jest.fn()}
        setMsg={jest.fn()}
      />
    );

    const file = new File(["testUpGif"], "testUp.gif", { type: "image/gif" });
    const input = screen.getByTestId("drop-input");

    userEvent.upload(input, file);

    await waitFor(() => {
      expect(mockFn).not.toBeCalled();
    });
  });
});
