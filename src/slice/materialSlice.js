import { createSlice } from "@reduxjs/toolkit";

export const materialSlice = createSlice({
  name: "material",
  initialState: {
    originalImage: null,
    trImage: null,
    maxPage: 0,
    trColor: null,
    bgColor: "transparent",
  },
  reducers: {
    loadOriginalImage: (state, action) => {
      const { dataUrl, transparent, maxPage, trColor } = action.payload;
      state.originalImage = dataUrl;
      state.trImage = transparent;
      state.maxPage = maxPage;
      state.trColor = trColor;
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
    }
  },
});

export const { loadOriginalImage, changeTrColor, changeBgColor, loadMaterial } = materialSlice.actions;
export default materialSlice.reducer;
