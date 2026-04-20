module.exports = (app, mainWindow, i18n, open, resetCurrentFile) => {
  let menu = [];

  // ファイル
  const file = {
    label: i18n.t("file"),
    submenu: [
      {
        label: i18n.t("new"),
        click: () => {
          resetCurrentFile();
          mainWindow.webContents.send("new", {});
        },
      },
      { type: "separator" },
      {
        label: i18n.t("open"),
        accelerator: "Ctrl+O",
        click: open,
      },
      {
        label: i18n.t("save"),
        accelerator: "Ctrl+S",
        click: () => {
          mainWindow.webContents.send("save", {});
        },
      },
      {
        label: i18n.t("saveAs"),
        accelerator: "Ctrl+Shift+S",
        click: () => {
          mainWindow.webContents.send("saveAs", {});
        },
      },
      { type: "separator" },
      { role: "close", label: i18n.t("exit") },
    ],
  };
  menu.push(file);
  // 編集
  const edit = {
    label: i18n.t("edit"),
    submenu: [
      {
        label: i18n.t("undo"),
        accelerator: "Ctrl+Z",
        registerAccelerator: false,
        click: () => {
          mainWindow.webContents.send("undo", {});
        },
      },
      {
        label: i18n.t("redo"),
        accelerator: "Ctrl+Y",
        registerAccelerator: false,
        click: () => {
          mainWindow.webContents.send("redo", {});
        },
      },
    ],
  };
  menu.push(edit);
  // 言語
  const lang = {
    label: i18n.t("language"),
    submenu: [
      {
        label: "日本語",
        type: "checkbox",
        checked: i18n.language === 'ja',
        click: () => {
          i18n.changeLanguage("ja");
          mainWindow.webContents.send("lang", {
            lang: "ja",
          });
        },
      },
      {
        label: "English",
        type: "checkbox",
        checked: i18n.language === 'en',
        click: () => {
          i18n.changeLanguage("en");
          mainWindow.webContents.send("lang", {
            lang: "en",
          });
        },
      },
    ],
  };
  menu.push(lang);

  return menu;
};
