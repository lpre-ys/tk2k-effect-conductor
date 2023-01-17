/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateByType } from "../../../slice/celListSlice";

export function Options({ type, visible, config, update }) {
  const { t } = useTranslation();
  const handleChangeCycle = ({ target }) => {
    let value = parseInt(target.value);
    if (Number.isNaN(value) || value < 0) {
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
          {t("configs.cycle")}:&nbsp;
          <input
            type="number"
            data-testid="from-to-options-cycle"
            css={styles.cycle}
            value={config.cycle === 0 ? "" : config.cycle}
            onChange={handleChangeCycle}
          />
        </label>
        <label css={[styles.label, styles.checkbox]}>
          <input
            name="round-trip"
            data-testid="from-to-options-round-trip"
            type="checkbox"
            checked={config.isRoundTrip}
            value="true"
            onChange={handleChangeRoundTrip}
          />
          :&nbsp;{t("configs.roundTrip")}
        </label>
      </div>
    );
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const config = useSelector((state) => {
    return state.celList.list[state.celList.celIndex][props.type];
  });
  const dispatch = useDispatch();
  const _props = {
    config,
    update: (type, newConfig) => {
      dispatch(updateByType({ type, data: newConfig }));
    },
    ...props,
  };

  return <Options {..._props} />;
};

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
  checkbox: css`
    cursor: pointer;
  `,
};
