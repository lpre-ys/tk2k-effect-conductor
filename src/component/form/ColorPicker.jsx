/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import TrImage from "../../tr2x.png";

const PRESET_COLORS = [
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
];

export default function ColorPicker({ label, color, setColor }) {
  const [showPalette, setShowPalette] = useState(false);
  const labelRef = useRef();

  let pickerLeft = 64;
  if (labelRef.current) {
    pickerLeft = labelRef.current.getBoundingClientRect().width + 8;
  }

  const pickerColor = color === "transparent" ? "#FFFFFF" : color;

  return (
    <>
      <div css={styles.bgColorContainer} data-testid="colorpicker-component">
        <span ref={labelRef} data-testid="colorpicker-label">
          {label}:&nbsp;
        </span>
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
            data-testid="colorpicker-color"
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
          <HexColorPicker color={pickerColor} onChange={setColor} />
          <div css={styles.presetRow}>
            {PRESET_COLORS.map((preset) => (
              <div
                key={preset}
                css={preset === "transparent" ? styles.presetSwatchTr : styles.presetSwatch}
                style={{ backgroundColor: preset }}
                onClick={() => setColor(preset)}
                data-testid={`colorpicker-preset-${preset}`}
              ></div>
            ))}
          </div>
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
    background: #fff;
    padding: 8px;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  `,
  presetRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 8px;
    width: 200px;
  `,
  presetSwatch: css`
    width: 20px;
    height: 20px;
    border: 1px solid #212121;
    border-radius: 2px;
    cursor: pointer;
  `,
  presetSwatchTr: css`
    width: 20px;
    height: 20px;
    border: 1px solid #212121;
    border-radius: 2px;
    cursor: pointer;
    background-image: url(${TrImage});
    background-size: cover;
  `,
};
