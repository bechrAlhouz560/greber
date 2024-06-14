import { app, dialog } from "@electron/remote";
import { copyFile, copyFileSync, unlink } from "fs";
import { toBase64, toBase64Sync } from "./copy";
import { coversPath, getCoverPath } from "./getAppData";
import { promisify } from "util";

import path from "path";
import { isDev } from "./globals";

export default async function uploadFile(message, mime, isBase64, types) {
  try {
    let file = await dialog.showOpenDialog({
      message: message,
      properties: ["openFile"],
      filters: [{ extensions: types }],
    });
    let filePath = file.filePaths[0];
    if (filePath) {
      if (isBase64) {
        let dataUrl = await toBase64(filePath, mime);
        return dataUrl;
      }
      return filePath;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
}

export async function removeCover(coverId) {
  try {
    await promisify(unlink)(getCoverPath(coverId));
    return coverId;
  } catch (error) {
    console.log("remove cover error");
  }
}
export function uploadCover(coverId, _path) {
  return new Promise(function (resolve, reject) {
    function copy(file) {
      if (!file.canceled) {
        const filePath = file?.filePaths ? file?.filePaths[0] : file;
        let coverPath = path.resolve(coversPath, `${coverId}.jpeg`);

        copyFileSync(filePath, coverPath);
        coverPath = getCoverPath(coverId);

        resolve(coverPath);
      } else {
        resolve(file);
      }
    }
    if (!_path) {
      dialog
        .showOpenDialog(null, {
          message: "Upload Image",
          properties: ["openFile"],
          filters: [{ extensions: ["jpeg", "jpg", "png"] }],
        })
        .then((file) => copy(file));
    } else {
      copy(_path);
    }
  });
}

export function handleURL(url) {
  let dev = isDev();
  return url ? (dev ? toBase64Sync(url, "image") : url) : null;
}
