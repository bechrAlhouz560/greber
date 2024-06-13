const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
import {createGzip} from 'zlib';
import {pipeline} from 'stream'
import {
  createReadStream,
  createWriteStream
} from 'fs';
import { promisify } from 'util';


const pipe  = promisify(pipeline);



export async function compressData () {
    
    const gzip = createGzip();
    const source = createReadStream('input.txt');
    const destination = createWriteStream('input.txt.gz');

    const result = await pipeline(source, gzip, destination);
    result.on('pipe', function (src) {
        console.log(src.readableEnded)
    })
}

export var createHash = function (key) {
    var hash = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
    return hash
}

export var encrypt = function (hash,buffer)  {
    // Create an initialization vector
    const iv = crypto.randomBytes(16);
    // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv(algorithm, hash, iv);
    // Create the new (encrypted) buffer
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return result;
};

export var decrypt = (hash,encrypted) => {
    // Get the iv: the first 16 bytes
    const iv = encrypted.slice(0, 16);
    // Get the rest
    encrypted = encrypted.slice(16);
    // Create a decipher
    const decipher = crypto.createDecipheriv(algorithm, hash, iv);
    // Actually decrypt it
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return result;
};

