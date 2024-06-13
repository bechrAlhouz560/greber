import { ipcRenderer } from "electron";
import * as React from "react";
import { useEffect } from "react";
import * as ReactDOM from "react-dom";
import App from "./app/App.jsx";
import greberDB from "./app/db/main.js";
import fs from "fs";
import { coversPath } from "./utils/getAppData";
import Loading from "./app/components/dialogs/Loading.jsx";

function Main() {
  const [loading, setLoading] = React.useState(true);
  useEffect(function () {
    greberDB.init().then(function () {
      // creating necessary folders for uploaded files
      if (!fs.existsSync(coversPath)) {
        fs.mkdirSync(coversPath);
      }
      ipcRenderer.send("create-tray");
      console.log("loaded !");

      setLoading(false);
    });
  }, []);
  return <>{loading ? <Loading /> : <App />}</>;
}

export default function render() {
  ReactDOM.render(<Main />, document.getElementById("app"));
}
