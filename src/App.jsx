/** @jsxImportSource @emotion/react */

import { css, Global } from "@emotion/react";
import React, { createRef } from "react";
import Material from "./component/Material";
import normalize from "normalize.css";
import makeTransparentImage from "./util/makeTransparentImage";
import Player from "./component/Player";
import Timeline from "./component/Timeline";
import Configs from "./component/Configs";
import Export from "./component/player/Export";
import { connect } from "react-redux";
import { resetFrameConfig, setFrame } from "./slice/frameSlice";

const INIT_MAX_FRAME = 20;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialMsg: "",
      material: {
        originalImage: null,
        transparentImage: null,
        maxPage: 0,
        transparentColor: null,
        bgColor: "transparent",
      },
      celConfigList: [initCelConfig(1, INIT_MAX_FRAME)],
      selectedCelId: 0,
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
          selectedCelId: 0,
        });
        this.props.resetFrameConfig();
      });
      // 保存
      window.appMenu.onReceiveSave(() => {
        window.appMenu.saveData(this.state);
      });
      // 読み込み
      window.appMenu.onReceiveLoad((data) => {
        this.setState(JSON.parse(data));
      });
    }
  }
  handleChangeCelConfigs = (type, config) => {
    const id = this.state.selectedCelId;
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
      // 追加したセルを選択する
      selectedCelId: newList.length - 1,
    });
  };
  handleDeleteCelConfig = () => {
    if (this.state.celConfigList.length < 2) {
      return;
    }
    const newList = this.state.celConfigList.filter((config, index) => {
      return index !== this.state.selectedCelId;
    });
    this.setState({
      celConfigList: newList,
      // 1個前のセルを選択する
      selectedCelId:
        this.state.selectedCelId === 0 ? 0 : this.state.selectedCelId - 1,
    });
  };
  handleCopyCelConfig = () => {
    // 有り得ない値だった場合、処理をしない
    if (this.state.selectedCelId >= this.state.celConfigList.length) {
      return;
    }
    if (this.state.selectedCelId < 0) {
      return;
    }
    const copyList = [...this.state.celConfigList];
    const target = JSON.parse(
      JSON.stringify(this.state.celConfigList[this.state.selectedCelId])
    );
    copyList.splice(this.state.selectedCelId, 0, target);
    this.setState({
      celConfigList: copyList,
    });
  };

  handleChangeSelectedCel = (value) => {
    this.setState({
      selectedCelId: parseInt(value),
    });
  };
  handleChangeMaterial = (type, value) => {
    this.setState((preConfig) => {
      preConfig.material[type] = value;
      return preConfig;
    });
  };
  loadImage = (dataUrl, name) => {
    makeTransparentImage(dataUrl)
      .then(({ transparent, maxPage, trColor }) => {
        this.setState({
          material: {
            originalImage: dataUrl,
            transparentImage: transparent,
            maxPage: maxPage,
            transparentColor: trColor,
            bgColor: "transparent",
          },
          materialMsg: "",
          materialName: name,
        });
      })
      .catch((error) => {
        if (error.message === "width") {
          this.setState({
            materialMsg: "素材画像の横幅が正しくないようです。",
          });
        }
        if (error.message === "height") {
          this.setState({
            materialMsg: "素材画像の縦幅が正しくないようです。",
          });
        }
      });
  };
  handleChangeTrColor = (r, g, b) => {
    makeTransparentImage(this.state.material.originalImage, { r, g, b }).then(
      ({ transparent, maxPage, trColor }) => {
        this.setState({
          material: {
            originalImage: this.state.material.originalImage,
            transparentImage: transparent,
            maxPage: maxPage,
            transparentColor: trColor,
            bgColor: this.state.material.bgColor,
          },
          materialMsg: "",
        });
      }
    );
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
            <Material
              material={this.state.material}
              loadImage={this.loadImage}
              changeTrColor={this.handleChangeTrColor}
              msg={this.state.materialMsg}
              changeMaterial={this.handleChangeMaterial}
            />
            <div className="player" css={styles.player}>
              <Export
                configList={this.state.celConfigList}
                title={this.state.title}
                setTitle={this.setTitle}
                materialName={this.state.materialName}
                setMaterialName={this.setMaterialName}
              />
              <Player
                material={this.state.material}
                celConfigList={this.state.celConfigList}
                ref={this.playerRef}
              />
            </div>
            <Configs
              config={this.state.celConfigList[this.state.selectedCelId]}
              celId={this.state.selectedCelId}
              update={this.handleChangeCelConfigs}
              material={this.state.material}
            />
          </div>
          <Timeline
            selected={this.state.selectedCelId}
            handler={this.handleChangeSelectedCel}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFrame: (value) => {
      dispatch(setFrame(value));
    },
    resetFrameConfig: dispatch(resetFrameConfig()),
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
