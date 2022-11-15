import { createSlice } from "@reduxjs/toolkit";

export const celListSlice = createSlice({
  name: 'celList',
  initialState: {
    celIndex: 0,
    // TODO celList
  },
  reducers: {
    setCelIndex: (state, action) => {
      state.celIndex = parseInt(action.payload);
    },
    resetCelIndex: (state) => {
      state.celIndex = 0;
    }
  }
});

export const { setCelIndex, resetCelIndex } = celListSlice.actions;
export default celListSlice.reducer;

// function initCelConfig(start, volume) {
//   return {
//     x: {
//       from: 0,
//       to: 0,
//       cycle: 0,
//       isRoundTrip: false,
//       easing: "easeLinear",
//       easingAdd: "",
//     },
//     y: {
//       from: 0,
//       to: 0,
//       cycle: 0,
//       isRoundTrip: false,
//       easing: "easeLinear",
//       easingAdd: "",
//     },
//     scale: {
//       from: 100,
//       to: 100,
//       cycle: 0,
//       isRoundTrip: false,
//       easing: "easeLinear",
//       easingAdd: "",
//     },
//     opacity: {
//       from: 0,
//       to: 0,
//       cycle: 0,
//       isRoundTrip: false,
//       easing: "easeLinear",
//       easingAdd: "",
//     },
//     frame: { start: start, volume: volume },
//     pattern: {
//       start: 1,
//       end: 1,
//       isRoundTrip: false,
//     },
//   };
// }
