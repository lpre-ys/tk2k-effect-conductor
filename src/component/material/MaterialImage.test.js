import { render, screen } from "@testing-library/react";
import { MaterialImage } from "./MaterialImage";

test("isShow is false, then no return", () => {
  render(<MaterialImage isShow={false} />);

  const target = screen.queryByTestId('material-image');
  expect(target).toBeNull();
});

test("isShow is true then has MaterialImage", () => {
  render(<MaterialImage isShow={true} />);

  const target = screen.getByTestId('material-image');
  expect(target).toBeInTheDocument();
});

test("isShow, then src is props.image", () => {
  render(<MaterialImage isShow={true} image="test4412.png" />);

  const target = screen.getByAltText('original')
  expect(target.src).toContain('test4412.png');
})
