import { createSlice } from "@reduxjs/toolkit";
import { INIT_MAX_FRAME } from "../util/const";
import i18n from "../i18n/config";

const initialState = {
  celIndex: 0,
  drawKey: Date.now(),
  list: [initCel(1, INIT_MAX_FRAME, makeDefaultName(1))],
};

export const celListSlice = createSlice({
  name: "celList",
  initialState,
  reducers: {
    resetCelList: (state) => {
      // keyの更新が必要なため、個別に記載する
      Object.assign(state, initialState);
      state.drawKey = Date.now();
    },
    loadCelList: (state, action) => {
      Object.assign(state, action.payload);
      // VerUP対応
      state.list.map((cel, index) => {
        if ("isLoopBack" in cel.frame === false) {
          // isLoopBackをfalseで追加
          cel.frame.isLoopBack = false;
        }
        if ("name" in cel === false) {
          // nameがないなら、index + 1で追加
          cel.name = makeDefaultName(index + 1);
        }
        // TODO
        return cel;
      });
    },
    setCelName: (state, action) => {
      state.list[state.celIndex].name = action.payload;
    },
    setCelIndex: (state, action) => {
      state.celIndex = parseInt(action.payload);
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
    updateByType: (state, action) => {
      const { type, data } = action.payload;
      state.list = state.list.map((cel, index) => {
        if (index === state.celIndex) {
          cel[type] = data;
        }
        return cel;
      });
    },
  },
});

export const {
  resetCelList,
  loadCelList,
  setCelIndex,
  setCelName,
  addCel,
  deleteCel,
  copyCel,
  moveCel,
  updateFrame,
  updatePattern,
  updateByType,
} = celListSlice.actions;
export default celListSlice.reducer;

function makeDefaultName(num) {
  return i18n.t("other.cel") + num;
}

function initCel(start, volume, name) {
  return {
    name: name,
    x: {
      from: 0,
      to: 0,
      cycle: 0,
      isRoundTrip: false,
      easing: "easeLinear",
      easingAdd: "",
    },
    y: {
      from: 0,
      to: 0,
      cycle: 0,
      isRoundTrip: false,
      easing: "easeLinear",
      easingAdd: "",
    },
    scale: {
      from: 100,
      to: 100,
      cycle: 0,
      isRoundTrip: false,
      easing: "easeLinear",
      easingAdd: "",
    },
    opacity: {
      from: 0,
      to: 0,
      cycle: 0,
      isRoundTrip: false,
      easing: "easeLinear",
      easingAdd: "",
    },
    frame: {
      start: start,
      volume: volume,
      isHideLast: false,
      isLoopBack: false,
    },
    pattern: {
      start: 1,
      end: 1,
      isRoundTrip: false,
      align: "loop",
    },
  };
}
