/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";

import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

import ColorPreview from "./ColorPreview";
import HSVColorConfig from "./HSVColorConfig";
import ParameterConfig from "./ParameterConfig";
import { setIsHsv } from "../../slice/celListSlice";

export function ColorConfigs({ isHSV, setIsHSV }) {
  const { t } = useTranslation();

  return (
    <>
      <button
        css={[styles.button, isHSV && styles.buttonOn]}
        onClick={() => {
          setIsHSV(!isHSV);
        }}
      >
        <FontAwesomeIcon
          icon={isHSV ? faToggleOn : faToggleOff}
          css={styles.icon}
        />
        {t("configs.color.hsvMode")}:&nbsp;{isHSV ? "ON" : "OFF"}
      </button>
      <ColorPreview />
      {isHSV ? (
        <>
          <HSVColorConfig />
          <ParameterConfig
            type="tkSat"
            name={t("configs.color.satulation")}
            note={t("configs.color.satulationNote")}
          />
        </>
      ) : (
        <>
          <ParameterConfig type="red" name={t("configs.color.red")} />
          <ParameterConfig type="green" name={t("configs.color.green")} />
          <ParameterConfig type="blue" name={t("configs.color.blue")} />
          <ParameterConfig type="tkSat" name={t("configs.color.satulation")} />
        </>
      )}
    </>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const isHSV = useSelector(
    (state) => state.celList.list[state.celList.celIndex].hsv.isHsv
  );
  const dispatch = useDispatch();

  const _props = {
    isHSV,
    setIsHSV: (value) => {
      dispatch(setIsHsv(value));
    },
    ...props,
  };

  return <ColorConfigs {..._props} />;
};

const styles = {
  button: css`
    border: none;
    padding: 0.3em 0.5em 0.3em 1.6em;
    margin-top: 1em;
    text-align: left;
    text-decoration: none;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    background: #e0e0e0;
    color: #424242;
    :hover {
      background-color: #757575;
      color: #fafafa;
    }
  `,
  buttonOn: css`
    background: #66bb6a;
    color: #fafafa;
    :hover {
      background: #388e3c;
    }
  `,
  icon: css`
    position: absolute;
    top: 0.4em;
    left: 0.4em;
  `,
};
