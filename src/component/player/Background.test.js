import { render, screen } from "@testing-library/react";
import { Background } from "./Background";

jest.mock("react-konva", () => {
  return {
    __esModule: true,
    Rect: ({ fill, fillPatternImage, width, height }) => {
      return (
        <div>
          {fill && <p>fill: {fill}</p>}
          {fillPatternImage && <p>pattern: {fillPatternImage}</p>}
          {width && <p>width: {width}</p>}
          {height && <p>height: {height}</p>}
        </div>
      );
    },
    Image: ({ x, y, width, height, image }) => {
      return <div>{image}</div>;
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

test("has props.image, then show image", () => {
  render(<Background image="testimage.png" />);

  const target = screen.queryByAltText("mock-use-image-testimage.png");
  expect(target).toBeInTheDocument();
});
test("empty props.image, then not show image", () => {
  render(<Background image="" />);

  const target = screen.queryByAltText("mock-use-image-testimage.png");
  expect(target).not.toBeInTheDocument();
});

describe("zoom", () => {
  test("zoom is 1, then width is 640", () => {
    render(<Background zoom={1} />);

    const targets = screen.getAllByText("width: 640");
    expect(targets[0]).toBeInTheDocument();
  });
  test("zoom is 1, then height is 480", () => {
    render(<Background zoom={1} />);

    const targets = screen.getAllByText("height: 480");
    expect(targets[0]).toBeInTheDocument();
  });
  test("zoom is 2, then width is 320", () => {
    render(<Background zoom={2} />);

    const targets = screen.getAllByText("width: 320");
    expect(targets[0]).toBeInTheDocument();
  });
  test("zoom is 2, then height is 240", () => {
    render(<Background zoom={2} />);

    const targets = screen.getAllByText("height: 240");
    expect(targets[0]).toBeInTheDocument();
  });
});
