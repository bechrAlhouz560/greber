
import { app , BrowserWindow } from "electron";
import path from "path";
import img from './assets/1x/logo_min.png';

const remoteMain = require("@electron/remote/main");
let mainWindow = null
// this is the main window of the app
export const createWindow = () => {
  // Create the browser window.
  // insure that is only one main window opened 
  // (to prevent database errors when another window is opened)


  if (!mainWindow || mainWindow.isDestroyed()) {
    mainWindow = new BrowserWindow({
      minWidth: 1000,
      minHeight: 500,
      icon: path.resolve(__dirname, img),
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        // devTools : false


      },
      frame: false

    });
    remoteMain.enable(mainWindow.webContents);
    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // quiting the app from the main window to prevent unwanted errors
    mainWindow.on('close', app.quit);
    
  } else {
    if (!mainWindow.isVisible())
    {
        mainWindow.show();
    }
    mainWindow.focus();
  }

  return mainWindow

};
