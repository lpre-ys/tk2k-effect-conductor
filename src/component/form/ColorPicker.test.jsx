import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorPicker from "./ColorPicker";

vi.mock("react-colorful", () => {
  return {
    HexColorPicker: ({ color, onChange }) => (
      <button data-testid="mock-hex-picker" onClick={() => onChange("#112233")}>
        {color}
      </button>
    ),
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
  const mockFn = vi.fn();
  render(<ColorPicker color="transparent" setColor={mockFn} />);

  userEvent.click(screen.getByTestId('colorpicker-color'));

  expect(mockFn).lastCalledWith('#FFFFFF');
});

test('color is not transparent, click picker, then not call setColor', () => {
  const mockFn = vi.fn();
  render(<ColorPicker color="red" setColor={mockFn} />);

  userEvent.click(screen.getByTestId('colorpicker-color'));

  expect(mockFn).not.toBeCalled();
});

test('picker change, then call setColor', () => {
  const mockFn = vi.fn();
  render(<ColorPicker setColor={mockFn} />);

  userEvent.click(screen.getByTestId('mock-hex-picker'));

  expect(mockFn).lastCalledWith('#112233');
});

test('click preset swatch, then call setColor with preset value', () => {
  const mockFn = vi.fn();
  render(<ColorPicker setColor={mockFn} />);

  userEvent.click(screen.getByTestId('colorpicker-preset-transparent'));

  expect(mockFn).lastCalledWith('transparent');
});