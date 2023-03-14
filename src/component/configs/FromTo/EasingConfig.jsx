/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { updateEasing } from "../../../slice/celListSlice";

export function EasingConfig({ type, config, updateEasing }) {
  const { t } = useTranslation();

  const changeEasing = ({ target }) => {
    const newConfig = Object.assign({}, config);
    newConfig.easing = target.value;
    // addの初期値はInが良い
    updateEasing(type, target.value, "In");
  };
  const changeAdd = ({ target }) => {
    updateEasing(type, config.easing, target.value);
  };
  let add = <></>;
  if (
    typeof config !== "undefined" &&
    !["easeLinear", "fixed", "sin", "cos"].includes(config.easing)
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
          {!type.includes("trig") && (
            <>
              <option value="sin" key="sin">
                sin
              </option>
              <option value="cos" key="cos">
                cos
              </option>
            </>
          )}
        </optgroup>
      </select>
      {add}
    </label>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const config = useSelector((state) => {
    const cel = state.celList.list[state.celList.celIndex];
    const keys = props.type.split(".");
    if (keys.includes("trig")) {
      return cel[keys[0]][keys[1]][keys[2]];
    } else {
      return cel[props.type];
    }
  });
  const dispatch = useDispatch();
  const _props = {
    updateEasing: (type, easing, easingAdd) => {
      dispatch(updateEasing({ type, easing, easingAdd }));
    },
    config,
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
