const { app, autoUpdater, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const imagePath =  path.join(__dirname, "..", 'icons/learnhub.png');
  console.log(imagePath);
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: imagePath,
    show: false,
  });
  mainWindow.loadURL('https://learnhub.nordicgamelab.org');

  const splash = new BrowserWindow({ 
    width: 600, 
    height: 500, 
    transparent: true, 
    frame: false, 
    alwaysOnTop: true ,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });
  
  splash.loadFile('html/splash.html');
  splash.center();
  setTimeout(function () {
    splash.close();
    mainWindow.center();
    mainWindow.show();
  }, 5000);
};

ipcMain.handle('getAppVersion', async (event, someArgument) => {
  console.log(someArgument);
  const result = await app.getVersion();
  return result
})

  if(app.isPackaged){
    const url = `https://downloads.nordicgamelab.org/update/${process.platform}/${app.getVersion()}`;
    autoUpdater.setFeedURL({ url });
    setInterval(() => {
      autoUpdater.checkForUpdates()
    }, 900000);
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart LearnHub to apply the updates.'
      }
      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
      })
    })
    autoUpdater.on('error', (message) => {
      console.error('There was a problem updating LearnHub. Please try again')
      console.error(message)
    })
  }
  console.log(app.getVersion());

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
