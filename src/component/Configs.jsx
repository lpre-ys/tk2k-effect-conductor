/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useSelector } from "react-redux";

import FromToConfig from "./configs/FromToConfig";
import PatternConfig from "./configs/PatternConfig";
import TimingConfig from "./configs/TimingConfig";

export default function Configs({ update }) {
  const celIndex = useSelector((state) => state.celList.celIndex);

  return (
    <div css={styles.container}>
      <h1>セル: {celIndex + 1}</h1>
      <TimingConfig />
      <PatternConfig />
      <FromToConfig type="x" name="X座標" />
      <FromToConfig type="y" name="Y座標" />
      <FromToConfig type="scale" name="拡大率" />
      <FromToConfig type="opacity" name="透明度" />
    </div>
  );
}

const styles = {
  container: css`
    flex-grow: 1;
    padding: 0 1em;
    height: 710px;
    overflow-y: scroll;
  `,
};
