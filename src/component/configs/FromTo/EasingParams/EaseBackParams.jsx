/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEasingOptions } from "../../../../slice/celListSlice";

export function EaseBackParams({ type, params, setIsValid, update }) {
  const [overshoot, setOvershoot] = useState(
    !!params.overshoot ? params.overshoot : ""
  );

  const validate = useCallback(() => {
    if (overshoot !== "" && Number.isNaN(parseFloat(overshoot))) {
      return false;
    }
    if (overshoot < 0) {
      return false;
    }
    return true;
  }, [overshoot]);

  const isChange = useCallback(() => {
    return params.overshoot !== overshoot;
  }, [overshoot, params.overshoot]);

  useEffect(() => {
    setIsValid(validate());
    if (!validate()) {
      return;
    }
    if (isChange()) {
      update(type, { overshoot });
    }
  }, [overshoot, isChange, setIsValid, type, update, validate]);

  return (
    <>
      <h3 css={styles.header}>EaseBack&nbsp;追加設定</h3>
      <label css={styles.label}>
        戻り量&nbsp;<small>(overshoot)</small>:&nbsp;
        <input
          type="number"
          step="0.1"
          name="overshoot"
          css={styles.number}
          onChange={({ target }) => {
            setOvershoot(target.value);
          }}
          value={overshoot}
          placeholder="1.70158"
        />
      </label>
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
    !!config.easingOptions && config.easingOptions.easeBack
      ? config.easingOptions.easeBack
      : {};
  const dispatch = useDispatch();
  const _props = {
    params,
    update: (type, value) => {
      dispatch(updateEasingOptions({ type, easing: "easeBack", value }));
    },
    ...props,
  };
  return <EaseBackParams {..._props} />;
};

const styles = {
  label: css`
    margin-right: 0.5em;
    user-select: none;
  `,
  number: css`
    width: 5em;
  `,
  header: css`
    font-size: 1.1em;
    font-weight: normal;
    margin: 1em 0 0.5em;
    padding-bottom: 0.1em;
    border-bottom: 1px solid #00bcd4;
  `,
};
