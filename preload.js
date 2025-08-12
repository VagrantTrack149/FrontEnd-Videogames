const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getGames: () => ipcRenderer.invoke('get-games'),
    addGame: (gameData) => ipcRenderer.invoke('add-game', gameData),
    executeGame: (exePath) => ipcRenderer.invoke('execute-game', exePath),
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    getImagePath: (gameId) => ipcRenderer.invoke('get-image-path', gameId),
    saveImage: (gameId, imageData) => ipcRenderer.invoke('save-image', gameId, imageData),
    updateGame:(gameId,gameData) => ipcRenderer.invoke('update-game', gameId, gameData),
    deleteGame: (gameId) => ipcRenderer.invoke('delete-game', gameId),
});