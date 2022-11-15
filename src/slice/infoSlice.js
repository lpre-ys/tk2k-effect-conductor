import { createSlice } from "@reduxjs/toolkit";

export const infoSlice = createSlice({
  name: "info",
  initialState: {
    title: "",
    image: "",
  },
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
    resetInfo: (state) => {
      state.title = "";
      state.image = "";
    }
  }
});

export const { setTitle, setImage, resetInfo } = infoSlice.actions;
export default infoSlice.reducer;