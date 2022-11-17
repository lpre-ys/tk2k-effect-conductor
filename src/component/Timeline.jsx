/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCel, copyCel, deleteCel } from "../slice/celListSlice";
import { setFrame } from "../slice/frameSlice";
import TimeCelView from "./timeline/TimeCelView";

const FRAME_SIZE = 20;
const TIMELINE_HEIGHT = 28;

export function Timeline({
  frame,
  maxFrame,
  celList,
  setFrame,
  addCel,
  copyCel,
  deleteCel,
}) {
  console.log("RENDER: Timeline");

  const scrollRef = useRef(null);

  const baseList = [];
  for (let i = 0; i < maxFrame; i++) {
    baseList.push(
      <div css={styles.frame} key={"base" + i}>
        <p
          css={styles.frameText}
          onClick={() => {
            setFrame(i);
          }}
        >
          {i + 1}
        </p>
      </div>
    );
  }

  useLayoutEffect(() => {
    if (maxFrame > 60) {
      let position = frame - 59;
      if (position < 0) {
        position = 0;
      }
      scrollRef.current.scroll({
        left: FRAME_SIZE * position,
      });
    }
  });

  return (
    <div className="timeline" css={styles.container} data-testid="timeline">
      <h1 css={styles.header}>タイムライン</h1>
      <div>
        <button
          css={styles.button}
          type="button"
          onClick={() => {
            const volume = maxFrame - frame;
            const start = frame + 1;
            addCel(volume, start);
          }}
        >
          <FontAwesomeIcon icon={faPlus} css={styles.icon} />
          追加
        </button>
        <button
          css={styles.button}
          type="button"
          onClick={() => {
            copyCel();
          }}
        >
          <FontAwesomeIcon icon={faCopy} css={styles.icon} />
          コピー
        </button>
        <button
          css={[
            styles.button,
            styles.deleteButton,
            celList.length < 2 && styles.disabled,
          ]}
          type="button"
          onClick={() => {
            deleteCel();
          }}
          disabled={celList.length < 2}
        >
          <FontAwesomeIcon icon={faTrashAlt} css={styles.icon} />
          削除
        </button>
      </div>
      <div
        css={styles.wrapper}
        ref={scrollRef}
        style={{
          overflowX: maxFrame > 60 ? "scroll" : "visible",
        }}
      >
        <section css={styles.timelineComponent}>
          <div
            css={styles.cursor}
            style={{
              top: `-8px`,
              left: `${4 + FRAME_SIZE * frame}px`,
            }}
          ></div>
          <div
            css={styles.base}
            style={{
              width: `${maxFrame * FRAME_SIZE}px`,
              gridTemplateColumns: `${FRAME_SIZE}px `.repeat(maxFrame),
              gridTemplateRows: `${
                celList.length > 6
                  ? 201
                  : FRAME_SIZE + TIMELINE_HEIGHT * celList.length
              }px`,
            }}
          >
            {baseList}
          </div>
          <div
            css={styles.timelineWrapper}
            style={{
              width: `${maxFrame * FRAME_SIZE + 18}px`,
              height: `${
                celList.length > 6 ? 180 : TIMELINE_HEIGHT * celList.length
              }px`,
              overflowY: celList.length > 6 ? "scroll" : "visible",
            }}
          >
            {celList.map((config, index) => {
              return (
                <TimeCelView
                  key={`timeline_${index}`}
                  index={index}
                  config={config}
                />
              );
            })}
            <div
              css={styles.spacer}
              style={{
                top: `${celList.length * TIMELINE_HEIGHT}px`,
              }}
              data-testid="timeline-spacer"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const frame = useSelector((state) => state.frame.frame);
  const maxFrame = useSelector((state) => state.frame.maxFrame);
  const celList = useSelector((state) => state.celList.list);
  const dispatch = useDispatch();
  const _props = {
    frame,
    maxFrame,
    celList,
    setFrame: (value) => {
      dispatch(setFrame(value));
    },
    addCel: (volume, start) => {
      dispatch(addCel({ volume, start }));
    },
    copyCel: () => {
      dispatch(copyCel());
    },
    deleteCel: () => {
      dispatch(deleteCel());
    },
    ...props,
  };

  return <Timeline {..._props} />;
};

const styles = {
  container: css`
    padding: 0 1em;
  `,
  header: css``,
  wrapper: css`
    width: 1215px;
    margin-left: 16px;
  `,
  button: css`
    border: none;
    padding: 0.3em 0.8em 0.3em 1.8em;
    margin: 0 0.3em;
    text-align: center;
    text-decoration: none;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    background: #e0e0e0;
    color: #424242;
    :hover {
      background-color: #757575;
      color: #fafafa;
    }
  `,
  deleteButton: css`
    background: #e53935;
    color: #eeeeee;
    margin-left: 2em;
    :hover {
      background: #c62828;
    }
  `,
  disabled: css`
    background-color: #9e9e9e;
    color: #fafafa;
    cursor: not-allowed;
    :hover {
      background-color: #9e9e9e;
      color: #fafafa;
    }
  `,
  icon: css`
    position: absolute;
    top: 0.4em;
    left: 0.6em;
  `,
  timelineComponent: css`
    font-size: 0.8rem;
    position: relative;
    margin: 20px 0 8px;
  `,
  cursor: css`
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid black;
    position: absolute;
  `,
  timelineWrapper: css`
    top: 21px;
    height: 180px;
    position: absolute;
  `,
  spacer: css`
    position: absolute;
    left: 0;
    width: 100px;
    height: 4px;
  `,
  base: css`
    background: gray;
    display: grid;
    box-sizing: border-box;
    border-left: 1px solid gray;
  `,
  frame: css`
    background: #fafafa;
    border-right: 1px solid gray;
  `,
  frameText: css`
    background: #e0e0e0;
    margin: 0px;
    padding: 0;
    text-align: center;
    line-height: 17px;
    height: ${FRAME_SIZE}px;
    border-bottom: 1px dotted gray;
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  `,
};
