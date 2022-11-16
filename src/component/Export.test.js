import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Export } from "./Export";

describe("Title", () => {
  test("INIT title is props.title", () => {
    render(<Export title="初期表示" />);

    const target = screen.getByLabelText("名前:");
    expect(target).toBeInTheDocument();
    expect(target).toHaveValue('初期表示');
  });

  test("change, then call setTitle value", () => {
    const mockFn = jest.fn();
    render(<Export setTitle={mockFn} />);

    const target = screen.getByLabelText("名前:");
    userEvent.type(target, "テストネーム");

    expect(mockFn).toBeCalledWith('テストネーム');
  });
});

describe("image name", () => {
  test("INIT image name is props.imageName", () => {
    render(<Export imageName="素材初期表示" />);

    const target = screen.getByLabelText("素材ファイル:");
    expect(target).toBeInTheDocument();
    expect(target).toHaveValue('素材初期表示');
  });
  test("change, then call setImage", () => {
    const mockFn = jest.fn();
    render(<Export setImage={mockFn} />);

    const target = screen.getByLabelText("素材ファイル:");
    userEvent.type(target, "テスト素材名");

    expect(mockFn).toBeCalledWith('テスト素材名');
  });
});

describe("COPY button", () => {
  test("writeData is not function, then noop", () => {
    render(<Export />);

    const target = screen.getByText("COPY!!");
    expect(target).toBeInTheDocument();

    userEvent.click(target);

    expect(target).not.toBeDisabled();
  });
  test("writeData is function, then call", async () => {
    const mockFn = jest.fn();
    mockFn.mockResolvedValue(true);
    window.tk2k = { writeData: mockFn };

    render(<Export />);

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

    render(<Export />);

    const target = screen.getByText("COPY!!");

    userEvent.click(target);

    expect(target).toBeDisabled();

    await waitFor(() => {
      expect(target).not.toBeDisabled();
    });
  });
  // TODO データの中身をチェックした方が良い
});
