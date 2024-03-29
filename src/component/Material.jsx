/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { memo, useState } from "react";
import Loader from "./material/Loader";
import Patterns from "./material/Patterns";
import MaterialImage from "./material/MaterialImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export function Material({ originalImage, trImage }) {
  const [isShowImage, setIsShowImage] = useState(false);
  const [msg, setMsg] = useState("");
  const { t } = useTranslation();

  return (
    <div className="material" css={styles.component}>
      <h1 css={styles.header}>{t("material.header")}</h1>
      <section css={styles.loader} className="loader">
        <Loader setMsg={setMsg} />
        {originalImage && (
          <>
            <button
              type="button"
              css={[styles.loaderButton, isShowImage && styles.loaderButtonOn]}
              onClick={() => {
                setIsShowImage(!isShowImage);
              }}
              data-testid="material-toggle-is-show-image"
            >
              <FontAwesomeIcon icon={faImage} css={styles.icon} />
              {t("material.preview")}
            </button>
            <MaterialImage isShow={isShowImage}></MaterialImage>
          </>
        )}
      </section>
      {msg && (
        <p css={styles.msg} data-testid="material-msg">
          {msg}
        </p>
      )}
      {trImage && (
        <>
          <section className="patterns">
            <h2>{t("material.pattern")}</h2>
            <Patterns />
          </section>
        </>
      )}
    </div>
  );
}

export default memo((props) => {
  const originalImage = useSelector((state) => state.material.originalImage);
  const trImage = useSelector((state) => state.material.trImage);
  const _props = {
    originalImage,
    trImage,
    ...props,
  };

  return <Material {..._props} />;
});

const styles = {
  component: css`
    padding: 0 1em;
  `,
  loaderButton: css`
    border: none;
    padding: 0.3em 0.8em 0.3em 1.8em;
    margin: 0.5em 0.3em 0.3em;
    text-align: center;
    text-decoration: none;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    background: #e0e0e0;
    color: #424242;
    :hover {
      background-color: #757575;
      color: #fafafa;
    }
  `,
  loaderButtonOn: css`
    background-color: #9e9e9e;
    color: #fafafa;
  `,
  icon: css`
    position: absolute;
    top: 0.4em;
    left: 0.6em;
  `,
  header: css`
    width: 200px;
  `,
  loader: css`
    margin-bottom: 1rem;
  `,
  msg: css`
    width: 14em;
  `,
};
