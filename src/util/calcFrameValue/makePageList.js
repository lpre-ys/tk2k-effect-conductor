export default function makePageList({ start, end, isRoundTrip, isCustom, customPattern }) {
  const pageList = [];
  if (isCustom) {
    pageList.push(...customPattern);
    if (pageList.length < 1) {
      pageList.push(1);
    }
  } else {
    if (start < end) {
      for (let page = start; page <= end; page++) {
        pageList.push(page);
      }
    } else {
      for (let page = start; page >= end; page--) {
        pageList.push(page);
      }
    }
  }

  // 反転時追加でページリストに入れる
  if (isRoundTrip) {
    pageList.push(...pageList.slice(0, -1).reverse());
  }

  return pageList;
}