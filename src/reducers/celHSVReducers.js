export const updateHSVMax = (state, action) => {
  state.list = state.list.map((cel, index) => {
    if (index === state.celIndex) {
      cel.hsv.max = action.payload;
    }
    return cel;
  });
};

export const updateHSVMin = (state, action) => {
  state.list = state.list.map((cel, index) => {
    if (index === state.celIndex) {
      cel.hsv.min = action.payload;
    }
    return cel;
  });
};
