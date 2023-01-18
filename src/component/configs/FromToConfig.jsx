/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useConfigOption } from "../../hook/useConfigOption";
import { updateByType } from "../../slice/celListSlice";
import EasingConfig from "./FromTo/EasingConfig";
import Options from "./FromTo/Options";
import { Header } from "./Header";

export function FromToConfig({ type, name, config, update }) {
  const [from, setFrom] = useState(config.from);
  const [to, setTo] = useState(config.to);

  const hasOption = () => {
    return config.cycle !== 0 || config.isRoundTrip;
  };
  const reset = () => {
    setFrom(config.from);
    setTo(config.to);
  };
  const { isValidOption, headerProps, optionProps } = useConfigOption(
    hasOption,
    reset
  );

  const validate = (value) => {
    return !Number.isNaN(parseInt(value));
  };

  const validateConfig = useCallback(({ from, to }) => {
    return validate(from) && validate(to);
  }, []);

  const isChangeConfig = (newConfig, oldConfig) => {
    return newConfig.from !== oldConfig.from || newConfig.to !== oldConfig.to;
  };

  useEffect(() => {
    const newConfig = Object.assign({}, config);
    newConfig.from = parseInt(from);
    newConfig.to = parseInt(to);

    if (validateConfig(newConfig) && isChangeConfig(newConfig, config)) {
      update(type, newConfig);
    }
  }, [config, from, to, type, update, validateConfig]);

  return (
    <div>
      <Header
        name={name}
        isValid={validateConfig({ from, to }) && isValidOption}
        {...headerProps}
      />
      <div css={styles.wrapper}>
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
        <Options type={type} {...optionProps} />
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const config = useSelector(
    (state) => state.celList.list[state.celList.celIndex][props.type]
  );
  const dispatch = useDispatch();
  const _props = {
    config,
    update: (type, newConfig) => {
      dispatch(updateByType({ type, data: newConfig }));
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
};
