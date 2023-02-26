/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import EasingConfig from "./FromTo/EasingConfig";

export function ConstConfig({ type, name, config, update }) {
  const [from, setFrom] = useState(config.from);

  const reset = () => {
    setFrom(config.from);
  };

  const validate = (value) => {
    return !Number.isNaN(parseInt(value));
  };

  const validateConfig = useCallback(({ from, to }) => {
    return validate(from) && validate(to);
  }, []);

  const isChangeConfig = (newConfig, oldConfig) => {
    return newConfig.from !== oldConfig.from;
  };

  useEffect(() => {
    const newConfig = Object.assign({}, config);
    newConfig.from = parseInt(from);

    if (validateConfig(newConfig) && isChangeConfig(newConfig, config)) {
      update(type, newConfig);
    }
  }, [config, from, type, update, validateConfig]);

  return (
    <div>
      <h2 css={[styles.header]}>
        {name}
        {!validate(from) && (
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            css={styles.exIcon}
            onClick={reset}
            data-testid="config-header-icon-error"
          />
        )}
      </h2>
      <div css={styles.wrapper}>
        <input
          type="number"
          data-testid="const-config-params-from"
          css={styles.number}
          value={from}
          onChange={({ target }) => {
            setFrom(target.value);
          }}
        />
        <EasingConfig type={type} config={config} />
      </div>
    </div>
  );
}

const styles = {
  header: css`
    cursor: pointer;
    position: relative;
    padding-left: 1.2em;
    user-select: none;
  `,
  headerIcon: css`
    // color: #0097a7;
    position: absolute;
    top: 0.55em;
    left: 0.4em;
    font-size: 1rem;
  `,
  exIcon: css`
    color: #b71c1c;
    cursor: pointer;
    margin-left: 0.2em;
    :hover {
      font-size: 1.1em;
      color: #e53935;
    }
    width: 1em;
  `,
  wrapper: css`
    margin: 0 0.5em;
  `,
  number: css`
    width: 3em;
    margin-right: 78px;
  `,
};
