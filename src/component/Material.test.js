import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import makeTransparentImage from "../util/makeTransparentImage";
import { renderWithProviders } from "../util/renderWithProviders";
import { Material } from "./Material";

describe("INIT state", () => {
  test("then no msg", () => {
    renderWithProviders(<Material />);

    const target = screen.queryByTestId("material-msg");
    expect(target).toBeNull();
  });
  test("then no MaterialImage", () => {
    renderWithProviders(<Material />);

    const target = screen.queryByTestId("material-image");
    expect(target).toBeNull();
  });
});

// * Loader
jest.mock("../util/makeTransparentImage");

describe("Loader", () => {
  test("has Loader component", () => {
    renderWithProviders(<Material />);

    const target = screen.getByTestId("material-loader");
    expect(target).toBeInTheDocument();
  });
  describe("loadImage", () => {
    const mockMake = makeTransparentImage;
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
        renderWithProviders(<Material loadOriginalImage={mockFn} />);

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
        renderWithProviders(
          <Material setImageName={mockFn} loadOriginalImage={jest.fn()} />
        );

        const file = new File(["testUp"], "テスト画像name.png", {
          type: "image/png",
        });
        const input = screen.getByTestId("drop-input");

        userEvent.upload(input, file);

        await waitFor(() => {
          expect(mockFn).toBeCalledWith("テスト画像name");
        });
      });
      test("then empty Msg", async () => {
        mockMake.mockResolvedValue({});
        renderWithProviders(
          <Material setImageName={jest.fn()} loadOriginalImage={jest.fn()} />
        );

        const file = new File(["testUp"], "テスト画像name.png", {
          type: "image/png",
        });
        const input = screen.getByTestId("drop-input");

        userEvent.upload(input, file);

        await waitFor(() => {
          const target = screen.queryByTestId("material-msg");
          expect(target).toBeNull();
        });
      });
    });
    describe("reject", () => {
      test("then no call loadOriginalImage", async () => {
        mockMake.mockRejectedValue();
        const mockFn = jest.fn();
        renderWithProviders(<Material loadOriginalImage={mockFn} />);

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
        renderWithProviders(<Material setImageName={mockFn} />);

        const file = new File(["testUp"], "testUp.png", { type: "image/png" });
        const input = screen.getByTestId("drop-input");

        userEvent.upload(input, file);

        await waitFor(() => {
          expect(mockFn).not.toBeCalled();
        });
      });
      test("Error is width, then show Width Error Msg", async () => {
        mockMake.mockRejectedValue(new Error("width"));
        renderWithProviders(<Material />);

        const file = new File(["testUp"], "testUp.png", { type: "image/png" });
        const input = screen.getByTestId("drop-input");

        userEvent.upload(input, file);

        await waitFor(() => {
          expect(
            screen.getByText("素材画像の横幅が正しくないようです。")
          ).toBeInTheDocument();
        });
      });
      test("Error is height, then show Height Error Msg", async () => {
        mockMake.mockRejectedValue(new Error("height"));
        renderWithProviders(<Material />);

        const file = new File(["testUp"], "testUp.png", { type: "image/png" });
        const input = screen.getByTestId("drop-input");

        userEvent.upload(input, file);

        await waitFor(() => {
          expect(
            screen.getByText("素材画像の縦幅が正しくないようです。")
          ).toBeInTheDocument();
        });
      });
    });
  });
});

// * MaterialImage
describe("MaterialImage", () => {
  test("material.orgImg is empty, then not has Preview Button", () => {
    renderWithProviders(<Material originalImage={null} />);

    const target = screen.queryByText("プレビュー");
    expect(target).toBeNull();
  });
  test("material.orgImg is loaded, then has  Preview Button", () => {
    renderWithProviders(<Material originalImage="test.png" />);

    const target = screen.queryByText("プレビュー");
    expect(target).toBeInTheDocument();
  });
  test("click Preview Button, then show MaterialImage", () => {
    renderWithProviders(<Material originalImage="test.png" />);

    const target = screen.queryByText("プレビュー");
    userEvent.click(target);

    expect(screen.getByTestId("material-image")).toBeInTheDocument();
  });
  test("click twice Preview Button, then hide MaterialImage", () => {
    renderWithProviders(<Material originalImage="test.png" />);

    const target = screen.queryByText("プレビュー");
    userEvent.click(target);
    userEvent.click(target);

    expect(screen.queryByTestId("material-image")).toBeNull();
  });
});

describe("Patterns", () => {
  test("trImg is loaded, then has Patterns component", () => {
    renderWithProviders(<Material trImage="test" />);

    const target = screen.getByTestId("patterns-input-bgcolor");
    expect(target).toBeInTheDocument();
  });
  test("trImg is not loaded, then not has Patterns component", () => {
    renderWithProviders(<Material />);

    const target = screen.queryByTestId("patterns-input-bgcolor");
    expect(target).toBeNull();
  });
});
