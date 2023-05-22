import Konva from "konva";

const FACTOR_R = 0.3;
const FACTOR_G = 0.6;
const FACTOR_B = 0.1;

export default class KonvaTkColorSprite extends Konva.Sprite {
  constructor(config) {
    super(config);
    this.tkRed = typeof config.tkRed !== "undefined" ? config.tkRed : 100;
    this.tkGreen = typeof config.tkGreen !== "undefined" ? config.tkGreen : 100;
    this.tkBlue = typeof config.tkBlue !== "undefined" ? config.tkBlue : 100;
    this.tkSat = typeof config.tkSat !== "undefined" ? config.tkSat : 100;
    this.tmpCanvas = document.createElement("canvas");
  }
  _sceneFunc(context) {
    // offset使ってなさそうだから消した
    const anim = this.animation(),
      index = this.frameIndex(),
      ix4 = index * 4,
      set = this.animations()[anim],
      x = set[ix4 + 0],
      y = set[ix4 + 1],
      width = set[ix4 + 2],
      height = set[ix4 + 3],
      image = this.image();

    if (this.hasFill() || this.hasStroke()) {
      context.beginPath();
      context.rect(0, 0, width, height);
      context.closePath();
      context.fillStrokeShape(this);
    }

    if (image) {
      if (
        this.tkRed !== 100 ||
        this.tkGreen !== 100 ||
        this.tkBlue !== 100 ||
        this.tkSat !== 100
      ) {
        // 色調変更有の場合、tmpCanvasで画像を書き換える
        this.tmpCanvas.width = width;
        this.tmpCanvas.height = height;
        const ctx = this.tmpCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        // 各ピクセルのデータを取得
        const data = imageData.data;
        const grayData = [];

        // RGB565へ減らす
        for (let i = 0; i < data.length; i += 4) {
          data[i] = data[i] >> 3;
          data[i + 1] = data[i + 1] >> 2;
          data[i + 2] = data[i + 2] >> 3;
        }

        // 彩度系の計算は重いので、条件分岐を付ける
        if (this.tkSat !== 100) {
          // グレースケールを作る
          for (let i = 0; i < data.length; i += 4) {
            grayData[i] = Math.floor(
              data[i] * FACTOR_R +
              (data[i + 1] * FACTOR_G) / 2 +
              data[i + 2] * FACTOR_B
            );
            grayData[i + 1] = grayData[i] * 2;
            grayData[i + 2] = grayData[i];
          }
        }

        // 合成
        for (let i = 0; i < data.length; i += 4) {
          // 彩度
          if (this.tkSat !== 100) {
            data[i] = satulation(data[i], grayData[i], this.tkSat, 31);
            data[i + 1] = satulation(
              data[i + 1],
              grayData[i + 1],
              this.tkSat,
              63
            );
            data[i + 2] = satulation(
              data[i + 2],
              grayData[i + 2],
              this.tkSat,
              31
            );
          }
          // 色
          data[i] = add(data[i], this.tkRed, 31);
          data[i + 1] = add(data[i + 1], this.tkGreen, 63);
          data[i + 2] = add(data[i + 2], this.tkBlue, 31);
        }

        // RGB565での表示と同じになるよう、色を変換する
        for (let i = 0; i < data.length; i += 4) {
          data[i] = normalize5Bit(data[i]);
          data[i + 1] = normalize6Bit(data[i + 1]);
          data[i + 2] = normalize5Bit(data[i + 2]);
        }

        ctx.putImageData(imageData, 0, 0);
        context.drawImage(
          this.tmpCanvas,
          0,
          0,
          width,
          height,
          0,
          0,
          width,
          height
        );
      } else {
        // 色調変更が無い場合、そのままimageを描画
        context.drawImage(image, x, y, width, height, 0, 0, width, height);
      }
    }
  }
}

function add(data, c, max) {
  if (c < 100) {
    data = Math.floor((data * c) / 100);
  } else if (c > 100) {
    data += Math.floor(((max - data) * (c - 100)) / 100);
  }
  if (data > max) {
    data = max;
  }
  return data;
}

function satulation(data, gray, s, max) {
  const diff = gray - data;
  if (s < 100) {
    data += Math.floor((diff * (100 - s)) / 100);
  } else if (s > 100) {
    data -= Math.floor((diff * (s - 100)) / 100);
  }
  if (data > max) {
    data = max;
  }
  return data;
}

function normalize5Bit(c) {
  return (c << 3) | (c >> 2);
}

function normalize6Bit(c) {
  return (c << 2) | (c >> 4);
}
