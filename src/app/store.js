import { configureStore } from "@reduxjs/toolkit";
import frameSlice from "../slice/frameSlice";

export default configureStore({
  reducer: {
    frame: frameSlice
  }
});