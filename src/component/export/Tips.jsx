/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Tips = () => {
  const [isShow, setIsShow] = useState(false);

  return (
    <>
      <span
        css={styles.icon}
        onMouseOver={() => {
          setIsShow(true);
        }}
        onMouseLeave={() => {
          setIsShow(false);
        }}
      >
        <FontAwesomeIcon icon={faCircleQuestion} />
      </span>
      <div css={styles.dialog} style={{ display: isShow ? "block" : "none" }}>
        クリップボード内の戦闘アニメデータから、セルの動作以外の情報を取得し、上書き設定します。
      </div>
    </>
  );
};

export default Tips;

const styles = {
  icon: css`
    cursor: pointer;
    margin-left: 0.2em;
    :hover {
      color: #0277bd;
    }
  `,
  dialog: css`
    border: 2px solid #616161;
    position: absolute;
    left: 535px;
    top: 70px;
    font-size: 0.8rem;
    padding: 0.25em;
    width: 28em;
    background: rgba(176, 190, 197, 0.5);
    border-radius: 2px 2px 2px 2px;
  `,
};
