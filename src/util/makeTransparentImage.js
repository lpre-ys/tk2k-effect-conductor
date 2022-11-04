export default async function makeTransparentImage(originalSrc, trColor) {
  const original = await loadImage(originalSrc);
  const width = original.naturalWidth;
  const height = original.naturalHeight;
  if (width !== 480) {
    throw new Error('width');
  }
  if (height > 480 || height % 96 !== 0) {
    throw new Error('height');
  }
  // キャンバスへ画像のロード
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(original, 0, 0);
  const imageData = ctx.getImageData(
    0,
    0,
    width,
    height
  );
  // 各ピクセルのデータを取得
  const data = imageData.data;
  const maxPage = Number.parseInt(height / 96) * 5;
  const colorList = [];
  // 透過色が無い場合、決定する
  if (!trColor) {
    trColor = { r: 0, g: 255, b: 0 };
    // 各ページ4隅の色の取得
    for (let page = 0; page < maxPage; page++) {
      const x = 0 + (page % 5) * 96;
      const y = 0 + parseInt(page / 5) * 96;
      const leftTop = (x + y * 480) * 4;
      const rightTop = leftTop + (95 * 4);
      const leftBottom = leftTop + (95 * 480 * 4);
      const rightBottom = leftBottom + (95 * 4);
      // 左上
      // data[leftTop] = 192;
      colorList.push([data[leftTop], data[leftTop + 1], data[leftTop + 2]].join(','));
      // 右上
      // data[rightTop] = 192;
      colorList.push([data[rightTop], data[rightTop + 1], data[rightTop + 2]].join(','));
      // 左下
      // data[leftBottom] = 192;
      colorList.push([data[leftBottom], data[leftBottom + 1], data[leftBottom + 2]].join(','));
      // 右下
      // data[rightBottom] = 192;
      colorList.push([data[rightBottom], data[rightBottom + 1], data[rightBottom + 2]].join(','));
    }
    // 色別にカウントを取り、透過色を決定する
    const colorCount = {};
    let max = 0;
    for (let i = 0; i < colorList.length; i++) {
      const color = colorList[i];
      colorCount[color] = (colorCount[color] || 0) + 1;
      if (max < colorCount[color]) {
        max = colorCount[color];
        [trColor.r, trColor.g, trColor.b] = color.split(',').map(str => parseInt(str));
      }
    }
  }

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    if (r === trColor.r && g === trColor.g && b === trColor.b) {
      data[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  const transparent = canvas.toDataURL();

  return { transparent, maxPage, trColor }
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}