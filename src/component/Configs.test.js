import { fireEvent, render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import Configs from "./Configs";

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
  test('celId: 0, then header "セル: 1"', () => {
    render(
      <Configs celId={0} config={defaultConfig} material={defaultMaterial} />
    );

    const target = screen.getByText("セル: 1");
    expect(target).toBeInTheDocument();
  });
  test('celId: 5, then header "セル: 6"', () => {
    render(
      <Configs celId={5} config={defaultConfig} material={defaultMaterial} />
    );

    const target = screen.getByText("セル: 6");
    expect(target).toBeInTheDocument();
  });
});
describe("TimingConfig", () => {
  test("has component", () => {
    render(
      <Configs celId={0} config={defaultConfig} material={defaultMaterial} />
    );

    const target = screen.getByText("表示タイミング");
    expect(target).toBeInTheDocument();
  });
  test("config is props.config.frame", () => {
    const config = Object.assign({}, defaultConfig);
    config.frame.start = 4;
    config.frame.volume = 12;
    render(
      <Configs celId={0} config={defaultConfig} material={defaultMaterial} />
    );

    // Endは計算で出すため、見なくて良い
    expect(screen.getByTestId("timing-start")).toHaveValue(4);
    expect(screen.getByTestId("timing-volume")).toHaveValue(12);
  });
  test("update is props.update", () => {
    const mockFn = jest.fn();

    render(
      <Configs
        celId={0}
        config={defaultConfig}
        material={defaultMaterial}
        update={mockFn}
      />
    );

    // onChangeを発火させる
    fireEvent.change(screen.getByTestId("timing-start"), {
      target: { value: 2 },
    });

    // 引数とかは子コンポーネントのテストで見るので、こっちでは見ない
    expect(mockFn).toBeCalled();
  });
});

describe("PatternConfig", () => {
  test("has component", () => {
    render(
      <Configs celId={0} config={defaultConfig} material={defaultMaterial} />
    );

    const target = screen.getByText("パターン");
    expect(target).toBeInTheDocument();
  });
  test("config is props.config.pattern", () => {
    const config = Object.assign({}, defaultConfig);
    config.pattern.start = 5;
    config.pattern.end = 10;
    render(<Configs celId={0} config={config} material={defaultMaterial} />);

    expect(screen.getByTestId("pattern-config-start")).toHaveValue(5);
    expect(screen.getByTestId("pattern-config-end")).toHaveValue(10);
  });
  test("image is props.material.transparentImage", () => {
    const material = Object.assign({}, defaultMaterial);
    material.transparentImage = "testtrimage.png";

    render(<Configs celId={0} config={defaultConfig} material={material} />);

    const target = screen.getByAltText("mock-use-image-testtrimage.png");
    expect(target).toBeInTheDocument();
  });
  test("bgColor is props.material.bgColor", () => {
    const material = Object.assign({}, defaultMaterial);
    material.transparentImage = "test.png";
    material.bgColor = "testBgColor";

    render(<Configs celId={0} config={defaultConfig} material={material} />);

    const target = screen.getByText("testBgColor");
    expect(target).toBeInTheDocument();
  });

  test("update is props.update", () => {
    const mockFn = jest.fn();

    render(
      <Configs
        celId={0}
        config={defaultConfig}
        material={defaultMaterial}
        update={mockFn}
      />
    );

    // onChangeを発火させる
    fireEvent.change(screen.getByTestId("pattern-config-start"), {
      target: { value: 3 },
    });

    // 引数とかは子コンポーネントのテストで見るので、こっちでは見ない
    expect(mockFn).toBeCalled();
  });
});

describe("FromTo(X)", () => {
  test("has component", () => {
    render(
      <Configs celId={0} config={defaultConfig} material={defaultMaterial} />
    );

    const target = screen.getByText("X座標");
    expect(target).toBeInTheDocument();
  });
  test("config is props.config.x", () => {
    const config = Object.assign({}, defaultConfig);
    config.x.from = -41;
    config.x.to = 98;
    render(<Configs celId={0} config={config} material={defaultMaterial} />);

    const froms = screen.getAllByTestId("from-to-config-from");
    expect(froms[0]).toHaveValue(-41);
    const tos = screen.getAllByTestId("from-to-config-to");
    expect(tos[0]).toHaveValue(98);
  });
  test("update is props.update", () => {
    const mockFn = jest.fn();

    render(
      <Configs
        celId={0}
        config={defaultConfig}
        material={defaultMaterial}
        update={mockFn}
      />
    );

    // onChangeを発火させる
    fireEvent.change(screen.getAllByTestId("from-to-config-from")[0], {
      target: { value: 12 },
    });

    // 引数とかは子コンポーネントのテストで見るので、こっちでは見ない
    expect(mockFn).toBeCalled();
  });
});

describe('Other FromTo Components', () => {
  test("has Y component", () => {
    render(
      <Configs celId={0} config={defaultConfig} material={defaultMaterial} />
    );

    const target = screen.getByText("Y座標");
    expect(target).toBeInTheDocument();
  });
  test("has scale component", () => {
    render(
      <Configs celId={0} config={defaultConfig} material={defaultMaterial} />
    );

    const target = screen.getByText("拡大率");
    expect(target).toBeInTheDocument();
  }); test("has opacity component", () => {
    render(
      <Configs celId={0} config={defaultConfig} material={defaultMaterial} />
    );

    const target = screen.getByText("透明度");
    expect(target).toBeInTheDocument();
  });
})