const { app, BrowserWindow } = require('electron')

function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })

    win.loadFile('index.html')

    win.webContents.openDevTools({mode: 'undocked'});
  }

  app.whenReady().then(() => {
    createWindow()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  try {
    require('electron-reloader')(module)
} catch(_) {}