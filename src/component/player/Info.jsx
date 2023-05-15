/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Info({ msg, setMsg }) {
  if (msg) {
    const msgList = msg.split("\n");
    return (
      <div css={styles.container}>
        <div css={styles.window}>
          {msgList.map((value, i) => {
            return (
              <p css={styles.line} key={i}>
                {value}
              </p>
            );
          })}
        </div>
        <h3 css={styles.header}>INFO</h3>
        <FontAwesomeIcon
          icon={faCircleXmark}
          css={styles.closeIcon}
          onClick={() => {
            setMsg("");
          }}
          data-testid="info-close-icon"
        />
      </div>
    );
  }
}

const styles = {
  container: css`
    position: relative;
    width: 100%;
    height: 2.5em;
  `,
  window: css`
    border: 1px solid #9e9e9e;
    border-radius: 0.2em;
    position: absolute;
    top: 0.7em;
    left: 0;
    width: 100%;
    padding: 0.7em 0 0.5em 0.5em;
  `,
  header: css`
    margin: 0;
    padding: 0 0.2em;
    background: white;
    position: absolute;
    top: 0;
    left: 0.5em;
  `,
  msg: css`
    margin: 0 0.5em 0.5em;
  `,
  line: css`
    margin: 0;
    padding: 0;
    :nth-of-type(n + 2) {
      margin-left: 2em;
    }
  `,
  closeIcon: css`
    position: absolute;
    font-size: 1.2em;
    color: #757575;
    top: 1em;
    left: 96%;
    cursor: pointer;
  `,
};
