import { app, dialog } from "@electron/remote";
import { copyFile, unlink } from "fs";
import { toBase64, toBase64Sync } from "./copy";
import { getCoverPath } from "./getAppData";
import { promisify } from "util";
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
    console.log(error);
  }
}
export function uploadCover(coverId, _path) {
  return new Promise(function (resolve, reject) {
    function copy(file) {
      if (!file.canceled) {
        const filePath = file?.filePaths ? file?.filePaths[0] : file;
        const coverPath = getCoverPath(coverId);
        copyFile(filePath, coverPath, function () {
          resolve(coverPath);
        });
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
  let dev = 1;
  url ? (dev ? toBase64Sync(url, "image") : url) : null;
}
