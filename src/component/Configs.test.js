import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithProviders } from "../util/renderWithProviders";
// import userEvent from "@testing-library/user-event";
import { Configs } from "./Configs";

const defaultConfig = {
  x: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  y: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  scale: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  opacity: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  frame: { start: 1, volume: 1 },
  pattern: { start: 1, end: 1 },
};
const defaultMaterial = {
  originalImage: null,
  transparentImage: null,
  maxPage: 0,
  transparentColor: null,
  bgColor: "transparent",
};

jest.mock("react-konva", () => {
  const { forwardRef } = jest.requireActual("react");
  return {
    __esModule: true,
    Stage: ({ children, onClick }) => {
      return (
        <div data-testid="mock-stage" onClick={onClick}>
          {children}
        </div>
      );
    },
    Layer: ({ children }) => {
      return <div>{children}</div>;
    },
    Rect: ({ fill }) => {
      return <div>{fill}</div>;
    },
    Sprite: forwardRef(({ image }, ref) => {
      return <div>{image}</div>;
    }),
  };
});

jest.mock("use-image", () => {
  return {
    __esModule: true.valueOf,
    default: (src) => {
      const { createElement } = jest.requireActual("react");
      return [createElement("img", { src: src, alt: `mock-use-image-${src}` })];
    },
  };
});
describe("Header", () => {
  test('celIndex: 0, then header "セル: 1"', () => {
    renderWithProviders(
      <Configs celIndex={0} />
    );

    const target = screen.getByText("セル: 1");
    expect(target).toBeInTheDocument();
  });
  test('celIndex: 5, then header "セル: 6"', () => {
    renderWithProviders(
      <Configs celIndex={5} />
    );

    const target = screen.getByText("セル: 6");
    expect(target).toBeInTheDocument();
  });
});
describe("TimingConfig", () => {
  test("has component", () => {
    renderWithProviders(
      <Configs celIndex={0} />
    );

    const target = screen.getByText("表示タイミング");
    expect(target).toBeInTheDocument();
  });
});

describe("PatternConfig", () => {
  test("has component", () => {
    renderWithProviders(
      <Configs celIndex={0} />
    );

    const target = screen.getByText("パターン");
    expect(target).toBeInTheDocument();
  });
});

describe('FromTo Components', () => {
  test("has X component", () => {
    renderWithProviders(
      <Configs celIndex={0} />
    );

    const target = screen.getByText("X座標");
    expect(target).toBeInTheDocument();
  });

  test("has Y component", () => {
    renderWithProviders(
      <Configs celIndex={0} />
    );

    const target = screen.getByText("Y座標");
    expect(target).toBeInTheDocument();
  });
  test("has scale component", () => {
    renderWithProviders(
      <Configs celIndex={0} />
    );

    const target = screen.getByText("拡大率");
    expect(target).toBeInTheDocument();
  }); test("has opacity component", () => {
    renderWithProviders(
      <Configs celIndex={0} />
    );

    const target = screen.getByText("透明度");
    expect(target).toBeInTheDocument();
  });
})