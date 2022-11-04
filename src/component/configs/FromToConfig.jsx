/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState } from "react";
import { FaAngleDown, FaAngleRight, FaExclamation } from "react-icons/fa";
import EasingConfig from "./FromTo/EasingConfig";
import Options from "./FromTo/Options";

export default function FromToConfig({ type, name, config, update }) {
  const [isOption, setIsOption] = useState(false);
  const [from, setFrom] = useState(config.from);
  const [to, setTo] = useState(config.to);

  const handleChangeFrom = ({ target }) => {
    setFrom(target.value);
    if (validate(target.value)) {
      const newConfig = Object.assign({}, config);
      newConfig.from = parseInt(target.value);
      update(type, newConfig);
    }
  };
  const handleChangeTo = ({ target }) => {
    setTo(target.value);
    if (validate(target.value)) {
      const newConfig = Object.assign({}, config);
      newConfig.to = parseInt(target.value);
      update(type, newConfig);
    }
  };

  const validate = (value) => {
    return !Number.isNaN(parseInt(value));
  };

  const validateAll = () => {
    return validate(from) && validate(to);
  };

  return (
    <div>
      <h2
        css={[styles.header]}
        onClick={() => {
          setIsOption(!isOption);
        }}
      >
        {isOption ? (
          <FaAngleDown
            data-testid="from-to-config-icon-down"
            css={styles.headerIcon}
          />
        ) : (
          <FaAngleRight
            data-testid="from-to-config-icon-right"
            css={styles.headerIcon}
          />
        )}
        {name}
        {!validateAll() && (
          <FaExclamation
            css={styles.exIcon}
            onClick={(e) => {
              // RESET
              setFrom(config.from);
              setTo(config.to);
              // ヘッダ側の処理を行わない
              e.stopPropagation();
            }}
            data-testid="from-to-config-icon-error"
          />
        )}
      </h2>
      <div css={styles.wrapper}>
        <label css={styles.label}>
          <input
            type="number"
            data-testid="from-to-config-from"
            css={styles.number}
            value={from}
            onChange={handleChangeFrom}
          />
          →
          <input
            type="number"
            data-testid="from-to-config-to"
            css={styles.number}
            value={to}
            onChange={handleChangeTo}
          />
        </label>
        <EasingConfig config={config} type={type} update={update} />
        <Options
          config={config}
          type={type}
          update={update}
          visible={isOption}
        />
      </div>
    </div>
  );
}

const styles = {
  header: css`
    cursor: pointer;
    position: relative;
    padding-left: 1.4em;
    user-select: none;
  `,
  headerIcon: css`
    color: #0097a7;
    position: absolute;
    top: 0.4em;
    left: 0.35em;
  `,
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
  exIcon: css`
    font-size: 0.8em;
    color: #b71c1c;
    cursor: pointer;
    :hover {
      font-size: 0.9em;
      color: #e53935;
    }
  `,
};
