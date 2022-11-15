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
import { resetCelIndex, setCelIndex } from "./slice/celListSlice";

const INIT_MAX_FRAME = 20;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      celConfigList: [initCelConfig(1, INIT_MAX_FRAME)],
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
        this.setState({
          celConfigList: [initCelConfig(1, INIT_MAX_FRAME)],
        });
        this.props.resetFrameConfig();
        this.props.resetCelIndex();
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
  handleChangeCelConfigs = (type, config) => {
    const id = this.props.celIndex;
    this.setState((preConfig) => {
      preConfig.celConfigList = preConfig.celConfigList.map(
        (celConfig, index) => {
          if (index === parseInt(id)) {
            if (type in celConfig) {
              celConfig[type] = config;
            }
          }
          return celConfig;
        }
      );
      return preConfig;
    });
  };
  handleAddCelConfig = () => {
    const volume = this.props.maxFrame - this.props.frame;
    const start = this.props.frame + 1;
    const newList = [...this.state.celConfigList, initCelConfig(start, volume)];

    // TODO 追加する位置を、末尾じゃなくて、選択してるのの次にしたい。（COPYでやってるはず）
    this.setState({
      celConfigList: newList,
    });
    // 追加したセルを選択する
    this.props.setCelIndex(newList.length - 1);
  };
  handleDeleteCelConfig = () => {
    if (this.state.celConfigList.length < 2) {
      return;
    }
    const newList = this.state.celConfigList.filter((config, index) => {
      return index !== this.props.celIndex;
    });
    this.setState({
      celConfigList: newList,
    });
    // 1個前のセルを選択する
    this.props.setCelIndex(
      this.props.celIndex === 0 ? 0 : this.props.celIndex - 1
    );
  };
  handleCopyCelConfig = () => {
    // 有り得ない値だった場合、処理をしない
    if (this.props.celIndex >= this.state.celConfigList.length) {
      return;
    }
    if (this.props.celIndex < 0) {
      return;
    }
    const copyList = [...this.state.celConfigList];
    const target = JSON.parse(
      JSON.stringify(this.state.celConfigList[this.props.celIndex])
    );
    copyList.splice(this.props.celIndex, 0, target);
    this.setState({
      celConfigList: copyList,
    });
  };

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
                configList={this.state.celConfigList}
                title={this.state.title}
                setTitle={this.setTitle}
                materialName={this.state.materialName}
                setMaterialName={this.setMaterialName}
              />
              <Player
                celConfigList={this.state.celConfigList}
                ref={this.playerRef}
              />
            </div>
            <Configs
              config={this.state.celConfigList[this.props.celIndex]}
              update={this.handleChangeCelConfigs}
            />
          </div>
          <Timeline
            configList={this.state.celConfigList}
            handleAdd={this.handleAddCelConfig}
            handleDelete={this.handleDeleteCelConfig}
            handleCopy={this.handleCopyCelConfig}
          />
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
    setCelIndex: (value) => {
      dispatch(setCelIndex(value));
    },
    resetFrameConfig: dispatch(resetFrameConfig()),
    resetCelIndex: dispatch(resetCelIndex()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

function initCelConfig(start, volume) {
  return {
    x: {
      from: 0,
      to: 0,
      cycle: 0,
      isRoundTrip: false,
      easing: "easeLinear",
      easingAdd: "",
    },
    y: {
      from: 0,
      to: 0,
      cycle: 0,
      isRoundTrip: false,
      easing: "easeLinear",
      easingAdd: "",
    },
    scale: {
      from: 100,
      to: 100,
      cycle: 0,
      isRoundTrip: false,
      easing: "easeLinear",
      easingAdd: "",
    },
    opacity: {
      from: 0,
      to: 0,
      cycle: 0,
      isRoundTrip: false,
      easing: "easeLinear",
      easingAdd: "",
    },
    frame: { start: start, volume: volume },
    pattern: {
      start: 1,
      end: 1,
      isRoundTrip: false,
    },
  };
}
