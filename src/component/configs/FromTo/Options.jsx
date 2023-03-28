/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { updateCycle, updateIsRoundTrip } from "../../../slice/celListSlice";
import EasePolyParams from "./EasingParams/EasePolyParams";
import EaseBackParams from "./EasingParams/EaseBackParams";
import EaseElasticParams from "./EasingParams/EaseElasticParams";

export function Options({
  type,
  setIsValid,
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
        <EasingParams
          type={type}
          easing={config.easing}
          setIsValid={setIsValid}
        />
      </div>
    );
  }
}

function EasingParams({ type, easing, setIsValid }) {
  if (easing === "easePoly") {
    return <EasePolyParams type={type} setIsValid={setIsValid} />;
  }
  if (easing === "easeBack") {
    return <EaseBackParams type={type} setIsValid={setIsValid} />;
  }
  if (easing === "easeElastic") {
    return <EaseElasticParams type={type} setIsValid={setIsValid} />;
  }
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
};
