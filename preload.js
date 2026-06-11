const {
  ipcRenderer,
  contextBridge,
  // shell: { openExternal },
} = require("electron");

// // Notification
contextBridge.exposeInMainWorld("Notif", {
  send: (_msg) => ipcRenderer.send("Notif", _msg),
});

// Helpers
contextBridge.exposeInMainWorld("Preload", {
  // OpenLink: (_link) => openExternal(_link),
  OpenLink: (_link) => console.log(_link),
});
