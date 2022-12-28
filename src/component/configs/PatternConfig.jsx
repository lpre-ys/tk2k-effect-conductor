/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useCallback } from "react";
import { memo } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePattern } from "../../slice/celListSlice";
import PatternImage from "./Pattern/PatternImage";

export function PatternConfig({ config, update }) {
  const [start, setStart] = useState(config.start);
  const [end, setEnd] = useState(config.end);
  const [isRoundTrip, setIsRoundTrip] = useState(config.isRoundTrip);

  const validateStart = (start, end) => {
    const num = parseInt(start);
    return validate(num);
  };
  const validateEnd = (start, end) => {
    const num = parseInt(end);
    return validate(num);
  };

  const validateConfig = useCallback(({ start, end }) => {
    return validateStart(start, end) && validateEnd(start, end);
  }, []);

  function isChangeConfig(newConfig, oldConfig) {
    return (
      newConfig.start !== oldConfig.start ||
      newConfig.end !== oldConfig.end ||
      newConfig.isRoundTrip !== oldConfig.isRoundTrip
    );
  }

  useEffect(() => {
    const newConfig = {
      start: parseInt(start),
      end: parseInt(end),
      isRoundTrip: isRoundTrip,
    };
    if (validateConfig(newConfig) && isChangeConfig(newConfig, config)) {
      update(newConfig);
    }
  }, [start, end, isRoundTrip, update, validateConfig, config]);

  return (
    <div>
      <h2>
        パターン
        {!validateConfig({ start, end }) && (
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            css={styles.exIcon}
            onClick={() => {
              // RESET
              setStart(config.start);
              setEnd(config.end);
            }}
            data-testid="pattern-config-icon"
          />
        )}
      </h2>
      <div css={styles.container}>
        <PatternImage config={config} />
        <div css={styles.wrapper}>
          <div>
            <label css={[styles.label, styles.checkbox]}>
              <input
                name="round-trip"
                data-testid="from-to-options-round-trip"
                type="checkbox"
                checked={isRoundTrip}
                value="true"
                onChange={({ target }) => {
                  setIsRoundTrip(target.checked);
                }}
              />
              :&nbsp;往復
            </label>
          </div>
          <div>
            <label css={styles.label}>
              開始:&nbsp;
              <input
                type="number"
                data-testid="pattern-config-start"
                css={[
                  styles.number,
                  !validateStart(start, end) && styles.error,
                ]}
                value={start}
                onChange={({ target }) => {
                  setStart(target.value);
                }}
              />
            </label>
            <br />
            <label css={styles.label}>
              終了:&nbsp;
              <input
                type="number"
                data-testid="pattern-config-end"
                css={[styles.number, !validateEnd(start, end) && styles.error]}
                value={end}
                onChange={({ target }) => {
                  setEnd(target.value);
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo((props) => {
  const config = useSelector(
    (state) => state.celList.list[state.celList.celIndex].pattern
  );
  const dispatch = useDispatch();
  const _props = {
    config,
    update: (newConfig) => {
      dispatch(updatePattern(newConfig));
    },
    ...props,
  };

  return <PatternConfig {..._props} />;
});

const styles = {
  container: css`
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin: 0.5em;
  `,
  wrapper: css`
    display: flex;
    height: 90px;
    flex-direction: column;
    justify-content: space-between;
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
    width: 1em;
    :hover {
      font-size: 1.1em;
      color: #e53935;
    }
  `,
  label: css`
    user-select: none;
  `,
  checkbox: css`
    cursor: pointer;
  `,
};

// 共通のバリデーション
function validate(num) {
  // 数字に出来ないならダメ
  if (Number.isNaN(num)) {
    return false;
  }
  // 範囲チェック
  if (num < 1) {
    return false;
  }
  if (num > 25) {
    return false;
  }
  return true;
}
