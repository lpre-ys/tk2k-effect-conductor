import { fireEvent, render, screen } from "@testing-library/react";
import PatternImage from "./PatternImage";
// import userEvent from "@testing-library/user-event";

// * 細かいパラメータの設定は見ない

const mockIsRunning = jest.fn();
const mockFrameIndex = jest.fn();
const mockStart = jest.fn();
const mockStop = jest.fn();
jest.mock("react-konva", () => {
  const { forwardRef } = jest.requireActual("react");
  return {
    __esModule: true,
    Stage: ({ children, onClick }) => {
      return <div data-testid="mock-stage" onClick={onClick}>{children}</div>;
    },
    Layer: ({ children }) => {
      return <div>{children}</div>;
    },
    Rect: () => {
      return <div></div>;
    },
    Sprite: forwardRef((props, ref) => {
      ref.current = {
        isRunning: mockIsRunning,
        frameIndex: mockFrameIndex,
        start: mockStart,
        stop: mockStop,
      };
      return <div></div>;
    }),
  };
});
test("image is empty, then show emptyBlock", () => {
  render(<PatternImage />);

  const empty = screen.queryByTestId("pattern-image-empty");
  expect(empty).toBeInTheDocument();
  const main = screen.queryByTestId("pattern-image-canvas");
  expect(main).not.toBeInTheDocument();
});
test("image is valid, then show canvas", () => {
  render(<PatternImage image="test.png" config={{ start: 1, end: 1 }} />);

  const empty = screen.queryByTestId("pattern-image-empty");
  expect(empty).not.toBeInTheDocument();
  const main = screen.queryByTestId("pattern-image-canvas");
  expect(main).toBeInTheDocument();
});

describe('onClick', () => {
  test('isRunning, then Sprite is Stop and reset frame', () => {
    render(<PatternImage image="test.png" config={{ start: 1, end: 1 }} />);
    mockIsRunning.mockReturnValue(true);

    fireEvent.click(screen.getByTestId('mock-stage'));

    expect(mockStop).toBeCalled();
    expect(mockFrameIndex).toBeCalledWith(0);
  });
  test('not isRunning, then Sprite is Start', () => {
    render(<PatternImage image="test.png" config={{ start: 1, end: 1 }} />);
    mockIsRunning.mockReturnValue(false);

    fireEvent.click(screen.getByTestId('mock-stage'));

    expect(mockStart).toBeCalled();
  });
});