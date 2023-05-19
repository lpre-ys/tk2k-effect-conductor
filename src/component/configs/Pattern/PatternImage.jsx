/** @jsxImportSource @emotion/react */

import { useRef } from "react";
import useImage from "use-image";
import { Layer, Rect, Stage } from "react-konva";
import TrBg from "../../../tr2x.png";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import makePageList from "../../../util/calcFrameValue/makePageList";
import TkColorSprite from "../../player/TkColorSprite";

export function PatternImage({
  config,
  trImage,
  bgColor,
  red = 100,
  green = 100,
  blue = 100,
  sat = 100,
}) {
  const spriteRef = useRef();
  const layerRef = useRef();
  const [trBgImage] = useImage(TrBg);
  const [imgElement] = useImage(trImage);

  if (trImage) {
    return (
      <div data-testid="pattern-image-canvas" css={styles.pattern}>
        <Stage
          width={96}
          height={96}
          onClick={() => {
            if (spriteRef.current.isRunning()) {
              spriteRef.current.stop();
              spriteRef.current.frameIndex(0);
            } else {
              spriteRef.current.start();
            }
          }}
        >
          <Layer ref={layerRef}>
            <Rect
              x={0}
              y={0}
              width={96}
              height={96}
              fillPatternImage={trBgImage}
            ></Rect>
            <Rect x={0} y={0} width={96} height={96} fill={bgColor}></Rect>
            <TkColorSprite
              x={0}
              y={0}
              image={imgElement}
              animation="pattern"
              animations={{ pattern: makePatterns(config) }}
              frameRate={30}
              frameIndex={0}
              ref={spriteRef}
              parent={layerRef.current}
              tkRed={red}
              tkGreen={green}
              tkBlue={blue}
              tkSat={sat}
            />
          </Layer>
        </Stage>
      </div>
    );
  } else {
    return (
      <div data-testid="pattern-image-empty" css={styles.emptyPattern}></div>
    );
  }
}
function makePatterns(config) {
  const pageList = makePageList(config);
  const patterns = [];
  for (let i = 0; i < pageList.length; i++) {
    const page = pageList[i] - 1;
    const x = page % 5;
    const y = parseInt(page / 5);
    // 左上
    patterns.push(x * 96);
    // 右上
    patterns.push(y * 96);
    // 横幅
    patterns.push(96);
    // 縦幅
    patterns.push(96);
  }

  return patterns;
}

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (props) => {
  const { trImage, bgColor } = useSelector((state) => state.material);
  const _props = {
    trImage,
    bgColor,
    ...props,
  };
  return <PatternImage {..._props} />;
};

const styles = {
  emptyPattern: css`
    width: 96px;
    height: 96px;
    background: #e0e0e0;
  `,
  pattern: css`
    cursor: pointer;
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
    width: 96px;
    height: 96px;
  `,
};
