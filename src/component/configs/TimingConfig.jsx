/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function TimingConfig({ config, update }) {
  const [start, setStart] = useState(config.start);
  const [volume, setVolume] = useState(config.volume);
  const [end, setEnd] = useState(config.start + config.volume - 1);

  const validateStart = (value) => {
    return !Number.isNaN(parseInt(value));
  };
  const validateEnd = (value) => {
    return !Number.isNaN(parseInt(value));
  };
  const validateVolume = (value) => {
    const num = parseInt(value);
    if (Number.isNaN(num)) {
      return false;
    }
    return num > 0;
  };
  const validateAll = () => {
    return validateStart(start) && validateEnd(end) && validateVolume(volume);
  };
  const handleChangeStart = ({ target }) => {
    setStart(target.value);

    if (validateStart(target.value)) {
      // configの更新
      const newConfig = Object.assign({}, config);
      newConfig.start = parseInt(target.value);
      update("frame", newConfig);
      setEnd(newConfig.start + newConfig.volume - 1); // endも連動して更新する
    }
  };
  const handleChangeEnd = ({ target }) => {
    setEnd(target.value);

    if (validateEnd(target.value)) {
      // configの更新
      const newConfig = Object.assign({}, config);
      // Endを動かす場合、頭を動かし、volumeはそのまま。
      newConfig.start = parseInt(target.value) + 1 - newConfig.volume;
      update("frame", newConfig);

      setStart(newConfig.start); // startも連動して更新する
    }
  };

  const handleChangeVolume = ({ target }) => {
    setVolume(target.value);

    if (validateVolume(target.value)) {
      const newConfig = Object.assign({}, config);
      newConfig.volume = parseInt(target.value);
      update("frame", newConfig);
    }
  };

  const handleReset = () => {
    setStart(config.start);
    setEnd(config.start + config.volume - 1);
    setVolume(config.volume);
  };

  return (
    <div>
      <h2>
        表示タイミング
        {!validateAll() && (
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            css={styles.exIcon}
            onClick={handleReset}
            data-testid="timing-config-icon"
          />
        )}
      </h2>
      <div css={styles.wrapper}>
        <input
          type="number"
          data-testid="timing-start"
          css={[styles.number, !validateStart(start) && styles.error]}
          value={start}
          onChange={handleChangeStart}
        />
        ～
        <input
          type="number"
          data-testid="timing-end"
          css={[styles.number, !validateEnd(end) && styles.error]}
          value={end}
          onChange={handleChangeEnd}
        />
        <label css={styles.label}>
          フレーム数: &nbsp;
          <input
            type="number"
            data-testid="timing-volume"
            css={[styles.number, !validateVolume(volume) && styles.error]}
            value={volume}
            onChange={handleChangeVolume}
          />
        </label>
      </div>
    </div>
  );
}

const styles = {
  number: css`
    width: 2.2rem;
  `,
  label: css`
    margin-left: 1em;
  `,
  wrapper: css`
    margin: 0.5em;
  `,
  error: css`
    color: #b71c1c;
  `,
  exIcon: css`
    color: #b71c1c;
    margin-left: 0.2em;
    cursor: pointer;
    :hover {
      font-size: 1.1em;
      color: #e53935;
    }
  `,
};
