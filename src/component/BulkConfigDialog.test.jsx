import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../util/renderWithProviders";
import BulkConfigDialog from "./BulkConfigDialog";

const nonFixed = { from: 10, to: 20, cycle: 0, isRoundTrip: false, easing: "easeLinear", easingAdd: "" };
const fixed = { from: 100, to: 100, cycle: 0, isRoundTrip: false, easing: "fixed", easingAdd: "" };

const makeCel = (isHsv = false) => ({
  x: { ...nonFixed },
  y: { ...nonFixed },
  scale: { ...nonFixed, from: 100, to: 100 },
  opacity: { ...nonFixed, from: 0, to: 0 },
  red:   { ...fixed },
  green: { ...fixed },
  blue:  { ...fixed },
  hsv:   { min: 0, max: 100, isHsv },
  hue:   { ...fixed, from: 0,   to: 0   },
  sat:   { ...fixed, from: 0,   to: 0   },
  val:   { ...fixed, from: 100, to: 100 },
  tkSat: { ...fixed },
  frame: { start: 1, volume: 10 },
});

const preloaded = {
  celList: {
    celIndex: 0,
    selectedIndices: [0],
    drawKey: 0,
    list: [makeCel()],
  },
};

describe("BulkConfigDialog", () => {
  test("ダイアログが表示される", () => {
    renderWithProviders(<BulkConfigDialog onClose={vi.fn()} />, { preloadedState: preloaded });
    expect(screen.getByText("一括設定")).toBeInTheDocument();
    expect(screen.getByText("上書き")).toBeInTheDocument();
    expect(screen.getByText("加算")).toBeInTheDocument();
    expect(screen.getByText("乗算")).toBeInTheDocument();
  });

  test("キャンセルで onClose が呼ばれ、状態は変わらない", () => {
    const onClose = vi.fn();
    const { store } = renderWithProviders(
      <BulkConfigDialog onClose={onClose} />,
      { preloadedState: preloaded }
    );

    userEvent.click(screen.getByText("キャンセル"));

    expect(onClose).toBeCalled();
    expect(store.getState().celList.list[0].x.from).toBe(10);
  });

  test("乗算に切り替えると入力値が全て 1 になる", () => {
    renderWithProviders(<BulkConfigDialog onClose={vi.fn()} />, { preloadedState: preloaded });

    userEvent.click(screen.getByText("乗算"));

    const inputs = screen.getAllByRole("spinbutton");
    inputs.forEach((input) => expect(input).toHaveValue(1));
  });

  test("加算に切り替えると入力値が全て 0 になる", () => {
    renderWithProviders(<BulkConfigDialog onClose={vi.fn()} />, { preloadedState: preloaded });

    userEvent.click(screen.getByText("乗算"));
    userEvent.click(screen.getByText("加算"));

    const inputs = screen.getAllByRole("spinbutton");
    inputs.forEach((input) => expect(input).toHaveValue(0));
  });

  test("適用クリックで onClose が呼ばれる", () => {
    const onClose = vi.fn();
    renderWithProviders(<BulkConfigDialog onClose={onClose} />, { preloadedState: preloaded });

    userEvent.click(screen.getByText("適用"));
    expect(onClose).toBeCalled();
  });

  test("チェックをオンにしたパラメータだけ変更される", () => {
    const { store } = renderWithProviders(
      <BulkConfigDialog onClose={vi.fn()} />,
      { preloadedState: preloaded }
    );

    const checkboxes = screen.getAllByRole("checkbox");
    userEvent.click(checkboxes[0]); // X のみオン

    userEvent.click(screen.getByText("適用"));

    // X は上書き 0 で更新される（from=0, to=0+(20-10)=10）
    expect(store.getState().celList.list[0].x.from).toBe(0);
    // Y は変わらない
    expect(store.getState().celList.list[0].y.from).toBe(10);
  });

  test("オーバーレイクリックで onClose が呼ばれる", () => {
    const onClose = vi.fn();
    renderWithProviders(<BulkConfigDialog onClose={onClose} />, { preloadedState: preloaded });

    userEvent.click(screen.getByTestId("bulk-config-overlay"));
    expect(onClose).toBeCalled();
  });

  test("全セルが RGB モードのとき red/green/blue が表示され hue は表示されない", () => {
    const state = {
      celList: { celIndex: 0, selectedIndices: [0, 1], drawKey: 0, list: [makeCel(false), makeCel(false)] },
    };
    renderWithProviders(<BulkConfigDialog onClose={vi.fn()} />, { preloadedState: state });
    expect(screen.getByText("赤")).toBeInTheDocument();
    expect(screen.getByText("緑")).toBeInTheDocument();
    expect(screen.getByText("青")).toBeInTheDocument();
    expect(screen.queryByText("H. 色相")).not.toBeInTheDocument();
  });

  test("全セルが HSV モードのとき hue/sat/val が表示され red は表示されない", () => {
    const state = {
      celList: { celIndex: 0, selectedIndices: [0], drawKey: 0, list: [makeCel(true)] },
    };
    renderWithProviders(<BulkConfigDialog onClose={vi.fn()} />, { preloadedState: state });
    expect(screen.getByText("H. 色相")).toBeInTheDocument();
    expect(screen.getByText("S. 彩度")).toBeInTheDocument();
    expect(screen.getByText("V. 明度")).toBeInTheDocument();
    expect(screen.queryByText("赤")).not.toBeInTheDocument();
  });

  test("ON/OFF 混在のとき混在メッセージが表示され red も hue も表示されない", () => {
    const state = {
      celList: { celIndex: 0, selectedIndices: [0, 1], drawKey: 0, list: [makeCel(false), makeCel(true)] },
    };
    renderWithProviders(<BulkConfigDialog onClose={vi.fn()} />, { preloadedState: state });
    expect(screen.getByText(/HSVモードが混在/)).toBeInTheDocument();
    expect(screen.queryByText("赤")).not.toBeInTheDocument();
    expect(screen.queryByText("H. 色相")).not.toBeInTheDocument();
  });

  test("混在モードでも tkSat（彩度）は表示される", () => {
    const state = {
      celList: { celIndex: 0, selectedIndices: [0, 1], drawKey: 0, list: [makeCel(false), makeCel(true)] },
    };
    renderWithProviders(<BulkConfigDialog onClose={vi.fn()} />, { preloadedState: state });
    expect(screen.getByText("彩度")).toBeInTheDocument();
  });

  test("混在モードで適用すると tkSat は更新され red と hue は変わらない", () => {
    const state = {
      celList: { celIndex: 0, selectedIndices: [0, 1], drawKey: 0, list: [makeCel(false), makeCel(true)] },
    };
    const { store } = renderWithProviders(
      <BulkConfigDialog onClose={vi.fn()} />,
      { preloadedState: state }
    );

    const checkboxes = screen.getAllByRole("checkbox");
    userEvent.click(checkboxes[4]); // tkSat チェック（basic 4 個の後、混在時は tkSat のみ）

    userEvent.click(screen.getByText("適用"));

    expect(store.getState().celList.list[0].tkSat.from).toBe(0);
    expect(store.getState().celList.list[0].red.from).toBe(100);
  });

  test("HSV モードで適用すると hue が更新され red は変わらない", () => {
    const state = {
      celList: { celIndex: 0, selectedIndices: [0], drawKey: 0, list: [makeCel(true)] },
    };
    const { store } = renderWithProviders(
      <BulkConfigDialog onClose={vi.fn()} />,
      { preloadedState: state }
    );

    const checkboxes = screen.getAllByRole("checkbox");
    userEvent.click(checkboxes[4]); // hue チェック（basic 4 個の後）

    userEvent.click(screen.getByText("適用"));

    expect(store.getState().celList.list[0].hue.from).toBe(0);
    expect(store.getState().celList.list[0].red.from).toBe(100); // 変わらない
  });
});
