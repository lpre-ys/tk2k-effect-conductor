import { configureStore } from "@reduxjs/toolkit";
import celListSlice from "../slice/celListSlice";
import frameSlice from "../slice/frameSlice";
import materialSlice from "../slice/materialSlice";

export default configureStore({
  reducer: {
    frame: frameSlice,
    material: materialSlice,
    celList: celListSlice
  }
});