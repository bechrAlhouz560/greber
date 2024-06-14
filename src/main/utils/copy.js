import fs from "fs";
import path from "path";
import { app } from "@electron/remote";

export function toBase64(filePath, mime) {
  return new Promise(function (resolve, reject) {
    let ext = path.extname(filePath).split(".")[1];
    fs.readFile(filePath, function (err, data) {
      if (!err) {
        let base64 = data.toString("base64");
        let dataUrl = `data:${mime}/${ext};base64,${base64}`;
        resolve(dataUrl);
      } else {
        reject(err);
      }
    });
  });
}

export function toBase64Sync(filePath, mime) {
  let ext = path.extname(filePath).split(".")[1];
  const data = fs.readFileSync(filePath);
  let base64 = data.toString("base64");
  let dataUrl = `data:${mime}/${ext};base64,${base64}`;

  return dataUrl;
}

export function activityPath() {
  let doc_path = app.getPath("documents");
  let greberDir = path.resolve(doc_path, "greber");
  if (!fs.existsSync(greberDir)) {
    fs.mkdirSync(greberDir);
  }
  let actPath = path.resolve(greberDir, "activity");

  if (!fs.existsSync(actPath)) {
    fs.mkdirSync(actPath);
  }
  return actPath;
}

export function copyFileActivity(activity, file) {
  return new Promise(function (resolve, reject) {
    let actDir = path.resolve(activityPath(), activity.id.toString());
    if (!fs.existsSync(actDir)) {
      fs.mkdir(actDir, function (err) {
        if (!err) {
          let filename = file.id + path.extname(file.path).toLowerCase();
          let newPath = path.resolve(actDir, filename);
          fs.copyFile(
            file.path,
            path.resolve(actDir, filename),
            function (err) {
              if (!err) {
                resolve({
                  file,
                  newPath,
                });
              } else {
                reject(err);
              }
            }
          );
        } else {
          reject(err);
        }
      });
    } else {
      let filename = file.id + path.extname(file.path).toLowerCase();
      let newPath = path.resolve(actDir, filename);
      fs.copyFile(file.path, path.resolve(actDir, newPath), function (err) {
        if (!err) {
          resolve({
            file,
            newPath,
          });
        } else {
          reject(err);
        }
      });
    }
  });
}
