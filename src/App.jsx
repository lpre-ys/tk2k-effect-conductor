/** @jsxImportSource @emotion/react */

import { css, Global } from "@emotion/react";
import React, { createRef } from "react";
import Material from "./component/Material";
import normalize from "normalize.css";
import Player from "./component/Player";
import Timeline from "./component/Timeline";
import Configs from "./component/Configs";
import Export from "./component/player/Export";
import { connect } from "react-redux";
import { resetFrameConfig, setFrame } from "./slice/frameSlice";
import { resetCelList } from "./slice/celListSlice";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      materialName: "",
    };
    this.playerRef = createRef();
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    if (!!window.appMenu) {
      // 新規
      window.appMenu.onReceiveNew(() => {
        // configとCelConfigのリセット
        this.props.resetFrameConfig();
        this.props.resetCelList();
      });
      // 保存
      window.appMenu.onReceiveSave(() => {
        // TODO データ色々もってくる
        window.appMenu.saveData(this.state);
      });
      // 読み込み
      window.appMenu.onReceiveLoad((data) => {
        // TODO データ色々書き戻す
        this.setState(JSON.parse(data));
      });
    }
  }

  handleKeyDown = (event) => {
    if (event.target.tagName === "INPUT") {
      return;
    }
    if (event.key === "ArrowLeft") {
      if (this.playerRef.current.pause !== null) {
        this.playerRef.current.pause();
      }
      this.props.setFrame(this.props.frame - 1);
    }
    if (event.key === "ArrowRight") {
      if (this.playerRef.current.pause !== null) {
        this.playerRef.current.pause();
      }
      this.props.setFrame(this.props.frame + 1);
    }
    if (event.key === " ") {
      if (event.target.tagName === "BUTTON") {
        return;
      }
      if (this.playerRef.current.playpause !== null) {
        this.playerRef.current.playpause();
      }
    }
    event.preventDefault();
  };

  // for Export
  setTitle = (value) => {
    this.setState({ title: value });
  };
  setMaterialName = (value) => {
    this.setState({ materialName: value });
  };

  render() {
    return (
      <>
        <Global styles={normalize}></Global>
        <Global styles={styles.global}></Global>
        <div className="App" css={styles.container}>
          <div className="effect">
            <Material setMaterialName={this.setMaterialName} />
            <div className="player" css={styles.player}>
              <Export
                title={this.state.title}
                setTitle={this.setTitle}
                materialName={this.state.materialName}
                setMaterialName={this.setMaterialName}
              />
              <Player ref={this.playerRef} />
            </div>
            <Configs
              update={this.handleChangeCelConfigs}
              key={this.props.celIndex}
            />
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFrame: (value) => {
      dispatch(setFrame(value));
    },
    resetFrameConfig: dispatch(resetFrameConfig()),
    resetCelList: dispatch(resetCelList()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
