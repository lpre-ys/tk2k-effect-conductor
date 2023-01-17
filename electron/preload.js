const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("tk2k", {
  writeData: async (args) => {
    return await ipcRenderer.invoke("write-anime", args);
  },
  readInfo: async (args) => {
    return await ipcRenderer.invoke("read-info", args);
  },
});

contextBridge.exposeInMainWorld("appMenu", {
  onReceiveNew: (listener) => {
    ipcRenderer.on("new", (event, ...arg) => {
      listener(...arg);
    });
  },
  onReceiveSave: (listener) => {
    ipcRenderer.on("save", (event, ...arg) => {
      listener(...arg);
    });
  },
  onReceiveLoad: (listener) => {
    ipcRenderer.on("load", (event, ...arg) => {
      listener(...arg);
    });
  },
  onReceiveLanguage: (listener) => {
    ipcRenderer.on("lang", (event, ...arg) => {
      listener(...arg);
    });
  },
  saveData: async (args) => {
    await ipcRenderer.invoke("save-state-data", args).then((result) => {
      return result;
    });
  },
});
