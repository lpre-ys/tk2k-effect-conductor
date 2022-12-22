import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FRAME_SIZE } from "../util/const";
import { renderWithProviders } from "../util/renderWithProviders";
import { Timeline } from "./Timeline";

const defaultConfig = {
  frame: { start: 1, volume: 10 },
};

describe("Buttons", () => {
  test("add,　then Call props.addCel", () => {
    const mockFn = jest.fn();
    renderWithProviders(<Timeline celList={[]} addCel={mockFn} />);

    userEvent.click(screen.getByText("追加"));
    expect(mockFn).toBeCalled();
  });
  test("copy,　then Call props.copyCel", () => {
    const mockFn = jest.fn();
    renderWithProviders(<Timeline celList={[]} copyCel={mockFn} />);

    userEvent.click(screen.getByText("コピー"));
    expect(mockFn).toBeCalled();
  });
  test("delete　celList.length = 1,then not Call props.deleteCel", () => {
    const mockFn = jest.fn();
    renderWithProviders(
      <Timeline celList={[defaultConfig]} deleteCel={mockFn} />
    );

    userEvent.click(screen.getByText("削除"));
    expect(mockFn).not.toBeCalled();
  });
  test("delete　celList.length = 2,then Call props.deleteCel", () => {
    const mockFn = jest.fn();
    renderWithProviders(
      <Timeline celList={[defaultConfig, defaultConfig]} deleteCel={mockFn} />
    );

    userEvent.click(screen.getByText("削除"));
    expect(mockFn).toBeCalled();
  });
});

// * 細かい座標系は一旦見ない。

describe("TimeCelView", () => {
  test("celList.length = 1, then has 1 TimeCelView", () => {
    // 1回
    renderWithProviders(<Timeline celList={[defaultConfig]} />);

    const target = screen.queryAllByTestId("time-cel-view");
    expect(target).toHaveLength(1);
  });
  test("celList.length = 4, then has 4 TimeCelView", () => {
    // 複数回
    renderWithProviders(
      <Timeline
        celList={[defaultConfig, defaultConfig, defaultConfig, defaultConfig]}
      />
    );

    const targets = screen.queryAllByTestId("time-cel-view");
    expect(targets).toHaveLength(4);
  });
  test("index is celList index", () => {
    renderWithProviders(
      <Timeline celList={[defaultConfig, defaultConfig, defaultConfig]} />
    );

    const targets = screen.queryAllByTestId("time-cel-view");
    expect(targets[0]).toHaveAttribute("data-id", "0");
    expect(targets[1]).toHaveAttribute("data-id", "1");
    expect(targets[2]).toHaveAttribute("data-id", "2");
  });
  test("config is celList", () => {
    const config1 = {
      frame: { start: 1, volume: 11 },
    };
    const config2 = {
      frame: { start: 2, volume: 22 },
    };
    renderWithProviders(<Timeline celList={[config1, config2]} />);

    const targets = screen.queryAllByTestId("time-cel-view");
    expect(targets[0]).toHaveStyle({
      left: `${FRAME_SIZE * (1 - 1) + 4}px`,
      width: `${FRAME_SIZE * 11 - 8}px`,
    });
    expect(targets[1]).toHaveStyle({
      left: `${FRAME_SIZE * (2 - 1) + 4}px`,
      width: `${FRAME_SIZE * 22 - 8}px`,
    });
  });
});

test("has spacer", () => {
  renderWithProviders(<Timeline celList={[defaultConfig]} />);

  const target = screen.getByTestId("timeline-spacer");
  expect(target).toBeInTheDocument();
});
