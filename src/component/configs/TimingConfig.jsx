/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateFrame } from "../../slice/celListSlice";

export function TimingConfig({ config, update }) {
  const [start, setStart] = useState(config.start);
  const [volume, setVolume] = useState(config.volume);
  const [isHideLast, setIsHideLast] = useState(config.isHideLast);
  const [isLoopBack, setIsLoopBack] = useState(config.isLoopBack);
  const { t } = useTranslation();

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

  const validateConfig = useCallback(({ start, volume }) => {
    return validateStart(start) && validateVolume(volume);
  }, []);

  const isChangeConfig = (newConfig, oldConfig) => {
    return (
      newConfig.start !== oldConfig.start ||
      newConfig.volume !== oldConfig.volume ||
      newConfig.isHideLast !== oldConfig.isHideLast ||
      newConfig.isLoopBack !== oldConfig.isLoopBack
    );
  };

  useEffect(() => {
    const newConfig = {
      start: parseInt(start),
      volume: parseInt(volume),
      isHideLast,
      isLoopBack,
    };
    if (validateConfig(newConfig) && isChangeConfig(newConfig, config)) {
      update(newConfig);
    }
  }, [start, update, volume, config, validateConfig, isHideLast, isLoopBack]);

  const handleReset = () => {
    setStart(config.start);
    setVolume(config.volume);
    setIsHideLast(config.isHideLast);
    setIsLoopBack(config.isLoopBack);
  };

  return (
    <div>
      <h2>
        {t("configs.timing.label")}
        {!validateConfig({ start, volume }) && (
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
          {t("configs.timing.frame")}: &nbsp;
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
      <div>
        <label css={[styles.label, styles.checkbox]}>
          <input
            name="is-hide-last"
            data-testid="timing-is-hide-last"
            type="checkbox"
            checked={isHideLast}
            value="true"
            onChange={({ target }) => {
              setIsHideLast(target.checked);
            }}
          />
          :&nbsp;{t("configs.timing.isHideLast")}
        </label>
        <label css={[styles.label, styles.checkbox]}>
          <input
            name="is-loop-back"
            data-testid="timing-is-hide-last"
            type="checkbox"
            checked={isLoopBack}
            value="true"
            onChange={({ target }) => {
              setIsLoopBack(target.checked);
            }}
          />
          :&nbsp;{t("configs.timing.loop")}
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
    user-select: none;
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
  checkbox: css`
    cursor: pointer;
    display: block;
    padding-top: 0.3rem;
  `,
};
