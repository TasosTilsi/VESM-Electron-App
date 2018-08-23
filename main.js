// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

const {autoUpdater}=require('electron-updater');
const log = require('electron-log');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow



function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 720})
  //mainWindow.setResizable(false)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
// Someone tried to run a second instance, we should focus our window.
if (mainWindow) {
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
}
});

if (shouldQuit) {
app.quit();
return;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  autoUpdater.quitAndInstall();
});
//------------------------------------------------------------//
const appVersion = require('./package.json').version;
const {ipcMain} = require('electron');
ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg);  // prints "ping"
    event.sender.send('asynchronous-reply', appVersion);
})

/*ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg);  // prints "ping"
    event.returnValue = appVersion;
  })*/