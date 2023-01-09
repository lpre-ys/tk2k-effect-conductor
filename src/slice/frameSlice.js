import { createSlice } from "@reduxjs/toolkit";

const INIT_MAX_FRAME = 20;
const initialState = {
  frame: 0,
  maxFrame: INIT_MAX_FRAME,
};

export const frameSlice = createSlice({
  name: "frame",
  initialState,
  reducers: {
    resetFrameConfig: () => initialState,
    loadFrameConfig: (state, action) => {
      // 古いデータにString型の物があるので、ここでも変換しておく
      state.frame = parseInt(action.payload.frame);
      state.maxFrame = parseInt(action.payload.maxFrame);
    },
    setFrame: (state, action) => {
      if (action.payload < 0) {
        return;
      }
      if (action.payload >= state.max) {
        return;
      }
      state.frame = parseInt(action.payload);
    },
    setMaxFrame: (state, action) => {
      state.maxFrame = parseInt(action.payload);
    },
    nextFrame: (state) => {
      state.frame += 1;
      if (state.frame >= state.maxFrame) {
        state.frame = 0;
      }
    },
    prevFrame: (state) => {
      state.frame -= 1;
      if (state.frame < 0) {
        state.frame = state.maxFrame - 1;
      }
    },
  },
});

export const {
  loadFrameConfig,
  setFrame,
  setMaxFrame,
  resetFrameConfig,
  nextFrame,
  prevFrame,
} = frameSlice.actions;
export default frameSlice.reducer;
