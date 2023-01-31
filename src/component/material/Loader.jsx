/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { memo } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setImage } from "../../slice/infoSlice";
import { loadOriginalImage } from "../../slice/materialSlice";
import makeTransparentImage from "../../util/makeTransparentImage";

export function Loader({ setMsg, loadOriginalImage, setImageName }) {
  const { t } = useTranslation();
  const loadImage = (dataUrl, name) => {
    makeTransparentImage(dataUrl)
      .then(({ transparent, maxPage, trColor }) => {
        loadOriginalImage({ dataUrl, transparent, maxPage, trColor });
        setImageName(name);
        setMsg("");
      })
      .catch((error) => {
        if (error.message === "width") {
          setMsg(t("material.error.width"));
        }
        if (error.message === "height") {
          setMsg(t("material.error.height"));
        }
      });
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const name = acceptedFiles[0].name.replace(/\.[^/.]+$/, "");
        loadImage(reader.result, name);
      });
      reader.readAsDataURL(acceptedFiles[0]);
    }
  };
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

export default memo((props) => {
  const dispatch = useDispatch();

  const _props = {
    loadOriginalImage: (params) => {
      dispatch(loadOriginalImage(params));
    },
    setImageName: (name) => {
      dispatch(setImage(name));
    },
    ...props,
  };
  return <Loader {..._props} />;
});

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
