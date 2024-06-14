import { Tray, Menu, MenuItem } from "electron";
import img from "./assets/1x/logo_min.png";

import path from "path";
import openNotepad from "./notepad";
import { createWindow } from "./mainWindow";

let tray;
export const menuItems = [
  new MenuItem({
    label: "Open Notepad",
    click: openNotepad,
  }),
  new MenuItem({
    label: "Exit",
    role: "quit",
  }),
];
export function createMenu() {
  const menu = new Menu();
  for (const item of menuItems) {
    menu.append(item);
  }
  return menu;
}

export function createTray() {
  if (!tray) {
    tray = new Tray(path.resolve(__dirname, img));
    tray.setContextMenu(createMenu());

    tray.on("click", createWindow);
  }
}
