const FRAME_SIZE = 20;
const TIMELINE_HEIGHT = 28;
const INIT_MAX_FRAME = 20;
const FRAME_SEC = 33; // 30 fps
const DEFAULT_CEL = {
  name: "",
  x: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  y: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  scale: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  opacity: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  red: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "fixed",
    easingAdd: "",
  },
  green: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "fixed",
    easingAdd: "",
  },
  blue: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "fixed",
    easingAdd: "",
  },
  tkSat: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "fixed",
    easingAdd: "",
  },
  frame: {
    start: 0,
    volume: 0,
    isHideLast: false,
    isLoopBack: false,
  },
  pattern: {
    start: 1,
    end: 1,
    isRoundTrip: false,
    align: "loop",
    customPattern: [],
    isCustom: false,
  },
};
const DEFAULT_TRIG = {
  center: {},
  amp: {
    from: 100,
    to: 100,
    cycle: 0,
    isRoundTrip: false,
    easing: "easeLinear",
    easingAdd: "",
  },
  cycle: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "fixed",
    easingAdd: "",
  },
  start: {
    from: 0,
    to: 0,
    cycle: 0,
    isRoundTrip: false,
    easing: "fixed",
    easingAdd: "",
  },
};

export {
  FRAME_SIZE,
  TIMELINE_HEIGHT,
  INIT_MAX_FRAME,
  FRAME_SEC,
  DEFAULT_CEL,
  DEFAULT_TRIG,
};
