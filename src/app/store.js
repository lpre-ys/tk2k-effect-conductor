import { configureStore } from "@reduxjs/toolkit";
import celListSlice from "../slice/celListSlice";
import frameSlice from "../slice/frameSlice";
import infoSlice from "../slice/infoSlice";
import materialSlice from "../slice/materialSlice";
import playerSlice from "../slice/playerSlice";

export default configureStore({
  reducer: {
    frame: frameSlice,
    material: materialSlice,
    celList: celListSlice,
    info: infoSlice,
    player: playerSlice
  }
});