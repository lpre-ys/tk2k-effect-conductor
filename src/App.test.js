import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { act } from "react-dom/test-utils";
import App from "./App";
import { renderWithProviders } from "./util/renderWithProviders";
import testdata from "./App.testdata.json";

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

jest.mock("./component/configs/Pattern/PatternImage.jsx", () => () => {
  return <div data-testid="mock-pattern-image"></div>;
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
describe("<Configs />", () => {
  test("has Configs component", () => {
    renderWithProviders(<App />);

    const target = screen.getByText("表示タイミング");
    expect(target).toBeInTheDocument();
  });
  test("change CelName", () => {
    renderWithProviders(<App />);

    const header = screen.getByRole("heading", { name: "セル1" });
    expect(header).toBeInTheDocument();

    userEvent.click(header);
    const target = screen.getByDisplayValue("セル1");
    userEvent.type(target, "a");
    userEvent.click(screen.getByText("素材データ"));

    expect(header).toHaveTextContent("セル1a");
  });
});

// * Timeline *
test("has Timeline component", () => {
  renderWithProviders(<App />);

  const target = screen.getByText("タイムライン");
  expect(target).toBeInTheDocument();
});

// * for Electron functions
describe("for Electron", () => {
  describe("init Language", () => {
    const lang = jest.fn();
    beforeEach(() => {
      window.initArgs = { lang };
    });
    afterEach(() => {
      delete window.initArgs;
    });
    test("ja, then show Japanese UI", () => {
      lang.mockReturnValue("ja");
      renderWithProviders(<App />);

      const target = screen.getByText("タイムライン");
      expect(target).toBeInTheDocument();
    });
    test("en, then show English UI", () => {
      lang.mockReturnValue("en");
      renderWithProviders(<App />);

      const target = screen.getByText("Timeline");
      expect(target).toBeInTheDocument();
    });
  });
  describe("Menu", () => {
    beforeEach(() => {
      window.appMenu = {
        onReceiveNew: jest.fn(),
        onReceiveSave: jest.fn(),
        onReceiveLoad: jest.fn(),
        onReceiveLanguage: jest.fn(),
        saveData: jest.fn(),
      };
    });
    afterEach(() => {
      delete window.appMenu;
    });
    test("call langage, then change lang", () => {
      window.initArgs = { lang: jest.fn().mockReturnValue("ja") };
      let changeLang;
      window.appMenu.onReceiveLanguage = (listener) => {
        changeLang = listener;
      };
      renderWithProviders(<App />);

      // デフォルトは日本語
      const ja = screen.getByText("タイムライン");
      expect(ja).toBeInTheDocument();

      act(() => {
        changeLang({ lang: "en" });
      });

      const target = screen.getByText("Timeline");
      expect(target).toBeInTheDocument();
      delete window.initArgs;
    });
    test("call Save, then save data", () => {
      let save;
      window.appMenu.onReceiveSave = (listener) => {
        save = listener;
      };
      renderWithProviders(<App />);

      // セル1の名前を適当に変更する
      const header = screen.getByRole("heading", { name: "セル1" });
      userEvent.click(header);
      const input = screen.getByDisplayValue("セル1");
      userEvent.type(input, "a");
      userEvent.click(screen.getByText("Material Data"));

      expect(header).toHaveTextContent("セル1a");

      save();

      const target = window.appMenu.saveData;

      expect(target).toBeCalled();
      const [arg] = target.mock.calls[target.mock.calls.length - 1];
      expect(arg).toMatchObject({ celList: { list: [{ name: "セル1a" }] } });
    });
    test("call Load, then load data", () => {
      let load;
      window.appMenu.onReceiveLoad = (listener) => {
        load = listener;
      }
      renderWithProviders(<App />);
      act(() => {
        load(JSON.stringify(testdata));
      });

      const header = screen.getByRole("heading", { name: "セル1b" });
      expect(header).toBeInTheDocument();
    });
    test('call New, then reset all data', () => {
      let newFunc;
      window.appMenu.onReceiveNew = (listener) => {
        newFunc = listener;
      }
      renderWithProviders(<App />);

      // セル1の名前を適当に変更する
      const header = screen.getByRole("heading", { name: "セル1" });
      userEvent.click(header);
      const input = screen.getByDisplayValue("セル1");
      userEvent.type(input, "a");
      userEvent.click(screen.getByText("Material Data"));

      expect(header).toHaveTextContent("セル1a");
      act(() => {
        newFunc();
      });

      expect(header).toHaveTextContent('セル1');
    })
  });
});

