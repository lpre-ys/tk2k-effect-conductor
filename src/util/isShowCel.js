export default function isShowCel(frame, { start, volume, isHideLast }) {
  frame += 1; // startが1始まりなので、合わせる
  const end = start + volume - 1;
  if (isHideLast && frame === end) {
    return false;
  }
  if (frame < start) {
    return false;
  }
  if (frame > end) {
    return false;
  }
  return true;
}