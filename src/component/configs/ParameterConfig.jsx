/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { updateByType } from "../../slice/celListSlice";
import { ConstConfig } from "./ConstConfig";
import FromToConfig from "./FromToConfig";

export function ParameterConfig({ name, type, config, update }) {
  const returnConfig = () => {
    if (config.easing === "fixed") {
      return (
        <ConstConfig name={name} type={type} config={config} update={update} />
      );
    } else {
      return (
        <FromToConfig name={name} type={type} config={config} update={update} />
      );
    }
  };
  return <div css={styles.wrapper}>{returnConfig()}</div>;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const config = useSelector(
    (state) => state.celList.list[state.celList.celIndex][props.type]
  );
  const dispatch = useDispatch();
  const _props = {
    config,
    update: (type, newConfig) => {
      dispatch(updateByType({ type, data: newConfig }));
    },
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
