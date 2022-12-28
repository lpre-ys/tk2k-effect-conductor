export default function makePageList({ start, end, isRoundTrip }) {
  const pageList = [];
  if (start < end) {
    for (let page = start; page <= end; page++) {
      pageList.push(page);
    }
  } else {
    for (let page = start; page >= end; page--) {
      pageList.push(page);
    }
  }

  // 反転時追加でページリストに入れる
  if (isRoundTrip) {
    for (let i = pageList.length - 2; i > 0; i--) {
      pageList.push(pageList[i]);
    }
  }

  return pageList;
}