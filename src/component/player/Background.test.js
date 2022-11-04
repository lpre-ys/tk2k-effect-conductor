import { render, screen } from "@testing-library/react";
import Background from "./Background";

jest.mock("react-konva", () => {
  return {
    __esModule: true,
    Rect: ({ fill, fillPatternImage }) => {
      return (
        <div>
          {fill && <p>fill: {fill}</p>}
          {fillPatternImage && <p>pattern: {fillPatternImage}</p>}
        </div>
      );
    },
    Image: ({ x, y, width, height, image }) => {
      return (
        <div>
          {image}
        </div>
      );
    },
  };
});

jest.mock("use-image", () => {
  return {
    __esModule: true.valueOf,
    default: (src) => {
      const { createElement } = jest.requireActual("react");
      const elem = createElement("img", {
        src: src,
        alt: `mock-use-image-${src}`,
      });
      return [elem];
    },
  };
});

test("1st rect's fillPatternImage is trImage", () => {
  render(<Background src="dummy.png" />);

  const target = screen.getByAltText("mock-use-image-tr.png");
  expect(target).toBeInTheDocument();
});

test("2nd rect's fill is props.color", () => {
  render(<Background src="dummy.png" color="testcolor" />);

  const target = screen.getByText("fill: testcolor");
  expect(target).toBeInTheDocument();
});

test("has props.mage, then show image", () => {
  render(<Background image="testimage.png" />);

  const target = screen.queryByAltText("mock-use-image-testimage.png");
  expect(target).toBeInTheDocument();
});
test("empty props.mage, then not show image", () => {
  render(<Background image="" />);

  const target = screen.queryByAltText("mock-use-image-testimage.png");
  expect(target).not.toBeInTheDocument();
});
