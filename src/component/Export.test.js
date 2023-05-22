import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../util/renderWithProviders";
import { Export } from "./Export";

describe("Title", () => {
  test("INIT title is props.title", () => {
    renderWithProviders(<Export title="初期表示" />);

    const target = screen.getByLabelText("名前:");
    expect(target).toBeInTheDocument();
    expect(target).toHaveValue("初期表示");
  });

  test("change, then call setTitle value", () => {
    const mockFn = jest.fn();
    renderWithProviders(<Export setTitle={mockFn} />);

    const target = screen.getByLabelText("名前:");
    userEvent.type(target, "テストネーム");

    expect(mockFn).toBeCalledWith("テストネーム");
  });
});

describe("image name", () => {
  test("INIT image name is props.imageName", () => {
    renderWithProviders(<Export imageName="素材初期表示" />);

    const target = screen.getByLabelText("素材ファイル:");
    expect(target).toBeInTheDocument();
    expect(target).toHaveValue("素材初期表示");
  });
  test("change, then call setImage", () => {
    const mockFn = jest.fn();
    renderWithProviders(<Export setImage={mockFn} />);

    const target = screen.getByLabelText("素材ファイル:");
    userEvent.type(target, "テスト素材名");

    expect(mockFn).toBeCalledWith("テスト素材名");
  });
});

describe("COPY button", () => {
  test("writeData is not function, then noop", () => {
    renderWithProviders(<Export />);

    const target = screen.getByText("COPY!!");
    expect(target).toBeInTheDocument();

    userEvent.click(target);

    expect(target).not.toBeDisabled();
  });
  test("writeData is function, then call", async () => {
    const mockFn = jest.fn();
    mockFn.mockResolvedValue(true);
    window.tk2k = { writeData: mockFn };

    renderWithProviders(<Export />);

    const target = screen.getByText("COPY!!");

    userEvent.click(target);

    await waitFor(() => {
      expect(mockFn).toBeCalled();
    });
  });
  test("writeData is resolved, then button is Enabled", async () => {
    const mockFn = jest.fn();
    mockFn.mockResolvedValue(true);
    window.tk2k = { writeData: mockFn };

    renderWithProviders(<Export />);

    const target = screen.getByText("COPY!!");

    userEvent.click(target);

    expect(target).toBeDisabled();

    await waitFor(() => {
      expect(target).not.toBeDisabled();
    });
  });
  // TODO データの中身をチェックした方が良い
});

describe("Options", () => {
  test("update target", () => {
    renderWithProviders(<Export />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByTestId("export-options-target");

    userEvent.selectOptions(target, "0");
    expect(target).toHaveValue("0");

    userEvent.selectOptions(target, "1");
    expect(target).toHaveValue("1");
  });
  test("update yLine", () => {
    renderWithProviders(<Export />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByTestId("export-options-yline");

    userEvent.selectOptions(target, "0");
    expect(target).toHaveValue("0");

    userEvent.selectOptions(target, "1");
    expect(target).toHaveValue("1");

    userEvent.selectOptions(target, "2");
    expect(target).toHaveValue("2");
  });
  test("load", async () => {
    const testData = {
      title: "test title",
      image: "test image",
      target: "1",
      yLine: "2",
      rawEffect: "test Raw Effect!!!",
    };
    window.tk2k = {
      readInfo: jest.fn().mockResolvedValue(testData),
    };
    renderWithProviders(<Export />);

    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByText("クリップボードから読み込み");
    userEvent.click(target);

    await waitFor(() => {
      expect(screen.getByText("クリップボードから読み込み")).toBeInTheDocument();
    })
    expect(screen.getByTestId("export-options-target")).toHaveValue("1");
    expect(screen.getByTestId("export-options-yline")).toHaveValue("2");
    expect(screen.getByText(/設定有り/)).toBeInTheDocument();
  });
  test('clear rawEffect', async () => {
    const testData = {
      title: "test title",
      image: "test image",
      target: "1",
      yLine: "2",
      rawEffect: "test Raw Effect!!!",
    };
    window.tk2k = {
      readInfo: jest.fn().mockResolvedValue(testData),
    };
    renderWithProviders(<Export />);

    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const loadButton = screen.getByText("クリップボードから読み込み");
    userEvent.click(loadButton);

    await waitFor(() => {
      expect(screen.getByText("クリップボードから読み込み")).toBeInTheDocument();
    })
    const target = screen.getByText('クリア');
    userEvent.click(target);

    expect(screen.getByText(/設定無し/)).toBeInTheDocument();
  })
});
