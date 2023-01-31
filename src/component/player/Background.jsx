import { memo } from "react";
import { Image, Rect } from "react-konva";
import { useSelector } from "react-redux";
import useImage from "use-image";
import TrImage from "../../tr.png";

export function Background({ color, image, zoom }) {
  const [trImage] = useImage(TrImage);
  const [bgImage] = useImage(image);
  const width = 320 * (2 / zoom);
  const height = 240 * (2 / zoom);
  return (
    <>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fillPatternImage={trImage}
      ></Rect>
      <Rect x={0} y={0} width={width} height={height} fill={color}></Rect>
      {!!image && bgImage && (
        <Image
          x={(width - bgImage.naturalWidth) / 2}
          y={(height - bgImage.naturalHeight) / 2}
          width={bgImage.naturalWidth}
          height={bgImage.naturalHeight}
          image={bgImage}
        />
      )}
    </>
  );
}

export default memo((props) => {
  const bgImage = useSelector((state) => state.player.bgImage);
  const bgColor = useSelector((state) => state.player.bgColor);
  const zoom = useSelector((state) => state.player.zoom);
  const _props = {
    image: bgImage,
    color: bgColor,
    zoom,
    ...props,
  };

  return <Background {..._props} />;
});
