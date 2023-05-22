import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Options } from "./Options";

describe("show/hide", () => {
  test("has isShowOption button", () => {
    render(<Options />);

    const target = screen.getByTestId("export-options-button");
    expect(target).toBeInTheDocument();
  });

  test("INIT, then hide content", () => {
    render(<Options />);

    const target = screen.queryByTestId("export-options-container");
    expect(target).not.toBeInTheDocument();
  });
  test("click button, then show content", () => {
    render(<Options />);

    const button = screen.getByTestId("export-options-button");

    userEvent.click(button);

    const target = screen.getByTestId("export-options-container");
    expect(target).toBeInTheDocument();
  });
  test("click button twice, then hide content", () => {
    render(<Options />);

    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByTestId("export-options-container");
    expect(target).toBeInTheDocument();

    userEvent.click(button);
    expect(target).not.toBeInTheDocument();
  });
});

describe("target", () => {
  test("has Select", () => {
    render(<Options />);

    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByTestId("export-options-target");
    expect(target).toBeInTheDocument();
  });
  test("value is props.target", () => {
    render(<Options target={1} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByTestId("export-options-target");
    expect(target).toHaveValue("1");
  });
  test("change value, then call props.setTarget", () => {
    const setTarget = jest.fn();
    render(<Options target={1} setTarget={setTarget} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByTestId("export-options-target");
    userEvent.selectOptions(target, "0");

    expect(setTarget).toBeCalledWith("0");
  });
});
describe("yLine", () => {
  test("has Select", () => {
    render(<Options />);

    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByTestId("export-options-yline");
    expect(target).toBeInTheDocument();
  });
  test("value is props.yLine", () => {
    render(<Options yLine={1} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByTestId("export-options-yline");
    expect(target).toHaveValue("1");
  });
  test("change value, then call props.setTarget", () => {
    const setYLine = jest.fn();
    render(<Options yLine={1} setYLine={setYLine} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByTestId("export-options-yline");
    userEvent.selectOptions(target, "2");

    expect(setYLine).toBeCalledWith("2");
  });
});
describe("rawEffect", () => {
  test("empty, then show OFF text", () => {
    render(<Options rawEffect={false} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByText(/設定無し/);
    expect(target).toBeInTheDocument();
  });
  test("has Effect, then show ON text and clear button", () => {
    render(<Options rawEffect={true} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByText(/設定有り/);
    expect(target).toBeInTheDocument();

    const clear = screen.getByText("クリア");
    expect(clear).toBeInTheDocument();
  });
  test("click Clear, then call clearRawEffect", () => {
    const clearRawEffect = jest.fn();
    render(<Options rawEffect={true} clearRawEffect={clearRawEffect} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByText("クリア");
    userEvent.click(target);

    expect(clearRawEffect).toBeCalled();
  });
});

describe("load data", () => {
  test("INIT, has load button", () => {
    render(<Options />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByText("クリップボードから読み込み");
    expect(target).toBeInTheDocument();
  });
  test("no electron, then noop", () => {
    const loadFromTk2k = jest.fn();
    render(<Options loadFromTk2k={loadFromTk2k} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByText("クリップボードから読み込み");
    userEvent.click(target);

    expect(loadFromTk2k).not.toBeCalled();
  });
  test("readInfo is not function, then noop", () => {
    const loadFromTk2k = jest.fn();
    window.tk2k = { readInfo: 123 };
    render(<Options loadFromTk2k={loadFromTk2k} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);

    const target = screen.getByText("クリップボードから読み込み");
    userEvent.click(target);

    expect(loadFromTk2k).not.toBeCalled();
  });
  test("readInfo is resolve, then load finished", () => {
    const loadFromTk2k = jest.fn();
    let resolve;
    const readInfo = jest.fn(() => new Promise((r) => (resolve = r)));
    window.tk2k = { readInfo: readInfo };
    render(<Options loadFromTk2k={loadFromTk2k} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);
    const loadButton = screen.getByText("クリップボードから読み込み");
    userEvent.click(loadButton);
    const target = screen.getByText("Loading...");
    expect(target).toBeInTheDocument();

    resolve("test data");
    return waitFor(() => expect(loadFromTk2k).toBeCalledWith("test data"));
  });
  test("readInfo is reject, then noop", () => {
    const loadFromTk2k = jest.fn();
    let reject;
    const readInfo = jest.fn(() => new Promise((rs, rj) => (reject = rj)));
    window.tk2k = { readInfo: readInfo };
    render(<Options loadFromTk2k={loadFromTk2k} />);
    const button = screen.getByTestId("export-options-button");
    userEvent.click(button);
    const loadButton = screen.getByText("クリップボードから読み込み");
    userEvent.click(loadButton);
    const target = screen.getByText("Loading...");
    expect(target).toBeInTheDocument();

    reject("error");
    return waitFor(() => {
      expect(screen.getByText("クリップボードから読み込み")).toBeInTheDocument();
    });
  });
});
