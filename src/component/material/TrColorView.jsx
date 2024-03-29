/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { changeTrColor } from "../../slice/materialSlice";
import makeTransparentImage from "../../util/makeTransparentImage";

export function TrColorView({ image, trColor, changeTrColor }) {
  const [isShowTrInput, setIsShowTrInput] = useState(false);
  const { t } = useTranslation();
  const [r, setR] = useState(trColor.r);
  const [g, setG] = useState(trColor.g);
  const [b, setB] = useState(trColor.b);

  const updateTrColor = useCallback(
    (newColor) => {
      makeTransparentImage(image, newColor).then(({ transparent, trColor }) => {
        changeTrColor(transparent, trColor);
      });
    },
    [changeTrColor, image]
  );
  const validateColor = (color) => {
    return Object.keys(color).reduce((flag, key) => {
      const value = parseInt(color[key]);
      return flag && !Number.isNaN(value) && value >= 0 && value <= 255;
    }, true);
  };
  const checkChangeColor = (oldColor, newColor) => {
    return (
      oldColor.r !== newColor.r ||
      oldColor.g !== newColor.g ||
      oldColor.b !== newColor.b
    );
  };

  useEffect(() => {
    const newColor = {
      r: parseInt(r),
      g: parseInt(g),
      b: parseInt(b),
    };
    if (validateColor(newColor) && checkChangeColor(trColor, newColor)) {
      updateTrColor(newColor);
    }
  }, [r, g, b, updateTrColor, trColor]);

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
        {t("material.trColor")}:
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
    changeTrColor: useCallback(
      (transparent, trColor) => {
        dispatch(changeTrColor({ transparent, trColor }));
      },
      [dispatch]
    ),
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
