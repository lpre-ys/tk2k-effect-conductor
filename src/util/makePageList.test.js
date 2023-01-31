import makePageList from "./makePageList";

const DEFAULT_CONFIG = {
  start: 1,
  end: 1,
  isRoundTrip: false,
  isCustom: false,
  customPattern: []
};
let config;

beforeEach(() => {
  config = Object.assign({}, DEFAULT_CONFIG);
});

describe('isCustom', () => {
  beforeEach(() => {
    config.customPattern = [3, 5, 9]
  })
  test('TRUE, then use customPattern', () => {
    config.isCustom = true;
    const result = makePageList(config);

    expect(result).toEqual([3, 5, 9]);
  });
  test('FALSE, then use StartEnd', () => {
    config.isCustom = false;
    const result = makePageList(config);

    expect(result).toEqual([1]);
  });
})

describe('customPattern', () => {
  test('customPattern.length is ZERO, then set [1]', () => {
    config.start = 3;
    config.end = 3;
    config.customPattern = [];
    config.isCustom = true;
    const result = makePageList(config);

    expect(result).toEqual([1]);
  });
  test('customPattern.length is not ZERO, then set customPattern', () => {
    config.start = 3;
    config.end = 3;
    config.customPattern = [4];
    config.isCustom = true;
    const result = makePageList(config);

    expect(result).toEqual([4]);
  });
})