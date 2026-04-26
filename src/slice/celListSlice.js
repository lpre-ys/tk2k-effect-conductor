import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_CEL, DRAG_TYPE, INIT_MAX_FRAME } from "../util/const";
import { calculateFrameAfterDrag } from "../util/frameUtil";
import i18n from "../i18n/config";
import merge from "deepmerge";
import * as celParamReducers from "../reducers/celParamReducers";
import * as celHSVReducers from "../reducers/celHSVReducers";

const initialState = {
  celIndex: 0,
  selectedIndices: [0],
  drawKey: Date.now(),
  list: [initCel(1, INIT_MAX_FRAME, makeDefaultName(1))],
};

export const celListSlice = createSlice({
  name: "celList",
  initialState,
  reducers: {
    resetCelList: (state) => {
      // keyの更新が必要なため、個別に記載する
      state.celIndex = 0;
      state.selectedIndices = [0];
      state.drawKey = Date.now();
      state.list = [initCel(1, INIT_MAX_FRAME, makeDefaultName(1))];
    },
    loadCelList: (state, action) => {
      Object.assign(state, action.payload);
      // selectedIndicesが無い場合は後方互換のためcelIndexから生成
      if (!action.payload.selectedIndices) {
        state.selectedIndices = [state.celIndex];
      }
      // VerUP対応
      const list = state.list.map((cel, index) => {
        // デフォルト値を持っていてほしいので、マージする
        const merged = merge(DEFAULT_CEL, cel);

        // 名前はデフォ値を生成するので、ここで個別対応
        // 空文字で設定している可能性があるので
        // ロードしたデータにkeyがあるか無いかでチェックする
        if ("name" in cel === false) {
          merged.name = makeDefaultName(index + 1);
        }

        return merged;
      });
      state.list = list;
    },
    setCelName: (state, action) => {
      state.list[state.celIndex].name = action.payload;
    },
    setCelIndex: (state, action) => {
      state.celIndex = parseInt(action.payload);
      state.selectedIndices = [state.celIndex];
    },
    setActiveIndex: (state, action) => {
      state.celIndex = parseInt(action.payload);
      // selectedIndices は変えない（複数選択を維持したままアクティブセルを切り替える）
    },
    toggleSelectIndex: (state, action) => {
      const index = parseInt(action.payload);
      const set = new Set(state.selectedIndices);
      if (set.has(index)) {
        if (set.size === 1) return;
        set.delete(index);
        if (state.celIndex === index) {
          state.celIndex = Math.min(...set);
        }
      } else {
        set.add(index);
        state.celIndex = index;
      }
      state.selectedIndices = [...set];
    },
    addCel: (state, action) => {
      const { volume, start } = action.payload;
      const newList = [...state.list];
      // 追加したセルを選択する
      const index = state.celIndex + 1;

      newList.splice(
        state.celIndex + 1,
        0,
        initCel(start, volume, makeDefaultName(state.list.length + 1))
      );
      state.list = newList;
      state.celIndex = index;
      state.selectedIndices = [index];
    },
    deleteCel: (state) => {
      if (state.list.length < 2) {
        return;
      }
      const newList = state.list.filter((config, index) => {
        return index !== state.celIndex;
      });
      state.list = newList;
      // 1個前のセルを選択する
      state.celIndex = state.celIndex === 0 ? 0 : state.celIndex - 1;
      state.selectedIndices = [state.celIndex];
      // 表示更新に失敗するケースがあるので、drawKeyも更新してしまう。
      state.drawKey = Date.now();
    },
    copyCel: (state) => {
      // 有り得ない値だった場合、処理をしない
      if (state.celIndex >= state.list.length) {
        return;
      }
      if (state.celIndex < 0) {
        return;
      }
      const copyList = [...state.list];
      const target = JSON.parse(JSON.stringify(state.list[state.celIndex]));
      target.name += "_" + i18n.t("other.copy");
      copyList.splice(state.celIndex + 1, 0, target);
      state.list = copyList;
      // 追加したセルを選択する
      state.celIndex += 1;
      state.selectedIndices = [state.celIndex];
    },
    moveCelGroup: (state, action) => {
      const delta = parseInt(action.payload);
      if (delta === 0 || state.list.length < 2) return;
      const dir = delta > 0 ? 1 : -1;
      const steps = Math.abs(delta);
      let celIndexPos = state.celIndex;
      let currentSelected = new Set(state.selectedIndices);

      for (let step = 0; step < steps; step++) {
        const nextSelected = new Set(currentSelected);
        // 下方向はインデックスの大きい方から処理、上方向は小さい方から
        const sorted = [...currentSelected].sort((a, b) => dir > 0 ? b - a : a - b);
        for (const i of sorted) {
          const next = i + dir;
          if (next >= 0 && next < state.list.length && !nextSelected.has(next)) {
            [state.list[i], state.list[next]] = [state.list[next], state.list[i]];
            nextSelected.delete(i);
            nextSelected.add(next);
            if (celIndexPos === i) celIndexPos = next;
          }
        }
        currentSelected = nextSelected;
      }

      state.selectedIndices = [...currentSelected];
      state.celIndex = celIndexPos;
    },
    moveCel: (state, action) => {
      let target = parseInt(action.payload);
      if (state.list.length < 2) {
        return;
      }
      if (target < 0 || target >= state.list.length) {
        // ターゲットが配列の範囲外の場合、処理しない
        return;
      }
      if (state.celIndex === target) {
        // ターゲットと選択中のセルが同じ場合、処理しない
        return;
      }
      // 現在のセルを取得
      const cel = JSON.parse(JSON.stringify(state.list[state.celIndex]));
      // 現在のセルを削除したリストを取得
      const newList = state.list.filter((config, index) => {
        return index !== state.celIndex;
      });

      // ターゲットにセルを挿入する
      newList.splice(target, 0, cel);
      state.list = newList;

      // 挿入したセルを選択する
      state.celIndex = target;
      state.selectedIndices = [target];
    },
    updateFrameMultiple: (state, action) => {
      const { indices, offsetFrame, type } = action.payload;
      for (const idx of indices) {
        const frame = state.list[idx].frame;
        const result = calculateFrameAfterDrag(type, frame.start, frame.volume, offsetFrame);
        frame.start = result.start;
        frame.volume = result.volume;
      }
    },
    updateFrame: (state, action) => {
      state.list = state.list.map((cel, index) => {
        if (index === state.celIndex) {
          cel.frame = action.payload;
        }
        return cel;
      });
    },
    updatePattern: (state, action) => {
      state.list = state.list.map((cel, index) => {
        if (index === state.celIndex) {
          cel.pattern = action.payload;
        }
        return cel;
      });
    },
    ...celParamReducers,
    ...celHSVReducers
  },
});

export const {
  resetCelList,
  loadCelList,
  setCelIndex,
  setActiveIndex,
  toggleSelectIndex,
  setCelName,
  addCel,
  deleteCel,
  copyCel,
  moveCel,
  moveCelGroup,
  updateFrame,
  updateFrameMultiple,
  updatePattern,
  updateFromTo,
  updateCycle,
  updateIsRoundTrip,
  updateEasing,
  updateEasingOptions,
  updateHSVMin,
  updateHSVMax,
  setIsHsv
} = celListSlice.actions;
export default celListSlice.reducer;

function makeDefaultName(num) {
  return i18n.t("other.cel") + num;
}

function initCel(start, volume, name) {
  const cel = JSON.parse(JSON.stringify(DEFAULT_CEL));
  cel.name = name;
  cel.frame.start = start;
  cel.frame.volume = volume;

  return cel;
}
