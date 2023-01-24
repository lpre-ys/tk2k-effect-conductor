import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../util/renderWithProviders";
import { Material } from "./Material";

jest.mock("react-color", () => {
  return {
    __esModule: true,
    SketchPicker: () => {
      return <div data-testid="mock-sketch-picker"></div>;
    },
  };
});

describe("INIT state", () => {
  test("then no msg", () => {
    renderWithProviders(<Material />);

    const target = screen.queryByTestId("material-msg");
    expect(target).toBeNull();
  });
  test("then no MaterialImage", () => {
    renderWithProviders(<Material />);

    const target = screen.queryByTestId("material-image");
    expect(target).toBeNull();
  });
});

// * Loader
describe("Loader", () => {
  test("has Loader component", () => {
    renderWithProviders(<Material />);

    const target = screen.getByTestId("material-loader");
    expect(target).toBeInTheDocument();
  });
});

// * MaterialImage
describe("MaterialImage", () => {
  test("material.orgImg is empty, then not has Preview Button", () => {
    renderWithProviders(<Material originalImage={null} />);

    const target = screen.queryByText("プレビュー");
    expect(target).toBeNull();
  });
  test("material.orgImg is loaded, then has  Preview Button", () => {
    renderWithProviders(<Material originalImage="test.png" />);

    const target = screen.queryByText("プレビュー");
    expect(target).toBeInTheDocument();
  });
  test("click Preview Button, then show MaterialImage", () => {
    renderWithProviders(<Material originalImage="test.png" />);

    const target = screen.queryByText("プレビュー");
    userEvent.click(target);

    expect(screen.getByTestId("material-image")).toBeInTheDocument();
  });
  test("click twice Preview Button, then hide MaterialImage", () => {
    renderWithProviders(<Material originalImage="test.png" />);

    const target = screen.queryByText("プレビュー");
    userEvent.click(target);
    userEvent.click(target);

    expect(screen.queryByTestId("material-image")).toBeNull();
  });
});

describe("Patterns", () => {
  test("trImg is loaded, then has Patterns component", () => {
    renderWithProviders(<Material trImage="test" />);

    const target = screen.getByTestId("patterns-ul");
    expect(target).toBeInTheDocument();
  });
  test("trImg is not loaded, then not has Patterns component", () => {
    renderWithProviders(<Material />);

    const target = screen.queryByTestId("patterns-ul");
    expect(target).toBeNull();
  });
});
