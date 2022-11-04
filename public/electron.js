const {
  BrowserWindow,
  app,
  ipcMain,
  clipboard,
  Menu,
  dialog,
} = require("electron");
const path = require("path");
const iconv = require("iconv-lite");
const fs = require("fs");

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
  });

  mainWindow.loadFile("build/index.html");
  mainWindow.webContents.openDevTools();
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

ipcMain.handle("write-anime", (event, { frameList, title, materialName }) => {
  console.log("write-anime!!!");

  const animeData = [];
  // タイトル、素材名の設定
  const titleArray = new Uint8Array(iconv.encode(title, "Shift_JIS"));
  animeData.push(1);
  animeData.push(titleArray.length);
  animeData.push(...titleArray);
  const materialArray = new Uint8Array(iconv.encode(materialName, "Shift_JIS"));
  animeData.push(2);
  animeData.push(materialArray.length);
  animeData.push(...materialArray);

  animeData.push(6, 1, 0, 9, 1, 0, 10, 1, 1, 12); // フラッシュ設定など、変更予定が無い部分

  // フレームデータの生成
  const frameData = [];
  frameList.forEach((cellList, frameNo) => {
    frameData.push(frameNo + 1);
    frameData.push(1); // セル情報ID
    if (cellList.length === 0) {
      // 無をプッシュする
      frameData.push(1, 0); // 表示無し
    } else {
      const celInfo = [];
      celInfo.push(cellList.length);

      cellList.forEach((cel, celNo) => {
        celInfo.push(celNo + 1);
        celInfo.push(...makeCellData(cel));
      });

      celInfo.unshift(celInfo.length); // celデータ全体の長さを頭に入れる
      frameData.push(...celInfo);
    }
    frameData.push(0); // frameの終端
  });
  frameData.push(0); //終端

  // フレームデータの結合
  animeData.push(...parseBER(frameData.length));
  animeData.push(frameList.length);
  animeData.push(...frameData);

  // ヘッダ生成
  const dataLength = animeData.length;

  const header = new ArrayBuffer(4);
  const view = new DataView(header);
  view.setUint32(0, dataLength, true);
  animeData.unshift(1, 0, 0, 0);
  animeData.unshift(...new Uint8Array(header));

  clipboard.writeText(animeData.join(","));
  console.log(animeData.join(","));

  return new Promise((resolve, reject) => {
    const spawn = require("child_process").spawn;
    const child = spawn("powershell.exe", [
      "-ExecutionPolicy",
      "RemoteSigned",
      "./fallback/write.ps1",
    ]);

    child.on("exit", (code) => {
      console.log("PS exit. code:", code);
      if (code === 0) {
        console.log("Exit");
        resolve();
      } else {
        reject(code);
      }
    });

    child.stdout.setEncoding("utf-8");
    child.stdout.on("data", function (data) {
      console.log("on stdout data");
      console.log(data);
    });

    child.stderr.on("data", function (data) {
      console.log("Powershell Errors: " + data);
    });

    child.stdin.end();
  });
});

function makeCellData(cell) {
  // frame viewは固定なので初期値にセットしておく(1, 1)
  const data = [1, 1];
  if (cell.pageIndex > 1) {
    data.push(...makeBERData(2, cell.pageIndex - 1));
  }
  // X座標
  data.push(...makeBERData(3, cell.x));
  // Y座標
  data.push(...makeBERData(4, cell.y));
  // 拡大率
  if (cell.scale !== 100) {
    data.push(...makeBERData(5, cell.scale));
  }
  // 透明度
  if (cell.opacity !== 0) {
    data.push(...makeBERData(10, cell.opacity));
  }
  // 終端
  data.push(0);
  // dataの長さを最初にunshift
  data.unshift(data.length);

  return data;
}

function parseBER(number) {
  // 数字がマイナスの場合、反転させるため数字を足す
  if (number < 0) {
    number += 4294967296;
  }
  const result = [];
  let rem = number % 128;
  let div = parseInt(number / 128);
  result.push(rem);
  while (div > 0) {
    rem = div % 128;
    div = parseInt(div / 128);
    result.push(rem + 128);
  }

  return result.reverse();
}

function makeBERData(id, number) {
  const data = [];
  data.push(id);
  const value = parseBER(number);
  data.push(value.length);
  data.push(...value);

  return data;
}
