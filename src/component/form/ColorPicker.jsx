/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useRef, useState } from "react";
import { SketchPicker } from "react-color";
import TrImage from "../../tr2x.png";

export default function ColorPicker({ label, color, setColor }) {
  const [showPalette, setShowPalette] = useState(false);
  const labelRef = useRef();

  let pickerLeft = 64;
  if (labelRef.current) {
    pickerLeft = labelRef.current.getBoundingClientRect().width + 8;
  }

  return (
    <>
      <div css={styles.bgColorContainer}>
        <span ref={labelRef}>{label}:&nbsp;</span>
        <div css={styles.bgColorBase}>
          <div
            css={styles.bgColor}
            style={{ backgroundColor: color }}
            onClick={() => {
              if (color === "transparent") {
                setColor("#FFFFFF");
              }
              setShowPalette(true);
            }}
          ></div>
        </div>
        <div
          css={styles.cover}
          style={{ display: showPalette ? "block" : "none" }}
          onClick={() => {
            setShowPalette(false);
          }}
        ></div>
        <div
          css={styles.pickerContainer}
          style={{
            display: showPalette ? "block" : "none",
            left: `${pickerLeft}px`,
          }}
        >
          <SketchPicker
            color={color === "transparent" ? "rgba(0, 0, 0, 0.0)" : color}
            presetColors={[
              "#D0021B",
              "#F5A623",
              "#F8E71C",
              "#8B572A",
              "#7ED321",
              "#417505",
              "#BD10E0",
              "#9013FE",
              "#4A90E2",
              "#50E3C2",
              "#B8E986",
              "#000000",
              "#4A4A4A",
              "#9B9B9B",
              "#FFFFFF",
              "transparent",
            ]}
            onChange={(color, event) => {
              let value = color.hex;
              if (color.rgb.a < 1.0) {
                value = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
              }
              setColor(value);
            }}
          />
        </div>
      </div>
    </>
  );
}

const styles = {
  bgColorContainer: css`
    position: relative;
  `,
  bgColorBase: css`
    width: 2.5em;
    height: 1em;
    border: 1px solid #212121;
    border-radius: 2px;
    display: inline-block;
    vertical-align: text-top;
    background-image: url(${TrImage});
    cursor: pointer;
    margin: 2px;
    :hover {
      border: 1px solid #d84315;
    }
  `,
  bgColor: css`
    width: 100%;
    height: 100%;
  `,
  cover: css`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  `,
  pickerContainer: css`
    position: absolute;
    top: 24px;
    z-index: 2;
    user-select: none;
  `,
};
