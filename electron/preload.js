const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("initArgs", {
  "lang": () => {
    const arg = process.argv.find((arg) => /storedLanguage=/.test(arg));
    return arg ? arg.split('=').pop() : false;
  }
});

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
  onReceiveUndo: (listener) => {
    ipcRenderer.on("undo", (event, ...arg) => {
      listener(...arg);
    });
  },
  onReceiveRedo: (listener) => {
    ipcRenderer.on("redo", (event, ...arg) => {
      listener(...arg);
    });
  },
  onReceiveSaveAs: (listener) => {
    ipcRenderer.on("saveAs", (event, ...arg) => {
      listener(...arg);
    });
  },
  markDirty: () => ipcRenderer.send("mark-dirty"),
  onRequestState: (listener) => {
    ipcRenderer.on("request-state", (event, ...arg) => {
      listener(...arg);
    });
  },
  respondState: (data) => ipcRenderer.send("state-response", data),
  saveData: async (args) => {
    return await ipcRenderer.invoke("save-state-data", args);
  },
  saveDataAs: async (args) => {
    return await ipcRenderer.invoke("save-state-data-as", args);
  },
});
