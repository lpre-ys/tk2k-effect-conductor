/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateHSVMax, updateHSVMin } from "../../slice/celListSlice";

import { Header } from "./Header";
import NumberInput from "./Input/NumberInput";
import ParameterConfig from "./ParameterConfig";

export function HSVColorConfig({ config, updateMin, updateMax }) {
  const { t } = useTranslation();
  const [min, setMin] = useState(config.min);
  const [max, setMax] = useState(config.max);

  useEffect(() => {
    if (config.min !== min) {
      updateMin(min);
    }
  }, [config.min, min, updateMin]);

  useEffect(() => {
    if (config.max !== max) {
      updateMax(max);
    }
  }, [config.max, max, updateMax]);

  return (
    <div>
      <Header
        name={t("configs.color.hsvColor")}
        isValid={() => true}
        reset={() => {}}
      />
      <div css={styles.minmaxContainer}>
        <label>
          Min:&nbsp;
          <NumberInput
            type="hsvMinMax"
            val={min}
            setVal={(value) => {
              setMin(parseInt(value));
            }}
            testSuffix="-hsv-min"
          />
        </label>
        <label>
          Max:&nbsp;
          <NumberInput
            type="hsvMinMax"
            val={max}
            setVal={(value) => {
              setMax(parseInt(value));
            }}
            testSuffix="-hsv-max"
          />
        </label>
      </div>
      <div css={styles.paramsContainer}>
        <ParameterConfig
          name={t("configs.color.hsvHue")}
          note={t("configs.color.hsvHueNote")}
          type="hue"
          isSub={true}
          min={0}
          max={360}
        />
        <ParameterConfig
          name={t("configs.color.hsvSat")}
          note="(%)"
          type="sat"
          isSub={true}
          min={0}
          max={100}
        />
        <ParameterConfig
          name={t("configs.color.hsvVal")}
          note="(%)"
          type="val"
          isSub={true}
          min={0}
          max={100}
        />
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
