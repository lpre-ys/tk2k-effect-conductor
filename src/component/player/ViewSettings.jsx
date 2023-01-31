/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { memo, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setBgColor, setBgImage, setZoom } from "../../slice/playerSlice";
import ColorPicker from "../form/ColorPicker";

export function ViewSettings({
  bgColor,
  setBgColor,
  setBgImage,
  isShowCelBorder,
  setIsShowCelBorder,
  zoom,
  setZoom,
}) {
  const { t } = useTranslation();
  return (
    <div css={styles.container}>
      <div css={styles.wrapper}>
        <div css={styles.bgWrapper}>
          <ColorPicker
            label={t("player.bgColor")}
            color={bgColor}
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
          <label css={styles.label}>
            {t("player.zoom")}:&nbsp;
            <select
              value={zoom}
              onChange={({ target }) => {
                setZoom(target.value);
              }}
            >
              <option value={2} key={2}>
                2x
              </option>
              <option value={1} key={1}>
                1x
              </option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

export default memo((props) => {
  const bgColor = useSelector((state) => state.player.bgColor);
  const zoom = useSelector((state) => state.player.zoom);

  const dispatch = useDispatch();
  const _props = {
    setBgColor: (value) => {
      dispatch(setBgColor(value));
    },
    setBgImage: (value) => {
      dispatch(setBgImage(value));
    },
    setZoom: (value) => {
      dispatch(setZoom(value));
    },
    bgColor,
    zoom,
    ...props,
  };

  return <ViewSettings {..._props} />;
});

function BgImage({ setBgImage }) {
  const { t, i18n } = useTranslation();

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
    <div
      css={styles.loader}
      style={{ width: `${i18n.language === "en" ? 200 : 250}px` }}
    >
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
