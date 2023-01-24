import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../util/renderWithProviders";
import { Patterns } from "./Patterns";

jest.mock("react-color", () => {
  return {
    __esModule: true,
    SketchPicker: () => {
      return <div data-testid="mock-sketch-picker"></div>;
    },
  };
});

test("image is div.backgroundImage", () => {
  renderWithProviders(<Patterns max={1} image="testbg.png" />);

  const target = screen.getByTestId("patterns-pattern-sprite");
  expect(target).toHaveStyle({ backgroundImage: "url(testbg.png)" });
});

describe("Length", () => {
  test("max = 0, then 0 li element", () => {
    renderWithProviders(<Patterns max={0} />);
    const target = screen.queryAllByRole("listitem");
    expect(target).toHaveLength(0);
  });
  test("max = 1, then 1 li element", () => {
    renderWithProviders(<Patterns max={1} />);
    const target = screen.queryAllByRole("listitem");
    expect(target).toHaveLength(1);
  });
  test("max = 25, then 25 li element", () => {
    renderWithProviders(<Patterns max={25} />);
    const target = screen.queryAllByRole("listitem");
    expect(target).toHaveLength(25);
  });
});
describe("bgColor, changeBgColor", () => {
  test("change BGColor then call changeBgColor", () => {
    const mockHandler = jest.fn();
    renderWithProviders(
      <Patterns max={1} image="test.png" bgColor="transparent" changeBgColor={mockHandler} />
    );
    const picker = screen.getByTestId("colorpicker-color");

    userEvent.click(picker);

    expect(mockHandler).toBeCalledWith("#FFFFFF");
  });

  test("bgColor is transparent, then bg style is url(tr.png)", () => {
    renderWithProviders(
      <Patterns max={1} image="test.png" bgColor="transparent" />
    );
    const target = screen.getByTestId("patterns-pattern-bgcolor-div");
    expect(target).toHaveStyle(`background: transparent`);
  });

  test("bgColor is gray, then bg style is gray", () => {
    renderWithProviders(<Patterns max={1} image="test.png" bgColor="gray" />);
    const target = screen.getByTestId("patterns-pattern-bgcolor-div");
    expect(target).toHaveStyle(`background: gray`);
  });

  test("ColorPicker color is bgColor", () => {
    renderWithProviders(<Patterns max={1} bgColor="darkgray" />);
    const target = screen.getByTestId("colorpicker-color");
    expect(target).toHaveStyle({ backgroundColor: "darkgray" });
  });
});

test("has TrColorView component", () => {
  renderWithProviders(<Patterns />);

  const target = screen.getByTestId("tr-color-view");
  expect(target).toBeInTheDocument();
});
