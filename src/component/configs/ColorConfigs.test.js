import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../util/renderWithProviders";
import { ColorConfigs } from "./ColorConfigs";

jest.mock("./Pattern/PatternImage.jsx", () => () => {
  return <div>Mock: PatternImage</div>
});

test('has HSV mode button', () => {
  renderWithProviders(<ColorConfigs />);

  const target = screen.getByRole('button');
  expect(target).toHaveTextContent('HSVモード');
});
test("click HSV mode button, then call setIsHSV", () => {
  const setIsHSV = jest.fn();
  renderWithProviders(<ColorConfigs setIsHSV={setIsHSV} />);

  const target = screen.getByRole('button');
  userEvent.click(target);

  expect(setIsHSV).toBeCalled();
});

test('HSV mode OFF, then show RGB and tkSat form', () => {
  renderWithProviders(<ColorConfigs isHSV={false} />);

  expect(screen.getByText('赤')).toBeInTheDocument();
  expect(screen.getByText('緑')).toBeInTheDocument();
  expect(screen.getByText('青')).toBeInTheDocument();
  expect(screen.getByText('彩度')).toBeInTheDocument();
});

test('HSV mode ON, then show HSV and tkSat form', () => {
  renderWithProviders(<ColorConfigs isHSV={true} />);

  expect(screen.getByText('H. 色相')).toBeInTheDocument();
  expect(screen.getByText('S. 彩度')).toBeInTheDocument();
  expect(screen.getByText('V. 明度')).toBeInTheDocument();
  expect(screen.getByText('※ツクール側の値')).toBeInTheDocument();
});

test('change HSV min, then update HSV.min', () => {
  renderWithProviders(<ColorConfigs isHSV={true} />);

  const target = screen.getByTestId("color-range-input-number-hsv-min");
  userEvent.clear(target);
  userEvent.type(target, "34");

  expect(target).toHaveValue(34);
});

test('change HSV max, then update HSV.max', () => {
  renderWithProviders(<ColorConfigs isHSV={true} />);

  const target = screen.getByTestId("color-range-input-number-hsv-max");
  userEvent.clear(target);
  userEvent.type(target, "156");

  expect(target).toHaveValue(156);
});