import { createSlice } from "@reduxjs/toolkit";

const INIT_MAX_FRAME = 20;

export const frameSlice = createSlice({
  name: 'frame',
  initialState: {
    frame: 0,
    maxFrame: INIT_MAX_FRAME
  },
  reducers: {
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
    resetFrameConfig: (state) => {
      state.frame = 0;
      state.maxFrame = INIT_MAX_FRAME;
    }
  }
});

export const { setFrame, setMaxFrame, resetFrameConfig } = frameSlice.actions;
export default frameSlice.reducer;

