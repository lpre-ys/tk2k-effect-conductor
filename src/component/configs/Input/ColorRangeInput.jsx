/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect, useRef } from "react";
import { useState } from "react";

export default function ColorRangeInput({
  min = 0,
  max = 200,
  value,
  setVal,
  testSuffix,
  rangeColorCss,
  isHue,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isMousePress, setIsMousePress] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const numberRef = useRef(null);

  const isShowRange = () => {
    return isFocused || isMouseOver;
  };

  const handleChange = ({ target }) => {
    setLocalValue(target.value);
  };

  useEffect(() => {
    if (!isMousePress) {
      setVal(localValue);
    }
  }, [localValue, isMousePress, setVal]);

  return (
    <div
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      css={[styles.container, isShowRange() && styles.containerIsShowRange]}
    >
      <input
        ref={numberRef}
        type="number"
        data-testid={`color-range-input-number${testSuffix}`}
        min={min}
        max={max}
        value={localValue}
        onChange={handleChange}
        {...props}
      />
      {isShowRange() && (
        <div css={styles.rangeContainer}>
          <input
            type="range"
            css={[styles.range, rangeColorCss]}
            style={{
              "--slider-color": isHue ? `hsl(${localValue}, 70%, 50%)` : "",
            }}
            min={min}
            max={max}
            value={localValue}
            tabIndex={-1}
            onChange={handleChange}
            onMouseOver={() => {
              setIsMouseOver(true);
            }}
            onMouseLeave={() => {
              setIsMouseOver(false);
            }}
            onMouseDown={() => {
              setIsMousePress(true);
            }}
            onMouseUp={() => {
              setIsMousePress(false);
              numberRef.current.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: css`
    position: relative;
    display: inline-block;
  `,
  containerIsShowRange: css`
    height: 3em;
  `,
  rangeContainer: css`
    position: absolute;
    top: 1.5em;
  `,
  range: css`
    -webkit-appearance: none;
    appearance: none;
    height: 2px;
    width: 8em;
    border-radius: 6px;
    background-color: #e0e0e0;
    ::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      cursor: pointer;
      position: relative;
      width: 18px;
      height: 18px;
      display: block;
      background-color: #fff;
      border-radius: 50%;
      -webkit-border-radius: 50%;
      border: 2px solid #616161;
    }
  `,
};
