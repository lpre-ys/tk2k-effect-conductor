/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFrame } from "../../slice/celListSlice";

export function TimingConfig({ config, update }) {
  const [start, setStart] = useState(config.start);
  const [volume, setVolume] = useState(config.volume);

  const validateStart = (value) => {
    return !Number.isNaN(parseInt(value));
  };
  const validateVolume = (value) => {
    const num = parseInt(value);
    if (Number.isNaN(num)) {
      return false;
    }
    return num > 0;
  };

  const calcEnd = () => {
    const result = parseInt(start) + parseInt(volume) - 1;
    return Number.isNaN(result) ? "" : result;
  };

  const validateInput = () => {
    return validateConfig({ start, volume });
  };

  const validateConfig = useCallback(({ start, volume }) => {
    return validateStart(start) && validateVolume(volume);
  }, []);

  const isChangeConfig = (newConfig, oldConfig) => {
    return (
      newConfig.start !== oldConfig.start ||
      newConfig.volume !== oldConfig.volume
    );
  };

  useEffect(() => {
    const newConfig = {
      start: parseInt(start),
      volume: parseInt(volume),
    };
    if (validateConfig(newConfig) && isChangeConfig(newConfig, config)) {
      update(newConfig);
    }
  }, [start, update, volume, config, validateConfig]);

  const handleReset = () => {
    setStart(config.start);
    setVolume(config.volume);
  };

  return (
    <div>
      <h2>
        表示タイミング
        {!validateInput() && (
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
          onChange={({ target }) => {
            setStart(target.value);
          }}
        />
        ～
        <input
          type="text"
          data-testid="timing-end"
          css={[styles.end]}
          value={calcEnd()}
          disabled={true}
        />
        <label css={styles.label}>
          フレーム数: &nbsp;
          <input
            type="number"
            data-testid="timing-volume"
            css={[styles.number, !validateVolume(volume) && styles.error]}
            value={volume}
            onChange={({ target }) => {
              setVolume(target.value);
            }}
          />
        </label>
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const config = useSelector(
    (state) => state.celList.list[state.celList.celIndex].frame
  );
  const dispatch = useDispatch();
  const _props = {
    config,
    update: (newConfig) => {
      dispatch(updateFrame(newConfig));
    },
    ...props,
  };
  return <TimingConfig {..._props} />;
};

const styles = {
  number: css`
    width: 2.8rem;
  `,
  end: css`
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
