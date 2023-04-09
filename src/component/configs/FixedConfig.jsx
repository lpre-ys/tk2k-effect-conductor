/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EasingConfig from "./FromTo/EasingConfig";
import { Header } from "./Header";
import { updateFromTo } from "../../slice/celListSlice";

export function FixedConfig({
  type,
  name,
  note,
  config,
  updateFromTo,
  isSub,
  isHideEasing,
}) {
  const [from, setFrom] = useState(config.from);

  const reset = () => {
    setFrom(config.from);
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
        <input
          type="number"
          data-testid="const-config-params-from"
          css={[styles.number, isSub && styles.numberSub]}
          value={from}
          onChange={({ target }) => {
            setFrom(target.value);
          }}
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
    if (keys.length === 1) {
      return cel[props.type];
    } else if (keys[1] === "trig") {
      return cel[keys[0]][keys[1]][keys[2]];
    }
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
  number: css`
    width: 3em;
    margin-right: 78px;
  `,
  sub: css`
    font-size: 0.9em;
  `,
  numberSub: css`
    margin-right: 71px;
  `,
};
