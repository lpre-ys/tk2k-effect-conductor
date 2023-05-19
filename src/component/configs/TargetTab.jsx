/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faBook, faPalette } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
export default function TargetTab({ target, setTarget }) {
  const { t } = useTranslation();
  const targetList = {
    normal: { label: t("configs.tab.basic"), icon: faBook },
    color: { label: t("configs.tab.color"), icon: faPalette },
  };
  return (
    <div css={styles.container}>
      {Object.keys(targetList).map((key) => {
        const { label, icon } = targetList[key];
        return (
          <div
            data-testid="target-tab"
            css={[styles.tab, key === target && styles.selected]}
            key={key}
            onClick={() => {
              setTarget(key);
            }}
          >
            <FontAwesomeIcon icon={icon} css={styles.icon} />
            {label}
            {key === target && <div css={styles.deleteLine}></div>}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: css`
    margin-top: 1em;
    display: flex;
    border-bottom: 2px solid #00bcd4;
  `,
  tab: css`
    padding: 0.3em 1em 0.2em;
    margin-left: 0.5em;
    text-decoration: underline;
    text-align: center;
    border: 1px solid #00bcd4;
    background: #00bcd4;
    border-radius: 2px 2px 0 0;
    border-bottom: none;
    color: #fafafa;
    cursor: pointer;
    user-select: none;
  `,
  selected: css`
    text-decoration: none;
    text-width: bold;
    background: white;
    border-bottom: white 1px solid;
    color: #424242;
    cursor: default;
    position: relative;
  `,
  deleteLine: css`
    background: white;
    position: absolute;
    top: 1.6em;
    left: 0;
    width: 100%;
    height: 3px;
  `,
  icon: css`
    display: inline-box;
    margin-right: 0.2em;
  `,
};
