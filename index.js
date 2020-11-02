const {app, BrowserWindow,ipcMain, remote } = require('electron')
const {autoUpdater} = require('electron-updater');
require('jquery');
require('./assets/js/functions.js')
let win;


// Object.defineProperty(app, 'isPackaged', {
//     get() {
//       return true;
//     }
//   });



function createWindow(){
    win = new BrowserWindow({
        width:300,
        height:500,
        frame:false,
        transparent:false,
        icon:"./resources/icons/appIcon512px.png",
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule:true,
        }
    })

    win.loadFile('index.html');
}


function createLoginWindow(){
    win = new BrowserWindow({
        width:300,
        height:500,
        frame:false,
        transparent:false,
        icon:"./resources/icons/appIcon512px.png",
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule:true,
        }
    })

    win.loadFile('login.html');
    win.once('ready-to-show', () => {
    });
    
}

function createViewWindow(){
    win = new BrowserWindow({
        width:800,
        height:600,
        frame:false,
        transparent:false,
        icon:"./resources/icons/appIcon512px.png",
        webPreferences:{
            nodeIntegration:true,
            enableRemoteModule:true,
        }
    });
    win.loadFile('./viewInfo.html');
    
}

app.whenReady().then(createLoginWindow).then(autoUpdater.checkForUpdatesAndNotify());

app.on('window-all-closed', ()=>{
    if(process.platform !== "darwin"){
        app.quit();
    }
})

app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length == 0){
        createWindow();
        createLoginWindow();
        createViewWindow();
    }
})

ipcMain.on('viewInfo',(event,arg)=>{
    createViewWindow();
    event.returnValue = 'success';
})

ipcMain.on('logOut',(event,arg)=>{
    createLoginWindow();
    event.returnValue = 'success';
})

ipcMain.on('viewActivities',(event,arg)=>{
    createWindow();
    event.returnValue = 'success';
})

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

app.on('web-contents-created', (event, contents) => {
    if (contents.getType() === 'webview') {
      contents.on('will-navigate', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
      });
    }
  });

autoUpdater.on('update-available', () => {
    win.webContents.send('update_available');
  });
autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded');
});