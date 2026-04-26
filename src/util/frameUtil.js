import { DRAG_TYPE } from "./const";

export function calculateFrameAfterDrag(type, start, volume, offsetFrame) {
  if (type === DRAG_TYPE.MOVE) {
    return { start: Math.max(1, start + offsetFrame), volume };
  }
  if (type === DRAG_TYPE.RESIZE_LEFT) {
    const end = start + volume - 1;
    const newStart = Math.max(1, Math.min(start + offsetFrame, end));
    return { start: newStart, volume: end - newStart + 1 };
  }
  if (type === DRAG_TYPE.RESIZE_RIGHT) {
    return { start, volume: Math.max(1, volume + offsetFrame) };
  }
  return { start, volume };
}
