import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../util/renderWithProviders";
import { Player } from "./Player";

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

jest.mock("react-color", () => {
  return {
    __esModule: true,
    SketchPicker: () => {
      return <div data-testid="mock-sketch-picker"></div>;
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

describe("ViewSettings", () => {
  describe("bgColor", () => {
    test("has ColorPicker component", () => {
      renderWithProviders(<Player celList={[]} />);
      const target = screen.getByTestId("colorpicker-component");

      expect(target).toBeInTheDocument();
    });
    test("ColorPicker.label is 背景色", () => {
      renderWithProviders(<Player celList={[]} />);
      const target = screen.getByText(/背景色/);

      expect(target).toBeInTheDocument();
    });
    test("ColorPicker.color is bgColor", () => {
      renderWithProviders(<Player celList={[]} bgColor="green" />);
      const target = screen.getByTestId("colorpicker-color")
      expect(target).toHaveStyle({ backgroundColor: "green" })
    });
    test("ColorPicker.setColor is setBgColor", () => {
      const mockFn = jest.fn();
      renderWithProviders(
        <Player celList={[]} bgColor="transparent" setBgColor={mockFn} />
      );

      userEvent.click(screen.getByTestId("colorpicker-color"));

      expect(mockFn).toBeCalledWith("#FFFFFF");
    });
  });
  test("INIT isShowCelBorder is false", () => {
    renderWithProviders(<Player celList={[]} />);

    const target = screen.getByLabelText("枠表示:");
    expect(target).not.toBeChecked();
  });
  test("click once checkbox, then isShowCelBorder is true", () => {
    renderWithProviders(<Player celList={[]} />);

    const target = screen.getByLabelText("枠表示:");
    userEvent.click(target);
    expect(target).toBeChecked();
  });
  test("click twice checkbox, then isShowCelBorder is false", () => {
    renderWithProviders(<Player celList={[]} />);

    const target = screen.getByLabelText("枠表示:");
    userEvent.click(target);
    userEvent.click(target);
    expect(target).not.toBeChecked();
  });
});

describe("background", () => {
  test("has component", () => {
    renderWithProviders(<Player celList={[]} />);

    const target = screen.getByAltText("mock-use-image-tr.png");
    expect(target).toBeInTheDocument();
  });
});

jest.mock("./player/Cel", () => ({ id, setMsg }) => {
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
describe("Cel", () => {
  test("celList is empty, then no Cel component", () => {
    renderWithProviders(<Player celList={[]} />);

    const target = screen.queryAllByTestId("mock-cel");
    expect(target).toHaveLength(0);
  });
  test("celList length is 1, then 1 Cel component", () => {
    renderWithProviders(
      <Player celList={[defaultCelConfig]} material={defaultMaterial} />
    );

    const target = screen.queryAllByTestId("mock-cel");
    expect(target).toHaveLength(1);
  });
  test("celList length is 3, then 3 Cel component", () => {
    renderWithProviders(
      <Player
        celList={[defaultCelConfig, defaultCelConfig, defaultCelConfig]}
        material={defaultMaterial}
      />
    );

    const target = screen.queryAllByTestId("mock-cel");
    expect(target).toHaveLength(3);
  });
});

describe("Controller", () => {
  test("has component", () => {
    renderWithProviders(<Player celList={[]} />);

    const target = screen.queryByTestId("controller");
    expect(target).toBeInTheDocument();
  });
  test("INIT then show Play button", () => {
    renderWithProviders(<Player celList={[]} />);

    const target = screen.getByTitle("play");
    expect(target).toBeInTheDocument();
  });
  test("start, then show Pause button", () => {
    renderWithProviders(<Player celList={[]} />);

    const play = screen.getByTitle("play");
    userEvent.click(play);

    const target = screen.getByTitle("pause");
    expect(target).toBeInTheDocument();
  });
  test("pause, then show Play button", () => {
    renderWithProviders(<Player celList={[]} />);

    const play = screen.getByTitle("play");
    userEvent.click(play);

    const pause = screen.getByTitle("pause");
    userEvent.click(pause);

    expect(screen.getByTitle("play")).toBeInTheDocument();
  });
  test("repeat, then set Repeat ON", () => {
    renderWithProviders(<Player celList={[]} />);

    const repeat = screen.getByTitle("repeat");
    userEvent.click(repeat);

    expect(screen.getByTitle("repeat")).toHaveStyle({ color: "#fafafa" });
  });

  test("change frame, then call setGlobalFrame", () => {
    renderWithProviders(<Player celList={[]} />);

    const target = screen.getByTestId("controller-frame");
    fireEvent.change(target, { target: { value: "5" } });

    expect(target).toHaveValue(5);
  });
  test("next, then call setGlobalFrame +1", () => {
    renderWithProviders(<Player celList={[]} />);
    // 一旦5にする
    const frame = screen.getByTestId("controller-frame");
    fireEvent.change(frame, { target: { value: "5" } });

    const target = screen.getByTitle("next");
    userEvent.click(target);

    expect(frame).toHaveValue(6);
  });
  test("prev, then call setGlobalFrame -1", () => {
    renderWithProviders(<Player celList={[]} />);

    // 一旦5にする
    const frame = screen.getByTestId("controller-frame");
    fireEvent.change(frame, { target: { value: "5" } });

    const target = screen.getByTitle("prev");
    userEvent.click(target);

    expect(frame).toHaveValue(4);
  });
});

describe("Info", () => {
  test("INIT, then no component", () => {
    renderWithProviders(<Player celList={[]} />);

    const target = screen.queryByText("INFO");
    expect(target).not.toBeInTheDocument();
  });
  test("click Cel, then show message", () => {
    renderWithProviders(
      <Player celList={[defaultCelConfig]} material={defaultMaterial} />
    );

    const target = screen.getByTitle("mock-set-msg");
    userEvent.click(target);

    expect(screen.getByText("INFO")).toBeInTheDocument();
  });
});

const defaultMaterial = {
  originalImage: null,
  transparentImage: null,
  maxPage: 0,
  transparentColor: null,
  bgColor: "transparent",
};
const defaultCelConfig = {
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
  frame: { start: 0, volume: 10 },
  pattern: { start: 1, end: 1 },
};
