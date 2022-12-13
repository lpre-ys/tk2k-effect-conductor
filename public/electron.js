const { BrowserWindow, app, ipcMain, Menu, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const {
  tk2k,
  getEmptyData,
  write,
  read,
  parser,
} = require("tk2k-clipdata");

let mainWindow;

const template = Menu.buildFromTemplate([
  {
    label: "ファイル",
    submenu: [
      {
        label: "新規作成",
        click: () => {
          mainWindow.webContents.send("new", {});
        },
      },
      { type: "separator" },
      {
        label: "開く",
        click: () => {
          dialog
            .showOpenDialog(mainWindow, {
              properties: ["openFile"],
              filters: [
                {
                  name: "Effect Data",
                  extensions: ["json"],
                },
              ],
            })
            .then(({ canceled, filePaths }) => {
              if (canceled) {
                return;
              }
              loadFile(filePaths[0]);
            });
        },
      },
      {
        label: "保存",
        click: () => {
          mainWindow.webContents.send("save", {});
        },
      },
      { type: "separator" },
      { role: "close", label: "終了" },
    ],
  },
]);

Menu.setApplicationMenu(template);

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1080,
    useContentSize: true,
    webPreferences: {
      preload: path.resolve(__dirname, "../electron/preload.js"),
    },
    icon: path.resolve(__dirname, "../asset/icon.png"),
  });

  mainWindow.loadFile("build/index.html");
  // mainWindow.webContents.openDevTools();
};
// Passthrough is not supported, GL is disabled, ANGLE is とか言うエラーを消すヤツ
app.disableHardwareAcceleration();

app.whenReady().then(createWindow);

app.once("window-all-closed", () => app.quit());

ipcMain.handle("save-state-data", (event, data) => {
  dialog
    .showSaveDialog(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "Effect Data", extensions: ["json"] }],
    })
    .then(({ canceled, filePath }) => {
      if (canceled) {
        return;
      }
      // ファイル保存処理
      writeFile(filePath, JSON.stringify(data));
    });
});

function writeFile(path, data) {
  fs.writeFile(path, data, (error) => {
    if (error !== null) {
      dialog.showErrorBox(
        "ファイル保存エラー",
        ["ファイルの保存に失敗しました。", `Error: ${error}`].join("\\n")
      );
      return;
    }
  });
}

function loadFile(path) {
  fs.readFile(path, (error, data) => {
    if (error !== null) {
      dialog.showErrorBox(
        "ファイル読み込みエラー",
        ["ファイルの読み込みに失敗しました", `Error: ${error}`].join("\\n")
      );
    }
    mainWindow.webContents.send("load", data.toString());
  });
}

ipcMain.handle("read-info", () => {
  console.log("read-info");

  return read(tk2k.ANIME)
    .then((data) => {
      const result = {};
      result.title = parser.parseString(data.title.raw);
      result.material = parser.parseString(data.material.raw);
      result.target = parser.parseBer(data.target.raw);
      result.yLine = parser.parseBer(data.yLine.raw);
      result.rawEffect = data.effectList.raw;

      return result;
    })
    .catch((error) => {
      console.log(error);
    });
});

ipcMain.handle("write-anime", (event, { frameList, info }) => {
  console.log("write-anime!!!");

  const anime = getEmptyData(tk2k.ANIME);
  anime.title.data = info.title;
  anime.material.data = info.image;
  anime.target.data = info.target;
  anime.yLine.data = info.yLine;

  if (info.rawEffect) {
    anime.effectList.raw = info.rawEffect;
  }

  // フレームデータの生成
  const frameData = [];
  frameList.forEach((cels, frameNo) => {
    const celList = cels.map((cel, celIndex) => {
      const celObj = getEmptyData(tk2k.ANIME_CEL);
      celObj.pattern.data = cel.pageIndex - 1;
      celObj.x.data = cel.x;
      celObj.y.data = cel.y;
      celObj.scale.data = cel.scale;
      celObj.alpha.data = cel.opacity;
      return { id: celIndex + 1, data: celObj };
    });
    const frame = getEmptyData(tk2k.ANIME_FRAME);
    frame.celList.data = celList;
    frameData.push({ id: frameNo, data: frame });
  });

  anime.frameList.data = frameData;

  write(tk2k.ANIME, anime).then(() => {
    console.log("done");
  });
});
