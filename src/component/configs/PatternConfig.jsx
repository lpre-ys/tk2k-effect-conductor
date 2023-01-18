/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect } from "react";
import { useCallback } from "react";
import { memo } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useConfigOption } from "../../hook/useConfigOption";
import { updatePattern } from "../../slice/celListSlice";
import { Header } from "./Header";
import { Options } from "./Pattern/Options";
import PatternImage from "./Pattern/PatternImage";

export function PatternConfig({ config, update }) {
  const [start, setStart] = useState(config.start);
  const [end, setEnd] = useState(config.end);
  const [isRoundTrip, setIsRoundTrip] = useState(config.isRoundTrip);
  const [align, setAlign] = useState(config.align);
  const [isCustom, setIsCustom] = useState(config.isCustom);
  const [customPattern, setCustomPattern] = useState(
    config.customPattern ? config.customPattern.join(",") : ""
  );
  const { t } = useTranslation();

  const hasOption = () => {
    return config.isCustom;
  };
  const reset = () => {
    setStart(config.start);
    setEnd(config.end);
    setCustomPattern(config.customPattern.join(","));
  };
  const { isValidOption, headerProps, optionProps } = useConfigOption(
    hasOption,
    reset
  );

  const validateStart = (start, end) => {
    const num = parseInt(start);
    return validate(num);
  };
  const validateEnd = (start, end) => {
    const num = parseInt(end);
    return validate(num);
  };
  const validateCustomPattern = (pattern) => {
    const joined = pattern.replace(/\n/g, ",");
    if (!/^[0-9, ]*$/.test(joined)) {
      return false;
    }
    return joined.split(",").every((elem) => {
      const trimed = elem.trim();
      if (trimed === "") {
        // 空文字の場合スキップするので、ここではtrueにしておく
        return true;
      }
      const num = parseInt(trimed);
      return !Number.isNaN(num) && num > 0 && num < 26;
    });
  };

  const validateConfig = useCallback(({ start, end }) => {
    return validateStart(start, end) && validateEnd(start, end);
  }, []);

  function isChangeConfig(newConfig, oldConfig) {
    return (
      newConfig.start !== oldConfig.start ||
      newConfig.end !== oldConfig.end ||
      newConfig.isRoundTrip !== oldConfig.isRoundTrip ||
      newConfig.align !== oldConfig.align ||
      newConfig.isCustom !== oldConfig.isCustom ||
      JSON.stringify(newConfig.customPattern) !==
        JSON.stringify(oldConfig.customPattern)
    );
  }

  useEffect(() => {
    // バリデーションNGの場合、更新しない
    if (!validateCustomPattern(customPattern)) {
      return;
    }
    // customPattern をArrayに変換
    const arrayCustomPattern = customPattern
      .replace(/\n/g, ",")
      .split(",")
      .map((elem) => {
        return parseInt(elem.trim());
      })
      .filter((elem) => {
        return !Number.isNaN(elem);
      });

    const newConfig = {
      start: parseInt(start),
      end: parseInt(end),
      isRoundTrip,
      align,
      isCustom,
      customPattern: arrayCustomPattern,
    };
    if (validateConfig(newConfig) && isChangeConfig(newConfig, config)) {
      update(newConfig);
    }
  }, [
    start,
    end,
    isRoundTrip,
    align,
    update,
    validateConfig,
    config,
    customPattern,
    isCustom,
  ]);

  const alignList = {
    loop: t("configs.pattern.loop"),
    even: t("configs.pattern.even"),
    start: t("configs.pattern.head"),
    end: t("configs.pattern.last"),
    center: t("configs.pattern.center"),
  };

  return (
    <div>
      <Header
        name={t("configs.pattern.label")}
        isValid={
          validateConfig({ start, end }) &&
          validateCustomPattern(customPattern) &&
          isValidOption
        }
        {...headerProps}
      />
      <div css={styles.container}>
        <PatternImage config={config} />
        <div css={styles.wrapper}>
          <div>
            <label css={[styles.label, styles.alignList]}>
              <select
                value={align}
                onChange={({ target }) => {
                  setAlign(target.value);
                }}
              >
                {Object.keys(alignList).map((key) => {
                  return (
                    <option value={key} key={key}>
                      {alignList[key]}
                    </option>
                  );
                })}
              </select>
            </label>
            <label css={[styles.label, styles.checkbox]}>
              <input
                name="round-trip"
                data-testid="from-to-options-round-trip"
                type="checkbox"
                checked={isRoundTrip}
                value="true"
                onChange={({ target }) => {
                  setIsRoundTrip(target.checked);
                }}
              />
              :&nbsp;{t("configs.roundTrip")}
            </label>
          </div>
          <div>
            <label css={styles.label}>
              {t("configs.pattern.start")}:&nbsp;
              <input
                type="number"
                data-testid="pattern-config-start"
                css={[
                  styles.number,
                  !validateStart(start, end) && styles.error,
                ]}
                value={start}
                onChange={({ target }) => {
                  setStart(target.value);
                }}
                disabled={isCustom}
              />
            </label>
            <br />
            <label css={styles.label}>
              {t("configs.pattern.end")}:&nbsp;
              <input
                type="number"
                data-testid="pattern-config-end"
                css={[styles.number, !validateEnd(start, end) && styles.error]}
                value={end}
                onChange={({ target }) => {
                  setEnd(target.value);
                }}
                disabled={isCustom}
              />
            </label>
          </div>
        </div>
      </div>
      <Options
        isCustom={isCustom}
        setIsCustom={setIsCustom}
        customPattern={customPattern}
        setCustomPattern={setCustomPattern}
        {...optionProps}
      />
    </div>
  );
}

export default memo((props) => {
  const config = useSelector(
    (state) => state.celList.list[state.celList.celIndex].pattern
  );
  const dispatch = useDispatch();
  const _props = {
    config,
    update: (newConfig) => {
      dispatch(updatePattern(newConfig));
    },
    ...props,
  };

  return <PatternConfig {..._props} />;
});

const styles = {
  container: css`
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin: 0.5em;
  `,
  wrapper: css`
    display: flex;
    height: 90px;
    flex-direction: column;
    justify-content: space-between;
  `,
  number: css`
    width: 3em;
    :disabled {
      text-decoration-line: line-through;
    }
  `,
  error: css`
    color: #b71c1c;
  `,
  exIcon: css`
    color: #b71c1c;
    cursor: pointer;
    margin-left: 0.2em;
    width: 1em;
    :hover {
      font-size: 1.1em;
      color: #e53935;
    }
  `,
  label: css`
    user-select: none;
  `,
  checkbox: css`
    cursor: pointer;
  `,
  alignList: css`
    margin-right: 1em;
  `,
};

// 共通のバリデーション
function validate(num) {
  // 数字に出来ないならダメ
  if (Number.isNaN(num)) {
    return false;
  }
  // 範囲チェック
  if (num < 1) {
    return false;
  }
  if (num > 25) {
    return false;
  }
  return true;
}
