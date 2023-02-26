/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateByType } from "../../../slice/celListSlice";

export function EasingConfig({ type, config, update }) {
  const { t } = useTranslation();

  const changeEasing = ({ target }) => {
    const newConfig = Object.assign({}, config);
    newConfig.easing = target.value;
    // addの初期値はInが良い
    newConfig.easingAdd = "In";
    update(type, newConfig);
  };
  const changeAdd = ({ target }) => {
    const newConfig = Object.assign({}, config);
    newConfig.easingAdd = target.value;
    update(type, newConfig);
  };
  let add = <></>;
  if (
    typeof config !== "undefined" &&
    !["easeLinear", "fixed"].includes(config.easing)
  ) {
    add = (
      <select
        data-testid="from-to-easing-select-add"
        value={config.easingAdd}
        onChange={changeAdd}
      >
        <option value="In" key="In">
          In
        </option>
        <option value="Out" key="Out">
          Out
        </option>
        <option value="InOut" key="InOut">
          All
        </option>
      </select>
    );
  }
  return (
    <label data-testid="from-to-easing">
      <select
        data-testid="from-to-easing-select"
        value={config.easing}
        onChange={changeEasing}
        css={styles.select}
      >
        <optgroup label="Easing">
          {easingList.map((name) => {
            return (
              <option value={name} key={name}>
                {name}
              </option>
            );
          })}
        </optgroup>
        <optgroup label="Other">
          <option value="fixed" key="fixed">
            {t("configs.parameter.fixed")}
          </option>
          <option value="sin" key="sin">
            sin
          </option>
          <option value="cos" key="cos">
            cos
          </option>
        </optgroup>
      </select>
      {add}
    </label>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const dispatch = useDispatch();
  const _props = {
    update: (type, newConfig) => {
      dispatch(updateByType({ type, data: newConfig }));
    },
    ...props,
  };
  return <EasingConfig {..._props} />;
};

const easingList = [
  "easeLinear",
  "easeBack",
  "easeBounce",
  "easeCircle",
  "easeCubic",
  "easeElastic",
  "easeExp",
  "easePoly",
  "easeQuad",
  "easeSin",
];

const styles = {
  select: css`
    width: 6.8em;
  `,
};
