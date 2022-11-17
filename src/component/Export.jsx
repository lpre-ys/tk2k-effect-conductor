/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImage, setTitle } from "../slice/infoSlice";
import getDataByLocalFrame from "../util/calcFrameValue";

export const Export = ({
  maxFrame,
  configList,
  title,
  imageName,
  setTitle,
  setImage,
}) => {
  console.log("RENDER: Export");
  const [disabled, setDisabled] = useState(false);

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
      const result = configList
        .map((celConfig) => {
          const end = celConfig.frame.start + celConfig.frame.volume;
          if (celConfig.frame.start - 1 <= i && end - 1 > i) {
            const localFrame = i - celConfig.frame.start + 1;
            const cel = getDataByLocalFrame(localFrame, celConfig);
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
      .writeData({ frameList, title, materialName: imageName })
      .then(() => {
        setDisabled(false);
      });
  }, [configList, maxFrame, title, imageName]);
  return (
    <div css={styles.container}>
      <label>
        名前:&nbsp;
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
        素材ファイル:&nbsp;
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
    </div>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const maxFrame = useSelector((state) => state.frame.maxFrame);
  const configList = useSelector((state) => state.celList.list);
  const title = useSelector((state) => state.info.title);
  const imageName = useSelector((state) => state.info.image);
  const dispatch = useDispatch();
  const _props = {
    maxFrame,
    configList,
    title,
    imageName,
    dispatch,
    setTitle: (value) => {
      dispatch(setTitle(value));
    },
    setImage: (value) => {
      dispatch(setImage(value));
    },
    ...props,
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
  label: css``,
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
