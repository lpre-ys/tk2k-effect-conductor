import { createSlice } from "@reduxjs/toolkit";
import { INIT_MAX_FRAME } from "../util/const";

export const celListSlice = createSlice({
  name: "celList",
  initialState: {
    celIndex: 0,
    list: [initCel(1, INIT_MAX_FRAME)],
  },
  reducers: {
    setCelIndex: (state, action) => {
      state.celIndex = parseInt(action.payload);
    },
    resetCelList: (state) => {
      state.celIndex = 0;
      state.list = [initCel(1, INIT_MAX_FRAME)];
    },
    addCel: (state, action) => {
      const { volume, start } = action.payload;
      const newList = [...state.list, initCel(start, volume)];

      // TODO 追加する位置を、末尾じゃなくて、選択してるのの次にしたい。（COPYでやってるはず）
      state.list = newList;
      // 追加したセルを選択する
      state.celIndex = newList.length - 1;
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
      copyList.splice(state.celIndex, 0, target);
      state.list = copyList;
    },
    updateFrame: (state, action) => {
      state.list = state.list.map((cel, index) => {
        if (index === state.celIndex) {
          cel.frame = action.payload;
        }
        return cel;
      })
    },
    updatePattern: (state, action) => {
      state.list = state.list.map((cel, index) => {
        if (index === state.celIndex) {
          cel.pattern = action.payload;
        }
        return cel;
      })
    },
    updateByType: (state, action) => {
      const { type, data } = action.payload;
      state.list = state.list.map((cel, index) => {
        if (index === state.celIndex) {
          cel[type] = data;
        }
        return cel;
      })
    }
  },
});

export const {
  setCelIndex,
  resetCelList,
  addCel,
  deleteCel,
  copyCel,
  updateFrame,
  updatePattern,
  updateByType
} = celListSlice.actions;
export default celListSlice.reducer;

function initCel(start, volume) {
  return {
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
    frame: { start: start, volume: volume },
    pattern: {
      start: 1,
      end: 1,
      isRoundTrip: false,
    },
  };
}
