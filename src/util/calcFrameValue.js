import getDataByLocalFrame from "./calcFrameValue/getDataByLocalFrame";

export default function calcFrameValue(frame, maxFrame, config) {
  if (frame < 0 || frame >= maxFrame) {
    // そもそも範囲外の場合、表示無し
    return false;
  }
  const localFrame = calcLocalFrame(frame, maxFrame, config.frame);
  let { volume, isHideLast } = config.frame;
  if (isHideLast) {
    volume -= 1;
  }
  if (localFrame < 0 || localFrame >= volume) {
    return false;
  }

  return getDataByLocalFrame(localFrame, config);
}

export function calcLocalFrame(frame, maxFrame, { start, isLoopBack }) {
  if (isLoopBack) {
    start = ((start - 1) % maxFrame) + 1;
    if (start < 1) {
      start += maxFrame;
    }
  }

  let localFrame = frame - start + 1;

  if (isLoopBack && localFrame < 0) {
    localFrame += maxFrame;
  }

  return localFrame;
}
