/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import hsvToTkColor from "../../util/calcFrameValue/hsvToTkColor";
import { Header } from "./Header";
import PatternImage from "./Pattern/PatternImage";

export function ColorPreview({ config }) {
  const { t } = useTranslation();

  const { pattern, hsv, red, green, blue, tkSat } = config;
  let from = {
    red: red.from,
    green: green.from,
    blue: blue.from,
    sat: tkSat.from,
  };
  let to = {
    red: getTo(red),
    green: getTo(green),
    blue: getTo(blue),
    sat: getTo(tkSat),
  };
  if (hsv.isHsv) {
    const { hue, sat, val } = config;
    const { min, max } = hsv;

    const newFrom = hsvToTkColor(hue.from, sat.from, val.from, min, max);
    from = { ...from, ...newFrom };

    const newTo = hsvToTkColor(getTo(hue), getTo(sat), getTo(val), min, max);
    to = { ...to, ...newTo };
  }

  return (
    <div>
      <Header
        name={t("configs.color.preview")}
        note={""}
        isValid={true}
        reset={() => {}}
      />
      <div css={styles.container}>
        <PatternImage config={pattern} {...from} />
        <div>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
        <PatternImage config={pattern} {...to} />
      </div>
    </div>
  );
}

function getTo(config) {
  return config.easing === "fixed" ? config.from : config.to;
}

const styles = {
  container: css`
    display: flex;
    gap: 1em;
    align-items: center;
    margin: 0 2em;
  `,
};

export default memo((props) => {
  const config = useSelector(
    (state) => state.celList.list[state.celList.celIndex]
  );
  const _props = {
    config,
    ...props,
  };

  return <ColorPreview {..._props} />;
});
