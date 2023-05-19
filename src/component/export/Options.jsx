/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faPaste } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faAngleRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  clearRawEffect,
  loadFromTk2k,
  setTarget,
  setYLine,
} from "../../slice/infoSlice";
import Tips from "./Tips";

export const Options = ({
  target,
  yLine,
  rawEffect,
  loadFromTk2k,
  clearRawEffect,
  setTarget,
  setYLine,
}) => {
  const [isShowOption, setIsShowOption] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { t } = useTranslation();

  const handleReadInfo = () => {
    if (
      window.tk2k === undefined ||
      typeof window.tk2k.readInfo !== "function"
    ) {
      return;
    }
    setIsDisabled(true);
    window.tk2k
      .readInfo()
      .then((result) => {
        loadFromTk2k(result);
        setIsDisabled(false);
      })
      .catch(() => {
        setIsDisabled(false);
      });
  };
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsShowOption(!isShowOption);
        }}
        css={styles.optionButton}
      >
        {isShowOption ? (
          <FontAwesomeIcon icon={faAngleDown} css={styles.icon} />
        ) : (
          <FontAwesomeIcon icon={faAngleRight} css={styles.icon} />
        )}
        {t("export.option")}
      </button>
      {isShowOption && (
        <div css={styles.optionContainer}>
          <div css={styles.loadContainer}>
            {isDisabled ? (
              <button css={styles.disabledLoadButton}>
                <FontAwesomeIcon
                  icon={faSpinner}
                  css={styles.icon}
                  className="fa-spin"
                />
                Loading...
              </button>
            ) : (
              <button css={styles.loadButton} onClick={handleReadInfo}>
                <FontAwesomeIcon icon={faPaste} css={styles.icon} />
                {t("export.load")}
              </button>
            )}
            <Tips />
          </div>
          <label>
            {t("export.target.label")}:&nbsp;
            <select
              value={target}
              onChange={({ target }) => {
                setTarget(target.value);
              }}
            >
              <option value="0">{t("export.target.single")}</option>
              <option value="1">{t("export.target.screen")}</option>
            </select>
          </label>
          <label>
            {t("export.yLine.label")}:&nbsp;
            <select
              value={yLine}
              onChange={({ target }) => {
                setYLine(target.value);
              }}
            >
              <option value="0">{t("export.yLine.head")}</option>
              <option value="1">{t("export.yLine.center")}</option>
              <option value="2">{t("export.yLine.feet")}</option>
            </select>
          </label>
          <span>
            {t("export.seFlash.label")}:&nbsp;
            {!!rawEffect ? (
              <>
                {t("export.seFlash.on")}
                <span
                  css={styles.clear}
                  onClick={() => {
                    clearRawEffect();
                  }}
                >
                  {t("export.seFlash.clear")}
                </span>
              </>
            ) : (
              <>{t("export.seFlash.off")}</>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const target = useSelector((state) => state.info.target);
  const yLine = useSelector((state) => state.info.yLine);
  const rawEffect = useSelector((state) => state.info.rawEffect);
  const dispatch = useDispatch();
  const _props = {
    target,
    yLine,
    rawEffect,
    loadFromTk2k: (value) => {
      dispatch(loadFromTk2k(value));
    },
    clearRawEffect: () => {
      dispatch(clearRawEffect());
    },
    setTarget: (value) => {
      dispatch(setTarget(value));
    },
    setYLine: (value) => {
      dispatch(setYLine(value));
    },
    ...props,
  };
  return <Options {..._props} />;
};

const styles = {
  optionContainer: css`
    margin-left: 0.5em;
    font-size: 0.9rem;
    label {
      margin-right: 0.5em;
    }
  `,
  icon: css`
    position: absolute;
    font-size: 1.1em;
    top: 0.4em;
    left: 0.5em;
  `,

  optionButton: css`
    background-color: #ffffff;
    border: none;
    color: #424242;
    padding: 0.4em 0.7em 0.5em 1.8em;
    font-size: 0.8rem;
    text-align: center;
    text-decoration: none;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    :hover {
      background-color: #e1f5fe;
    }
  `,
  loadButton: css`
    background-color: #2196f3;
    border: none;
    color: #fafafa;
    padding: 0.4em 0.7em 0.5em 1.8em;
    text-align: center;
    text-decoration: none;
    font-weight: bold;
    width: 15.5em;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    :hover {
      background-color: #0277bd;
    }
  `,
  disabledLoadButton: css`
    background-color: #9e9e9e;
    border: none;
    color: #fafafa;
    padding: 0.4em 0.7em 0.5em 1.8em;
    text-align: center;
    text-decoration: none;
    font-weight: bold;
    width: 15.5em;
    border-radius: 4px;
    position: relative;
    cursor: not-allowed;
  `,
  loadContainer: css`
    padding-bottom: 0.2em;
    position: relative;
  `,
  clear: css`
    text-decoration: underline;
    text-decoration-color: #1e88e5;
    cursor: pointer;
    margin-left: 0.5em;
  `,
};
