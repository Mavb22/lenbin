// /* Importing the libraries that are going to be used in the middleware. */
const CryptoJS = require("crypto-js") // Importar CryptoJS
const bcrypt = require("bcryptjs")// Importar bcryptjs
const dotenv = require('dotenv');// Importar dotenv
dotenv.config();
/* This is a middleware that encrypts the password and email of the user before sending it to the
database. */
module.exports = async (ctx, next) => {
  //Obtener los datos del body
  const {password,email} = ctx.request.body;
  //Validar si existe el email y password
  if (!password && !email) {
    ctx.body = {
      status: 400,
      message: 'Email and password are required'
    }
  }
  //Hashear la contraseña
  const hash = await bcrypt.hash(password, 10);
  //Iniciar la llave secreta
  let key = process.env.KEY;
  //Iniciar el VI (vector inicial)
  let iv = key.slice(0, 16);
  //Create Key
  key = CryptoJS.enc.Utf8.parse(key);
  //Get Iv
  iv = CryptoJS.enc.Utf8.parse(iv);
  // const obt = ctx.request.body;
  //Encriptar los datos del body
  // for (const llave in obt) {
  //   if (llave !=='email') {
  //     let encrypted = CryptoJS.AES.encrypt(obt[llave], key,{ iv: iv}).toString();
  //     ctx.request.body[llave] = encrypted;
  //     const decrypted = CryptoJS.AES.decrypt(encrypted, key,{ iv: iv}).toString(CryptoJS.enc.Utf8)
  //     console.log('decrypted',decrypted);
  //   }
  // }
  //Enviar los datos al siguiente middleware
  ctx.request.body.password = hash;
  // ctx.request.body.email = obt.email;
  //Enviar el request al next
  return await next();
}
