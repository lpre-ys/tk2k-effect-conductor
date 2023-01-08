import { screen } from "@testing-library/react";
import { renderWithProviders } from "../util/renderWithProviders";
import userEvent from "@testing-library/user-event";
import { Configs } from "./Configs";

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
  test("header text is name", () => {
    renderWithProviders(<Configs name="テストセル" />);

    const target = screen.getByText("テストセル");
    expect(target).toContainHTML("</h1>");
  });
  test("header click, then show input and focus", () => {
    renderWithProviders(<Configs name="テストセル" />);
    const header = screen.getByText("テストセル");

    userEvent.click(header);

    const target = screen.getByDisplayValue("テストセル");
    expect(target).toContainHTML("</input>");
    expect(target).toHaveFocus();
  });
  test("input on change, then call setCelName", () => {
    const mock = jest.fn();
    renderWithProviders(<Configs name="テストセル" setCelName={mock} />);
    const header = screen.getByText("テストセル");

    userEvent.click(header);
    const target = screen.getByDisplayValue("テストセル");
    userEvent.type(target, "a");

    expect(mock).lastCalledWith("テストセルa");
  });
  test("blur input, then hide input and show header", () => {
    renderWithProviders(<Configs name="テストセル" />);
    const header = screen.getByText("テストセル");

    userEvent.click(header);
    expect(screen.getByDisplayValue("テストセル")).toContainHTML("</input>");

    // 適当な場所をクリックして、フォーカスをはずす
    userEvent.click(screen.getByText("表示タイミング"));
    expect(screen.getByText("テストセル")).toContainHTML("</h1>");
  });
});
describe("TimingConfig", () => {
  test("has component", () => {
    renderWithProviders(<Configs />);

    const target = screen.getByText("表示タイミング");
    expect(target).toBeInTheDocument();
  });
});

describe("PatternConfig", () => {
  test("has component", () => {
    renderWithProviders(<Configs />);

    const target = screen.getByText("パターン");
    expect(target).toBeInTheDocument();
  });
});

describe("FromTo Components", () => {
  test("has X component", () => {
    renderWithProviders(<Configs />);

    const target = screen.getByText("X座標");
    expect(target).toBeInTheDocument();
  });

  test("has Y component", () => {
    renderWithProviders(<Configs />);

    const target = screen.getByText("Y座標");
    expect(target).toBeInTheDocument();
  });
  test("has scale component", () => {
    renderWithProviders(<Configs />);

    const target = screen.getByText("拡大率");
    expect(target).toBeInTheDocument();
  });
  test("has opacity component", () => {
    renderWithProviders(<Configs />);

    const target = screen.getByText("透明度");
    expect(target).toBeInTheDocument();
  });
});
