// /* Importing the libraries that are going to be used in the middleware. */

const bcrypt = require("bcryptjs")// Importar bcryptjs
const dotenv = require('dotenv');// Importar dotenv
const { key, iv , CryptoJS} = require("../../extensions/controllers/cyptoJS");
const { sendEmail } = require("../../extensions/controllers/send_email");
dotenv.config();
/* This is a middleware that encrypts the password and email of the user before sending it to the
database. */
module.exports = async (ctx, next) => {
  // const {password,email} = ctx.request.body;
  // const url = 'http://localhost:4200/auth/email-validator/';
  // const SendEmail = await sendEmail(email, url, 'Pleace clcick  on the following link, or paste this into your browser to complete the process:', 'Forgot password', ctx,`Forgot your password ${email}` )
  // if(!SendEmail){
  //   ctx.throw(400, 'The email was not sent');
  // }
  // ctx.send({msj: "Check your email, a link is sent to change your password"})
  // Obtener los datos del body
  const {password,email} = ctx.request.body;
  const emailService = strapi.plugins.email.services.email;
  //Validar si existe el email y password
  if (!password && !email) {
    ctx.body = {
      status: 400,
      message: 'Email and password are required'
    }
  }
  //Hashear la contraseña
  // const extpassword = /^(?=.*[A-Z].*[A-Z])(?=.*\d{1,3})(?=.*[\u0021-\u002b\u003c-\u0040].*[\u0021-\u002b\u003c-\u0040].*[\u0021-\u002b\u003c-\u0040])(?=.*[a-z].*[a-z])\S{8,10}$/g;
  const extpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])(?!.*(.)\1)[A-Za-z\d$@$!%*?&]{8,15}(?!\s)/g;
  //Iniciar la llave secreta
  // let key = process.env.KEY;
  //Iniciar el VI (vector inicial)
  // let iv = "H98zM6i/55yNJfkFs"
  // let iv = key.slice(0,16);
  //Create Key
  // key = CryptoJS.enc.Utf8.parse(key);
  //Get Iv
  // const obt = ctx.request.body;
  // for (const llave in obt) {
  //   if (llave !=='email', llave !=='password') {
  //     let encrypted = CryptoJS.AES.encrypt(obt[llave], key,{ iv: iv}).toString();
  //     ctx.request.body[llave] = encrypted;
  //     const decrypted = CryptoJS.AES.decrypt(encrypted, key,{ iv: iv}).toString(CryptoJS.enc.Utf8)
  //     console.log(encrypted)
  //     console.log(decrypted)
  //   }
  // }
  if(!extpassword.test(password)){
    return ctx.send({msj:'The password does not meet the criteria. At least one lowercase letter, at least one uppercase letter, at least one digit, at least one special character ($@$!%*?&) and no duplicate digits and no spaces'})
  }
  const hash = await bcrypt.hash(password, 10);
  ctx.request.body.password = hash;
  const url = 'http://localhost:1337/usuarios/confirm';
  // let key = process.env.KEY;
  //   //Iniciar el VI (vector inicial)
  //   let iv = key.slice(0,16);
  //   //Create Key
  //   key = CryptoJS.enc.Utf8.parse(key);
  //   //Get Iv
  //   iv = CryptoJS.enc.Utf8.parse(iv);
  // const token = jwt.sign({
  //   email: CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
  // }, process.env.SECRET_KEY, {expiresIn: '20mins'
  // });
  // const SendEmail = await sendEmail(email, url, 'Pleace clcick  on the following link, or paste this into your browser to complete the process:', 'Confirm user', ctx, `Confirm user with email:${email}`, 'Confirm password')
  console.log(email)
  const SendEmail = await sendEmail(email, url, 'Pleace clcick  on the following link, or paste this into your browser to complete the process:', 'Forgot password', ctx,`Forgot your password ${email}`, 'Confirm user')
  if(!SendEmail){
    ctx.throw(400, 'The email was not sent');
  }
  return await next();
  // ctx.request.body.email = obt.email;
  // ctx.send({
  //   msj: "Esta listo",
  //   body:ctx.request.body
  // })
  //Enviar el request al next
}
