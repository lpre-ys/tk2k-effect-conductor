import * as d3 from "d3-ease";

// * 表示有無はこのfunctionを呼ぶ前にチェックしているので、不要
export default function getDataByLocalFrame(localFrame, config) {
  if (config.frame.volume === 1) {
    // 1フレだけの場合
    return getStartValues(config);
  }
  // easingする系の取得
  const x = calcFrameValue(localFrame, config.x, config.frame);
  const y = calcFrameValue(localFrame, config.y, config.frame);
  const scale = calcFrameValue(localFrame, config.scale, config.frame);
  const opacity = calcFrameValue(localFrame, config.opacity, config.frame);
  // フレームの決定
  const pageIndex = calcPageIndex(localFrame, config.pattern);
  return {
    x,
    y,
    scale,
    opacity,
    pageIndex,
  };
}

function getStartValues(config) {
  const x = config.x.from;
  const y = config.y.from;
  const scale = config.scale.from
  const opacity = config.opacity.from;
  const pageIndex = config.pattern.start - 1; // pageIndexは0はじまり。
  return {
    x, y, scale, opacity, pageIndex,
  }
}

function calcPageIndex(localFrame, { start, end, isRoundTrip }) {
  const pageNum = end - start + 1;
  let pageIndex = 0;
  if (isRoundTrip) {
    pageIndex = (localFrame % (pageNum - 1));
    if (Math.floor(localFrame / (pageNum - 1)) % 2 === 1) {
      // 復路は反転
      pageIndex = pageNum - pageIndex - 1;
    }
  } else {
    pageIndex = (localFrame % pageNum);
  }
  // 開始分ずらす
  pageIndex += start - 1;

  return pageIndex;
}

function calcFrameValue(localFrame, config, frameConfig) {
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
