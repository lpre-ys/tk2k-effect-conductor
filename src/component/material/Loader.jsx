/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function Loader(props) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 1) {
        const reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.addEventListener("load", () => {
          props.loadImage(reader.result);
        });
      }
    },
    [props]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
    },
    maxFiles: 1,
    onDrop,
  });

  return (
    <div className="container" css={styles.loader}>
      <div {...getRootProps()}>
        <input data-testid="drop-input" {...getInputProps()} />
        <p css={styles.p}>Drag & Drop or Click</p>
      </div>
    </div>
  );
}

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
