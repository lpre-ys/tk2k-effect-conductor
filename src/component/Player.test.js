import {
  fireEvent,
  render,
  screen
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Player from "./Player";

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
  };
});

describe("ViewSettings", () => {
  test("INIT bgColor is transparent", () => {
    render(<Player maxFrame={12} globalFrame={34} celConfigList={[]} />);

    const target = screen.getByLabelText("背景色:");
    expect(target).toHaveValue("transparent");
  });
  test("change bgColor, then update bgColor", () => {
    render(<Player maxFrame={12} globalFrame={34} celConfigList={[]} />);

    const target = screen.getByLabelText("背景色:");

    fireEvent.change(target, { target: { value: "red" } });
    expect(target).toHaveValue("red");
  });
  test("INIT isShowCelBorder is false", () => {
    render(<Player maxFrame={12} globalFrame={34} celConfigList={[]} />);

    const target = screen.getByLabelText("枠表示:");
    expect(target).not.toBeChecked();
  });
  test("click once checkbox, then isShowCelBorder is true", () => {
    render(<Player maxFrame={12} globalFrame={34} celConfigList={[]} />);

    const target = screen.getByLabelText("枠表示:");
    userEvent.click(target);
    expect(target).toBeChecked();
  });
  test("click twice checkbox, then isShowCelBorder is false", () => {
    render(<Player maxFrame={12} globalFrame={34} celConfigList={[]} />);

    const target = screen.getByLabelText("枠表示:");
    userEvent.click(target);
    userEvent.click(target);
    expect(target).not.toBeChecked();
  });
});

jest.mock("./player/Background", () => ({ color, image }) => {
  return (
    <div data-testid="mock-background">
      <p>color: {color}</p>
      <p>image: {JSON.stringify(image)}</p>
    </div>
  );
});

describe("background", () => {
  test("has component", () => {
    render(<Player maxFrame={12} globalFrame={34} celConfigList={[]} />);

    const target = screen.getByTestId("mock-background");
    expect(target).toBeInTheDocument();
  });
  test("init color is transparent", () => {
    render(<Player maxFrame={12} globalFrame={34} celConfigList={[]} />);

    const target = screen.getByText("color: transparent");
    expect(target).toBeInTheDocument();
  });
  test("init image is null", () => {
    render(<Player maxFrame={12} globalFrame={34} celConfigList={[]} />);

    const target = screen.getByText("image: null");
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
  test("celConfigList is empty, then no Cel component", () => {
    render(<Player maxFrame={10} globalFrame={0} celConfigList={[]} />);

    const target = screen.queryAllByTestId("mock-cel");
    expect(target).toHaveLength(0);
  });
  test("celConfigList length is 1, then 1 Cel component", () => {
    render(
      <Player
        maxFrame={10}
        globalFrame={0}
        celConfigList={[defaultCelConfig]}
        material={defaultMaterial}
      />
    );

    const target = screen.queryAllByTestId("mock-cel");
    expect(target).toHaveLength(1);
  });
  test("celConfigList length is 3, then 3 Cel component", () => {
    render(
      <Player
        maxFrame={10}
        globalFrame={0}
        celConfigList={[defaultCelConfig, defaultCelConfig, defaultCelConfig]}
        material={defaultMaterial}
      />
    );

    const target = screen.queryAllByTestId("mock-cel");
    expect(target).toHaveLength(3);
  });
});

describe("Controller", () => {
  test("has component", () => {
    render(<Player maxFrame={10} globalFrame={0} celConfigList={[]} />);

    const target = screen.queryByTestId("controller");
    expect(target).toBeInTheDocument();
  });
  test("INIT then show Play button", () => {
    render(<Player maxFrame={10} globalFrame={0} celConfigList={[]} />);

    const target = screen.getByTitle("play");
    expect(target).toBeInTheDocument();
  });
  test("start, then show Pause button", () => {
    render(<Player maxFrame={10} globalFrame={0} celConfigList={[]} />);

    const play = screen.getByTitle("play");
    userEvent.click(play);

    const target = screen.getByTitle("pause");
    expect(target).toBeInTheDocument();
  });
  test("pause, then show Play button", () => {
    render(<Player maxFrame={10} globalFrame={0} celConfigList={[]} />);

    const play = screen.getByTitle("play");
    userEvent.click(play);

    const pause = screen.getByTitle("pause");
    userEvent.click(pause);

    expect(screen.getByTitle("play")).toBeInTheDocument();
  });
  test("repeat, then set Repeat ON", () => {
    render(<Player maxFrame={10} globalFrame={0} celConfigList={[]} />);

    const repeat = screen.getByTitle("repeat");
    userEvent.click(repeat);

    expect(screen.getByTitle("repeat")).toHaveStyle({ color: "#fafafa" });
  });

  test("change frame, then call setGlobalFrame", () => {
    const mockFn = jest.fn();
    render(
      <Player
        maxFrame={10}
        globalFrame={0}
        celConfigList={[]}
        setGlobalFrame={mockFn}
      />
    );

    const target = screen.getByTestId("controller-frame");
    fireEvent.change(target, { target: { value: "5" } });

    expect(mockFn).toBeCalledWith(4);
  });
  test("next, then call setGlobalFrame +1", () => {
    const mockFn = jest.fn();
    render(
      <Player
        maxFrame={10}
        globalFrame={5}
        celConfigList={[]}
        setGlobalFrame={mockFn}
      />
    );

    const target = screen.getByTitle("next");
    userEvent.click(target);

    expect(mockFn).toBeCalledWith(6);
  });
  test("prev, then call setGlobalFrame -1", () => {
    const mockFn = jest.fn();
    render(
      <Player
        maxFrame={10}
        globalFrame={5}
        celConfigList={[]}
        setGlobalFrame={mockFn}
      />
    );

    const target = screen.getByTitle("prev");
    userEvent.click(target);

    expect(mockFn).toBeCalledWith(4);
  });
});

describe("Info", () => {
  test("INIT, then no component", () => {
    render(<Player maxFrame={10} globalFrame={0} celConfigList={[]} />);

    const target = screen.queryByText("INFO");
    expect(target).not.toBeInTheDocument();
  });
  test("click Cel, then show message", () => {
    render(
      <Player
        maxFrame={10}
        globalFrame={0}
        celConfigList={[defaultCelConfig]}
        material={defaultMaterial}
      />
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
