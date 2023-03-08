/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { useConfigOption } from "../../hook/useConfigOption";
import FixedConfig from "./FixedConfig";
import EasingConfig from "./FromTo/EasingConfig";
import FromToConfig from "./FromToConfig";
import { Header } from "./Header";

export default function SinCosConfig({ type, name, config, update }) {
  const hasOption = () => {
    // sincosは常に何らかの設定があるので
    return true;
  };
  const reset = () => {};
  const { headerProps, optionProps } = useConfigOption(hasOption, reset);

  return (
    <div>
      <Header name={name} isValid={true} {...headerProps} />
      <div css={styles.wrapper} data-testid="sincos-config-wrapper">
        <div css={styles.title}>
          <p css={styles.p} data-testid="sincos-config-title">
            <b>A</b>+<b>B</b>
            {config.easing}((2π/<b>C</b>)t+<b>D</b>)
          </p>
          <EasingConfig type={type} config={config} update={update} />
        </div>
        <Options
          type={type}
          config={config.trig}
          update={update}
          {...optionProps}
        />
      </div>
    </div>
  );
}

function Options({ type, config, update, isOption }) {
  const { t } = useTranslation();
  if (isOption) {
    return (
      <div data-testid="sincos-config-options">
        <Params
          name={`A. ${t("configs.trig.center")}`}
          type={`${type}.trig.center`}
          config={config.center}
          update={update}
        />
        <Params
          name={`B. ${t("configs.trig.amp")}`}
          type={`${type}.trig.amp`}
          config={config.amp}
          update={update}
        />
        <Params
          name={`C. ${t("configs.trig.cycle")}`}
          type={`${type}.trig.cycle`}
          config={config.cycle}
          update={update}
          isHideEasing={true}
        />
        <Params
          name={`D. ${t("configs.trig.start.name")}`}
          note={t("configs.trig.start.note")}
          type={`${type}.trig.start`}
          config={config.start}
          update={update}
          isHideEasing={true}
        />
      </div>
    );
  }
}

function Params({ name, note, type, config, update, isHideEasing }) {
  return (
    <div css={styles.params}>
      {config.easing === "fixed" ? (
        <FixedConfig
          name={name}
          note={note}
          type={type}
          config={config}
          update={update}
          isSub={true}
          isHideEasing={isHideEasing}
        />
      ) : (
        <FromToConfig
          name={name}
          note={note}
          type={type}
          config={config}
          update={update}
          isSub={true}
        />
      )}
    </div>
  );
}

const styles = {
  wrapper: css`
    margin: 0 0.5em;
  `,
  label: css`
    margin-right: 0.5em;
  `,
  number: css`
    width: 3em;
  `,
  error: css`
    color: #b71c1c;
  `,
  title: css`
    display: flex;
    justify-content: space-around;
  `,
  p: css`
    margin: 0;
    font-size: 1.2em;
  `,
  params: css`
    margin-left: 0.5em;
  `,
};
