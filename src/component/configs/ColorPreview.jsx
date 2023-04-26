/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header } from "./Header";
import PatternImage from "./Pattern/PatternImage";

export function ColorPreview({ config, red, green, blue, tkSat }) {
  const { t } = useTranslation();

  return (
    <div>
      <Header
        name={t("configs.preview")}
        note={""}
        isValid={true}
        reset={() => {}}
      />
      <div css={styles.container}>
        <PatternImage
          config={config}
          red={red.from}
          green={green.from}
          blue={blue.from}
          sat={tkSat.from}
        />
        <div>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
        <PatternImage
          config={config}
          red={getTo(red)}
          green={getTo(green)}
          blue={getTo(blue)}
          sat={getTo(tkSat)}
        />
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
    (state) => state.celList.list[state.celList.celIndex].pattern
  );
  const red = useSelector(
    (state) => state.celList.list[state.celList.celIndex].red
  );
  const green = useSelector(
    (state) => state.celList.list[state.celList.celIndex].green
  );
  const blue = useSelector(
    (state) => state.celList.list[state.celList.celIndex].blue
  );
  const tkSat = useSelector(
    (state) => state.celList.list[state.celList.celIndex].tkSat
  );
  const _props = {
    config,
    red,
    green,
    blue,
    tkSat,
    ...props,
  };

  return <ColorPreview {..._props} />;
});
