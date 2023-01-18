/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
export function Options({
  isOption,
  isCustom,
  setIsCustom,
  customPattern,
  setCustomPattern,
}) {
  const { t } = useTranslation();
  if (!isOption) {
    return null;
  }
  return (
    <div css={styles.container}>
      <button
        css={[styles.button, isCustom && styles.buttonOn]}
        onClick={() => {
          setIsCustom(!isCustom);
        }}
      >
        <FontAwesomeIcon
          icon={isCustom ? faToggleOn : faToggleOff}
          css={styles.icon}
        />
        {t("configs.pattern.custom")}:&nbsp;{isCustom ? "ON" : "OFF"}
      </button>
      <div>
        <textarea
          css={styles.textarea}
          style={{ display: isCustom ? "block" : "none" }}
          onChange={({ target }) => {
            setCustomPattern(target.value);
          }}
          value={customPattern}
        ></textarea>
      </div>
    </div>
  );
}

const styles = {
  container: css`
    margin: 0.5em;
  `,
  button: css`
    border: none;
    padding: 0.3em 0.5em 0.3em 1.6em;
    margin-top: 0.5em;
    text-align: left;
    text-decoration: none;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    background: #e0e0e0;
    color: #424242;
    :hover {
      background-color: #757575;
      color: #fafafa;
    }
  `,
  buttonOn: css`
    background: #66bb6a;
    color: #fafafa;
    :hover {
      background: #388e3c;
    }
  `,
  textarea: css`
    margin: 0.5em;
    width: 15em;
    height: 2.5em;
  `,
  icon: css`
    position: absolute;
    top: 0.4em;
    left: 0.4em;
  `,
};
