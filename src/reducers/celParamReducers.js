import merge from "deepmerge";
import { DEFAULT_TRIG } from "../util/const";

export const updateFromTo = (state, action) => {
  const { type, from, to } = action.payload;
  state.list = state.list.map((cel, index) => {
    if (index === state.celIndex) {
      const keys = type.split(".");
      if (keys.length === 1) {
        cel[type].from = from;
        cel[type].to = to;
      } else if (keys[1] === "trig") {
        // trig系
        cel[keys[0]][keys[1]][keys[2]].from = from;
        cel[keys[0]][keys[1]][keys[2]].to = to;
      }
    }
    return cel;
  });
};
export const updateCycle = (state, action) => {
  const { type, value } = action.payload;
  state.list = state.list.map((cel, index) => {
    if (index === state.celIndex) {
      const keys = type.split(".");
      if (keys.length === 1) {
        cel[type].cycle = value;
      } else if (keys[1] === "trig") {
        // trig系
        cel[keys[0]][keys[1]][keys[2]].cycle = value;
      }
    }
    return cel;
  });
};
export const updateIsRoundTrip = (state, action) => {
  const { type, value } = action.payload;
  state.list = state.list.map((cel, index) => {
    if (index === state.celIndex) {
      const keys = type.split(".");
      if (keys.length === 1) {
        cel[type].isRoundTrip = value;
      } else if (keys[1] === "trig") {
        // trig系
        cel[keys[0]][keys[1]][keys[2]].isRoundTrip = value;
      }
    }
    return cel;
  });
};
export const updateEasing = (state, action) => {
  const { type, easing, easingAdd } = action.payload;
  state.list = state.list.map((cel, index) => {
    if (index === state.celIndex) {
      const keys = type.split(".");
      if (keys.length === 1) {
        // easingがSinCosかつ、trigパラメータが無い場合、作成する
        if (
          ["sin", "cos"].includes(easing) &&
          typeof cel[type].trig === "undefined"
        ) {
          const center = merge({}, cel[type]); // 先にcenterを作ってから
          cel[type].trig = merge({}, DEFAULT_TRIG);
          cel[type].trig.center = center;
        }

        // trig系の処理完了後、easingを更新する
        cel[type].easing = easing;
        cel[type].easingAdd = !!easingAdd ? easingAdd : "";
      } else if (keys[1] === "trig") {
        // trig系
        cel[keys[0]][keys[1]][keys[2]].easing = easing;
        cel[keys[0]][keys[1]][keys[2]].easingAdd = !!easingAdd
          ? easingAdd
          : "";
      }
    }
    return cel;
  });
};
export const updateEasingOptions = (state, action) => {
  const { type, easing, value } = action.payload;
  // type: x.trig.amp みたいなやつ
  // easing: easePoly
  // value: Objectが来るはず
  state.list = state.list.map((cel, index) => {
    if (index === state.celIndex) {
      const keys = type.split(".");
      let target = false;
      if (keys.length === 1) {
        target = cel[type];

      } else if (keys[1] === "trig") {
        // trig系
        target = cel[keys[0]][keys[1]][keys[2]];
      }
      if (!target) {
        throw new Error("Unsupported key.");
      }

      // もし、easingOptionsが無ければ作る
      if (!Object.keys(target).includes("easingOptions")) {
        target.easingOptions = {};
      }
      target.easingOptions[easing] = value;
    }
    return cel;
  });
};