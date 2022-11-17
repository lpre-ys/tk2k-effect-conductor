/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ViewSettings({
  background,
  setBgColor,
  setBgImage,
  isShowCelBorder,
  setIsShowCelBorder,
}) {
  console.log("RENDER: ViewSettings");

  return (
    <div css={styles.container}>
      <div css={styles.wrapper}>
        <div css={styles.bgWrapper}>
          <label>
            背景色:&nbsp;
            <input
              type="text"
              css={styles.input}
              value={background}
              onChange={({ target }) => {
                setBgColor(target.value);
              }}
            />
          </label>
          <BgImage setBgImage={setBgImage} />
          <label css={styles.label}>
            枠表示:&nbsp;
            <input
              type="checkbox"
              name="celBorder"
              checked={isShowCelBorder}
              value="true"
              onChange={({ target }) => {
                setIsShowCelBorder(target.checked);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function BgImage({ setBgImage }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 1) {
        const reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.addEventListener("load", () => {
          setBgImage(reader.result);
        });
      }
    },
    [setBgImage]
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
    <>
      <div css={styles.loader}>
        <div {...getRootProps()}>
          <input data-testid="drop-player-bg-image" {...getInputProps()} />
          背景画像設定
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          setBgImage(null);
        }}
      >
        クリア
      </button>
    </>
  );
}

const styles = {
  container: css`
    margin-top: 1em;
  `,
  header: css`
    width: 40%;
    position: relative;
    padding-left: 1em;
  `,
  headerIcon: css`
    position: absolute;
    top: 0.35em;
    left: 0;
    color: #0097a7;
  `,
  loader: css`
    width: 250px;
    height: 1/2em;
    border: 2px dotted black;
    text-align: center;
  `,
  wrapper: css`
    display: flex;
    flex-flow: column;
    gap: 0.2em;
    padding: 0 0.5em;
  `,

  bgWrapper: css`
    display: flex;
    align-items: center;
    gap: 0.5em;
  `,
  input: css`
    width: 6em;
  `,
  label: css`
    user-select: none;
    cursor: pointer;
  `,
};
