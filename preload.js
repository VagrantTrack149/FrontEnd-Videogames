const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI',{
    ReadDir: () => ipcRenderer.invoke('read-dir'),
    ReadFiles: () => ipcRenderer.invoke('read-files'),
    ExcFile:() =>  ipcRenderer.invoke('exc-file')
});