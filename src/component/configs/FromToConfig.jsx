/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import {
  faAngleDown,
  faAngleRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
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

  const hasOption = () => {
    return config.cycle !== 0 || config.isRoundTrip;
  };

  const headerColorStyle = {
    color: hasOption() ? "#00838F" : "#9E9E9E",
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
          <FontAwesomeIcon
            icon={faAngleDown}
            css={styles.headerIcon}
            style={headerColorStyle}
            data-testid="from-to-config-icon-down"
          />
        ) : (
          <FontAwesomeIcon
            icon={faAngleRight}
            css={styles.headerIcon}
            style={headerColorStyle}
            data-testid="from-to-config-icon-right"
          />
        )}
        {name}
        {!validateAll() && (
          <FontAwesomeIcon
            icon={faTriangleExclamation}
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
    color: #b71c1c;
    cursor: pointer;
    margin-left: 0.2em;
    :hover {
      font-size: 1.1em;
      color: #e53935;
    }
    width: 1em;
  `,
};
