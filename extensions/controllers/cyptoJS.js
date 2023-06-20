const CryptoJS = require("crypto-js");
let key = process.env.KEY;
//Iniciar el VI (vector inicial)
let iv = key.slice(0,16);
//Create Key
key = CryptoJS.enc.Utf8.parse(key);
//Get Iv
iv = CryptoJS.enc.Utf8.parse(iv);

module.exports = {
  key,
  iv,
  CryptoJS
}
