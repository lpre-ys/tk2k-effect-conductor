import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  image: "",
  rawEffect: false,
  target: 0,
  yLine: 1,
};

export const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setTarget: (state, action) => {
      state.target = action.payload;
    },
    setYLine: (state, action) => {
      state.yLine = action.payload;
    },
    clearRawEffect: (state) => {
      state.rawEffect = false;
    },
    loadInfo: (state, action) => {
      Object.assign(state, action.payload);
    },
    loadFromTk2k: (state, action) => {
      const clipData = action.payload;

      state.title = clipData.title;
      state.image = clipData.material;
      state.target = clipData.target;
      state.yLine = clipData.yLine;
      state.rawEffect = clipData.rawEffect;
    },
    resetInfo: () => initialState
  },
});

export const {
  setTitle,
  setImage,
  setTarget,
  setYLine,
  clearRawEffect,
  loadInfo,
  loadFromTk2k,
  resetInfo,
} = infoSlice.actions;
export default infoSlice.reducer;
