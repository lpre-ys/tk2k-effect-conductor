/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEasingOptions } from "../../../../slice/celListSlice";

export function EasePolyParams({ type, params, setIsValid, update }) {
  const [exponent, setExponent] = useState(
    !!params.exponent ? params.exponent : ""
  );

  const validate = useCallback(() => {
    if (exponent !== "" && Number.isNaN(parseFloat(exponent))) {
      return false;
    }
    if (exponent < 0) {
      return false;
    }
    return true;
  }, [exponent]);

  const isChange = useCallback(() => {
    return params.exponent !== exponent;
  }, [exponent, params.exponent]);

  useEffect(() => {
    setIsValid(validate());
    if (!validate()) {
      return;
    }
    if (isChange()) {
      update(type, { exponent });
    }
  }, [exponent, isChange, setIsValid, type, update, validate]);

  return (
    <>
      <h3 css={styles.header}>EasePoly&nbsp;追加設定</h3>
      <label css={styles.label}>
        指数&nbsp;<small>(exponent)</small>:&nbsp;
        <input
          type="number"
          step="0.1"
          name="exponent"
          css={styles.number}
          onChange={({ target }) => {
            setExponent(target.value);
          }}
          value={exponent}
          placeholder="3.0"
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
    !!config.easingOptions && config.easingOptions.easePoly
      ? config.easingOptions.easePoly
      : {};
  const dispatch = useDispatch();
  const _props = {
    params,
    update: (type, value) => {
      dispatch(updateEasingOptions({ type, easing: "easePoly", value }));
    },
    ...props,
  };
  return <EasePolyParams {..._props} />;
};

const styles = {
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
