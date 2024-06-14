import { app } from "@electron/remote";
import path from "path";
import { handleURL } from "./upload";

import cardBg from "../../assets/bg.png";
export const coversPath = path.resolve(getAppData(), "covers");

export function getCoverPath(coverId) {
  try {
    let _path = coverId
      ? handleURL(path.resolve(coversPath, `${coverId}.jpeg`))
      : null;

    return _path;
  } catch (error) {
    console.log(error);

    return cardBg;
  }
}
export default function getAppData() {
  let appName = app.getName();
  let appData = app.getPath("appData");
  return path.resolve(appData, appName);
}
