/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeBgColor } from "../../slice/materialSlice";
import TrImage from "../../tr2x.png";
import TrColorView from "./TrColorView";

function Patterns() {
  const { maxPage, trImage, bgColor } = useSelector((state) => state.material);

  const dispatch = useDispatch();

  const patterns = [];
  for (let i = 0; i < maxPage; i++) {
    const x = (i % 5) * 96;
    const y = parseInt(i / 5) * 96;
    patterns.push(
      <li key={i} css={styles.li}>
        <div
          css={{
            background: bgColor,
          }}
          data-testid="patterns-pattern-bgcolor-div"
        >
          <div
            css={styles.sprite}
            style={{
              backgroundImage: `url(${trImage})`,
              backgroundPosition: `-${x}px -${y}px`,
            }}
            data-testid="patterns-pattern-sprite"
          >
            <p css={styles.number}>{i + 1}</p>
          </div>
        </div>
      </li>
    );
  }

  return (
    <>
      <label>
        背景色:&nbsp;
        <input
          type="text"
          css={styles.input}
          value={bgColor}
          onChange={({ target }) => {
            dispatch(changeBgColor(target.value));
          }}
          data-testid="patterns-input-bgcolor"
        />
      </label>
      <TrColorView />
      <ul css={styles.ul}>{patterns}</ul>
    </>
  );
}

export default memo(Patterns);

const styles = {
  ul: css`
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    gap: 0.8em;
    height: 420px;
    overflow-y: scroll;
    padding: 0.3em;
    margin: 0;
    justify-content: space-between;
    width: 222px;
  `,
  li: css`
    background: url(${TrImage});
  `,
  number: css`
    margin: 0 4px;
    text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff,
      1px -1px 0 #fff, 0px 1px 0 #fff, 0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff;
  `,
  sprite: css`
    width: 96px;
    height: 96px;
    background-repeat: no-repeat;
  `,
  color: css`
    width: 2em;
  `,
  input: css`
    width: 6em;
  `,
};
