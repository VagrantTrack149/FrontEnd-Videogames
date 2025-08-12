const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Carpeta para almacenar los accesos directos e imágenes
const gamesFolder = path.join(app.getPath('userData'), 'games');
if (!fs.existsSync(gamesFolder)) {
  fs.mkdirSync(gamesFolder, { recursive: true });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: 'D:/Documentos/FrontEnd/preload.js',
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false,
            sandbox: true
    }
  });

  win.loadFile('src/renderer/index.html');
};

app.whenReady().then(() => {
  createWindow();

  // Obtener lista de juegos
  ipcMain.handle('get-games', async () => {
    try {
      const files = fs.readdirSync(gamesFolder);
      console.log(gamesFolder);
      return files.filter(file => file.endsWith('.json')).map(file => {
        const gameData = JSON.parse(fs.readFileSync(path.join(gamesFolder, file), 'utf-8'));
        return {
          id: path.basename(file, '.json'),
          ...gameData
        };
      });
    } catch (error) {
      return [];
    }
  });

  // Añadir nuevo juego
  ipcMain.handle('add-game', async (event, gameData) => {
    try {
      const id = Date.now().toString();
      const gamePath = path.join(gamesFolder, `${id}.json`);
      const imagePath = path.join(gamesFolder, `${id}.png`);
      
      // Guardar metadatos del juego
      fs.writeFileSync(gamePath, JSON.stringify({
        name: gameData.name,
        exePath: gameData.exePath,
        addedDate: new Date().toISOString(),
        imagePath: imagePath
      }));
      
      // Guardar imagen si existe
      if (gameData.imageData) {
        const base64Data = gameData.imageData.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(imagePath, base64Data, 'base64');
      }
      
      return id;
    } catch (error) {
      console.error('Error adding game:', error);
      return null;
    }
  });

  // Ejecutar juego
  ipcMain.handle('execute-game', (event, exePath) => {
    exec(`"${exePath}"`, (error) => {
      if (error) console.error('Error executing game:', error);
    });
  });

 // Handler para abrir diálogo de archivos
    ipcMain.handle('open-file-dialog', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Ejecutables', extensions: ['exe', 'lnk', 'app', 'sh'] },
                { name: 'Todos los archivos', extensions: ['*'] }
            ]
        });
        return canceled ? null : filePaths[0];
    });


    //Handler para guardar la imagen del juego
    ipcMain.handle('save-image', async (event, gameId, imageData) => {
      const imagePath = path.join(gamesFolder, `${gameId}.png`);
      const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync(imagePath, base64Data, 'base64');
      return imagePath;
    });
    
//Handler para obtener la ruta de la imagen del juego
  ipcMain.handle('get-image-path', (event, gameId) => {
    const imagePath = path.join(gamesFolder, `${gameId}.png`);
    if (fs.existsSync(imagePath)) {
        const imageBuffer= fs.readFileSync(imagePath);
        return `data:image/png;base64,${imageBuffer.toString('base64')}`;
    }
    return null;
  });
//Handleer para actualizar el juego
  ipcMain.handle('update-game', async (event, gameId, gameData) => {
    try {
      const gamePath = path.join(gamesFolder, `${gameId}.json`);
      const imageData= path.join(gamesFolder, `${gameId}.png`);

      fs.writeFileSync(gamePath, JSON.stringify({
        name:gameData.name,
        exePath: gameData.exePath,
        addedDate: gameData.addedDate,
        imagePath: imagePath
      }));
      if (gameData.imageData) {
        //Tengo que rehacerlo no sirve.
        const base64Data = gameData.imageData.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(imageData, base64Data, 'base64');
      }else{
        if (fs.existsSync(imageData)) {
          fs.unlinkSync(imageData);
        }
      }
      return true;
    }catch(error){
      console.error('Error actualizando game:', error);
      return false;
    }
  });
});

ipcMain.handle('delete-game', async (event, gameId) => {
  try{
    const gamePath= path.join(gamesFolder, `${gameId}.json`);
    const imagePath= path.join(gamesFolder, `${gameId}.png`);

    if (fs.existsSync(gamePath)) {
      fs.unlinkSync(gamePath);
    }else{}

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    return true;
  }catch(error){
    console.error('error borrando: ', error);
    return false;
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});