/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";

import FromToConfig from "./configs/FromToConfig";
import PatternConfig from "./configs/PatternConfig";
import TimingConfig from "./configs/TimingConfig";
import { setCelName } from "../slice/celListSlice";
import { useEffect, useRef, useState } from "react";

export function Configs({ name, setCelName }) {
  const [isInput, setIsInput] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (isInput && ref.current) {
      ref.current.focus();
    }
  }, [isInput]);
  return (
    <div css={styles.container}>
      {isInput ? (
        <h1>
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
          css={styles.name}
          onClick={() => {
            setIsInput(true);
          }}
        >
          {name}
        </h1>
      )}
      <TimingConfig />
      <PatternConfig />
      <FromToConfig type="x" name="X座標" />
      <FromToConfig type="y" name="Y座標" />
      <FromToConfig type="scale" name="拡大率" />
      <FromToConfig type="opacity" name="透明度" />
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
  input: css`
    width: 10em;
  `,
};
