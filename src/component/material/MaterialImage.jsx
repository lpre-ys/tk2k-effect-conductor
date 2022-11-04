/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

export default function MaterialImage({ src, isShow }) {
  if (isShow) {
    return (
      <div css={styles.image} data-testid="material-image">
        <img src={src} alt="original"></img>
      </div>
    );
  }
}

const styles = {
  image: css`
    width: 220px;
    height: 220px;
    overflow: scroll;
  `,
};
