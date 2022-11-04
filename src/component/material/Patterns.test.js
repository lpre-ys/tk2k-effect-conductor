import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Patterns from "./Patterns";

const defaultTrColor = { r: 0, g: 0, b: 0 };

test("image is div.backgroundImage", () => {
  render(<Patterns trColor={defaultTrColor} max={1} image="testbg.png" />);

  const target = screen.getByTestId("patterns-pattern-sprite");
  expect(target).toHaveStyle({ backgroundImage: "url(testbg.png)" });
});

describe("Length", () => {
  test("max = 0, then 0 li element", () => {
    render(<Patterns trColor={defaultTrColor} max={0} />);
    const target = screen.queryAllByRole("listitem");
    expect(target).toHaveLength(0);
  });
  test("max = 1, then 1 li element", () => {
    render(<Patterns trColor={defaultTrColor} max={1} />);
    const target = screen.queryAllByRole("listitem");
    expect(target).toHaveLength(1);
  });
  test("max = 25, then 25 li element", () => {
    render(<Patterns trColor={defaultTrColor} max={25} />);
    const target = screen.queryAllByRole("listitem");
    expect(target).toHaveLength(25);
  });
});
describe("bgColor, changeBgColor", () => {
  test("change BGColor then call changeBgColor", () => {
    const mockHandler = jest.fn();
    render(
      <Patterns
        trColor={defaultTrColor}
        max={1}
        image="test.png"
        handle={mockHandler}
      />
    );
    const inputElement = screen.getByTestId("patterns-input-bgcolor");

    userEvent.type(inputElement, "red");

    expect(mockHandler).toBeCalledWith("bgColor", "red");
  });

  test("bgColor is transparent, then bg style is url(tr.png)", () => {
    render(
      <Patterns
        trColor={defaultTrColor}
        max={1}
        image="test.png"
        bgColor="transparent"
      />
    );
    const target = screen.getByTestId("patterns-pattern-bgcolor-div");
    expect(target).toHaveStyle(`background: transparent`);
  });

  test("bgColor is gray, then bg style is gray", () => {
    render(
      <Patterns
        trColor={defaultTrColor}
        max={1}
        image="test.png"
        bgColor="gray"
      />
    );
    const target = screen.getByTestId("patterns-pattern-bgcolor-div");
    expect(target).toHaveStyle(`background: gray`);
  });

  test("bgColor input value is bgColor", () => {
    render(<Patterns trColor={defaultTrColor} max={1} bgColor="test" />);
    const target = screen.getByTestId("patterns-input-bgcolor");
    expect(target).toHaveValue("test");
  });
});

jest.mock("./TrColorView", () => ({ trColor, changeTrColor }) => {
  return (
    <div data-testid="tr-color-view">
      <p data-testid="tr-color-view-tr-color">{JSON.stringify(trColor)}</p>
      <input
        data-testid="tr-color-change"
        onChange={({ target }) => {
          changeTrColor(target.value);
        }}
      />
    </div>
  );
});
describe("trColor, changeTrColor", () => {
  test("has TrColorView component", () => {
    render(<Patterns />);

    const target = screen.getByTestId("tr-color-view");
    expect(target).toBeInTheDocument();
  });
  test("TrColorView.trColor is Patterns.trColor", () => {
    render(<Patterns trColor={{ r: 10, g: 22, b: 94 }} />);

    const target = screen.getByTestId("tr-color-view-tr-color");
    expect(JSON.parse(target.textContent)).toEqual({ r: 10, g: 22, b: 94 });
  });
  test("TrColorView.changeTrColor, then call Patterns.changeTrColor", () => {
    const mockFn = jest.fn();
    render(<Patterns changeTrColor={mockFn} />);

    userEvent.type(screen.getByTestId('tr-color-change'), 'testChanged');

    expect(mockFn).toBeCalledWith("testChanged");
  });
});
