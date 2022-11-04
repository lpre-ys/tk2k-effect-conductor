/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import PatternImage from "./Pattern/PatternImage";

export default function PatternConfig({ config, update, image, bgColor }) {
  const [start, setStart] = useState(config.start);
  const [end, setEnd] = useState(config.end);

  const handleChangeStart = ({ target }) => {
    setStart(target.value);
    if (validateStart(target.value)) {
      const newConfig = Object.assign({}, config);
      newConfig.start = parseInt(target.value);
      update("page", newConfig);
    }
  };
  const handleChangeEnd = ({ target }) => {
    setEnd(target.value);
    if (validateEnd(target.value)) {
      const newConfig = Object.assign({}, config);
      newConfig.end = parseInt(target.value);
      update("page", newConfig);
    }
  };

  const validateStart = (value) => {
    const num = parseInt(value);
    let result = validate(num);
    if (!result) {
      return result;
    }

    return num <= end;
  };
  const validateEnd = (value) => {
    const num = parseInt(value);
    let result = validate(num);
    if (!result) {
      return result;
    }

    return num >= start;
  };

  const validateAll = () => {
    return validateStart(start) && validateEnd(end);
  };

  return (
    <div>
      <h2>
        パターン
        {!validateAll() && (
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
        <PatternImage image={image} config={config} bgColor={bgColor} />
        <div css={styles.wrapper}>
          <label>
            開始:&nbsp;
            <input
              type="number"
              data-testid="pattern-config-start"
              css={[styles.number, !validateStart(start) && styles.error]}
              value={start}
              onChange={handleChangeStart}
            />
          </label>
          <br />
          <label>
            終了:&nbsp;
            <input
              type="number"
              data-testid="pattern-config-end"
              css={[styles.number, !validateEnd(end) && styles.error]}
              value={end}
              onChange={handleChangeEnd}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: css`
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin: 0.5em;
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
