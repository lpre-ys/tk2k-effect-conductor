const {
  BrowserWindow,
  app,
  ipcMain,
  Menu,
  dialog,
  shell,
} = require("electron");
const path = require("path");
const fs = require("fs");
const { tk2k, getEmptyData, write, read, parser } = require("tk2k-clipdata");
const i18n = require("./configs/i18next.config");
const menuTemplate = require("./menuTemplate");
const ElectronStore = require("electron-store");

const store = new ElectronStore();
let mainWindow;
let currentFilePath = null;
let isDirty = false;
let isClosing = false;

const getWindowTitle = (filePath, dirty) => {
  const base = filePath ? `${path.basename(filePath)} - Effect Conductor` : "Effect Conductor";
  return dirty ? `* ${base}` : base;
};

const updateWindowTitle = (filePath) => {
  mainWindow.setTitle(getWindowTitle(filePath, isDirty));
};

const setClean = () => {
  isDirty = false;
  mainWindow.setTitle(getWindowTitle(currentFilePath, false));
};

const resetCurrentFile = () => {
  currentFilePath = null;
  isDirty = false;
  mainWindow.setTitle(getWindowTitle(null, false));
};

const openFile = () => {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ["openFile"],
      defaultPath: store.get("savePath", app.getPath("documents")),
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
      store.set("savePath", path.dirname(filePaths[0]));
      currentFilePath = filePaths[0];
      isDirty = false;
      updateWindowTitle(filePaths[0]);
      loadFile(filePaths[0]);
    });
};
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1080,
    useContentSize: true,
    title: "Effect Conductor",
    webPreferences: {
      preload: path.resolve(__dirname, "./preload.js"),
      additionalArguments: [
        `storedLanguage=${store.get("lang", "ja")}`
      ]
    },
    icon: path.resolve(__dirname, "../asset/icon.png"),
  });

  mainWindow.loadFile("build/index.html");
  // mainWindow.webContents.openDevTools();

  // 外部URL表示関連
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("close", async (e) => {
    if (!isDirty) return;
    if (isClosing) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    isClosing = true;

    try {
      const { response } = await dialog.showMessageBox(mainWindow, {
        type: "warning",
        buttons: [i18n.t("save"), i18n.t("discard"), i18n.t("cancel")],
        defaultId: 0,
        cancelId: 2,
        message: i18n.t("unsavedChangesMessage"),
        detail: i18n.t("unsavedChangesDetail"),
      });

      if (response === 1) {
        setClean();
        mainWindow.close();
      } else if (response === 0) {
        const data = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            ipcMain.removeListener("state-response", handler);
            reject(new Error("state-response timeout"));
          }, 5000);
          const handler = (event, stateData) => {
            clearTimeout(timer);
            resolve(stateData);
          };
          ipcMain.once("state-response", handler);
          mainWindow.webContents.send("request-state");
        });
        if (currentFilePath) {
          await writeFile(currentFilePath, JSON.stringify(data));
          setClean();
        } else {
          await showSaveAsDialog(data);
        }
        if (!isDirty) mainWindow.close();
      }
    } catch {
      // 保存失敗またはタイムアウト: ウィンドウを閉じない
    } finally {
      isClosing = false;
    }
  });
};
// Passthrough is not supported, GL is disabled, ANGLE is とか言うエラーを消すヤツ
app.disableHardwareAcceleration();

app.whenReady().then(createWindow);

app.once("window-all-closed", () => app.quit());

// i18n関連
const preLang = store.get("lang", "ja");
i18n.on("loaded", (loaded) => {
  i18n.changeLanguage(preLang);
  i18n.off("loaded");
});

i18n.on("languageChanged", (lng) => {
  const menu = Menu.buildFromTemplate(
    menuTemplate(app, mainWindow, i18n, openFile, resetCurrentFile)
  );
  Menu.setApplicationMenu(menu);
  store.set("lang", lng);
});

function showSaveAsDialog(data) {
  return dialog
    .showSaveDialog(mainWindow, {
      defaultPath: store.get("savePath", app.getPath("documents")),
      filters: [{ name: "Effect Data", extensions: ["json"] }],
    })
    .then(({ canceled, filePath }) => {
      if (canceled) {
        return;
      }
      store.set("savePath", path.dirname(filePath));
      currentFilePath = filePath;
      return writeFile(filePath, JSON.stringify(data)).then(() => {
        setClean();
      });
    });
}

ipcMain.on("mark-dirty", () => {
  if (!isDirty) {
    isDirty = true;
    mainWindow.setTitle(getWindowTitle(currentFilePath, true));
  }
});

ipcMain.handle("save-state-data", (event, data) => {
  if (currentFilePath) {
    return writeFile(currentFilePath, JSON.stringify(data)).then(() => {
      setClean();
    });
  }
  return showSaveAsDialog(data);
});

ipcMain.handle("save-state-data-as", (event, data) => {
  return showSaveAsDialog(data);
});

function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (error) => {
      if (error !== null) {
        dialog.showErrorBox(
          "ファイル保存エラー",
          ["ファイルの保存に失敗しました。", `Error: ${error}`].join("\n")
        );
        reject(error);
        return;
      }
      resolve();
    });
  });
}

function loadFile(path) {
  fs.readFile(path, (error, data) => {
    if (error !== null) {
      dialog.showErrorBox(
        "ファイル読み込みエラー",
        ["ファイルの読み込みに失敗しました", `Error: ${error}`].join("\n")
      );
      currentFilePath = null;
      updateWindowTitle(null);
      return;
    }
    const str = data.toString();
    try {
      JSON.parse(str);
    } catch (e) {
      dialog.showErrorBox(
        "ファイル読み込みエラー",
        ["ファイルの読み込みに失敗しました。", "JSON形式が正しくありません。"].join("\n")
      );
      currentFilePath = null;
      updateWindowTitle(null);
      return;
    }
    mainWindow.webContents.send("load", str);
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
      result.rawEffect = Array.from(data.effectList.raw);

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
  anime.target.data = parseInt(info.target);
  anime.yLine.data = parseInt(info.yLine);

  if (info.rawEffect) {
    anime.effectList.raw = Array.isArray(info.rawEffect)
      ? info.rawEffect
      : Object.values(info.rawEffect);
  }

  // フレームデータの生成
  const frameData = [];
  frameList.forEach((cels, frameNo) => {
    const celList = cels.map((cel, celIndex) => {
      const celObj = getEmptyData(tk2k.ANIME_CEL);
      celObj.pattern.data = cel.pageIndex;
      celObj.x.data = cel.x;
      celObj.y.data = cel.y;
      celObj.scale.data = cel.scale;
      celObj.alpha.data = cel.opacity;
      celObj.r.data = cel.red;
      celObj.g.data = cel.green;
      celObj.b.data = cel.blue;
      celObj.sat.data = cel.tkSat;
      return { id: celIndex + 1, data: celObj };
    });
    const frame = getEmptyData(tk2k.ANIME_FRAME);
    frame.celList.data = celList;
    frameData.push({ id: frameNo, data: frame });
  });

  anime.frameList.data = frameData;

  return write(tk2k.ANIME, anime)
    .then(() => {
      console.log("done");
      return true;
    })
    .catch((error) => {
      dialog.showErrorBox(
        "エラー",
        ["データコピーに失敗しました", `Error: ${error.text}`].join("\n")
      );
      return false;
    });
});
