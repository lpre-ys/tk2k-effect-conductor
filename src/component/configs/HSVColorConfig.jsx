/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateHSVMax, updateHSVMin } from "../../slice/celListSlice";

import { Header } from "./Header";
import ParameterConfig from "./ParameterConfig";

export function HSVColorConfig({ config, updateMin, updateMax }) {
  const { t } = useTranslation();
  const validateMinMax = (value) => {
    if (isNaN(value)) {
      return false;
    }
    if (value < 0) {
      return false;
    }
    if (value > 200) {
      return false;
    }

    return true;
  };
  return (
    <div>
      <Header name="HSVカラー" isValid={() => true} reset={() => {}} />
      <div css={styles.minmaxContainer}>
        <label>
          Min:&nbsp;
          <input
            type="number"
            css={styles.number}
            value={config.min}
            onChange={({ target }) => {
              const value = parseInt(target.value);
              if (validateMinMax(value)) {
                updateMin(value);
              }
            }}
          />
        </label>
        <label>
          Max:&nbsp;
          <input
            type="number"
            css={styles.number}
            value={config.max}
            onChange={({ target }) => {
              const value = parseInt(target.value);
              if (validateMinMax(value)) {
                updateMax(value);
              }
            }}
          />
        </label>
      </div>
      <div css={styles.paramsContainer}>
        <ParameterConfig
          name="H. 色相"
          note="範囲: 0～360"
          type="hue"
          isSub={true}
        />
        <ParameterConfig name="S. 彩度" note="(%)" type="sat" isSub={true} />
        <ParameterConfig name="V. 明度" note="(%)" type="val" isSub={true} />
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const config = useSelector(
    (state) => state.celList.list[state.celList.celIndex].hsv
  );

  const dispatch = useDispatch();

  const _props = {
    config,
    updateMin: (min) => {
      dispatch(updateHSVMin(min));
    },
    updateMax: (max) => {
      dispatch(updateHSVMax(max));
    },
    ...props,
  };

  return <HSVColorConfig {..._props} />;
};

const styles = {
  minmaxContainer: css`
    display: flex;
    gap: 1em;
  `,
  paramsContainer: css`
    margin-left: 0.5em;
  `,
  number: css`
    width: 3em;
  `,
};
