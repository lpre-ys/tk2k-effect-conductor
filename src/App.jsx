/** @jsxImportSource @emotion/react */

import { css, Global } from "@emotion/react";
import React, { createRef } from "react";
import Material from "./component/Material";
import normalize from "normalize.css";
import makeTransparentImage from "./util/makeTransparentImage";
import Player from "./component/Player";
import Timeline from "./component/Timeline";
import Configs from "./component/Configs";
import "./icon/LigatureSymbols.woff";

const INIT_MAX_FRAME = 20;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      material: {
        originalImage: null,
        transparentImage: null,
        maxPage: 0,
        transparentColor: null,
        bgColor: "transparent",
      },
      config: {
        maxFrame: INIT_MAX_FRAME,
        globalFrame: 0,
      },
      celConfigList: [initCelConfig(1, INIT_MAX_FRAME)],
      selectedCelId: 0,
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
          config: {
            maxFrame: INIT_MAX_FRAME,
            globalFrame: 0,
          },
          celConfigList: [initCelConfig(1, INIT_MAX_FRAME)],
          selectedCelId: 0,
        });
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
    const volume = this.state.config.maxFrame - this.state.config.globalFrame;
    const start = this.state.config.globalFrame + 1;
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
  handleChangeConfig = (type, value) => {
    if (type === "globalFrame") {
      // バリデーションここでやる
      if (value < 0) {
        return;
      }
      if (value >= this.state.config.maxFrame) {
        return;
      }
    }
    this.setState((preConfig) => {
      preConfig.config[type] = parseInt(value);
      return preConfig;
    });
  };
  handleChangeMaterial = (type, value) => {
    this.setState((preConfig) => {
      preConfig.material[type] = value;
      return preConfig;
    });
  };
  handleLoadImage = (dataUrl) => {
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
          msg: "",
        });
      })
      .catch((error) => {
        if (error.message === "width") {
          this.setState({ msg: "素材画像の横幅が正しくないようです。" });
        }
        if (error.message === "height") {
          this.setState({ msg: "素材画像の縦幅が正しくないようです。" });
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
          msg: "",
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
      this.handleChangeConfig("globalFrame", this.state.config.globalFrame - 1);
    }
    if (event.key === "ArrowRight") {
      if (this.playerRef.current.pause !== null) {
        this.playerRef.current.pause();
      }
      this.handleChangeConfig("globalFrame", this.state.config.globalFrame + 1);
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
  render() {
    return (
      <>
        <Global styles={normalize}></Global>
        <Global styles={styles.global}></Global>
        <div className="App" css={styles.container}>
          <div className="effect">
            <Material
              material={this.state.material}
              loadImage={this.handleLoadImage}
              changeTrColor={this.handleChangeTrColor}
              msg={this.state.msg}
              changeMaterial={this.handleChangeMaterial}
            />
            <Player
              material={this.state.material}
              frameConfig={this.state.config}
              changeConfig={this.handleChangeConfig}
              celConfigList={this.state.celConfigList}
              ref={this.playerRef}
            />
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
            frameConfig={this.state.config}
            handleChangeConfig={this.handleChangeConfig}
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
    page: { start: 1, end: 1 },
  };
}
