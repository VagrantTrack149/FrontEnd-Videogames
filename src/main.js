const {app, BrowserWindow, ipcMain}= require('electron')

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

    ipcMain.handle('read-dir', async (event,dirOath) => {
    const fs = require('fs');
    try {
        const files = await fs.readdirSync(dirOath);
        return files.filter(file => file.endsWith('.exe') || file.endsWith('.lnk')) || file.endsWith('.url');
    } catch (error) {
        console.error('Error leyendo el directorio:', error);
        throw error;
    }
});

    ipcMain.handle('get-game-image',async(event, gameName)=>{
        const staticPath=path.join(__dirname,'static');
        const imagePath=path.join(staticPath,gameName+'.png');
        if(fs.existsSync(imagePath)){
            return imagenPath;
        }
        return null;
    })

    ipcMain.handle('execute-game',(event,gamePath) =>{
        exec(gamePath,(error)=>{
            if(error){
                console.error("Error abriendo el juego",error)
            }
        })
    })
})

app.on('window-all-closed',()=>{
    if(process.platform !== 'windows'){
        app.quit()
    }
})

