/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import ColorPicker from "../form/ColorPicker";

export default function ViewSettings({
  background,
  setBgColor,
  setBgImage,
  isShowCelBorder,
  setIsShowCelBorder,
}) {
  const { t } = useTranslation();
  return (
    <div css={styles.container}>
      <div css={styles.wrapper}>
        <div css={styles.bgWrapper}>
          <ColorPicker
            label={t("player.bgColor")}
            color={background}
            setColor={setBgColor}
          />
          <BgImage setBgImage={setBgImage} />
          <button
            type="button"
            onClick={() => {
              setBgImage(null);
              setBgColor("transparent");
            }}
          >
            {t("player.clear")}
          </button>
          <label css={styles.label}>
            {t("player.border")}:&nbsp;
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
  const { t } = useTranslation();

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
    <div css={styles.loader}>
      <div {...getRootProps()}>
        <input data-testid="drop-player-bg-image" {...getInputProps()} />
        {t("player.bgImage")}
      </div>
    </div>
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
