/** @jsxImportSource @emotion/react */

import { css, Global } from "@emotion/react";
import normalize from "normalize.css";
import React from "react";
import { connect } from "react-redux";
import Configs from "./component/Configs";
import Export from "./component/Export";
import Material from "./component/Material";
import Player from "./component/Player";
import Timeline from "./component/Timeline";
import { loadCelList, resetCelList } from "./slice/celListSlice";
import { loadFrameConfig, resetFrameConfig } from "./slice/frameSlice";
import { loadInfo, resetInfo } from "./slice/infoSlice";
import { loadMaterial, resetMaterial } from "./slice/materialSlice";
import { loadPlayer, resetPlayer } from "./slice/playerSlice";
import { withTranslation } from "react-i18next";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (!!window.initArgs) {
      const lang = window.initArgs.lang();
      if (lang && this.props.i18n.language !== lang) {
        this.props.i18n.changeLanguage(lang);
        this.props.resetAll();
      }
    }
  }
  componentDidMount() {
    if (!!window.appMenu) {
      // 新規
      window.appMenu.onReceiveNew(() => {
        this.props.resetAll();
      });
      // 保存
      window.appMenu.onReceiveSave(() => {
        window.appMenu.saveData(this.props.data);
      });
      // 読み込み
      window.appMenu.onReceiveLoad((data) => {
        this.props.loadData(JSON.parse(data));
      });
      // 言語切り替え
      window.appMenu.onReceiveLanguage(({ lang }) => {
        this.props.i18n.changeLanguage(lang);
      });
    }
  }

  render() {
    return (
      <>
        <Global styles={normalize}></Global>
        <Global styles={styles.global}></Global>
        <div className="App" css={styles.container}>
          {(!process.env.NODE_ENV ||
            process.env.NODE_ENV === "development") && (
            <button
              onClick={() => {
                this.props.i18n.changeLanguage(
                  this.props.i18n.language === "ja" ? "en" : "ja"
                );
              }}
            >
              test
            </button>
          )}
          <div className="effect">
            <Material />
            <div className="player" css={styles.player}>
              <Export />
              <Player />
            </div>
            <Configs key={`${this.props.celIndex}:${this.props.drawKey}`} />
          </div>
          <Timeline />
        </div>
      </>
    );
  }
}

const styles = {
  container: css`
    padding: 16px 8px;
    width: 1264px;
    height: 1048px;
    overflow-y: hidden;
    overflow-x: hidden;
    // border: 1px solid gray;
  `,
  player: css`
    flex-basis: 640px;
    flex-grow: 0;
  `,
  global: css`
    h1 {
      font-size: 1.4rem;
      margin: 0 0 16px;
      padding: 0.25em 0.5em;
      color: #212121;
      background: transparent;
      border-left: solid 5px #00838f;
    }
    h2 {
      font-size: 1.2rem;
      color: #212121;
      padding: 0.25em 0.5em;
      border-bottom: 2px dotted #00bcd4;
    }
  `,
};

const mapStateToProps = (state) => {
  return {
    celIndex: state.celList.celIndex,
    drawKey: state.celList.drawKey,
    data: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadData: (value) => {
      dispatch(loadCelList(value.celList));
      dispatch(loadFrameConfig(value.frame));
      dispatch(loadInfo(value.info));
      dispatch(loadMaterial(value.material));
      dispatch(loadPlayer(value.player));
    },
    resetAll: () => {
      dispatch(resetFrameConfig());
      dispatch(resetCelList());
      dispatch(resetInfo());
      dispatch(resetMaterial());
      dispatch(resetPlayer());
    },
  };
};

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(App)
);
