/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFromTo } from "../../slice/celListSlice";
import EasingConfig from "./FromTo/EasingConfig";
import { Header } from "./Header";
import NumberInput from "./Input/NumberInput";

export function FixedConfig({
  type,
  name,
  note,
  config,
  updateFromTo,
  isSub,
  isHideEasing,
  min,
  max,
}) {
  const [from, setFrom] = useState(config.from);
  const [key, setKey] = useState(Date.now());

  const reset = () => {
    setFrom(config.from);
    setKey(Date.now());
  };

  const validate = (value) => {
    return !Number.isNaN(parseInt(value));
  };

  const isChangeConfig = (config, from) => {
    return config.from !== from;
  };

  useEffect(() => {
    if (validate(from) && isChangeConfig(config, parseInt(from))) {
      updateFromTo(type, parseInt(from), config.to);
    }
  }, [config, from, type, updateFromTo]);

  return (
    <div>
      <Header
        name={name}
        note={note}
        isValid={validate(from)}
        reset={reset}
        isSub={isSub}
      />
      <div
        css={[styles.wrapper, isSub && styles.sub]}
        data-testid="const-config-params-wrapper"
      >
        <NumberInput
          type={type}
          isSub={isSub}
          val={from}
          setVal={setFrom}
          numberStyle={isSub ? styles.numberSub : styles.number}
          testSuffix="-fixed"
          min={min}
          max={max}
          key={key}
        />
        {!isHideEasing && <EasingConfig type={type} />}
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const config = useSelector((state) => {
    const cel = state.celList.list[state.celList.celIndex];
    const keys = props.type.split(".");
    if (keys.length > 1 && keys[1] === "trig") {
      return cel[keys[0]][keys[1]][keys[2]];
    }
    return cel[props.type];
  });
  const dispatch = useDispatch();
  const _props = {
    config,
    updateFromTo: (type, from, to) => {
      dispatch(updateFromTo({ type, from, to }));
    },
    ...props,
  };

  return <FixedConfig {..._props} />;
};

const styles = {
  wrapper: css`
    margin: 0 0.5em;
  `,
  sub: css`
    font-size: 0.9em;
  `,
  number: css`
    margin-right: 78px;
  `,
  numberSub: css`
    margin-right: 71px;
  `,
};
