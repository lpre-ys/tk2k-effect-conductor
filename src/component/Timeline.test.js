import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Timeline from "./Timeline";

describe("Buttons", () => {
  test("add,　then Call props.handleAdd", () => {
    const mockFn = jest.fn();
    render(
      <Timeline
        maxFrame={10}
        globalFrame={0}
        configList={[]}
        handleAdd={mockFn}
      />
    );

    userEvent.click(screen.getByText("追加"));
    expect(mockFn).toBeCalled();
  });
  test("copy,　then Call props.handleCopy", () => {
    const mockFn = jest.fn();
    render(
      <Timeline
        maxFrame={10}
        globalFrame={0}
        configList={[]}
        handleCopy={mockFn}
      />
    );

    userEvent.click(screen.getByText("コピー"));
    expect(mockFn).toBeCalled();
  });
  test("delete　configList.length = 1,then not Call props.handleDelete", () => {
    const mockFn = jest.fn();
    render(
      <Timeline
        maxFrame={10}
        globalFrame={0}
        configList={[1]}
        handleDelete={mockFn}
      />
    );

    userEvent.click(screen.getByText("削除"));
    expect(mockFn).not.toBeCalled();
  });
  test("delete　configList.length = 2,then Call props.handleDelete", () => {
    const mockFn = jest.fn();
    render(
      <Timeline
        maxFrame={10}
        globalFrame={0}
        configList={[1, 2]}
        handleDelete={mockFn}
      />
    );

    userEvent.click(screen.getByText("削除"));
    expect(mockFn).toBeCalled();
  });
});

// * 細かい座標系は一旦見ない。

jest.mock(
  "./timeline/TimeCelView",
  () =>
    ({ index, config, isSelected, handler }) => {
      return (
        <div data-testid="time-cel-view">
          <p data-testid="time-cel-view-index">index: {index}</p>
          <p data-testid="time-cel-view-config">{config}</p>
          <p data-testid="time-cel-view-is-selected">
            {isSelected ? "true" : "false"}
          </p>
          <button
            type="button"
            data-testid="time-cel-view-handler"
            onClick={() => {
              handler();
            }}
          />
        </div>
      );
    }
);
describe("TimeCelView", () => {
  test("configList.length = 1, then has 1 TimeCelView", () => {
    // 1回
    render(<Timeline maxFrame={10} globalFrame={0} configList={[1]} />);

    const target = screen.queryAllByTestId("time-cel-view");
    expect(target).toHaveLength(1);
  });
  test("configList.length = 4, then has 4 TimeCelView", () => {
    // 複数回
    render(
      <Timeline maxFrame={10} globalFrame={0} configList={[1, 2, 3, 4]} />
    );

    const targets = screen.queryAllByTestId("time-cel-view");
    expect(targets).toHaveLength(4);
  });
  test("index is configList index", () => {
    render(<Timeline maxFrame={10} globalFrame={0} configList={[1, 2, 3]} />);

    const targets = screen.queryAllByTestId("time-cel-view-index");
    expect(targets[0]).toHaveTextContent("index: 0");
    expect(targets[1]).toHaveTextContent("index: 1");
    expect(targets[2]).toHaveTextContent("index: 2");
  });
  test("config is configList", () => {
    render(
      <Timeline
        maxFrame={10}
        globalFrame={0}
        configList={["testconfig1", "testconfig2"]}
      />
    );

    const targets = screen.queryAllByTestId("time-cel-view-config");
    expect(targets[0]).toHaveTextContent("testconfig1");
    expect(targets[1]).toHaveTextContent("testconfig2");
  });
  test("handler is props.handler", () => {
    const mockFn = jest.fn();
    render(
      <Timeline
        maxFrame={10}
        globalFrame={0}
        configList={[1]}
        handler={mockFn}
      />
    );

    userEvent.click(screen.getByTestId("time-cel-view-handler"));

    expect(mockFn).toBeCalled();
  });
  test("isSelected is only selected cel", () => {
    render(
      <Timeline
        maxFrame={10}
        globalFrame={0}
        configList={[1, 2, 3, 4, 5]}
        selected={3}
      />
    );

    const targets = screen.queryAllByTestId("time-cel-view-is-selected");
    expect(targets[0]).toHaveTextContent("false");
    expect(targets[1]).toHaveTextContent("false");
    expect(targets[2]).toHaveTextContent("false");
    expect(targets[3]).toHaveTextContent("true");
    expect(targets[4]).toHaveTextContent("false");
  });
});

test("has spacer", () => {
  render(<Timeline maxFrame={10} globalFrame={0} configList={[1]} />);

  const target = screen.getByTestId("timeline-spacer");
  expect(target).toBeInTheDocument();
});
