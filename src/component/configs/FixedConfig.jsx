/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import EasingConfig from "./FromTo/EasingConfig";
import { Header } from "./Header";

export default function FixedConfig({
  type,
  name,
  note,
  config,
  update,
  isSub,
  isHideEasing,
}) {
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
      <Header
        name={name}
        note={note}
        isValid={validate(from)}
        reset={reset}
        isSub={isSub}
      />
      <div
        css={[styles.wrapper, isSub && styles.sub]}
        data-testid="const-config-params-wrapper"
      >
        <input
          type="number"
          data-testid="const-config-params-from"
          css={[styles.number, isSub && styles.numberSub]}
          value={from}
          onChange={({ target }) => {
            setFrom(target.value);
          }}
        />
        {!isHideEasing && (
          <EasingConfig type={type} config={config} update={update} />
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: css`
    margin: 0 0.5em;
  `,
  number: css`
    width: 3em;
    margin-right: 78px;
  `,
  sub: css`
    font-size: 0.9em;
  `,
  numberSub: css`
    margin-right: 71px;
  `,
};
