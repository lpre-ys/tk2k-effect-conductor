import calcValue from "./calcValue";
import hsvToTkColor from "./hsvToTkColor";
import makePageList from "./makePageList";

// * 表示有無はこのfunctionを呼ぶ前にチェックしているので、不要
export default function getDataByLocalFrame(localFrame, config) {
  if (config.frame.volume === 1) {
    // 1フレだけの場合
    return getStartValues(config);
  }
  // easingする系の取得
  const x = calcValue(localFrame, config.x, config.frame);
  const y = calcValue(localFrame, config.y, config.frame);
  const scale = calcValue(localFrame, config.scale, config.frame);
  const opacity = calcValue(localFrame, config.opacity, config.frame);
  // 色計算
  let red, green, blue;
  if (config.hsv.isHsv) {
    // HSVモードによる計算
    const { min, max } = config.hsv;
    const hue = calcValue(localFrame, config.hue, config.frame);
    const sat = calcValue(localFrame, config.sat, config.frame);
    const val = calcValue(localFrame, config.val, config.frame);
    ({ red, green, blue } = hsvToTkColor(hue, sat, val, min, max));
  } else {
    red = calcValue(localFrame, config.red, config.frame);
    green = calcValue(localFrame, config.green, config.frame);
    blue = calcValue(localFrame, config.blue, config.frame);
  }
  // 色計算用の彩度と、tkool側の彩度を区別している
  const tkSat = calcValue(localFrame, config.tkSat, config.frame);
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
    tkSat,
    pageIndex,
  };
}
function getStartValues(config) {
  const x = config.x.from;
  const y = config.y.from;
  const scale = config.scale.from;
  const opacity = config.opacity.from;
  const pageIndex = config.pattern.start - 1; // pageIndexは0はじまり。
  let red = config.red.from;
  let green = config.green.from;
  let blue = config.blue.from;
  const tkSat = config.tkSat.from;
  if (config.hsv.isHsv) {
    const { min, max } = config.hsv;
    const hue = config.hue.from;
    const sat = config.sat.from;
    const val = config.val.from;
    ({ red, green, blue } = hsvToTkColor(hue, sat, val, min, max));
  }
  return {
    x,
    y,
    scale,
    opacity,
    pageIndex,
    tkSat,
    red,
    green,
    blue
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
  } else {
    // どれでも無い場合、center扱い
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
