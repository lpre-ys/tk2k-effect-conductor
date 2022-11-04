export default function EasingConfig({ config, type, update }) {
  const changeEasing = ({ target }) => {
    const newConfig = Object.assign({}, config);
    newConfig.easing = target.value;
    // addの初期値はInが良い
    newConfig.easingAdd = "In";
    update(type, newConfig);
  };
  const changeAdd = ({ target }) => {
    const newConfig = Object.assign({}, config);
    newConfig.easingAdd = target.value;
    update(type, newConfig);
  };
  let add = <></>;
  if (config.easing !== "easeLinear") {
    add = (
      <select
        data-testid="from-to-easing-select-add"
        value={config.easingAdd}
        onChange={changeAdd}
      >
        <option value="In" key="In">
          In
        </option>
        <option value="Out" key="Out">
          Out
        </option>
        <option value="InOut" key="InOut">
          All
        </option>
      </select>
    );
  }
  return (
    <label data-testid="from-to-easing">
      <select
        data-testid="from-to-easing-select"
        value={config.easing}
        onChange={changeEasing}
      >
        {easingList.map((name) => {
          return (
            <option value={name} key={name}>
              {name}
            </option>
          );
        })}
      </select>
      {add}
    </label>
  );
}

const easingList = [
  "easeLinear",
  "easeBack",
  "easeBounce",
  "easeCircle",
  "easeCubic",
  "easeElastic",
  "easeExp",
  "easePoly",
  "easeQuad",
  "easeSin",
];
