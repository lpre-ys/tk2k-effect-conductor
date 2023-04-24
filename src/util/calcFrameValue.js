import calcValue from "./calcValue";
import makePageList from "./makePageList";

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

// * 表示有無はこのfunctionを呼ぶ前にチェックしているので、不要
export function getDataByLocalFrame(localFrame, config) {
  if (config.frame.volume === 1) {
    // 1フレだけの場合
    return getStartValues(config);
  }
  // easingする系の取得
  const x = calcValue(localFrame, config.x, config.frame);
  const y = calcValue(localFrame, config.y, config.frame);
  const scale = calcValue(localFrame, config.scale, config.frame);
  const opacity = calcValue(localFrame, config.opacity, config.frame);
  const red = calcValue(localFrame, config.red, config.frame);
  const green = calcValue(localFrame, config.green, config.frame);
  const blue = calcValue(localFrame, config.blue, config.frame);
  // 色計算用の彩度と、tkool側の彩度を区別している
  const sat = calcValue(localFrame, config.tkSat, config.frame);
  // フレームの決定
  const pageIndex = calcPageIndex(
    localFrame,
    config.pattern,
    config.frame.volume
  );
  return {
    x,
    y,
    scale,
    opacity,
    red,
    green,
    blue,
    sat,
    pageIndex,
  };
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

function getStartValues(config) {
  const x = config.x.from;
  const y = config.y.from;
  const scale = config.scale.from;
  const opacity = config.opacity.from;
  const pageIndex = config.pattern.start - 1; // pageIndexは0はじまり。
  return {
    x,
    y,
    scale,
    opacity,
    pageIndex,
  };
}

function calcPageIndex(localFrame, config, volume) {
  // まずはページのリストを作成する
  const pageList = makePageList(config);

  if (["start", "end", "center"].includes(config.align)) {
    return calcPageIndexByPosition(config, pageList, localFrame, volume);
  }

  if (config.align === "even") {
    const index = Math.floor(localFrame / (volume / pageList.length));
    return pageList[index] - 1;
  }

  // ループ
  if (config.isRoundTrip) {
    pageList.pop();
  }
  return pageList[localFrame % pageList.length] - 1;
}

function calcPageIndexByPosition(config, pageList, localFrame, volume) {
  let head;
  if (config.align === "start") {
    head = 0;
  } else if (config.align === "end") {
    head = volume - pageList.length;
  } else if (config.align === "center") {
    head = Math.floor((volume - pageList.length) / 2);
  }

  let page;
  if (localFrame < head) {
    page = pageList[0];
  } else {
    page = pageList[localFrame - head]
      ? pageList[localFrame - head]
      : pageList[pageList.length - 1];
  }

  return page - 1;
}
