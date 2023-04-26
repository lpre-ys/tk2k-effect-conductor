import { useEffect, useRef } from "react";
import { forwardRef } from "react";

import KonvaTkColorSprite from "../../konva/KonvaTkColorSprite";

const TkColorSprite = ({ parent, ...props }, ref) => {
  const spriteRef = useRef(null);
  useEffect(() => {
    if (parent) {
      spriteRef.current = new KonvaTkColorSprite({ ...props });
      if (ref) {
        ref.current = spriteRef.current;
      }
      parent.add(spriteRef.current);

      return () => {
        spriteRef.current.destroy();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parent, ref]);

  useEffect(() => {
    if (spriteRef.current) {
      Object.keys(props).forEach((key) => {
        if (["tkRed", "tkGreen", "tkBlue", "tkSat"].includes(key)) {
          // tk系の場合そのまま代入
          spriteRef.current[key] = props[key];
        } else {
          spriteRef.current[key](props[key]);
        }
      });
    }
  }, [props]);
};

export default forwardRef(TkColorSprite);
