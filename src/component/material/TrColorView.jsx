/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTrColor } from "../../slice/materialSlice";
import makeTransparentImage from "../../util/makeTransparentImage";

export function TrColorView({ image, trColor, changeTrColor }) {
  const [isShowTrInput, setIsShowTrInput] = useState(false);
  const [r, setR] = useState(trColor.r);
  const [g, setG] = useState(trColor.g);
  const [b, setB] = useState(trColor.b);

  const updateTrColor = (newColor) => {
    makeTransparentImage(image, newColor).then(({ transparent, trColor }) => {
      changeTrColor(transparent, trColor);
    });
  };
  const validateColor = (color) => {
    return Object.keys(color).reduce((flag, key) => {
      const value = parseInt(color[key]);
      return flag && !Number.isNaN(value) && value >= 0 && value <= 255;
    }, true);
  };

  return (
    <div css={styles.trColorWrapper} data-testid="tr-color-view">
      <span
        onClick={() => {
          // stateのリセット
          setR(trColor.r);
          setG(trColor.g);
          setB(trColor.b);
          // 表示切替
          setIsShowTrInput(!isShowTrInput);
        }}
        css={styles.trColorLabel}
        data-testid="trcv-label-wrapper"
      >
        透過色:
      </span>
      <span
        style={{ color: `rgb(${trColor.r}, ${trColor.g}, ${trColor.b})` }}
        data-testid="trcv-color-label"
      >
        ■
      </span>
      {isShowTrInput ? (
        <>
          <label>
            R:
            <input
              css={styles.color}
              type="text"
              value={r}
              onChange={({ target }) => {
                setR(target.value);
                const newColor = {
                  r: parseInt(target.value),
                  g: parseInt(g),
                  b: parseInt(b),
                };
                if (validateColor(newColor)) {
                  updateTrColor(newColor);
                }
              }}
              data-color="r"
              data-testid="trcv-input-r"
            />
            G:
            <input
              css={styles.color}
              type="text"
              value={g}
              onChange={({ target }) => {
                setG(target.value);
                const newColor = {
                  r: parseInt(r),
                  g: parseInt(target.value),
                  b: parseInt(b),
                };
                if (validateColor(newColor)) {
                  updateTrColor(newColor);
                }
              }}
              data-color="g"
              data-testid="trcv-input-g"
            />
            B:
            <input
              css={styles.color}
              type="text"
              value={b}
              onChange={({ target }) => {
                setB(target.value);
                const newColor = {
                  r: parseInt(r),
                  g: parseInt(g),
                  b: parseInt(target.value),
                };
                if (validateColor(newColor)) {
                  updateTrColor(newColor);
                }
              }}
              data-color="b"
              data-testid="trcv-input-b"
            />
          </label>
        </>
      ) : (
        <>
          <span
            css={styles.trColor}
            data-testid="trcv-text-view"
          >{`rgb(${trColor.r}, ${trColor.g}, ${trColor.b})`}</span>
        </>
      )}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const { originalImage, trColor } = useSelector((state) => state.material);
  const dispatch = useDispatch();
  const _props = {
    image: originalImage,
    trColor,
    changeTrColor: (transparent, trColor) => {
      dispatch(changeTrColor({ transparent, trColor }));
    },
    ...props,
  };

  return <TrColorView {..._props} />;
};

const styles = {
  trColorWrapper: css`
    height: 2em;
    line-height: 1.8em;
  `,
  trColorLabel: css`
    text-decoration: underline;
    text-decoration-color: #1e88e5;
    cursor: pointer;
  `,
  color: css`
    width: 2em;
  `,
};
