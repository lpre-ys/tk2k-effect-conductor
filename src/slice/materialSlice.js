import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  key: Date.now(),
  originalImage: null,
  trImage: null,
  maxPage: 0,
  trColor: { r: 0, g: 0, b: 0 },
  bgColor: "transparent",
};

export const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    loadOriginalImage: (state, action) => {
      const { dataUrl, transparent, maxPage, trColor } = action.payload;
      state.originalImage = dataUrl;
      state.trImage = transparent;
      state.maxPage = maxPage;
      state.trColor = trColor;
      state.key = Date.now();
    },
    changeTrColor: (state, action) => {
      const { transparent, trColor } = action.payload;
      state.trImage = transparent;
      state.trColor = trColor;
    },
    changeBgColor: (state, action) => {
      state.bgColor = action.payload;
    },
    loadMaterial: (state, action) => {
      Object.assign(state, action.payload);
    },
    resetMaterial: () => initialState
  },
});

export const { loadOriginalImage, changeTrColor, changeBgColor, loadMaterial, resetMaterial } = materialSlice.actions;
export default materialSlice.reducer;
