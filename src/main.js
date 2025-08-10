const {app, BrowserWindow}= require('electron')

const createWindow=()=>{
    const win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration:true,
            preload:'D:/Documentos/FrontEnd/preload.js',
            contextIsolation:false,
        }
    })
    win.loadFile('src/renderer/index.html')
}

app.whenReady().then(()=>{
    createWindow()
})

app.on('window-all-closed',()=>{
    if(process.platform !== 'windows'){
        app.quit()
    }
})
    