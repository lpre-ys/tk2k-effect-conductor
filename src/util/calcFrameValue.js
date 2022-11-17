import * as d3 from "d3-ease";

export default function getDataByLocalFrame(localFrame, config) {
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
    pageIndex,
    scale,
    opacity,
  };
}

function calcPageIndex(localFrame, { start, end, isRoundTrip }) {
  const pageNum = end - start + 1;
  let pageIndex = 0;
  if (isRoundTrip && pageNum > 3) {
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
