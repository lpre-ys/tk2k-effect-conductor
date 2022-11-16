import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from "./App";
import { renderWithProviders } from "./util/renderWithProviders";

const INIT_MATERIAL = {
  originalImage: null,
  transparentImage: null,
  maxPage: 0,
  transparentColor: null,
  bgColor: "transparent",
};

const INIT_CEL_CONFIG = {
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
  frame: { start: 1, volume: 20 }, // 20: INIT_MAX_FRAME
  pattern: { start: 1, end: 1, isRoundTrip: false },
};

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
// const mockPause = jest.fn();
// const mockPlaypause = jest.fn();
// jest.mock("./component/Player", () => {
//   const { forwardRef } = jest.requireActual("react");
//   return {
//     __esModule: true,
//     default: forwardRef(({ material, celConfigList }, ref) => {
//       ref.current = { pause: mockPause, playpause: mockPlaypause };

//       return (
//         <div data-testid="player">
//           <p data-testid="player-material-json">{JSON.stringify(material)}</p>
//           <p data-testid="player-cel-config-list-json">
//             {JSON.stringify(celConfigList)}
//           </p>
//         </div>
//       );
//     }),
//   };
// });
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

  describe("handleKeyDown", () => {
    test("Left key down, then call ref.pause and frame -1", () => {
      renderWithProviders(<App />);
      // frameの初期値が0だと面倒なので、最初に適当な値（7）にでもしておく。
      fireEvent.change(screen.getByTestId("controller-frame"), {
        target: { value: "7" },
      });
      fireEvent.keyDown(document, {
        target: { tagName: "test" },
        key: "ArrowLeft",
      });

      expect(screen.getByTestId("controller-frame")).toHaveValue(6);
      expect(screen.getByTitle("play")).toBeInTheDocument();
    });
    test("Right key down, then call ref.pause and frame +1", () => {
      renderWithProviders(<App />);
      // frameの初期値が0だと面倒なので、最初に適当な値（7）にでもしておく。
      fireEvent.change(screen.getByTestId("controller-frame"), {
        target: { value: "7" },
      });
      fireEvent.keyDown(document, {
        target: { tagName: "test" },
        key: "ArrowRight",
      });
      expect(screen.getByTestId("controller-frame")).toHaveValue(8);
      expect(screen.getByTitle("play")).toBeInTheDocument();
    });

    test("Space key down, target tag is BUTTON, then noop", () => {
      renderWithProviders(<App />);
      fireEvent.keyDown(document, {
        target: { tagName: "BUTTON" },
        key: " ",
      });

      expect(screen.getByTitle("play")).toBeInTheDocument();
    });
    test("Space key down, target tag is not BUTTON, then call Playpause", () => {
      renderWithProviders(<App />);
      fireEvent.keyDown(document, {
        target: { tagName: "test" },
        key: " ",
      });

      expect(screen.getByTitle("pause")).toBeInTheDocument();
    });
  });
});

// * Configs
test("has Configs component", () => {
  renderWithProviders(<App />);

  const target = screen.getByText("セル: 1");
  expect(target).toBeInTheDocument();
});

// * Timeline *
test("has Timeline component", () => {
  renderWithProviders(<App />);

  const target = screen.getByText("タイムライン");
  expect(target).toBeInTheDocument();
});
