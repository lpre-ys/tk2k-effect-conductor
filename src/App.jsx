/** @jsxImportSource @emotion/react */

import { css, Global } from "@emotion/react";
import React, { createRef } from "react";
import normalize from "normalize.css";
import Material from "./component/Material";
import Player from "./component/Player";
import Timeline from "./component/Timeline";
import Configs from "./component/Configs";
import Export from "./component/Export";
import { connect } from "react-redux";
import {
  loadFrameConfig,
  resetFrameConfig,
  nextFrame,
  prevFrame,
} from "./slice/frameSlice";
import { loadCelList, resetCelList } from "./slice/celListSlice";
import { loadInfo } from "./slice/infoSlice";
import { loadMaterial } from "./slice/materialSlice";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.playerRef = createRef();
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    if (!!window.appMenu) {
      // 新規
      window.appMenu.onReceiveNew(() => {
        // configとCelConfigのリセット
        this.props.resetFrameConfig();
        this.props.resetCelList();
      });
      // 保存
      window.appMenu.onReceiveSave(() => {
        window.appMenu.saveData(this.props.data);
      });
      // 読み込み
      window.appMenu.onReceiveLoad((data) => {
        this.props.loadData(JSON.parse(data));
      });
    }
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    if (event.target.tagName === "INPUT") {
      return;
    }
    if (event.key === "ArrowLeft") {
      if (this.playerRef.current !== null) {
        this.playerRef.current.pause();
      }
      this.props.prevFrame();
      event.preventDefault();
    }
    if (event.key === "ArrowRight") {
      if (this.playerRef.current !== null) {
        this.playerRef.current.pause();
      }
      this.props.nextFrame();
      event.preventDefault();
    }
    if (event.key === " ") {
      if (event.target.tagName === "BUTTON") {
        return;
      }
      if (this.playerRef.current !== null) {
        this.playerRef.current.playpause();
      }
      event.preventDefault();
    }
  };

  render() {
    return (
      <>
        <Global styles={normalize}></Global>
        <Global styles={styles.global}></Global>
        <div className="App" css={styles.container}>
          <div className="effect">
            <Material />
            <div className="player" css={styles.player}>
              <Export />
              <Player ref={this.playerRef} />
            </div>
            <Configs key={this.props.celIndex} />
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
    frame: state.frame.frame,
    maxFrame: state.frame.maxFrame,
    celIndex: state.celList.celIndex,
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
    },
    nextFrame: () => {
      dispatch(nextFrame());
    },
    prevFrame: () => {
      dispatch(prevFrame());
    },
    resetFrameConfig,
    resetCelList,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
