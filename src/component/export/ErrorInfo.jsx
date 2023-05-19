/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";

const ErrorInfo = () => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(true);
  if (isShow) {
    return (
      <div css={styles.container} data-testid="export-error-info">
        <div>
          <p css={styles.msg}>
            <Trans i18nKey="export.error.message" />
          </p>
          <a
            href="https://github.com/lpre-ys/tk2k-effect-conductor/blob/main/doc/security.md"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faLink} css={styles.linkIcon} />
            {t("export.error.link")}
          </a>
        </div>
        <div
          css={styles.closeIcon}
          data-testid="export-error-info-close"
          onClick={() => {
            setIsShow(false);
          }}
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </div>
      </div>
    );
  }
};

export default ErrorInfo;

const styles = {
  container: css`
    font-size: 0.9rem;
    border: 1px solid #b71c1c;
    color: #b71c1c;
    border-radius: 0.2em;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0.8rem;
    background-color: #ffebee;
    display: flex;
    justify-content: space-between;
  `,
  msg: css`
    margin-top: 0;
    margin-bottm: 1em;
  `,
  closeIcon: css`
    font-size: 1rem;
    cursor: pointer;
    color: #424242;
  `,
  linkIcon: css`
    color: #424242;
  `,
};
