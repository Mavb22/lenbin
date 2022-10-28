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
  // const extpassword = /^(?=.*[A-Z].*[A-Z])(?=.*\d{1,3})(?=.*[\u0021-\u002b\u003c-\u0040].*[\u0021-\u002b\u003c-\u0040].*[\u0021-\u002b\u003c-\u0040])(?=.*[a-z].*[a-z])\S{8,10}$/g;
  const extpassword = /^(?=.*[a-z].*[a-z])(?=.*[A-Z].*[A-Z])(?=.*\d)(?=.*[/$@$!%*?&].*[/$@$!%*?&].*[/$@$!%*?&])[A-Za-z\d/$@$!%*?&]{8,15}/g;
  //Iniciar la llave secreta
  // let key = process.env.KEY;
  //Iniciar el VI (vector inicial)
  // let iv = "H98zM6i/55yNJfkFs"
  // let iv = key.slice(0,16);
  //Create Key
  // key = CryptoJS.enc.Utf8.parse(key);
  //Get Iv
  // iv = CryptoJS.enc.Utf8.parse(iv);
  // const obt = ctx.request.body;
  // Encriptar los datos del body
  // for (const llave in obt) {
    //   if (llave !=='email') {
      //     let encrypted = CryptoJS.AES.encrypt(obt[llave], key,{ iv: iv}).toString();
      //     ctx.request.body[llave] = encrypted;
      //     const decrypted = CryptoJS.AES.decrypt(encrypted, key,{ iv: iv}).toString(CryptoJS.enc.Utf8)
      //     console.log(encrypted)
      //   }
      // }
      // Enviar los datos al siguiente middleware
  if(!extpassword.test(password)){
    return ctx.send({msj:'La contraseña no cumpre con los criterios'})
  }
  const hash = await bcrypt.hash(password, 10);
  ctx.request.body.password = hash;
  return await next();
  // ctx.request.body.email = obt.email;
  // ctx.send({
  //   msj: "Esta listo",
  //   body:ctx.request.body
  // })
  //Enviar el request al next

}
