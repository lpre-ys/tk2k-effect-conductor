import { screen } from "@testing-library/react";
import React from "react";
import App from "./App";
import { renderWithProviders } from "./util/renderWithProviders";

jest.mock("react-color", () => {
  return {
    __esModule: true,
    SketchPicker: () => {
      return <div data-testid="mock-sketch-picker"></div>;
    },
  };
});


jest.mock("./component/player/Cel.jsx", () => ({ id, setMsg }) => {
  return (
    <div data-testid="mock-cel">
      <p>id: {id}</p>
      <button
        type="button"
        title="mock-set-msg"
        onClick={() => {
          setMsg("TEST MESSAGE");
        }}
      />
    </div>
  );
});

// * Material *
test("has Material component", () => {
  renderWithProviders(<App />);

  const target = screen.getByText("素材データ");
  expect(target).toBeInTheDocument();
});

// * Export *
test("has Export component", () => {
  renderWithProviders(<App />);

  const target = screen.getByText("COPY!!");
  expect(target).toBeInTheDocument();
});

// * Player *
jest.mock("react-konva", () => {
  return {
    __esModule: true,
    Stage: ({ children }) => {
      return <div data-testid="mock-stage">{children}</div>;
    },
    Layer: ({ children }) => {
      return <div data-testid="mock-layer">{children}</div>;
    },
    Line: () => {
      return <div data-testid="mock-line"></div>;
    },
    Rect: ({ fillPatternImage, fill }) => {
      return (
        <div data-testid="mock-rect">
          {fillPatternImage}
          <p>{fill}</p>
        </div>
      );
    },
    Image: ({ image }) => {
      return <div data-testid="mock-image">{image}</div>;
    },
  };
});
describe("<Player />", () => {
  test("has Player component", () => {
    renderWithProviders(<App />);

    const target = screen.getByTestId("effectCanvas");
    expect(target).toBeInTheDocument();
  });
});

// * Configs
test("has Configs component", () => {
  renderWithProviders(<App />);

  const target = screen.getByText("表示タイミング");
  expect(target).toBeInTheDocument();
});

// * Timeline *
test("has Timeline component", () => {
  renderWithProviders(<App />);

  const target = screen.getByText("タイムライン");
  expect(target).toBeInTheDocument();
});
