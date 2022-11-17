/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { memo, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import { useSelector } from "react-redux";
import Background from "./player/Background";
import Cel from "./player/Cel";
import Controller from "./player/Controller";
import Info from "./player/Info";
import ViewSettings from "./player/ViewSettings";

export const Player = ({ celList }) => {
  console.log("RENDER: Player");

  const [bgColor, setBgColor] = useState("transparent");
  const [bgImage, setBgImage] = useState(null);
  const [isShowCelBorder, setIsShowCelBorder] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <>
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
            {celList.map((cel, id) => {
              return (
                <Cel
                  key={id}
                  id={id + 1}
                  config={cel}
                  isShowCelBorder={isShowCelBorder}
                  setMsg={setMsg}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      <Controller />
      <Info msg={msg} setMsg={setMsg} />
    </>
  );
};

export default memo((props) => {
  const celList = useSelector((state) => state.celList.list);
  const _props = {
    celList,
    ...props,
  };

  return <Player {..._props} />;
});

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
