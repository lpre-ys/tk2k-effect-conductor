/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { memo } from "react";
import { useSelector } from "react-redux";

function MaterialImage({ isShow }) {
  const originalImage = useSelector((state) => state.material.originalImage);

  if (isShow) {
    return (
      <div css={styles.image} data-testid="material-image">
        <img src={originalImage} alt="original"></img>
      </div>
    );
  }
}
export default memo(MaterialImage);

const styles = {
  image: css`
    width: 220px;
    height: 220px;
    overflow: scroll;
  `,
};
