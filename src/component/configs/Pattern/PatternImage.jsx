/** @jsxImportSource @emotion/react */

import { useRef } from "react";
import useImage from "use-image";
import { Layer, Rect, Sprite, Stage } from "react-konva";
import TrImage from "../../../tr2x.png";
import { css } from "@emotion/react";
import { config } from "@fortawesome/fontawesome-svg-core";

export default function PatternImage({ image, config, bgColor }) {
  const spriteRef = useRef();
  const [trImage] = useImage(TrImage);
  const [imgElement] = useImage(image);

  if (image) {
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
          <Layer>
            <Rect
              x={0}
              y={0}
              width={320}
              height={240}
              fillPatternImage={trImage}
            ></Rect>
            <Rect x={0} y={0} width={320} height={240} fill={bgColor}></Rect>
            <Sprite
              x={0}
              y={0}
              image={imgElement}
              animation="pattern"
              animations={{ pattern: makePatterns(config) }}
              frameRate={30}
              frameIndex={0}
              ref={spriteRef}
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
function makePatterns({ start, end, isRoundTrip }) {
  const patterns = [];
  for (let page = start - 1; page < end; page++) {
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
  if (isRoundTrip) {
    // 戻りを追加
    for (let page = end - 2; page >= start; page--) {
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
  }

  return patterns;
}

const styles = {
  emptyPattern: css`
    width: 96px;
    height: 96px;
    background: #e0e0e0;
  `,
  pattern: css`
    cursor: pointer;
  `,
};
