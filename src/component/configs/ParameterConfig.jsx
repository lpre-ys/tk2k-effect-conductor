/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import FixedConfig from "./FixedConfig";
import FromToConfig from "./FromToConfig";
import SinCosConfig from "./SinCosConfig";

export function ParameterConfig({ name, type, easing }) {
  const returnConfig = () => {
    if (easing === "fixed") {
      return <FixedConfig name={name} type={type} />;
    }
    if (["sin", "cos"].includes(easing)) {
      return <SinCosConfig name={name} type={type} />;
    }
    return <FromToConfig name={name} type={type} />;
  };
  return <div css={styles.wrapper}>{returnConfig()}</div>;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const easing = useSelector(
    (state) => state.celList.list[state.celList.celIndex][props.type].easing
  );
  const _props = {
    easing,
    ...props,
  };
  return <ParameterConfig {..._props} />;
};

const styles = {
  type: css`
    position: absolute;
    right: 0.5em;
    top: 2px;
    display: block;
  `,
  wrapper: css`
    position: relative;
  `,
};
