/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

import FromToConfig from "./configs/FromToConfig";
import PatternConfig from "./configs/PatternConfig";
import TimingConfig from "./configs/TimingConfig";

export default function Configs({ config, update, material, celId }) {
  return (
    <div css={styles.container}>
      <h1>セル: {celId + 1}</h1>
      <TimingConfig config={config.frame} update={update} />
      <PatternConfig
        config={config.pattern}
        image={material.transparentImage}
        bgColor={material.bgColor}
        update={update}
      />
      <FromToConfig type="x" name="X座標" config={config.x} update={update} />
      <FromToConfig type="y" name="Y座標" config={config.y} update={update} />
      <FromToConfig
        type="scale"
        name="拡大率"
        config={config.scale}
        update={update}
      />
      <FromToConfig
        type="opacity"
        name="透明度"
        config={config.opacity}
        update={update}
      />
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
