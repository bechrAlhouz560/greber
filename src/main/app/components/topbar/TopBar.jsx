import styles from "./topbar.module.css";
import React from "react";
import { ipcRenderer } from "electron";
import { useState, useEffect } from "react";
import { FiMinus, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";

export function DateTime() {
  const [date, setDate] = useState();
  const activeRouter = useSelector((state) => state.router.activeRouter);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toUTCString();
      setDate(time);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("activeRouter", activeRouter);
  }, [activeRouter]);
  return (
    <div className={styles["datetime"]}>
      <span>{date}</span>
    </div>
  );
}
export default function () {
  return (
    <div className={styles["top-bar"]}>
      <div className={styles["body"]}>
        <span className={styles["title"]}>Greber</span>

        <DateTime />
      </div>
      <div className={styles["window-btns"]}>
        <div
          className={styles["win-btn"]}
          onClick={() => ipcRenderer.send("minimize-window")}
        >
          <span>
            <FiMinus />
          </span>
        </div>
        <div
          className={styles["win-btn"] + " " + styles["danger"]}
          onClick={() => ipcRenderer.send("hide-window")}
        >
          <span>
            <FiX />
          </span>
        </div>
      </div>
    </div>
  );
}
