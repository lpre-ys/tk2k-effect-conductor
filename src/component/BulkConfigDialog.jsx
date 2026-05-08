/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { bulkUpdateParams } from "../slice/celListSlice";

const PARAMS = [
  { key: "x",       labelKey: "configs.x",                  section: "basic" },
  { key: "y",       labelKey: "configs.y",                  section: "basic" },
  { key: "scale",   labelKey: "configs.scale",              section: "basic" },
  { key: "opacity", labelKey: "configs.opacity",            section: "basic" },
  { key: "red",     labelKey: "configs.color.red",          section: "color", colorMode: "rgb" },
  { key: "green",   labelKey: "configs.color.green",        section: "color", colorMode: "rgb" },
  { key: "blue",    labelKey: "configs.color.blue",         section: "color", colorMode: "rgb" },
  { key: "hue",     labelKey: "configs.color.hsvHue",       section: "color", colorMode: "hsv" },
  { key: "sat",     labelKey: "configs.color.hsvSat",       section: "color", colorMode: "hsv" },
  { key: "val",     labelKey: "configs.color.hsvVal",       section: "color", colorMode: "hsv" },
  { key: "tkSat",   labelKey: "configs.color.satulation",   section: "color", colorMode: "always" },
];

const UPDATE_TYPES = ["overwrite", "add", "multiply"];

const getDefaultValue = (updateType) => (updateType === "multiply" ? 1 : 0);

const makeInitialParamState = (updateType) =>
  Object.fromEntries(
    PARAMS.map(({ key }) => [key, { enabled: false, value: String(getDefaultValue(updateType)) }])
  );

export default function BulkConfigDialog({ onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const celList = useSelector((state) => state.celList.list);
  const selectedIndices = useSelector((state) => state.celList.selectedIndices);

  const hsvMode = useMemo(() => {
    const flags = selectedIndices
      .map((i) => celList[i])
      .filter(Boolean)
      .map((cel) => cel.hsv?.isHsv ?? false);
    if (flags.length === 0) return "rgb";
    if (flags.every((f) => f === true))  return "hsv";
    if (flags.every((f) => f === false)) return "rgb";
    return "mixed";
  }, [celList, selectedIndices]);

  const [updateType, setUpdateType] = useState("overwrite");
  const [paramState, setParamState] = useState(() => makeInitialParamState("overwrite"));

  const handleUpdateTypeChange = (type) => {
    const defaultValue = String(getDefaultValue(type));
    setUpdateType(type);
    setParamState((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, v]) => [key, { ...v, value: defaultValue }])
      )
    );
  };

  const handleToggleEnabled = (key) => {
    setParamState((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const handleValueChange = (key, raw) => {
    setParamState((prev) => ({
      ...prev,
      [key]: { ...prev[key], value: raw },
    }));
  };

  const handleApply = () => {
    const activeKeys = new Set(
      PARAMS
        .filter((p) => {
          if (!p.colorMode) return true;
          if (p.colorMode === "always") return true;
          if (p.colorMode === "rgb" && hsvMode === "rgb") return true;
          if (p.colorMode === "hsv" && hsvMode === "hsv") return true;
          return false;
        })
        .map((p) => p.key)
    );
    const params = {};
    for (const [key, { enabled, value }] of Object.entries(paramState)) {
      if (!activeKeys.has(key)) continue;
      if (enabled) {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) params[key] = parsed;
      }
    }
    if (Object.keys(params).length > 0) {
      dispatch(bulkUpdateParams({ indices: selectedIndices, params, updateType }));
    }
    onClose();
  };

  const basicParams = PARAMS.filter((p) => p.section === "basic");
  const colorParams = PARAMS.filter((p) => {
    if (p.section !== "color") return false;
    if (!p.colorMode || p.colorMode === "always") return true;
    if (p.colorMode === "rgb" && hsvMode === "rgb") return true;
    if (p.colorMode === "hsv" && hsvMode === "hsv") return true;
    return false;
  });

  return (
    <div css={styles.overlay} onMouseDown={onClose} data-testid="bulk-config-overlay">
      <div css={styles.dialog} onMouseDown={(e) => e.stopPropagation()}>
        <h2 css={styles.title}>{t("bulkConfigDialog.title")}</h2>

        <div css={styles.updateTypeRow}>
          {UPDATE_TYPES.map((type) => (
            <button
              key={type}
              css={[styles.typeButton, updateType === type && styles.typeButtonActive]}
              onClick={() => handleUpdateTypeChange(type)}
            >
              {t(`bulkConfigDialog.${type}`)}
            </button>
          ))}
        </div>

        <div css={styles.section}>
          <p css={styles.sectionLabel}>{t("bulkConfigDialog.basic")}</p>
          {basicParams.map(({ key, labelKey }) => (
            <ParamRow
              key={key}
              label={t(labelKey)}
              state={paramState[key]}
              onToggle={() => handleToggleEnabled(key)}
              onChange={(raw) => handleValueChange(key, raw)}
            />
          ))}
        </div>

        <div css={styles.section}>
          <p css={styles.sectionLabel}>{t("bulkConfigDialog.color")}</p>
          {hsvMode === "mixed" && (
            <p css={styles.mixedMessage}>{t("bulkConfigDialog.hsvMixed")}</p>
          )}
          {colorParams.map(({ key, labelKey }) => (
            <ParamRow
              key={key}
              label={t(labelKey)}
              state={paramState[key]}
              onToggle={() => handleToggleEnabled(key)}
              onChange={(raw) => handleValueChange(key, raw)}
            />
          ))}
        </div>

        <div css={styles.footer}>
          <button css={[styles.footerButton, styles.applyButton]} onClick={handleApply}>
            {t("bulkConfigDialog.apply")}
          </button>
          <button css={styles.footerButton} onClick={onClose}>
            {t("bulkConfigDialog.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ParamRow({ label, state, onToggle, onChange }) {
  return (
    <label css={styles.paramRow}>
      <input
        type="checkbox"
        checked={state.enabled}
        onChange={onToggle}
        css={styles.checkbox}
      />
      <span css={styles.paramLabel}>{label}</span>
      <input
        type="number"
        value={state.value}
        disabled={!state.enabled}
        onChange={(e) => onChange(e.target.value)}
        css={styles.input}
      />
    </label>
  );
}

const styles = {
  overlay: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `,
  dialog: css`
    background: #fafafa;
    border-radius: 8px;
    padding: 1.5em;
    min-width: 260px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  `,
  title: css`
    margin: 0 0 1em;
    font-size: 1.1rem;
    color: #212121;
  `,
  updateTypeRow: css`
    display: flex;
    gap: 0.3em;
    margin-bottom: 1em;
  `,
  typeButton: css`
    border: 1px solid #bdbdbd;
    padding: 0.3em 0.8em;
    font-size: 0.9rem;
    border-radius: 4px;
    cursor: pointer;
    background: #e0e0e0;
    color: #424242;
    :hover {
      background: #757575;
      color: #fafafa;
    }
  `,
  typeButtonActive: css`
    background: #546e7a;
    color: #fafafa;
    border-color: #546e7a;
    :hover {
      background: #455a64;
    }
  `,
  section: css`
    margin-bottom: 0.8em;
  `,
  sectionLabel: css`
    margin: 0 0 0.4em;
    font-size: 0.8rem;
    font-weight: bold;
    color: #616161;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.2em;
  `,
  paramRow: css`
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin: 0.3em 0;
    cursor: pointer;
  `,
  checkbox: css`
    cursor: pointer;
  `,
  paramLabel: css`
    width: 4em;
    font-size: 0.9rem;
    color: #424242;
  `,
  input: css`
    width: 6em;
    padding: 0.2em 0.4em;
    font-size: 0.9rem;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
    :disabled {
      background: #eeeeee;
      color: #9e9e9e;
      cursor: not-allowed;
    }
  `,
  footer: css`
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
    margin-top: 1em;
    border-top: 1px solid #e0e0e0;
    padding-top: 0.8em;
  `,
  footerButton: css`
    border: none;
    padding: 0.4em 1.2em;
    font-size: 0.95rem;
    border-radius: 4px;
    cursor: pointer;
    background: #e0e0e0;
    color: #424242;
    :hover {
      background: #757575;
      color: #fafafa;
    }
  `,
  applyButton: css`
    background: #546e7a;
    color: #fafafa;
    :hover {
      background: #455a64;
    }
  `,
  mixedMessage: css`
    margin: 0.3em 0;
    font-size: 0.8rem;
    color: #f57c00;
  `,
};
