/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import ColorRangeInput from "./ColorRangeInput";

export default function NumberInput({
  type,
  isSub,
  val,
  setVal,
  numberStyle,
  testSuffix = "",
  min,
  max,
}) {
  let rangeColorCss = {};
  if (type === "red") {
    rangeColorCss = styles.rangeRed;
  }
  if (type === "green") {
    rangeColorCss = styles.rangeGreen;
  }
  if (type === "blue") {
    rangeColorCss = styles.rangeBlue;
  }
  if (type === "hue") {
    rangeColorCss = styles.rangeHue;
  }
  return (
    <>
      {targetType.includes(type) ? (
        <ColorRangeInput
          value={val}
          css={[styles.number, numberStyle, isSub && styles.numberSub]}
          min={min}
          max={max}
          setVal={setVal}
          testSuffix={testSuffix}
          rangeColorCss={rangeColorCss}
          isHue={type === "hue"}
        />
      ) : (
        <input
          type="number"
          data-testid={`number-input${testSuffix}`}
          css={[styles.number, numberStyle, isSub && styles.numberSub]}
          value={val}
          min={min}
          max={max}
          onChange={({ target }) => {
            setVal(target.value);
          }}
        />
      )}
    </>
  );
}

const styles = {
  number: css`
    width: 3em;
  `,
  rangeRed: css`
    background-color: #ffcdd2;
    ::-webkit-slider-thumb {
      border: 2px solid #e53935;
    }
  `,
  rangeGreen: css`
    background-color: #c8e6c9;
    ::-webkit-slider-thumb {
      border: 2px solid #43a047;
    }
  `,
  rangeBlue: css`
    background-color: #c5cae9;
    ::-webkit-slider-thumb {
      border: 2px solid #3f51b5;
    }
  `,
  rangeHue: css`
    background: linear-gradient(
      to right,
      hsl(0, 100%, 60%) 0%,
      hsl(30, 100%, 60%) 8.3%,
      hsl(60, 100%, 60%) 16.6%,
      hsl(90, 100%, 60%) 25%,
      hsl(120, 100%, 60%) 33.3%,
      hsl(150, 100%, 60%) 41.6%,
      hsl(180, 100%, 60%) 50%,
      hsl(210, 100%, 60%) 58.3%,
      hsl(240, 100%, 60%) 66.6%,
      hsl(270, 100%, 60%) 75%,
      hsl(300, 100%, 60%) 83.3%,
      hsl(330, 100%, 60%) 91.6%,
      hsl(360, 100%, 60%) 100%
    );
    ::-webkit-slider-thumb {
      border: 2px solid var(--slider-color, #616161);
    }
  `,
};

const targetType = [
  "red",
  "green",
  "blue",
  "tkSat",
  "hsvMinMax",
  "hue",
  "sat",
  "val",
];
