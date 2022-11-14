/** @jsxImportSource @emotion/react */

// import { css } from "@emotion/react";
import { useCallback } from "react";

import { Group, Rect, Sprite, Text } from "react-konva";
import { useSelector } from "react-redux";
import useImage from "use-image";
import getDataByLocalFrame from "../../util/calcFrameValue";

const Cel = ({ image, maxPage, config, isShowCelBorder, id, setMsg }) => {
  const frame = useSelector((state) => state.frame.frame);

  const [imgElement] = useImage(image);

  const makePatterns = useCallback(() => {
    const width = 5;
    const height = maxPage / 5;
    const patterns = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
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
  }, [maxPage]);

  const resetData = {
    x: 0,
    y: 0,
    scale: 100,
    opacity: 100,
    pageIndex: 0,
  };
  let data = resetData;

  let visible = false;

  const localFrame = frame - (config.frame.start - 1);
  if (localFrame >= 0 && localFrame < config.frame.volume) {
    visible = true;
    data = getDataByLocalFrame(localFrame, config);
  } else {
    visible = false;
    data = resetData;
  }
  if (!image) {
    return <></>;
  }

  return (
    <Group
      x={data.x + 320 / 2}
      y={data.y + 240 / 2}
      onClick={() => {
        setMsg(
          [
            `セル:${id}[${frame + 1}]`,
            `パターン:${data.pageIndex + 1}`,
            `x: ${data.x}`,
            `y: ${data.y}`,
            `拡大率: ${data.scale}%`,
            `透明度: ${data.opacity}%`,
          ].join(" ")
        );
      }}
    >
      <Sprite
        x={calcScale(-96 / 2, data.scale)}
        y={calcScale(-96 / 2, data.scale)}
        image={imgElement}
        animation="pattern"
        animations={{ pattern: makePatterns() }}
        frameRate={30}
        frameIndex={data.pageIndex}
        visible={visible}
        opacity={(100 - data.opacity) / 100}
        scaleX={data.scale / 100}
        scaleY={data.scale / 100}
      />
      {isShowCelBorder && (
        <>
          <Rect
            x={calcScale(-96 / 2, data.scale) + 0.5}
            y={calcScale(-96 / 2, data.scale) + 0.5}
            width={calcScale(96, data.scale)}
            height={calcScale(96, data.scale)}
            stroke={"black"}
            strokeWidth={1}
            visible={visible}
          />
          <Rect
            x={calcScale(-96 / 2, data.scale) + 0.5}
            y={calcScale(-96 / 2, data.scale) + 0.5}
            width={15.5}
            height={15.5}
            fill={"black"}
            visible={visible}
            opacity={0.5}
          />
          <Text
            x={
              ((-96 / 2) * data.scale) / 100 +
              2 +
              (id.toString().length === 2 ? 0 : 2)
            }
            y={((-96 / 2) * data.scale) / 100 + 2.5}
            text={id}
            fontSize={12}
            fill={"white"}
            visible={visible}
          />
        </>
      )}
    </Group>
  );
};

export default Cel;

function calcScale(value, scale) {
  return Math.round((value * scale) / 100);
}
