/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTrColor } from "../../slice/materialSlice";
import makeTransparentImage from "../../util/makeTransparentImage";

export function TrColorView({ image, trColor, changeTrColor }) {
  const [isShowTrInput, setIsShowTrInput] = useState(false);

  const handleChangeTrColor = ({ target }) => {
    const value = parseInt(target.value);
    if (value < 0 || value > 255) {
      return;
    }
    const newColor = Object.assign({}, trColor);
    newColor[target.dataset.color] = value;

    makeTransparentImage(image, newColor).then(({ transparent, trColor }) => {
      changeTrColor(transparent, trColor);
    });
  };

  return (
    <div css={styles.trColorWrapper} data-testid="tr-color-view">
      <span
        onClick={() => {
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
              value={trColor.r}
              onChange={handleChangeTrColor}
              data-color="r"
              data-testid="trcv-input-r"
            />
            G:
            <input
              css={styles.color}
              type="text"
              value={trColor.g}
              onChange={handleChangeTrColor}
              data-color="g"
              data-testid="trcv-input-g"
            />
            B:
            <input
              css={styles.color}
              type="text"
              value={trColor.b}
              onChange={handleChangeTrColor}
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
    cursor: pointer;
  `,
  trColorLabel: css`
    text-decoration: underline;
    text-decoration-color: #1e88e5;
  `,
  color: css`
    width: 2em;
  `,
};
