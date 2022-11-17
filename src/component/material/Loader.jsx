/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React, { useCallback } from "react";
import { memo } from "react";
import { useDropzone } from "react-dropzone";

function Loader({ loadImage }) {
  console.log("RENDER: Loader");

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 1) {
        const reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.addEventListener("load", () => {
          const name = acceptedFiles[0].name.replace(/\.[^/.]+$/, "");
          loadImage(reader.result, name);
        });
      }
    },
    [loadImage]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/bmp": [".bmp"],
    },
    maxFiles: 1,
    onDrop,
  });

  return (
    <div
      className="container"
      css={styles.loader}
      data-testid="material-loader"
    >
      <div {...getRootProps()}>
        <input data-testid="drop-input" {...getInputProps()} />
        <p css={styles.p}>Drag & Drop or Click</p>
      </div>
    </div>
  );
}

export default memo(Loader);

const styles = {
  loader: css`
    width: 228px;
    height: 50px;
    border: 2px dotted black;
    text-align: center;
  `,
  p: css`
    margin: 0;
    padding: 1em;
  `,
};
