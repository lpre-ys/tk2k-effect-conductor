import * as d3 from "d3-ease";
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
  const x = calcParameter(localFrame, config.x, config.frame);
  const y = calcParameter(localFrame, config.y, config.frame);
  const scale = calcParameter(localFrame, config.scale, config.frame);
  const opacity = calcParameter(localFrame, config.opacity, config.frame);
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

  let page;

  // TODO 後で、必ず、絶対に、リファクタリングしなさい！！！！！
  if (config.align === "start") {
    page = pageList[localFrame]
      ? pageList[localFrame]
      : pageList[pageList.length - 1];
  } else if (config.align === "end") {
    const head = volume - pageList.length;
    if (localFrame < head) {
      page = pageList[0];
    } else {
      page = pageList[localFrame - head];
    }
  } else if (config.align === "center") {
    const head = Math.floor((volume - pageList.length) / 2);
    if (localFrame < head) {
      page = pageList[0];
    } else {
      page = pageList[localFrame - head]
        ? pageList[localFrame - head]
        : pageList[pageList.length - 1];
    }
  } else if (config.align === "even") {
    const index = Math.floor(localFrame / (volume / pageList.length));
    console.log(localFrame, index, volume, pageList.length);
    page = pageList[index];
  } else {
    if (config.isRoundTrip) {
      pageList.pop();
    }
    page = pageList[localFrame % pageList.length];
  }
  return page - 1;
}

function calcParameter(localFrame, config, frameConfig) {
  const from = parseFloat(config.from);
  const to = parseFloat(config.to);
  let t;
  const cycle = config.cycle > 0 ? config.cycle : frameConfig.volume;
  let position = localFrame % cycle;
  if (config.isRoundTrip) {
    // 周回する場合、cycleでlocalframeを割って、奇数ならpositionを反転
    if (Math.floor(localFrame / cycle) % 2 === 1) {
      position = cycle - position - 1;
    }
  }
  t = (1.0 / (cycle - 1)) * position; // MAXはcycle - 1にする（右端まで行くように）
  let easingName = config.easing;
  if (easingName !== "easeLinear") {
    easingName += config.easingAdd;
  }
  const weight = d3[easingName](t);

  const result = (to - from) * weight + from;

  return Math.round(result);
}
