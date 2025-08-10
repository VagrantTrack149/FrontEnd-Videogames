const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readDir: (path) => ipcRenderer.invoke('read-dir', path),
  getGameImage: (gameName) => ipcRenderer.invoke('get-game-image', gameName),
  executeGame: (path) => ipcRenderer.invoke('execute-game', path)
});