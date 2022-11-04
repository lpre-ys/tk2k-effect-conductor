import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Material from "./Material";

const initMaterial = {
  originalImage: null,
  transparentImage: null,
  maxPage: 0,
  transparentColor: null,
  bgColor: "transparent",
};

const loadedMaterial = {
  originalImage: "original.png",
  transparentImage: "transparent.png",
  maxPage: 0,
  transparentColor: { r: 11, g: 22, b: 33 },
  bgColor: "transparent",
};
describe("msg", () => {
  test("empty, then no msg", () => {
    render(<Material material={initMaterial} msg="" />);

    const target = screen.queryByTestId("material-msg");
    expect(target).toBeNull();
  });
  test("has msg, then show msg", () => {
    render(<Material material={initMaterial} msg="test msg" />);

    const target = screen.getByTestId("material-msg");
    expect(target).toBeInTheDocument();
    expect(target).toHaveTextContent("test msg");
  });
});

// * Loader
jest.mock("./material/Loader", () => ({ loadImage }) => {
  return (
    <div data-testid="material-loader">
      <button
        type="button"
        data-testid="material-loader-load"
        onClick={() => {
          loadImage();
        }}
      />
    </div>
  );
});
describe("Loader", () => {
  test("has Loader component", () => {
    render(<Material material={initMaterial} />);

    const target = screen.getByTestId("material-loader");
    expect(target).toBeInTheDocument();
  });
  test("Loader.loadImage is Material.loadImage", () => {
    const mockFn = jest.fn();
    render(<Material material={initMaterial} loadImage={mockFn} />);

    userEvent.click(screen.getByTestId("material-loader-load"));

    expect(mockFn).toBeCalled();
  });
});

// * MaterialImage
jest.mock("./material/MaterialImage", () => ({ src, isShow }) => {
  return (
    <div data-testid="mock-material-image">
      <p data-testid="material-image-src">{src}</p>
      <p data-testid="material-image-isShow">{isShow ? "true" : "false"}</p>
    </div>
  );
});
describe("MaterialImage", () => {
  test("material.orgImg is empty, then not has MaterialImage component", () => {
    render(
      <Material
        material={{
          originalImage: null,
          transparentImage: null,
          maxPage: 0,
          transparentColor: null,
          bgColor: "transparent",
        }}
      />
    );

    const target = screen.queryByTestId("mock-material-image");
    expect(target).toBeNull();
  });
  test("material.orgImg is loaded, then has MaterialImage component", () => {
    render(
      <Material
        material={{
          originalImage: "test.png",
          transparentImage: null,
          maxPage: 0,
          transparentColor: null,
          bgColor: "transparent",
        }}
      />
    );

    const target = screen.getByTestId("mock-material-image");
    expect(target).toBeInTheDocument();
  });
  test("src is props.material.originalImage", () => {
    render(
      <Material
        material={{
          originalImage: "test-src.png",
          transparentImage: null,
          maxPage: 0,
          transparentColor: null,
          bgColor: "transparent",
        }}
      />
    );

    const target = screen.getByTestId("material-image-src");
    expect(target).toHaveTextContent("test-src.png");
  });
  test("isShow is state.isShowImage", () => {
    render(
      <Material
        material={{
          originalImage: "test-src.png",
          transparentImage: null,
          maxPage: 0,
          transparentColor: null,
          bgColor: "transparent",
        }}
      />
    );

    const target = screen.getByTestId("material-image-isShow");
    expect(target).toHaveTextContent("false");

    // trueになった時、追従すること
    userEvent.click(screen.getByTestId("material-toggle-is-show-image"));
    expect(target).toHaveTextContent("true");
  });
});

describe("PreviewButton", () => {
  test("has toggle Button", () => {
    render(<Material material={loadedMaterial} />);

    const target = screen.getByTestId("material-toggle-is-show-image");
    expect(target).toBeInTheDocument();
  });
  test("click once, then isShowImage is true", () => {
    render(<Material material={loadedMaterial} />);

    const target = screen.getByTestId("material-toggle-is-show-image");
    userEvent.click(target);

    expect(target).toHaveStyle({
      backgroundColor: "#9e9e9e",
      color: "#fafafa",
    });
  });
  test("click twice, then isShowImage is false", () => {
    render(<Material material={loadedMaterial} />);

    const target = screen.getByTestId("material-toggle-is-show-image");
    userEvent.click(target);
    userEvent.click(target);

    expect(target).not.toHaveStyle({
      backgroundColor: "#9e9e9e",
      color: "#fafafa",
    });
  });
});

jest.mock(
  "./material/Patterns",
  () =>
    ({ image, max, trColor, bgColor, changeMaterial, changeTrColor }) => {
      return (
        <div data-testid="mock-patterns">
          <p data-testid="patterns-image">{image}</p>
          <p data-testid="patterns-max">{max}</p>
          <p data-testid="patterns-trColor">{JSON.stringify(trColor)}</p>
          <p data-testid="patterns-bgColor">{bgColor}</p>
          <button
            data-testid="patterns-change-material"
            onClick={changeMaterial}
          />
          <button
            data-testid="patterns-change-tr-color"
            onClick={changeTrColor}
          />
        </div>
      );
    }
);

describe("Patterns", () => {
  test("trImg is loaded, then has Patterns component", () => {
    render(
      <Material
        material={{
          originalImage: null,
          transparentImage: "test-trimg.png",
          maxPage: 0,
          transparentColor: null,
          bgColor: "transparent",
        }}
      />
    );

    const target = screen.getByTestId("mock-patterns");
    expect(target).toBeInTheDocument();
  });
  test("trImg is not loaded, then not has Patterns component", () => {
    render(
      <Material
        material={{
          originalImage: null,
          transparentImage: null,
          maxPage: 0,
          transparentColor: null,
          bgColor: "transparent",
        }}
      />
    );

    const target = screen.queryByTestId("mock-patterns");
    expect(target).toBeNull();
  });
  test("image is props.material.transparentImage", () => {
    render(
      <Material
        material={{
          originalImage: null,
          transparentImage: "test-trimg333.png",
          maxPage: 0,
          transparentColor: null,
          bgColor: "transparent",
        }}
      />
    );

    const target = screen.getByTestId("patterns-image");
    expect(target).toHaveTextContent("test-trimg333.png");
  });
  test("max is props.material.maxPage", () => {
    render(
      <Material
        material={{
          originalImage: null,
          transparentImage: "test-trimg.png",
          maxPage: 11,
          transparentColor: null,
          bgColor: "transparent",
        }}
      />
    );

    const target = screen.getByTestId("patterns-max");
    expect(target).toHaveTextContent(11);
  });
  test("trColor is props.material.transparentColor", () => {
    render(
      <Material
        material={{
          originalImage: null,
          transparentImage: "test-trimg.png",
          maxPage: 0,
          transparentColor: { r: 12, g: 34, b: 56 },
          bgColor: "transparent",
        }}
      />
    );

    const target = screen.getByTestId("patterns-trColor");
    expect(JSON.parse(target.textContent)).toEqual({ r: 12, g: 34, b: 56 });
  });
  test("bgColor is props.material.bgColor", () => {
    render(
      <Material
        material={{
          originalImage: null,
          transparentImage: "test-trimg.png",
          maxPage: 11,
          transparentColor: null,
          bgColor: "testBgColor",
        }}
      />
    );

    const target = screen.getByTestId("patterns-bgColor");
    expect(target).toHaveTextContent("testBgColor");
  });
  test("changeMaterial is props.changeMaterial", () => {
    const mockFn = jest.fn();
    render(<Material material={loadedMaterial} changeMaterial={mockFn} />);

    userEvent.click(screen.getByTestId("patterns-change-material"));

    expect(mockFn).toBeCalled();
  });
  test("changeTrColor is props.changeTrColor", () => {
    const mockFn = jest.fn();
    render(<Material material={loadedMaterial} changeTrColor={mockFn} />);

    userEvent.click(screen.getByTestId("patterns-change-tr-color"));

    expect(mockFn).toBeCalled();
  });
});
