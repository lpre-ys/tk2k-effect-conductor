/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { setCelIndex } from "../../slice/celListSlice";
import { FRAME_SIZE, TIMELINE_HEIGHT } from "../../util/const";

export function TimeCelView({ index, config, celIndex, setCelIndex }) {
  console.log("RENDER: TimeCelView");
  const isSelected = index === celIndex;

  return (
    <div
      css={[styles.timeline, isSelected ? styles.timelineSelected : null]}
      style={{
        top: `${4 + index * TIMELINE_HEIGHT}px`,
        left: `${FRAME_SIZE * (config.frame.start - 1) + 4}px`,
        width: `${FRAME_SIZE * config.frame.volume - 8}px`,
        height: `${TIMELINE_HEIGHT - 6}px`,
      }}
      onClick={({ currentTarget }) => {
        setCelIndex(currentTarget.dataset.id);
      }}
      data-id={index}
      data-testid="time-cel-view"
    >
      <p css={styles.timelineText}>{index + 1}</p>
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
  timeline: css`
    position: absolute;
    background: rgba(129, 212, 250, 0.7);
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid transparent;
    :hover {
      border: 1px solid #0277bd;
    }
  `,
  timelineSelected: css`
    background: rgba(165, 214, 167, 0.7);
    border: 1px solid #388e3c;
    cursor: auto;
    :hover {
      border: 1px solid #388e3c;
    }
  `,
  timelineText: css`
    margin: 2px 4px;
    padding: 0;
    text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff,
      1px -1px 0 #fff, 0px 1px 0 #fff, 0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff;
    user-select: none;
  `,
};
