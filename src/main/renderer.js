// import css files and fonts

import "./css/variables.css";
import "./css/globals.css";
// import Components
import render from "./index.jsx";

let log = console.log;

console.log = function (message, ...optionalParams) {
  log(message, ...optionalParams);
  window.ipcRenderer.send("log", message, ...optionalParams);
};
render();
