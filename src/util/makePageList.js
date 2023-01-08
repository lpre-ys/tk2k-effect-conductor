export default function makePageList({ start, end, isRoundTrip }) {
  let pageList = [];
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
    pageList.push(...pageList.slice(0, -1).reverse());
  }

  return pageList;
}