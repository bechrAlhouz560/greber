import React from "react";
import { useContext } from "react";
import { ErrorContext } from "../../App.jsx";
import "./dialogs.css";

import { FiAlertCircle, FiX } from "react-icons/fi";
export default function ErrorDialog() {
  const { error, setError } = useContext(ErrorContext);
  return (
    <div className="error-dialog-container">
      <div className="error-dialog">
        <div
          className="error-title"
          style={{
            background: error.warn ? "#d29034" : "",
          }}
        >
          <h1>
            {error.warn ? <FiAlertCircle /> : <FiX />} {error.title}
          </h1>
        </div>
        <div className="error-msg">
          <span> {error.message}</span>
        </div>
        <div className="error-btns">
          <div
            className="error-btn"
            style={{
              background: error.warn ? "rgb(210, 144, 52)" : "",
            }}
            onClick={function () {
              setError({});
            }}
          >
            <span>Ok</span>
          </div>
        </div>
      </div>
    </div>
  );
}
