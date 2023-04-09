/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";

import PatternConfig from "./configs/PatternConfig";
import TimingConfig from "./configs/TimingConfig";
import ParameterConfig from "./configs/ParameterConfig";
import { setCelName } from "../slice/celListSlice";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function Configs({ name, setCelName }) {
  const [isInput, setIsInput] = useState(false);
  const { t } = useTranslation();
  const ref = useRef();

  useEffect(() => {
    if (isInput && ref.current) {
      ref.current.focus();
    }
  }, [isInput]);
  return (
    <div css={styles.container}>
      {isInput ? (
        <h1 css={styles.header}>
          <input
            type="text"
            value={name}
            css={styles.input}
            style={{ display: isInput ? "block" : "none" }}
            onBlur={() => {
              setIsInput(false);
            }}
            onChange={({ target }) => {
              setCelName(target.value);
            }}
            ref={ref}
          />
        </h1>
      ) : (
        <h1
          css={[styles.name, styles.header]}
          onClick={() => {
            setIsInput(true);
          }}
        >
          {name ? name : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
        </h1>
      )}
      <TimingConfig />
      <PatternConfig />
      <ParameterConfig type="x" name={t("configs.x")} />
      <ParameterConfig type="y" name={t("configs.y")} />
      <ParameterConfig type="scale" name={t("configs.scale")} />
      <ParameterConfig type="opacity" name={t("configs.opacity")} />
      {/* <FromToConfig type="y" name={t("configs.y")} />
      <FromToConfig type="scale" name={t("configs.scale")} />
      <FromToConfig type="opacity" name={t("configs.opacity")} /> */}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const name = useSelector(
    (state) => state.celList.list[state.celList.celIndex].name
  );
  const dispatch = useDispatch();

  const _props = {
    name,
    setCelName: (value) => {
      dispatch(setCelName(value));
    },

    ...props,
  };

  return <Configs {..._props} />;
};

const styles = {
  container: css`
    flex-grow: 1;
    padding: 0 1em;
    height: 710px;
    overflow-y: scroll;
  `,
  name: css`
    text-decoration: underline 1px #9e9e9e;
    text-underline-offset: 3px;
    cursor: pointer;
  `,
  header: css`
    height: 2rem;
  `,
  input: css`
    width: 10em;
  `,
};
