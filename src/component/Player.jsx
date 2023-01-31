/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { memo, useEffect, useState } from "react";
import { Layer, Line, Stage, Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { loadOriginalImage } from "../slice/materialSlice";
import { setBgImage } from "../slice/playerSlice";
import makeTransparentImage from "../util/makeTransparentImage";
import Background from "./player/Background";
import Cel from "./player/Cel";
import Controller from "./player/Controller";
import Info from "./player/Info";
import ViewSettings from "./player/ViewSettings";

export const Player = ({ celList, zoom, setBgImage, loadMaterialImage }) => {
  const [isShowCelBorder, setIsShowCelBorder] = useState(false);
  const [msg, setMsg] = useState("");

  // 画像コピペ対応
  const handlePasteImage = ({ clipboardData }) => {
    const item = clipboardData.items[0];
    if (item.type.indexOf("image") === 0) {
      // 画像かつ、画像サイズが正しい時対応する
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        // まずは素材として読み取りを試みる
        const dataUrl = reader.result;
        makeTransparentImage(dataUrl)
          .then(({ transparent, maxPage, trColor }) => {
            loadMaterialImage({ dataUrl, transparent, maxPage, trColor });
          })
          .catch(() => {
            // サイズが異なる場合、背景画像として設定
            setBgImage(dataUrl);
          });
      });

      reader.readAsDataURL(blob);
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePasteImage);

    return () => {
      document.removeEventListener("paste", handlePasteImage);
    };
  });

  return (
    <>
      <ViewSettings
        isShowCelBorder={isShowCelBorder}
        setIsShowCelBorder={setIsShowCelBorder}
      />
      <div css={styles.canvasArea} data-testid="effectCanvas">
        <Stage width={320 * 2} height={240 * 2} scaleX={zoom} scaleY={zoom}>
          <Layer imageSmoothingEnabled={false}>
            <Background />
            <Grid zoom={zoom} />
            {[...celList].reverse().map((cel, id) => {
              return (
                <Cel
                  key={id}
                  id={id + 1}
                  config={cel}
                  isShowCelBorder={isShowCelBorder}
                  setMsg={setMsg}
                  zoom={zoom}
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
  const zoom = useSelector((state) => state.player.zoom);
  const dispatch = useDispatch();
  const _props = {
    loadMaterialImage: (value) => {
      dispatch(loadOriginalImage(value));
    },
    setBgImage: (value) => {
      dispatch(setBgImage(value));
    },
    celList,
    zoom,
    ...props,
  };

  return <Player {..._props} />;
});

function Grid({ zoom }) {
  const width = 320 * (2 / zoom);
  const height = 240 * (2 / zoom);
  return (
    <>
      <Line
        points={[0, height / 2 + 0.5, width, height / 2 + 0.5]}
        stroke="black"
        strokeWidth={1}
      ></Line>
      <Line
        points={[width / 2 + 0.5, 0, width / 2 + 0.5, height]}
        stroke="black"
        strokeWidth={1}
      ></Line>
      <Rect
        x={320 / 2 + 0.5}
        y={240 / 2 + 0.5}
        width={320}
        height={240}
        stroke="black"
        strokeWidth={1}
      ></Rect>
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
