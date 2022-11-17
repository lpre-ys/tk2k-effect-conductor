import { createSlice } from "@reduxjs/toolkit";

const INIT_MAX_FRAME = 20;

export const frameSlice = createSlice({
  name: "frame",
  initialState: {
    frame: 0,
    maxFrame: INIT_MAX_FRAME,
  },
  reducers: {
    resetFrameConfig: (state) => {
      state.frame = 0;
      state.maxFrame = INIT_MAX_FRAME;
    },
    loadFrameConfig: (state, action) => {
      Object.assign(state, action.payload);
    },
    setFrame: (state, action) => {
      if (action.payload < 0) {
        return;
      }
      if (action.payload >= state.max) {
        return;
      }
      state.frame = action.payload;
    },
    setMaxFrame: (state, action) => {
      state.maxFrame = action.payload;
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