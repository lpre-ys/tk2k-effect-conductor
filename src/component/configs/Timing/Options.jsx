/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useTranslation } from "react-i18next";
export function Options({
  isOption,
  isHideLast,
  setIsHideLast,
  isLoopBack,
  setIsLoopBack,
}) {
  const { t } = useTranslation();
  if (isOption) {
    return (
      <div data-testid="configs-timing-options">
        <label css={[styles.label, styles.checkbox]}>
          <input
            name="is-hide-last"
            data-testid="timing-is-hide-last"
            type="checkbox"
            checked={isHideLast}
            value="true"
            onChange={({ target }) => {
              setIsHideLast(target.checked);
            }}
          />
          :&nbsp;{t("configs.timing.isHideLast")}
        </label>
        <label css={[styles.label, styles.checkbox]}>
          <input
            name="is-loop-back"
            data-testid="timing-is-hide-last"
            type="checkbox"
            checked={isLoopBack}
            value="true"
            onChange={({ target }) => {
              setIsLoopBack(target.checked);
            }}
          />
          :&nbsp;{t("configs.timing.loop")}
        </label>
      </div>
    );
  }
}

const styles = {
  label: css`
    margin-left: 1em;
    user-select: none;
  `,
  checkbox: css`
    cursor: pointer;
    display: block;
    padding-top: 0.3rem;
  `,
};
