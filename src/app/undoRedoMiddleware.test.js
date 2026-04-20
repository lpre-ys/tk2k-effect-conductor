import {
  createUndoRedoMiddleware,
  undoAction,
  redoAction,
  clearUndoHistory,
} from './undoRedoMiddleware';
import { addCel, loadCelList, resetCelList } from '../slice/celListSlice';
import {
  loadFrameConfig,
  resetFrameConfig,
  setFrame,
  nextFrame,
  prevFrame,
} from '../slice/frameSlice';
import { loadInfo, resetInfo } from '../slice/infoSlice';
import { DEFAULT_CEL } from '../util/const';

const makeState = (overrides = {}) => ({
  frame: { frame: 0, maxFrame: 20, ...(overrides.frame || {}) },
  celList: { celIndex: 0, list: [{ ...DEFAULT_CEL }], drawKey: 0, ...(overrides.celList || {}) },
  info: { title: '', image: '', rawEffect: false, target: 0, yLine: 1, ...(overrides.info || {}) },
  player: { bgImage: null, bgColor: 'transparent', zoom: 2 },
  material: { key: 0, originalImage: null, trImage: null, maxPage: 0, trColor: { r: 0, g: 0, b: 0 }, bgColor: 'transparent' },
});

// invoke(action): アクションを流し込む
// setState(newState): reducerの実行をシミュレートしてgetState()の返り値を変更する
const setupMiddleware = (initialState, options = {}) => {
  let currentState = initialState ?? makeState();
  const store = {
    getState: () => currentState,
    dispatch: jest.fn(),
  };
  const next = jest.fn();
  const invoke = createUndoRedoMiddleware(options)(store)(next);
  const setState = (s) => { currentState = s; };
  return { store, next, invoke, setState };
};

const RECORDING_ACTION = addCel({ volume: 20, start: 1 });

// ----------------------------------------------------------------
describe('通過 (next呼び出し)', () => {
  test('記録対象アクションはnextに渡す', () => {
    const { invoke, next } = setupMiddleware();
    invoke(RECORDING_ACTION);
    expect(next).toHaveBeenCalledWith(RECORDING_ACTION);
  });

  test('undoActionはnextに渡さない', () => {
    const { invoke, next } = setupMiddleware();
    invoke(RECORDING_ACTION);
    invoke(undoAction());
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('redoActionはnextに渡さない', () => {
    const { invoke, next } = setupMiddleware();
    invoke(RECORDING_ACTION);
    invoke(undoAction());
    invoke(redoAction());
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('clearUndoHistoryはnextに渡さない', () => {
    const { invoke, next } = setupMiddleware();
    invoke(clearUndoHistory());
    expect(next).not.toHaveBeenCalled();
  });
});

// ----------------------------------------------------------------
describe('undo', () => {
  test('undoスタックが空のときは何もしない', () => {
    const { invoke, store } = setupMiddleware();
    invoke(undoAction());
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  test('undoでcelList・frame・infoの3スライスを前の状態に戻す', () => {
    const stateA = makeState({ celList: { list: [{ ...DEFAULT_CEL, name: 'a' }] } });
    const stateB = makeState({ celList: { list: [{ ...DEFAULT_CEL, name: 'b' }] } });
    const { invoke, store, setState } = setupMiddleware(stateA);

    invoke(RECORDING_ACTION);
    setState(stateB);

    invoke(undoAction());

    expect(store.dispatch).toHaveBeenCalledWith(loadCelList(stateA.celList));
    expect(store.dispatch).toHaveBeenCalledWith(loadFrameConfig(stateA.frame));
    expect(store.dispatch).toHaveBeenCalledWith(loadInfo(stateA.info));
  });

  test('frameの変更もスナップショットに含まれる', () => {
    const stateA = makeState({ frame: { frame: 0, maxFrame: 20 } });
    const stateB = makeState({ frame: { frame: 0, maxFrame: 30 } });
    const { invoke, store, setState } = setupMiddleware(stateA);

    invoke(RECORDING_ACTION);
    setState(stateB);
    invoke(undoAction());

    expect(store.dispatch).toHaveBeenCalledWith(loadFrameConfig(stateA.frame));
  });

  test('infoの変更もスナップショットに含まれる', () => {
    const stateA = makeState({ info: { title: 'before', image: '', rawEffect: false, target: 0, yLine: 1 } });
    const stateB = makeState({ info: { title: 'after', image: '', rawEffect: false, target: 0, yLine: 1 } });
    const { invoke, store, setState } = setupMiddleware(stateA);

    invoke(RECORDING_ACTION);
    setState(stateB);
    invoke(undoAction());

    expect(store.dispatch).toHaveBeenCalledWith(loadInfo(stateA.info));
  });

  test('2回undoすると2つ前の状態に戻る', () => {
    const stateA = makeState({ celList: { list: [{ ...DEFAULT_CEL, name: 'a' }] } });
    const stateB = makeState({ celList: { list: [{ ...DEFAULT_CEL, name: 'b' }] } });
    const stateC = makeState({ celList: { list: [{ ...DEFAULT_CEL, name: 'c' }] } });
    const { invoke, store, setState } = setupMiddleware(stateA);

    invoke(RECORDING_ACTION);
    setState(stateB);
    invoke(RECORDING_ACTION);
    setState(stateC);

    invoke(undoAction());
    expect(store.dispatch).toHaveBeenCalledWith(loadCelList(stateB.celList));

    store.dispatch.mockClear();
    setState(stateB);
    invoke(undoAction());
    expect(store.dispatch).toHaveBeenCalledWith(loadCelList(stateA.celList));
  });
});

// ----------------------------------------------------------------
describe('redo', () => {
  test('redoスタックが空のときは何もしない', () => {
    const { invoke, store } = setupMiddleware();
    invoke(redoAction());
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  test('undoした後のredoで元の状態に戻す', () => {
    const stateA = makeState({ celList: { list: [{ ...DEFAULT_CEL, name: 'a' }] } });
    const stateB = makeState({ celList: { list: [{ ...DEFAULT_CEL, name: 'b' }] } });
    const { invoke, store, setState } = setupMiddleware(stateA);

    invoke(RECORDING_ACTION);
    setState(stateB);
    invoke(undoAction());
    setState(stateA);

    store.dispatch.mockClear();
    invoke(redoAction());

    expect(store.dispatch).toHaveBeenCalledWith(loadCelList(stateB.celList));
    expect(store.dispatch).toHaveBeenCalledWith(loadFrameConfig(stateB.frame));
    expect(store.dispatch).toHaveBeenCalledWith(loadInfo(stateB.info));
  });

  test('新しいアクションを発行するとredoスタックがクリアされる', () => {
    const { invoke, store, setState } = setupMiddleware(makeState());

    invoke(RECORDING_ACTION);
    setState(makeState({ celList: { list: [{ ...DEFAULT_CEL, name: 'a' }] } }));
    invoke(undoAction());

    invoke(RECORDING_ACTION);

    store.dispatch.mockClear();
    invoke(redoAction());
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});

// ----------------------------------------------------------------
describe('clearUndoHistory', () => {
  test('undoスタックをクリアする', () => {
    const { invoke, store } = setupMiddleware();
    invoke(RECORDING_ACTION);
    invoke(clearUndoHistory());
    invoke(undoAction());
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  test('redoスタックもクリアする', () => {
    const { invoke, store, setState } = setupMiddleware(makeState());
    invoke(RECORDING_ACTION);
    setState(makeState({ celList: { list: [{ ...DEFAULT_CEL, name: 'a' }] } }));
    invoke(undoAction());
    invoke(clearUndoHistory());

    store.dispatch.mockClear();
    invoke(redoAction());
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});

// ----------------------------------------------------------------
describe('ブロック対象アクション（記録しない）', () => {
  test.each([
    ['player/系アクション', { type: 'player/setPlaying', payload: true }],
    ['material/系アクション', { type: 'material/changeTrColor', payload: {} }],
    ['setFrame', setFrame(5)],
    ['nextFrame', nextFrame()],
    ['prevFrame', prevFrame()],
    ['loadCelList', loadCelList({ list: [] })],
    ['loadFrameConfig', loadFrameConfig({ frame: 0, maxFrame: 20 })],
    ['loadInfo', loadInfo({ title: '' })],
    ['resetCelList', resetCelList()],
    ['resetFrameConfig', resetFrameConfig()],
    ['resetInfo', resetInfo()],
    ['@@INIT系の内部アクション', { type: '@@redux/INIT' }],
  ])('%sは記録されない', (_label, action) => {
    const { invoke, store } = setupMiddleware();
    invoke(action);
    invoke(undoAction());
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});

// ----------------------------------------------------------------
describe('MAX_HISTORY（履歴上限）', () => {
  test('101回アクションを発行してもundoは最大100回しか成功しない', () => {
    const { invoke, store } = setupMiddleware();

    for (let i = 0; i < 101; i++) {
      invoke(RECORDING_ACTION);
    }

    let successCount = 0;
    for (let i = 0; i < 101; i++) {
      store.dispatch.mockClear();
      invoke(undoAction());
      if (store.dispatch.mock.calls.length > 0) successCount++;
    }

    expect(successCount).toBe(100);
  });
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
describe('onUserAction コールバック', () => {
  test('記録対象アクション発行時に呼ばれる', () => {
    const onUserAction = jest.fn();
    const { invoke } = setupMiddleware(undefined, { onUserAction });
    invoke(RECORDING_ACTION);
    expect(onUserAction).toHaveBeenCalledTimes(1);
  });

  test('undoAction発行時に呼ばれる', () => {
    const onUserAction = jest.fn();
    const { invoke } = setupMiddleware(undefined, { onUserAction });
    invoke(RECORDING_ACTION);
    onUserAction.mockClear();
    invoke(undoAction());
    expect(onUserAction).toHaveBeenCalledTimes(1);
  });

  test('redoAction発行時に呼ばれる', () => {
    const onUserAction = jest.fn();
    const { invoke } = setupMiddleware(undefined, { onUserAction });
    invoke(RECORDING_ACTION);
    invoke(undoAction());
    onUserAction.mockClear();
    invoke(redoAction());
    expect(onUserAction).toHaveBeenCalledTimes(1);
  });

  test('ブロック対象アクション（loadCelList等）では呼ばれない', () => {
    const onUserAction = jest.fn();
    const { invoke } = setupMiddleware(undefined, { onUserAction });
    invoke(loadCelList({ list: [] }));
    invoke(resetCelList());
    invoke(loadFrameConfig({ frame: 0, maxFrame: 20 }));
    invoke(loadInfo({ title: '' }));
    expect(onUserAction).not.toHaveBeenCalled();
  });

  test('clearUndoHistory発行時は呼ばれない', () => {
    const onUserAction = jest.fn();
    const { invoke } = setupMiddleware(undefined, { onUserAction });
    invoke(clearUndoHistory());
    expect(onUserAction).not.toHaveBeenCalled();
  });

  test('undoStackが空のとき undoAction では呼ばれない', () => {
    const onUserAction = jest.fn();
    const { invoke } = setupMiddleware(undefined, { onUserAction });
    invoke(undoAction());
    expect(onUserAction).not.toHaveBeenCalled();
  });
});

// ----------------------------------------------------------------
describe('インスタンス分離（ファクトリ関数の独立性）', () => {
  test('別々のmiddlewareインスタンスはスタックを共有しない', () => {
    const { invoke: invoke1, store: store1 } = setupMiddleware();
    const { invoke: invoke2, store: store2 } = setupMiddleware();

    invoke1(RECORDING_ACTION);

    invoke2(undoAction());
    expect(store2.dispatch).not.toHaveBeenCalled();

    invoke1(undoAction());
    expect(store1.dispatch).toHaveBeenCalled();
  });
});
