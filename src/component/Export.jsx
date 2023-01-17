/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImage, setTitle } from "../slice/infoSlice";
import ErrorInfo from "./export/ErrorInfo";
import Options from "./export/Options";
import calcFrameValue from "../util/calcFrameValue";
import { useTranslation } from "react-i18next";

export const Export = ({
  maxFrame,
  configList,
  title,
  imageName,
  info,
  setTitle,
  setImage,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [errorMsgKey, setErrorMsgKey] = useState(false);
  const { t } = useTranslation();

  const handleExport = useCallback(() => {
    if (
      window.tk2k === undefined ||
      typeof window.tk2k.writeData !== "function"
    ) {
      return;
    }
    setDisabled(true);
    const frameList = [];
    for (let i = 0; i < maxFrame; i++) {
      // 基本データ作成
      const result = [...configList]
        .reverse()
        .map((celConfig) => {
          const cel = calcFrameValue(i, maxFrame, celConfig);
          if (cel) {
            cel.pageIndex += 1;
            return cel;
          } else {
            return null;
          }
        })
        .filter((value) => {
          return !!value;
        });

      frameList.push(result);
    }
    window.tk2k
      .writeData({ frameList, info })
      .then((result) => {
        setDisabled(false);
        if (result) {
          setErrorMsgKey(false);
        } else {
          setErrorMsgKey(Date.now());
        }
      })
      .catch((error) => {
        setDisabled(false);
      });
  }, [configList, maxFrame, info]);

  return (
    <div css={styles.container}>
      {errorMsgKey && <ErrorInfo key={errorMsgKey} />}
      <label>
        {t("export.name")}:&nbsp;
        <input
          type="text"
          value={title}
          css={styles.input}
          onChange={({ currentTarget }) => {
            setTitle(currentTarget.value);
          }}
        />
      </label>
      <label>
        {t("export.file")}:&nbsp;
        <input
          type="text"
          value={imageName}
          css={styles.input}
          onChange={({ currentTarget }) => {
            setImage(currentTarget.value);
          }}
        />
      </label>
      <button
        css={[styles.exportButton, disabled && styles.disabled]}
        type="button"
        onClick={handleExport}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={faCopy} css={styles.icon} />
        COPY!!
      </button>
      <Options />
    </div>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const maxFrame = useSelector((state) => state.frame.maxFrame);
  const configList = useSelector((state) => state.celList.list);
  const title = useSelector((state) => state.info.title);
  const imageName = useSelector((state) => state.info.image);
  const info = useSelector((state) => state.info);
  const dispatch = useDispatch();
  const _props = {
    maxFrame,
    configList,
    title,
    imageName,
    info,
    dispatch,
    setTitle: (value) => {
      dispatch(setTitle(value));
    },
    setImage: (value) => {
      dispatch(setImage(value));
    },
  };

  return <Export {..._props} />;
};

const styles = {
  container: css`
    margin: 0.5em 0.5em 0;
    padding-bottom: 1em;
    label {
      margin-right: 0.5em;
    }
    border-bottom: 1px dotted #9e9e9e;
  `,
  input: css`
    width: 10.5rem;
  `,
  exportButton: css`
    background-color: #388e3c;
    border: none;
    color: #fafafa;
    padding: 0.4em 0.7em 0.5em 1.8em;
    text-align: center;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    :hover {
      background-color: #1b5e20;
    }
  `,
  disabled: css`
    background-color: #9e9e9e;
    color: #fafafa;
    cursor: not-allowed;
    :hover {
      background-color: #9e9e9e;
      color: #fafafa;
    }
  `,
  icon: css`
    position: absolute;
    font-size: 1.1em;
    top: 0.4em;
    left: 0.5em;
  `,
};
