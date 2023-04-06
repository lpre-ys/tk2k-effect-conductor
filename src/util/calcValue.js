import * as d3 from "d3-ease";

export default function calcValue(localFrame, config, frameConfig) {
  let easingName = config.easing;
  // 特別なeasingNameの場合、処理を別メソッドに移す
  if (easingName === "fixed") {
    return calcFixedParameter(config);
  }
  if (["sin", "cos"].includes(easingName)) {
    return calcTrigParameter(localFrame, config, frameConfig);
  }
  const from = parseFloat(config.from);
  const to = config.easing === "fixed" ? from : parseFloat(config.to);
  const isNoCycle = config.cycle < 1;
  let t;
  let cycle = config.cycle;

  if (isNoCycle) {
    // cycle指定が無い場合、全体で1サイクルとする
    cycle = frameConfig.volume;
    if (config.isRoundTrip) {
      cycle = Math.ceil(cycle / 2);
    }
  }

  // cycleが1の場合、fromを返す
  if (cycle === 1) {
    return from;
  }

  let position = localFrame % cycle;
  if (config.isRoundTrip) {
    // 周回する場合、cycleでlocalframeを割って、奇数ならpositionを反転
    if (Math.floor(localFrame / cycle) % 2 === 1) {
      position = cycle - position - 1;
      if (isNoCycle && frameConfig.volume % 2 === 1) {
        position -= 1;
      }
    }
  }
  t = (1.0 / (cycle - 1)) * position; // MAXはcycle - 1にする（右端まで行くように）

  if (easingName !== "easeLinear") {
    easingName += config.easingAdd;
  }

  let easing = d3[easingName];

  if (config.easing === "easePoly") {
    const { exponent } = getEasingOptions(config, "easePoly");
    if (exponent) {
      easing = easing.exponent(exponent);
    }
  }

  if (config.easing === "easeBack") {
    const { overshoot } = getEasingOptions(config, "easeBack");
    if (overshoot) {
      easing = easing.overshoot(overshoot);
    }
  }

  if (config.easing === "easeElastic") {
    const { amplitude, period } = getEasingOptions(config, "easeElastic");
    if (amplitude) {
      easing = easing.amplitude(amplitude);
    }
    if (period) {
      easing = easing.period(period);
    }
  }

  const weight = easing(t);

  const result = (to - from) * weight + from;

  return Math.round(result);
}

function getEasingOptions(config, easing) {
  if (config.easingOptions && config.easingOptions[easing]) {
    return config.easingOptions[easing];
  }
  return false;
}

function calcFixedParameter(config) {
  return parseInt(config.from);
}

function calcTrigParameter(localFrame, config, frameConfig) {
  const funcName = config.easing;
  const amp = calcValue(localFrame, config.trig.amp, frameConfig);
  const center = calcValue(localFrame, config.trig.center, frameConfig);

  let cycle = calcValue(localFrame, config.trig.cycle, frameConfig);
  if (cycle === 0) {
    cycle = frameConfig.volume;
  }

  const start = calcValue(localFrame, config.trig.start, frameConfig);
  const radian = start * (Math.PI / 180);
  return (
    Math.round(
      Math[funcName](((Math.PI * 2) / cycle) * localFrame + radian) * amp
    ) + center
  );
}
