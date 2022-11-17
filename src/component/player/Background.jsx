import { Image, Rect } from "react-konva";
import useImage from "use-image";
import TrImage from "../../tr.png";

export default function Background({ color, image }) {
  console.log("RENDER: Background");

  const [trImage] = useImage(TrImage);
  const [bgImage] = useImage(image);
  return (
    <>
      <Rect
        x={0}
        y={0}
        width={320}
        height={240}
        fillPatternImage={trImage}
      ></Rect>
      <Rect x={0} y={0} width={320} height={240} fill={color}></Rect>
      {!!image && bgImage && (
        <Image
          x={(320 - bgImage.naturalWidth) / 2}
          y={(240 - bgImage.naturalHeight) / 2}
          width={bgImage.naturalWidth}
          height={bgImage.naturalHeight}
          image={bgImage}
        />
      )}
    </>
  );
}
