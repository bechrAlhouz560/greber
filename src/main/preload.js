// soon to be implimented
const { ipcRenderer } = require("electron");
console.log("preloading...");

window.ipcRenderer = ipcRenderer;
