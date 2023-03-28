/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEasingOptions } from "../../../../slice/celListSlice";

export function EaseElasticParams({ type, params, setIsValid, update }) {
  const [amplitude, setAmplitude] = useState(
    !!params.amplitude ? params.amplitude : ""
  );
  const [period, setPeriod] = useState(!!params.period ? params.period : "");

  const validate = useCallback(() => {
    if (amplitude !== "") {
      if (Number.isNaN(parseFloat(amplitude))) {
        return false;
      }
      if (amplitude < 0) {
        return false;
      }
    }
    if (period !== "") {
      if (Number.isNaN(parseFloat(period))) {
        return false;
      }
      if (period <= 0) {
        return false;
      }
    }
    return true;
  }, [amplitude, period]);

  const isChange = useCallback(() => {
    return params.amplitude !== amplitude || params.period !== period;
  }, [amplitude, params.amplitude, params.period, period]);

  useEffect(() => {
    setIsValid(validate());
    if (!validate()) {
      return;
    }
    if (isChange()) {
      update(type, { amplitude, period });
    }
  }, [amplitude, isChange, period, setIsValid, type, update, validate]);

  return (
    <>
      <h3 css={styles.header}>EaseElastic&nbsp;追加設定</h3>
      <div css={styles.form}>
        <label css={styles.label}>
          振幅&nbsp;<small>(amplitude)</small>:&nbsp;
          <input
            type="number"
            step="0.1"
            name="amplitude"
            css={styles.number}
            onChange={({ target }) => {
              setAmplitude(target.value);
            }}
            value={amplitude}
            placeholder="1.0"
          />
        </label>
      </div>
      <div css={styles.form}>
        <label css={styles.label}>
          期間&nbsp;<small>(period)</small>:&nbsp;
          <input
            type="number"
            step="0.1"
            name="period"
            css={styles.number}
            onChange={({ target }) => {
              setPeriod(target.value);
            }}
            value={period}
            placeholder="0.3"
          />
        </label>
      </div>
    </>
  );
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
  const params =
    !!config.easingOptions && !!config.easingOptions.easeElastic
      ? config.easingOptions.easeElastic
      : {};
  const dispatch = useDispatch();
  const _props = {
    params,
    update: (type, value) => {
      dispatch(updateEasingOptions({ type, easing: "easeElastic", value }));
    },
    ...props,
  };
  return <EaseElasticParams {..._props} />;
};

const styles = {
  form: css`
    margin-top: 0.3em;
  `,
  label: css`
    margin-right: 0.5em;
    user-select: none;
  `,
  number: css`
    width: 4em;
  `,
  header: css`
    font-size: 1.1em;
    font-weight: normal;
    margin: 1em 0 0.5em;
    padding-bottom: 0.1em;
    border-bottom: 1px solid #00bcd4;
  `,
};
