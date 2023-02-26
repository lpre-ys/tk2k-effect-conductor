/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useConfigOption } from "../../hook/useConfigOption";
import EasingConfig from "./FromTo/EasingConfig";
import Options from "./FromTo/Options";
import { Header } from "./Header";

export default function FromToConfig({ type, name, config, update }) {
  const [from, setFrom] = useState(config.from);
  const [to, setTo] = useState(config.to);

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
        isValid={validateConfig({ from, to })}
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
        <EasingConfig type={type} config={config} />
        <Options type={type} {...optionProps} />
      </div>
    </div>
  );
}

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
