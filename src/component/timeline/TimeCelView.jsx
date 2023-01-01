/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { setCelIndex } from "../../slice/celListSlice";
import { FRAME_SIZE, TIMELINE_HEIGHT } from "../../util/const";

export function TimeCelView({
  index,
  config,
  celIndex,
  setCelIndex,
  maxFrame,
}) {
  const isSelected = index === celIndex;

  let { start, volume } = config.frame;
  let isLeft = false;
  let leftVolume = 0;

  if (config.frame.isLoopBack) {
    // まずはstartを決める
    start = ((start - 1) % maxFrame) + 1;
    if (start < 1) {
      start = maxFrame + start;
    }
    // ループ無しの時にどこまで表示するか
    const last = start + volume - 1;
    if (last > maxFrame) {
      // 超えている場合、最大までにする
      volume = maxFrame - (start - 1);
      leftVolume = last - maxFrame;
      isLeft = true;
    }
  }

  return (
    <>
      <TimelineBar
        start={start}
        volume={volume}
        isSelected={isSelected}
        index={index}
        isHideLast={isLeft ? false : config.frame.isHideLast}
        setCelIndex={setCelIndex}
        type={isLeft ? "right" : "normal"}
      />
      {isLeft && config.frame.volume <= maxFrame && (
        <TimelineBar
          start={1}
          volume={leftVolume}
          isSelected={isSelected}
          index={index}
          isHideLast={config.frame.isHideLast}
          setCelIndex={setCelIndex}
          type="left"
        />
      )}
    </>
  );
}

function TimelineBar({
  start,
  volume,
  isSelected,
  index,
  isHideLast,
  setCelIndex,
  type,
}) {
  const width = FRAME_SIZE * volume - (type === "normal" ? 8 : 3);
  return (
    <div
      css={[
        styles.outside,
        type === "left" ? styles.left : null,
        type === "right" ? styles.right : null,
        isSelected ? styles.outsideSelected : null,
      ]}
      style={{
        top: `${4 + index * TIMELINE_HEIGHT}px`,
        left: `${FRAME_SIZE * (start - 1) + (type === "left" ? 1 : 4)}px`,
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
          width: `${width - 2 - (isHideLast ? FRAME_SIZE - 5 : 0)}px`,
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
  const maxFrame = useSelector((state) => state.frame.maxFrame);
  const dispatch = useDispatch();
  const _props = {
    celIndex,
    maxFrame,
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
  right: css`
    border-radius: 4px 0 0 4px;
  `,
  left: css`
    border-radius: 0 4px 4px 0;
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
