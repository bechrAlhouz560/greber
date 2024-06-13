import { BrowserWindow , } from "electron";
const remoteMain = require('@electron/remote/main');
import path from "path";
import img from './assets/1x/logo_min.png';


let mainWindow = null

// this is the white board window
export default function openNotepad() {
    if (!mainWindow || mainWindow.isDestroyed())
    {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            width:  350,
            height: 600,

            resizable : false,
            icon: path.resolve(__dirname, img),
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: NOTEPAD_PRELOAD_WEBPACK_ENTRY,
                // devTools : false

            },

            frame : false

        });
        remoteMain.enable(mainWindow.webContents);
        // and load the index.html of the app.
        mainWindow.loadURL(NOTEPAD_WEBPACK_ENTRY);
    
        

    }
    else
    {
        if (!mainWindow.isVisible())
        {
            mainWindow.show();
        }
        mainWindow.focus();
    }
    return mainWindow;
}