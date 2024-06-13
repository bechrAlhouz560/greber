import { readFileSync, readdir } from "fs";
import { createHash, decrypt } from "../../utils/encryption";
import { coversPath } from "../../utils/getAppData";
import { createGzip } from "zlib";
import { pipeline } from "stream";
import { createWriteStream } from "fs";
import { promisify } from "util";
import path from "path";
import { toBase64 } from "../../utils/copy";

const pipe = promisify(pipeline);
const readDirAsync = promisify(readdir);

export async function compressData() {
  const files = await readDirAsync(coversPath);
  const gzip = createGzip();
  const destination = createWriteStream("D:/greber.data.gz");
  let source = {};
  try {
    for await (const cover of files) {
      source[cover] = await toBase64(path.resolve(coversPath, cover), "jpeg");
    }

    await pipe(JSON.stringify(source), gzip, destination);
  } catch (error) {
    console.log(error);
  }

  gzip.close();
}

export async function exportData(
  file = "D:/data.json",
  password = "bechralhouz"
) {
  // let data =  JSON.stringify(store.getState());
  // let encrypted = encrypt(createHash(password), data);

  // writeFileSync(file,encrypted)

  compressData()
    .then(function () {
      console.log("finished !");
    })
    .catch(function (error) {
      console.log(error);
    });
}

export async function importData(file, password) {
  let data = readFileSync(file);
  let decrypted = decrypt(createHash(password), data);

  return decrypted;
}
