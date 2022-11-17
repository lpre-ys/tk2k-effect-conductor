/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useSelector } from "react-redux";

export function MaterialImage({ image, isShow }) {
  if (isShow) {
    return (
      <div css={styles.image} data-testid="material-image">
        <img src={image} alt="original"></img>
      </div>
    );
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const originalImage = useSelector((state) => state.material.originalImage);
  const _props = {
    image: originalImage,
    ...props,
  };
  return <MaterialImage {..._props} />;
};

const styles = {
  image: css`
    width: 220px;
    height: 220px;
    overflow: scroll;
  `,
};
