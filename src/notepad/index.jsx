import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app/App.jsx";
import "./styles.css";

export default function render() {
  ReactDOM.render(<App />, document.getElementById("app"));
}
