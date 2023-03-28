import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bgImage: null,
  bgColor: "transparent",
  zoom: 2
}
export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    resetPlayer: () => initialState,
    loadPlayer: (state, action) => {
      Object.assign(state, action.payload);
    },
    setBgImage: (state, action) => {
      state.bgImage = action.payload;
    },
    setBgColor: (state, action) => {
      state.bgColor = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = parseInt(action.payload);
    }
  }
})

export const {
  resetPlayer,
  loadPlayer,
  setBgImage,
  setBgColor,
  setZoom
} = playerSlice.actions;

export default playerSlice.reducer;