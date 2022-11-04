/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Layer, Line, Stage } from "react-konva";
import Background from "./player/Background";
import Cel from "./player/Cel";
import Controller from "./player/Controller";
import Export from "./player/Export";
import Info from "./player/Info";
import ViewSettings from "./player/ViewSettings";

const FRAME_SEC = 33; // 30 fps

function Player(
  {
    material,
    frameConfig: { maxFrame, globalFrame },
    changeConfig,
    celConfigList,
  },
  ref
) {
  const [isRepeat, setIsRepeat] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [bgColor, setBgColor] = useState("transparent");
  const [bgImage, setBgImage] = useState(null);
  const [isShowCelBorder, setIsShowCelBorder] = useState(false);
  const [msg, setMsg] = useState("");

  const animeRef = useRef();

  let timeCounter = 0.0;
  let globalFrameCounter = globalFrame;
  let prevTimeStamp;

  const animation = (timestamp) => {
    if (prevTimeStamp === undefined) {
      prevTimeStamp = timestamp;
    }
    timeCounter += timestamp - prevTimeStamp;

    let isChange = false;
    let isNext = true;
    while (timeCounter > FRAME_SEC) {
      // 現在のフレームの計算
      globalFrameCounter += 1;
      timeCounter -= FRAME_SEC;
      isChange = true;
    }
    if (isChange) {
      if (globalFrameCounter > maxFrame - 1) {
        if (isRepeat) {
          globalFrameCounter = 0;
        } else {
          //リピート無しの時はアニメを止める;
          isNext = false;
          setIsRunning(false);
          globalFrameCounter = maxFrame - 1; //はみ出したとき用
        }
      }
      changeConfig("globalFrame", globalFrameCounter);
    }
    if (isNext) {
      animeRef.current = window.requestAnimationFrame(animation);
    }
    prevTimeStamp = timestamp;
  };

  function playAnimation() {
    if (globalFrame >= maxFrame - 1) {
      globalFrameCounter = 0;
    }
    setIsRunning(true);
    animeRef.current = window.requestAnimationFrame(animation);
  }

  function stopAnimation() {
    window.cancelAnimationFrame(animeRef.current);
    setIsRunning(false);
  }

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(animeRef.current);
    };
  }, []);

  useImperativeHandle(ref, () => {
    return {
      playpause: () => {
        if (isRunning) {
          stopAnimation();
        } else {
          playAnimation();
        }
      },
      pause: () => {
        stopAnimation();
      },
    };
  });

  return (
    <div className="player" css={styles.container}>
      <Export maxFrame={maxFrame} configList={celConfigList} />
      <ViewSettings
        background={bgColor}
        isShowCelBorder={isShowCelBorder}
        setBgColor={setBgColor}
        setBgImage={setBgImage}
        setIsShowCelBorder={setIsShowCelBorder}
      />
      <div css={styles.canvasArea} data-testid="effectCanvas">
        <Stage width={320 * 2} height={240 * 2} scaleX={2} scaleY={2}>
          <Layer imageSmoothingEnabled={false}>
            <Background color={bgColor} image={bgImage} />
            <Grid />
            {celConfigList.map((celConfig, id) => {
              return (
                <Cel
                  key={id}
                  id={id + 1}
                  image={material.transparentImage}
                  maxPage={material.maxPage}
                  config={celConfig}
                  globalFrame={globalFrame}
                  isShowCelBorder={isShowCelBorder}
                  setMsg={setMsg}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      <Controller
        globalFrame={globalFrame}
        maxFrame={maxFrame}
        changeConfig={changeConfig}
        isRepeat={isRepeat}
        setIsRepeat={setIsRepeat}
        isRunning={isRunning}
        playAnimation={playAnimation}
        stopAnimation={stopAnimation}
      />

      <Info msg={msg} setMsg={setMsg} />
    </div>
  );
}

function Grid() {
  return (
    <>
      <Line
        points={[0, 240 / 2 + 0.5, 320, 240 / 2 + 0.5]}
        stroke="black"
        strokeWidth={1}
      ></Line>
      <Line
        points={[320 / 2 + 0.5, 0, 320 / 2 + 0.5, 240]}
        stroke="black"
        strokeWidth={1}
      ></Line>
    </>
  );
}

const styles = {
  container: css`
    flex-basis: 640px;
    flex-grow: 0;
  `,
  canvasArea: css`
    margin-top: 8px;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    font-smooth: never;
    -webkit-font-smoothing: none;
    canvas {
      font-smooth: never;
      -webkit-font-smoothing: none;
    }
  `,
};

export default forwardRef(Player);
