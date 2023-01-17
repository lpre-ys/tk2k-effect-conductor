module.exports = (app, mainWindow, i18n, open) => {
  let menu = [];

  // ファイル
  const file = {
    label: i18n.t("file"),
    submenu: [
      {
        label: i18n.t("new"),
        click: () => {
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
      { type: "separator" },
      { role: "close", label: i18n.t("exit") },
    ],
  };
  menu.push(file);
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
