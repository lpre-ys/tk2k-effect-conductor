import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Loader from "./Loader";

test('Loader has message', () => {
  render(<Loader />);
  const message = screen.getByText('Drag & Drop or Click');
  expect(message).toBeInTheDocument();
});

test('Loader loaded png file, then call loadImage', async () => {
  const mockFn = jest.fn();
  render(<Loader loadImage={mockFn} />);

  const file = new File(['testUp'], 'testUp.png', { type: 'image/png' });
  const input = screen.getByTestId('drop-input');

  userEvent.upload(input, file);
  await waitFor(() => {
    expect(mockFn).toBeCalled();
  });
});

test('Loader loaded multi png file, then noop', async () => {
  const mockFn = jest.fn();
  render(<Loader loadImage={mockFn} />);

  const files = [
    new File(['testUp1'], 'testUp2.png', { type: 'image/png' }),
    new File(['testUp2'], 'testUp1.png', { type: 'image/png' }),
  ];
  const input = screen.getByTestId('drop-input');

  userEvent.upload(input, files);
  await waitFor(() => {
    expect(mockFn).not.toBeCalled();
  });
});

test('Loader loaded bmp, then noop', async () => {
  const mockFn = jest.fn();
  render(<Loader loadImage={mockFn} />);

  const file = new File(['testUpBmp'], 'testUp.bmp', { type: 'image/bmp' });
  const input = screen.getByTestId('drop-input');

  userEvent.upload(input, file);

  await waitFor(() => {
    expect(mockFn).not.toBeCalled();
  });
});