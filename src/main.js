const { app, BrowserWindow, ipcMain } = require("electron");
import { createWindow } from "./mainWindow";
import openNotepad from "./notepad";
import { createTray } from "./tray";

// Activate the Auto Launcher of the app
// var AutoLaunch = require('auto-launch');
// var autoLauncher = new AutoLaunch({
//     name : app.getName(),
//     path : app.getPath('exe')
// });
// // Checking if autoLaunch is enabled, if not then enabling it.
// autoLauncher.isEnabled().then(function(isEnabled) {
//   if (isEnabled) return;
//    autoLauncher.enable();
// }).catch(function (err) {
//   throw err;
// });

const lock = app.requestSingleInstanceLock();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const remoteMain = require("@electron/remote/main");

/* add this before the enable function */
remoteMain.initialize();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("log", function (e, ...args) {
  console.log(...args);
});

// watching for renderer commands
ipcMain.on("close-window", function (ev) {
  let win = BrowserWindow.fromWebContents(ev.sender);
  win.close();
});
ipcMain.on("minimize-window", function (ev) {
  let win = BrowserWindow.fromWebContents(ev.sender);
  win.minimize();
});
ipcMain.on("hide-window", function (ev) {
  let win = BrowserWindow.fromWebContents(ev.sender);
  win.hide();
});

ipcMain.on("create-tray", createTray);

ipcMain.on("open-notepad", openNotepad);
