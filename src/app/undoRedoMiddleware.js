import { loadCelList, resetCelList } from "../slice/celListSlice";
import { loadFrameConfig, resetFrameConfig, setFrame, nextFrame, prevFrame } from "../slice/frameSlice";
import { loadInfo, resetInfo } from "../slice/infoSlice";

const UNDO_TYPE = 'UNDO';
const REDO_TYPE = 'REDO';
const CLEAR_TYPE = 'CLEAR_UNDO_HISTORY';

export const undoAction = () => ({ type: UNDO_TYPE });
export const redoAction = () => ({ type: REDO_TYPE });
export const clearUndoHistory = () => ({ type: CLEAR_TYPE });

const BLOCKED_PREFIXES = ['player/', 'material/'];
const BLOCKED_ACTIONS = new Set([
  setFrame.type, nextFrame.type, prevFrame.type,
  loadCelList.type, loadFrameConfig.type, loadInfo.type,
  resetCelList.type, resetFrameConfig.type, resetInfo.type,
  UNDO_TYPE, REDO_TYPE, CLEAR_TYPE,
]);

const MAX_HISTORY = 100;

const getEditableState = (state) => ({
  frame: state.frame,
  celList: state.celList,
  info: state.info,
});

const shouldRecord = (actionType) => {
  if (BLOCKED_PREFIXES.some((p) => actionType.startsWith(p))) return false;
  if (BLOCKED_ACTIONS.has(actionType)) return false;
  if (actionType.startsWith('@@')) return false;
  return true;
};

const restoreState = (dispatch, targetState) => {
  dispatch(loadCelList(targetState.celList));
  dispatch(loadFrameConfig(targetState.frame));
  dispatch(loadInfo(targetState.info));
};

export const createUndoRedoMiddleware = (options = {}) => {
  const { onUserAction } = options;
  let undoStack = [];
  let redoStack = [];

  return ({ getState, dispatch }) => (next) => (action) => {
    if (action.type === CLEAR_TYPE) {
      undoStack = [];
      redoStack = [];
      return;
    }

    if (action.type === UNDO_TYPE) {
      if (undoStack.length === 0) return;
      const current = getEditableState(getState());
      redoStack.push(current);
      restoreState(dispatch, undoStack.pop());
      onUserAction?.();
      return;
    }

    if (action.type === REDO_TYPE) {
      if (redoStack.length === 0) return;
      const current = getEditableState(getState());
      undoStack.push(current);
      restoreState(dispatch, redoStack.pop());
      onUserAction?.();
      return;
    }

    if (shouldRecord(action.type)) {
      undoStack.push(getEditableState(getState()));
      if (undoStack.length > MAX_HISTORY) undoStack.shift();
      redoStack = [];
      onUserAction?.();
    }

    return next(action);
  };
};
