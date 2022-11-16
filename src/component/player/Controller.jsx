/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
  faRepeat,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { setFrame, setMaxFrame } from "../../slice/frameSlice";

export function Controller({
  isRepeat,
  setIsRepeat,
  isRunning,
  playAnimation,
  stopAnimation,
  frame,
  maxFrame,
  setFrame,
  setMaxFrame,
}) {
  const control = ({ currentTarget }) => {
    const type = currentTarget.dataset.type;
    if (type === "play") {
      playAnimation();
    }
    if (type === "pause") {
      stopAnimation();
    }
    if (type === "stop") {
      stopAnimation();
      setFrame(0);
    }
    if (type === "repeat") {
      setIsRepeat(!isRepeat);
      // アニメーションは一回止めてしまう
      stopAnimation();
    }
    if (type === "frame") {
      const value = parseInt(currentTarget.value) - 1; // 表示だけ1大きいので、ここで吸収しておく
      if (value < maxFrame && value > -1) {
        setFrame(value);
      }
    }
    if (type === "next") {
      // 最大からもう1個→押したとき、0に戻す
      let value = frame + 1;
      if (value >= maxFrame) {
        value = 0;
      }
      setFrame(value);
    }
    if (type === "prev") {
      let value = frame - 1;
      if (value <= 0) {
        value = maxFrame - 1;
      }
      setFrame(value);
    }
  };
  return (
    <div css={styles.container} className="controller" data-testid="controller">
      <ul css={styles.wrapper}>
        <li css={[styles.li, styles.playLi]}>
          <button
            type="button"
            onClick={control}
            data-type="stop"
            title="stop"
            css={[styles.button, styles.stop]}
          >
            <FontAwesomeIcon icon={faStop} />
          </button>
          {isRunning ? (
            <button
              type="button"
              onClick={control}
              data-type="pause"
              title="pause"
              css={[styles.button, styles.pause]}
            >
              <FontAwesomeIcon icon={faPause} />
            </button>
          ) : (
            <button
              type="button"
              onClick={control}
              data-type="play"
              title="play"
              css={[styles.button, styles.play]}
            >
              <FontAwesomeIcon icon={faPlay} css={styles.playIcon} />
            </button>
          )}
          <button
            type="button"
            data-type="repeat"
            title="repeat"
            css={[styles.button, isRepeat ? styles.repeatOn : styles.repeatOff]}
            onClick={control}
          >
            <FontAwesomeIcon icon={faRepeat} />
          </button>
        </li>
        <li css={styles.li}>
          <button
            type="button"
            data-type="prev"
            title="prev"
            css={[styles.button, styles.prev]}
            onClick={control}
          >
            <FontAwesomeIcon icon={faBackwardStep} />
          </button>
          <label>
            <input
              type="number"
              value={frame + 1}
              onChange={control}
              data-type="frame"
              data-testid="controller-frame"
              css={styles.frame}
            />
          </label>
          <button
            type="button"
            data-type="next"
            title="next"
            css={[styles.button, styles.next]}
            onClick={control}
          >
            <FontAwesomeIcon icon={faForwardStep} />
          </button>
        </li>
        <li css={styles.liMaxFrame}>
          <label>
            総フレーム数:&nbsp;
            <input
              type="number"
              data-testid="controller-max-frame"
              value={maxFrame}
              onChange={({ target }) => {
                setMaxFrame(target.value);
              }}
              css={styles.maxFrame}
            />
          </label>
        </li>
      </ul>
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const { frame, maxFrame } = useSelector((state) => state.frame);
  const dispatch = useDispatch();
  const _props = {
    frame,
    maxFrame,
    setFrame: (value) => {
      dispatch(setFrame(value));
    },
    setMaxFrame: (value) => {
      dispatch(setMaxFrame(value));
    },
    ...props,
  };

  return <Controller {..._props} />;
};

const styles = {
  container: css`
    margin-top: 8px;
  `,
  wrapper: css`
    display: flex;
    padding: 0;
    margin: 0;
    gap: 1rem;
  `,
  li: css`
    margin: 0;
    list-style: none;
  `,
  playLi: css`
    margin-left: 28px;
    margin-right: 10px;
  `,
  frame: css`
    width: 2em;
    margin: 0 0.5rem;
    padding: 0.2rem 0.2rem 0.3rem 0.5rem;
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    position: relative;
    top: -1px;
  `,
  maxFrame: css`
    width: 2.2em;
    padding: 0.2rem 0.2rem 0.3rem 0.5rem;
  `,
  liMaxFrame: css`
    margin-left: auto;
    list-style: none;
  `,
  button: css`
    border: none;
    color: #fafafa;
    padding: 0.3rem 1rem 0.4rem;
    text-align: center;
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    height: 31px;
  `,
  stop: css`
    background-color: #e53935;
    margin-right: 0.5em;
    :hover {
      background-color: #c62828;
    }
  `,
  play: css`
    background-color: #2196f3;
    width: 5rem;
    :hover {
      background-color: #0277bd;
    }
  `,
  playIcon: css`
    position: relative;
    left: 2px;
  `,
  pause: css`
    background-color: #ff9800;
    width: 5rem;
    :hover {
      background-color: #ef6c00;
    }
  `,
  repeatOff: css`
    background-color: #bdbdbd;
    color: #eeeeee;
    margin-left: 0.5rem;
  `,
  repeatOn: css`
    background-color: #81c784;
    margin-left: 0.5rem;
  `,
  prev: css`
    background-color: #e0e0e0;
    color: #424242;
    :hover {
      color: #fafafa;
      background-color: #757575;
    }
  `,
  next: css`
    background-color: #e0e0e0;
    color: #424242;
    :hover {
      background-color: #757575;
      color: #fafafa;
    }
  `,
};
