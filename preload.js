const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getGames: () => ipcRenderer.invoke('get-games'),
  addGame: (gameData) => ipcRenderer.invoke('add-game', gameData),
  executeGame: (exePath) => ipcRenderer.invoke('execute-game', exePath),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  convertImageToBase64: (filePath) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(filePath);
    });
  }
});