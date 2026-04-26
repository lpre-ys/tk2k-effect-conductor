/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  moveCelGroup,
  setActiveIndex,
  setCelIndex,
  toggleSelectIndex,
  updateFrame,
  updateFrameMultiple,
} from "../../slice/celListSlice";
import { DRAG_TYPE, FRAME_SIZE, TIMELINE_HEIGHT } from "../../util/const";
import { calculateFrameAfterDrag } from "../../util/frameUtil";

const DIRECTION = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
};

const DRAG_DIRECTION_THRESHOLD = 8;

export function TimeCelView({
  index,
  config,
  celIndex,
  selectedIndices,
  setCelIndex,
  setActiveIndex,
  toggleSelectIndex,
  maxFrame,
  updateFrame,
  updateFrameMultiple,
  moveCelGroup,
  listLength,
}) {
  const [drag, setDrag] = useState(null);
  const dragRef = useRef(drag);
  useEffect(() => { dragRef.current = drag; }, [drag]);
  const selectedIndicesRef = useRef(selectedIndices);
  useEffect(() => { selectedIndicesRef.current = selectedIndices; }, [selectedIndices]);

  const isActive = index === celIndex;
  const isInSelection = selectedIndices.includes(index);

  useEffect(() => {
    if (!drag) return;

    const onMove = (e) => {
      const deltaX = e.clientX - drag.startX;
      const deltaY = e.clientY - drag.startY;
      setDrag((prev) => {
        if (!prev) return prev;

        let directionLocked = prev.directionLocked;
        if (!directionLocked) {
          if (Math.abs(deltaY) > DRAG_DIRECTION_THRESHOLD) directionLocked = DIRECTION.VERTICAL;
          else if (Math.abs(deltaX) > DRAG_DIRECTION_THRESHOLD) directionLocked = DIRECTION.HORIZONTAL;
          else return prev;
        }

        if (directionLocked === DIRECTION.VERTICAL) {
          const offsetRows = Math.round(deltaY / TIMELINE_HEIGHT);
          if (prev.offsetRows === offsetRows && prev.directionLocked === directionLocked) return prev;
          return { ...prev, directionLocked, offsetRows };
        } else {
          const offsetFrame = Math.round(deltaX / FRAME_SIZE);
          if (prev.offsetFrame === offsetFrame && prev.directionLocked === directionLocked) return prev;
          return { ...prev, directionLocked, offsetFrame };
        }
      });
    };

    const onUp = () => {
      const prev = dragRef.current;
      if (prev?.directionLocked === DIRECTION.VERTICAL) {
        if (prev.offsetRows !== 0) moveCelGroup(prev.offsetRows);
      } else if (prev?.directionLocked === DIRECTION.HORIZONTAL && prev.offsetFrame !== 0) {
        updateFrameMultiple({
          indices: selectedIndicesRef.current,
          offsetFrame: prev.offsetFrame,
          type: prev.type,
        });
      }
      setDrag(null);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    // drag.startX/startY はドラッグ開始時のみ変わる。offset 更新ではリスナーを再登録しない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag?.startX, updateFrame, updateFrameMultiple, moveCelGroup, listLength]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    if (e.ctrlKey) {
      toggleSelectIndex(index);
      return;
    }
    if (selectedIndicesRef.current.includes(index)) {
      // 選択中バーをクリック → アクティブセルのみ更新し、複数選択を維持
      setActiveIndex(index);
    } else {
      // 未選択バーをクリック → 単独選択にリセット
      setCelIndex(index);
    }
    setDrag({ startX: e.clientX, startY: e.clientY, offsetFrame: 0, offsetRows: 0, type: DRAG_TYPE.MOVE, directionLocked: null });
  };

  const createResizeHandler = (dragType) => (e) => {
    e.stopPropagation();
    if (!selectedIndicesRef.current.includes(index)) {
      setCelIndex(index);
    }
    setDrag({ startX: e.clientX, startY: e.clientY, offsetFrame: 0, offsetRows: 0, type: dragType, directionLocked: DIRECTION.HORIZONTAL });
  };

  const handleResizeLeftDown = createResizeHandler(DRAG_TYPE.RESIZE_LEFT);
  const handleResizeRightDown = createResizeHandler(DRAG_TYPE.RESIZE_RIGHT);

  let previewStart = config.frame.start;
  let previewVolume = config.frame.volume;
  if (drag?.directionLocked === DIRECTION.HORIZONTAL) {
    const result = calculateFrameAfterDrag(
      drag.type,
      config.frame.start,
      config.frame.volume,
      drag.offsetFrame
    );
    previewStart = result.start;
    previewVolume = result.volume;
  }

  const rowOffset =
    drag?.directionLocked === DIRECTION.VERTICAL
      ? Math.max(-index, Math.min(drag.offsetRows, listLength - 1 - index))
      : 0;

  let start = previewStart;
  let volume = previewVolume;
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
        isActive={isActive}
        isInSelection={isInSelection}
        index={index}
        rowOffset={rowOffset}
        isHideLast={isLeft ? false : config.frame.isHideLast}
        name={config.name ? config.name : index}
        type={isLeft ? "right" : "normal"}
        onMouseDown={handleMouseDown}
        onMouseDownLeft={handleResizeLeftDown}
        onMouseDownRight={handleResizeRightDown}
        isDragging={!!drag}
      />
      {isLeft && config.frame.volume <= maxFrame && (
        <TimelineBar
          start={1}
          volume={leftVolume}
          isActive={isActive}
          isInSelection={isInSelection}
          index={index}
          rowOffset={rowOffset}
          isHideLast={config.frame.isHideLast}
          name={config.name ? config.name : index}
          type="left"
          onMouseDown={handleMouseDown}
          isDragging={!!drag}
        />
      )}
    </>
  );
}

function TimelineBar({
  start,
  volume,
  isActive,
  isInSelection,
  index,
  rowOffset,
  isHideLast,
  name,
  type,
  onMouseDown,
  onMouseDownLeft,
  onMouseDownRight,
  isDragging,
}) {
  const width = FRAME_SIZE * volume - (type === "normal" ? 8 : 3);
  return (
    <div
      css={[
        styles.outside,
        type === "left" ? styles.left : null,
        type === "right" ? styles.right : null,
        isActive ? styles.outsideSelected : null,
        !isActive && isInSelection ? styles.outsideSecondarySelected : null,
        isDragging ? styles.dragging : null,
      ]}
      style={{
        top: `${4 + (index + rowOffset) * TIMELINE_HEIGHT}px`,
        left: `${FRAME_SIZE * (start - 1) + (type === "left" ? 1 : 4)}px`,
        width: `${width}px`,
        height: `${TIMELINE_HEIGHT - 6}px`,
      }}
      onMouseDown={onMouseDown}
      data-id={index}
      data-testid="time-cel-view"
    >
      <div
        css={[
          styles.inside,
          isActive ? styles.insideSelected : null,
          !isActive && isInSelection ? styles.insideSecondarySelected : null,
        ]}
        style={{
          width: `${width - 2 - (isHideLast ? FRAME_SIZE - 5 : 0)}px`,
        }}
        data-testid="time-cel-view-inside"
      >
        <p
          css={styles.timelineText}
          style={{
            marginLeft: start < 1 ? `${(start * -1 + 1) * 20 - 6}px` : "0",
          }}
        >
          {name}
        </p>
      </div>
      {type === "normal" && (
        <>
          <div
            css={styles.handleLeft}
            onMouseDown={onMouseDownLeft}
            data-testid="time-cel-handle-left"
          />
          <div
            css={styles.handleRight}
            onMouseDown={onMouseDownRight}
            data-testid="time-cel-handle-right"
          />
        </>
      )}
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const celIndex = useSelector((state) => state.celList.celIndex);
  const selectedIndices = useSelector((state) => state.celList.selectedIndices);
  const maxFrame = useSelector((state) => state.frame.maxFrame);
  const listLength = useSelector((state) => state.celList.list.length);
  const dispatch = useDispatch();
  const _props = {
    celIndex,
    selectedIndices,
    maxFrame,
    listLength,
    setCelIndex: (value) => dispatch(setCelIndex(value)),
    setActiveIndex: (value) => dispatch(setActiveIndex(value)),
    toggleSelectIndex: (value) => dispatch(toggleSelectIndex(value)),
    updateFrame: (newFrame) => dispatch(updateFrame(newFrame)),
    updateFrameMultiple: (payload) => dispatch(updateFrameMultiple(payload)),
    moveCelGroup: (delta) => dispatch(moveCelGroup(delta)),
    ...props,
  };

  return <TimeCelView {..._props} />;
};

const styles = {
  outside: css`
    position: absolute;
    border-radius: 4px;
    cursor: grab;
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
    :hover {
      border: 1px solid #388e3c;
    }
  `,
  insideSelected: css`
    background: rgba(165, 214, 167, 0.7);
  `,
  outsideSecondarySelected: css`
    border: 1px solid #1565c0;
    :hover {
      border: 1px solid #1565c0;
    }
  `,
  insideSecondarySelected: css`
    background: rgba(187, 222, 251, 0.7);
  `,
  dragging: css`
    cursor: grabbing;
    opacity: 0.8;
  `,
  handleLeft: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 8px;
    height: 100%;
    cursor: w-resize;
  `,
  handleRight: css`
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 100%;
    cursor: e-resize;
  `,
  timelineText: css`
    margin: 0;
    padding: 2px 4px;
    text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff,
      1px -1px 0 #fff, 0px 1px 0 #fff, 0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff;
    user-select: none;
    white-space: nowrap;
  `,
};
