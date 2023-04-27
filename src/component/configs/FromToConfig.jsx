/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useConfigOption } from "../../hook/useConfigOption";
import EasingConfig from "./FromTo/EasingConfig";
import Options from "./FromTo/Options";
import { Header } from "./Header";
import { updateFromTo } from "../../slice/celListSlice";

export function FromToConfig({
  type,
  name,
  config,
  updateFromTo,
  isSub,
  note,
}) {
  const [from, setFrom] = useState(config.from);
  const [to, setTo] = useState(config.to);
  const [optionIsValid, setOptionIsValid] = useState(true);

  const hasOption = () => {
    return config.cycle !== 0 || config.isRoundTrip;
  };
  const reset = () => {
    setFrom(config.from);
    setTo(config.to);
  };
  const { headerProps, optionProps } = useConfigOption(hasOption, reset);

  const validate = (value) => {
    return !Number.isNaN(parseInt(value));
  };

  const validateConfig = useCallback((from, to) => {
    return validate(from) && validate(to);
  }, []);

  const isChangeConfig = (config, from, to) => {
    return config.from !== from || config.to !== to;
  };

  useEffect(() => {
    if (validateConfig(from, to)) {
      const intFrom = parseInt(from);
      const intTo = parseInt(to);
      if (isChangeConfig(config, intFrom, intTo)) {
        updateFromTo(type, intFrom, intTo);
      }
    }
  }, [config, from, to, type, updateFromTo, validateConfig]);

  return (
    <div>
      <Header
        name={name}
        isValid={validateConfig(from, to) && optionIsValid}
        isSub={isSub}
        note={note}
        {...headerProps}
      />
      <div css={[styles.wrapper, isSub && styles.sub]}>
        <label css={styles.label}>
          <input
            type="number"
            data-testid="from-to-config-from"
            css={styles.number}
            value={from}
            onChange={({ target }) => {
              setFrom(target.value);
            }}
          />
          →
          <input
            type="number"
            data-testid="from-to-config-to"
            css={styles.number}
            value={to}
            onChange={({ target }) => {
              setTo(target.value);
            }}
          />
        </label>
        <EasingConfig type={type} />
        <Options type={type} setIsValid={setOptionIsValid} {...optionProps} />
      </div>
    </div>
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
  const dispatch = useDispatch();
  const _props = {
    config,
    updateFromTo: (type, from, to) => {
      dispatch(updateFromTo({ type, from, to }));
    },
    ...props,
  };

  return <FromToConfig {..._props} />;
};

const styles = {
  wrapper: css`
    margin: 0 0.5em;
  `,
  label: css`
    margin-right: 0.5em;
  `,
  number: css`
    width: 3em;
  `,
  error: css`
    color: #b71c1c;
  `,
  sub: css`
    font-size: 0.9em;
  `,
};
