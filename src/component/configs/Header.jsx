/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
export function Header({ name, color, isValid, reset, isOption, setIsOption }) {
  return (
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
          style={color}
          data-testid="config-header-icon-down"
        />
      ) : (
        <FontAwesomeIcon
          icon={faAngleRight}
          css={styles.headerIcon}
          style={color}
          data-testid="config-header-icon-right"
        />
      )}
      {name}
      {!isValid && (
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          css={styles.exIcon}
          onClick={reset}
          data-testid="config-header-icon-error"
        />
      )}
    </h2>
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
