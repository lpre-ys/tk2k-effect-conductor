/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

export default function Options({ type, config, update, visible }) {
  const handleChangeCycle = ({ target }) => {
    let value = target.value;
    if (value === "" || parseInt(value) < 0) {
      // 空文字は0に変換しておく
      value = 0;
    }
    const newConfig = Object.assign({}, config);
    newConfig.cycle = parseInt(value);
    update(type, newConfig);
  };
  const handleChangeRoundTrip = ({ target }) => {
    const newConfig = Object.assign({}, config);
    newConfig.isRoundTrip = !!target.checked;
    update(type, newConfig);
  };

  if (visible) {
    return (
      <div data-testid="from-to-options" css={styles.container}>
        <label css={styles.label}>
          周期:&nbsp;
          <input
            type="number"
            data-testid="from-to-options-cycle"
            css={styles.cycle}
            value={config.cycle === 0 ? "" : config.cycle}
            onChange={handleChangeCycle}
          />
        </label>
        <label css={styles.label}>
          <input
            name="round-trip"
            data-testid="from-to-options-round-trip"
            type="checkbox"
            checked={config.isRoundTrip}
            value="true"
            onChange={handleChangeRoundTrip}
          />
          :&nbsp;往復
        </label>
      </div>
    );
  }
}

const styles = {
  label: css`
    margin-right: 0.5em;
    user-select: none;
  `,
  cycle: css`
    width: 2.3em;
  `,
  container: css`
    margin-top: 0.3em;
  `,
};
