/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { setCelIndex } from "../../slice/celListSlice";
import { FRAME_SIZE, TIMELINE_HEIGHT } from "../../util/const";

export function TimeCelView({ index, config, celIndex, setCelIndex }) {
  const isSelected = index === celIndex;

  const width = FRAME_SIZE * config.frame.volume - 8;

  return (
    <div
      css={[styles.outside, isSelected ? styles.outsideSelected : null]}
      style={{
        top: `${4 + index * TIMELINE_HEIGHT}px`,
        left: `${FRAME_SIZE * (config.frame.start - 1) + 4}px`,
        width: `${width}px`,
        height: `${TIMELINE_HEIGHT - 6}px`,
      }}
      onClick={({ currentTarget }) => {
        setCelIndex(currentTarget.dataset.id);
      }}
      data-id={index}
      data-testid="time-cel-view"
    >
      <div
        css={[styles.inside, isSelected ? styles.insideSelected : null]}
        style={{
          width: `${
            width - 2 - (config.frame.isHideLast ? FRAME_SIZE - 5 : 0)
          }px`,
        }}
        data-testid="time-cel-view-inside"
      >
        <p css={styles.timelineText}>{index + 1}</p>
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const celIndex = useSelector((state) => state.celList.celIndex);
  const dispatch = useDispatch();
  const _props = {
    celIndex,
    setCelIndex: (value) => {
      dispatch(setCelIndex(value));
    },
    ...props,
  };

  return <TimeCelView {..._props} />;
};

const styles = {
  outside: css`
    position: absolute;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid #03a9f4;
    :hover {
      border: 1px solid #01579b;
    }
  `,
  inside: css`
    background: rgba(129, 212, 250, 0.7);
    height: 100%;
  `,
  outsideSelected: css`
    border: 1px solid #388e3c;
    cursor: auto;
    :hover {
      border: 1px solid #388e3c;
    }
  `,
  insideSelected: css`
    background: rgba(165, 214, 167, 0.7);
  `,
  timelineText: css`
    margin: 0;
    padding: 2px 4px;
    text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff,
      1px -1px 0 #fff, 0px 1px 0 #fff, 0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff;
    user-select: none;
  `,
};
