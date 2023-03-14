/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { EASING_OPTION_LIST } from "../../../util/const";
import { updateCycle, updateIsRoundTrip } from "../../../slice/celListSlice";

export function Options({
  type,
  isOption,
  config,
  updateCycle,
  updateIsRoundTrip,
}) {
  const { t } = useTranslation();
  const handleChangeCycle = ({ target }) => {
    let value = parseInt(target.value);
    if (Number.isNaN(value) || value < 0) {
      // 空文字は0に変換しておく
      value = 0;
    }
    updateCycle(type, parseInt(value));
  };
  const handleChangeRoundTrip = ({ target }) => {
    updateIsRoundTrip(type, !!target.checked);
  };
  // const handleChangeEasingOption = ({ target }) => {
  //   let value = parseFloat(target.value);
  //   // TODO バリデーションとかなんかいろいろ
  //   if (Number.isNaN(value) || value < 0) {
  //     // 空文字、マイナスは0に変換しておく
  //     value = 0;
  //   }
  //   // 新しい値を作る
  //   // TODO ちゃんと、保存先データの形を考えておかないとダメ！！！！！！！
  // };

  if (isOption) {
    return (
      <div data-testid="from-to-options" css={styles.container}>
        <label css={styles.label}>
          {t("configs.cycle")}:&nbsp;
          <input
            type="number"
            data-testid="from-to-options-cycle"
            css={styles.number}
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
        <EasingOption easing={config.easing} />
      </div>
    );
  }
}

function EasingOption({ easing }) {
  if (Object.keys(EASING_OPTION_LIST).includes(easing)) {
    return (
      <>
        <h3 css={styles.appendsHeader}>{toUcCase(easing)}&nbsp;追加設定</h3>
        <label css={styles.label}>
          指数&nbsp;<small>(exponent)</small>:&nbsp;
          <input type="number" step="0.01" css={styles.appends} />
        </label>
      </>
    );
  }
}

function toUcCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const config = useSelector((state) => {
    const cel = state.celList.list[state.celList.celIndex];
    const keys = props.type.split(".");
    if (keys.length === 1) {
      return cel[props.type];
    } else if (keys[1] === "trig") {
      return cel[keys[0]][keys[1]][keys[2]];
    }
  });
  const dispatch = useDispatch();
  const _props = {
    config,
    updateCycle: (type, value) => {
      dispatch(updateCycle({ type, value }));
    },
    updateIsRoundTrip: (type, value) => {
      dispatch(updateIsRoundTrip({ type, value }));
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
  number: css`
    width: 2.3em;
  `,
  container: css`
    margin-top: 0.3em;
  `,
  checkbox: css`
    cursor: pointer;
  `,
  appends: css`
    width: 4em;
  `,
  appendsHeader: css`
    font-size: 1.1em;
    font-weight: normal;
    margin: 1em 0 0.5em;
    padding-bottom: 0.1em;
    border-bottom: 1px solid #00bcd4;
  `,
};
