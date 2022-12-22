/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { memo, useEffect, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { loadOriginalImage } from "../slice/materialSlice";
import { setBgColor, setBgImage } from "../slice/playerSlice";
import makeTransparentImage from "../util/makeTransparentImage";
import Background from "./player/Background";
import Cel from "./player/Cel";
import Controller from "./player/Controller";
import Info from "./player/Info";
import ViewSettings from "./player/ViewSettings";

export const Player = ({
  celList,
  bgImage,
  bgColor,
  setBgImage,
  setBgColor,
  loadMaterialImage,
}) => {
  // const [bgColor, setBgColor] = useState("transparent");
  // const [bgImage, setBgImage] = useState(null);
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
  const bgImage = useSelector((state) => state.player.bgImage);
  const bgColor = useSelector((state) => state.player.bgColor);
  const dispatch = useDispatch();
  const _props = {
    loadMaterialImage: (value) => {
      dispatch(loadOriginalImage(value));
    },
    setBgImage: (value) => {
      dispatch(setBgImage(value));
    },
    setBgColor: (value) => {
      dispatch(setBgColor(value));
    },
    celList,
    bgImage,
    bgColor,
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
