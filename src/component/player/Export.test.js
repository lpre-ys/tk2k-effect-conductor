import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../util/renderWithProviders";
import Export from "./Export";

describe("Title", () => {
  test("INIT title is props.title", () => {
    renderWithProviders(<Export title="初期表示" />);

    const target = screen.getByLabelText("名前:");
    expect(target).toBeInTheDocument();
    expect(target).toHaveValue('初期表示');
  });

  test("change, then call setTitle value", () => {
    const mockFn = jest.fn();
    renderWithProviders(<Export setTitle={mockFn} />);

    const target = screen.getByLabelText("名前:");
    userEvent.type(target, "テストネーム");

    expect(mockFn).toBeCalledWith('テストネーム');
  });
});

describe("material name", () => {
  test("INIT material name is props.materialName", () => {
    renderWithProviders(<Export materialName="素材初期表示" />);

    const target = screen.getByLabelText("素材ファイル:");
    expect(target).toBeInTheDocument();
    expect(target).toHaveValue('素材初期表示');
  });
  test("change, then call setMaterialName", () => {
    const mockFn = jest.fn();
    renderWithProviders(<Export setMaterialName={mockFn} />);

    const target = screen.getByLabelText("素材ファイル:");
    userEvent.type(target, "テスト素材名");

    expect(mockFn).toBeCalledWith('テスト素材名');
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
