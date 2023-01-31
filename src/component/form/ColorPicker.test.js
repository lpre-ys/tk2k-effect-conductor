import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorPicker from "./ColorPicker";

jest.mock("react-color", () => {
  return {
    __esModule: true,
    SketchPicker: ({ onChange }) => {
      return (
        <div data-testid="mock-sketch-picker">
          <button
            data-testid="mock-picker-no-alpha"
            onClick={() => {
              onChange({
                hex: "#112233",
                rgb: { r: 10, g: 20, b: 30, a: 1.0 },
              });
            }}
          ></button>
          <button
            data-testid="mock-picker-alpha"
            onClick={() => {
              onChange({
                hex: "#112233",
                rgb: { r: 10, g: 20, b: 30, a: 0.9 },
              });
            }}
          ></button>
        </div>
      );
    },
  };
});

test("has Component", () => {
  render(<ColorPicker />);
  const target = screen.getByTestId("colorpicker-component");
  expect(target).toBeInTheDocument();
});

test("show props.label", () => {
  render(<ColorPicker label="test label" />);
  const target = screen.getByTestId("colorpicker-label");

  expect(target).toHaveTextContent("test label");
});
test("picker element's bgColor is props.color", () => {
  render(<ColorPicker color="#FAC184" />);
  const target = screen.getByTestId("colorpicker-color");

  expect(target).toHaveStyle({ backgroundColor: "#FAC184" });
});

test('color is transparent, click picker, then call setColor', () => {
  const mockFn = jest.fn();
  render(<ColorPicker color="transparent" setColor={mockFn} />);

  userEvent.click(screen.getByTestId('colorpicker-color'));

  expect(mockFn).lastCalledWith('#FFFFFF');
});

test('color is not transparent, click picker, then not call setColor', () => {
  const mockFn = jest.fn();
  render(<ColorPicker color="red" setColor={mockFn} />);

  userEvent.click(screen.getByTestId('colorpicker-color'));

  expect(mockFn).not.toBeCalled();
});

test('picker change, then call setColor', () => {
  const mockFn = jest.fn();
  render(<ColorPicker setColor={mockFn} />);

  userEvent.click(screen.getByTestId('mock-picker-no-alpha'));

  expect(mockFn).lastCalledWith('#112233');
});

test('picker change to alphacolor, then call setColor', () => {
  const mockFn = jest.fn();
  render(<ColorPicker setColor={mockFn} />);

  userEvent.click(screen.getByTestId('mock-picker-alpha'));

  expect(mockFn).lastCalledWith('rgba(10,20,30,0.9)');
});