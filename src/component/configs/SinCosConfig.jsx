/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useConfigOption } from "../../hook/useConfigOption";
import FixedConfig from "./FixedConfig";
import EasingConfig from "./FromTo/EasingConfig";
import FromToConfig from "./FromToConfig";
import { Header } from "./Header";

export function SinCosConfig({ type, name, config, isSub }) {
  const hasOption = () => {
    // sincosは常に何らかの設定があるので
    return true;
  };
  const reset = () => {};
  const { headerProps, optionProps } = useConfigOption(hasOption, reset);

  return (
    <div>
      <Header name={name} isValid={true} isSub={isSub} {...headerProps} />
      <div css={styles.wrapper} data-testid="sincos-config-wrapper">
        <div css={styles.title}>
          <p css={styles.p} data-testid="sincos-config-title">
            <b>A</b>+<b>B</b>
            {config.easing}((2π/<b>C</b>)t+<b>D</b>)
          </p>
          <EasingConfig type={type} />
        </div>
        <Options type={type} config={config.trig} {...optionProps} />
      </div>
    </div>
  );
}

function Options({ type, config, isOption }) {
  const { t } = useTranslation();
  if (isOption) {
    return (
      <div data-testid="sincos-config-options">
        <Params
          name={`A. ${t("configs.trig.center")}`}
          type={`${type}.trig.center`}
          easing={config.center.easing}
        />
        <Params
          name={`B. ${t("configs.trig.amp")}`}
          type={`${type}.trig.amp`}
          easing={config.amp.easing}
        />
        <Params
          name={`C. ${t("configs.trig.cycle")}`}
          type={`${type}.trig.cycle`}
          easing={config.cycle.easing}
          isHideEasing={true}
        />
        <Params
          name={`D. ${t("configs.trig.start.name")}`}
          note={t("configs.trig.start.note")}
          type={`${type}.trig.start`}
          easing={config.start.easing}
          isHideEasing={true}
        />
      </div>
    );
  }
}

function Params({ name, note, type, easing, isHideEasing }) {
  return (
    <div css={styles.params}>
      {easing === "fixed" ? (
        <FixedConfig
          name={name}
          note={note}
          type={type}
          isSub={true}
          isHideEasing={isHideEasing}
        />
      ) : (
        <FromToConfig name={name} note={note} type={type} isSub={true} />
      )}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const config = useSelector((state) => {
    const cel = state.celList.list[state.celList.celIndex];
    // SinCosにはtrigが来る事は無いので
    return cel[props.type];
  });
  const _props = {
    config,
    ...props,
  };
  return <SinCosConfig {..._props} />;
};

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
