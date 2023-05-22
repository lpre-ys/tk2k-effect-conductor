/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
export function Header({
  name,
  note,
  color,
  isValid,
  isSub,
  reset,
  isOption,
  setIsOption,
}) {
  const Heading = `h${isSub ? 3 : 2}`;
  const isUseOption = typeof setIsOption === "function";
  const optionIcon = isOption ? (
    <FontAwesomeIcon
      icon={faAngleDown}
      css={[styles.headerIcon, isSub && styles.headerIconSubFix]}
      style={color}
      data-testid="config-header-icon-down"
    />
  ) : (
    <FontAwesomeIcon
      icon={faAngleRight}
      css={[styles.headerIcon, isSub && styles.headerIconSubFix]}
      style={color}
      data-testid="config-header-icon-right"
    />
  );
  const normalIcon = (
    <span
      css={[styles.headerDotIcon, isSub && styles.headerDotIconSubFix]}
      data-testid="config-header-icon-dot"
    >
      ・
    </span>
  );
  return (
    <Heading
      css={[styles.header, isSub && styles.subHeader]}
      style={{ cursor: isUseOption ? "pointer" : "default" }}
      onClick={() => {
        if (isUseOption) {
          setIsOption(!isOption);
        }
      }}
    >
      {isUseOption ? optionIcon : normalIcon}
      {name}
      {!isValid && (
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          css={styles.exIcon}
          onClick={reset}
          data-testid="config-header-icon-error"
        />
      )}
      <span css={[styles.note, isSub && styles.subNote]}>{note}</span>
    </Heading>
  );
}

const styles = {
  header: css`
    position: relative;
    padding-left: 1.2em;
    user-select: none;
  `,
  subHeader: css`
    font-size: 1.1em;
    font-weight: normal;
    margin: 1em 0 0.5em;
    padding-bottom: 0.1em;
    border-bottom: 1px solid #00bcd4;
  `,
  headerIcon: css`
    // color: #0097a7;
    position: absolute;
    top: 0.55em;
    left: 0.4em;
    font-size: 1rem;
  `,
  headerIconSubFix: css`
    top: 0.15em;
    left: 0.3em;
  `,
  headerDotIcon: css`
    position: absolute;
    top: 0.3em;
    left: 0.2em;
    font-size: 1em;
    color: #9e9e9e;
  `,
  headerDotIconSubFix: css`
    top: 0em;
    left: 0.15em;
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
  note: css`
    font-size: 0.8em;
    font-weight: normal;
    margin-left: 1em;
    position: absolute;
    right: 1em;
    top: 0.7em;
  `,
  subNote: css`
    top: 0.2em;
  `,
};
