'use strict';

const bcrypt = require('bcryptjs'); // Importar bcryptjs
const fetch = require("node-fetch");
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
const nodemailer = require('nodemailer');
const CryptoJS = require("crypto-js");
const recapchaKey = "6Ldi6mgkAAAAADe9RqQmyhpwtKQ7r0F1tYX45PrD";
const redis = require('redis');
const NodeRSA = require('node-rsa');
const keysRSA = {};
const client = redis.createClient({
  port: 6379,
  host: "127.0.0.1"
})
// const recapchaKey = "6Ld_IVskAAAAAKZZ9M-R_QCATx4VThTwFBS1WGsG2";
/* Creating a transporter to send emails. */
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USEREMAIL, // generated ethereal user
    pass: process.env.PASSWORDEMAIL // generated ethereal password
  },
});
transporter.verify().then(() => {
  console.log("Ready for send emails")
})
// function Client (){
//   client.on('connect', () =>{
//     console.log('Redis connect')
//   });
//   client.on('ready', () =>{
//     console.log('Redis ready');
//   });
//   client.on('error', (err) =>{
//     console.log('Redis error', err.message);
//   });
//   client.on('end', () =>{
//     console.log('Redis end');
//   });
//   process.on('SIGINT',()=>{
//     client.quit
//   })
//   client.SET("foo","bar");
//   client.GET('foo',(err, value)=>{
//     if(err) console.log(err.message)
//     console.log(value);
//   })
// }
// client.on('error', err => console.log('Redis Client Error', err));

function Keys(){
  const keys = new NodeRSA({b: 1024});
  const publicKeyBackend = keys.exportKey('public');
  const publicKeyUsuario = keys.exportKey('public');
  const privateKeyBackend = keys.exportKey('private');
  const privateKeyUsuario = keys.exportKey('private');
  return {
    publicKeyBackend,
    publicKeyUsuario,
    privateKeyBackend,
    privateKeyUsuario
  }
}
function Encrypt(text, key){
  const keyPublic = new NodeRSA(key);
  const encrypted = keyPublic.encrypt(text, 'base64');
  return {encrypt:encrypted}
}
function Decrypt (text,key){
  let keyPrivate = new NodeRSA(key);
  let decrypt = keyPrivate.decrypt(text, 'utf8');
  return decrypt;
}
module.exports ={
  async decrypt(ctx){
    const {role, key} =  ctx.request.body;
    ctx.send({
      role:Decrypt(role,key)
    });
  },
  async token_refresh (ctx){
    Object.assign(keysRSA, Keys());
    try {
      let key = process.env.KEY;
      //Iniciar el VI (vector inicial)
      let iv = key.slice(0,16);
      //Create Key
      key = CryptoJS.enc.Utf8.parse(key);
      //Get Iv
      iv = CryptoJS.enc.Utf8.parse(iv);
      const {refresh} = ctx.request.header;
      if(!refresh){
        return ctx.throw(400, 'Somenthing goes wrong');
      }
      const verifyRefresh = jwt.verify(refresh , process.env.REFRESH_KEY);
      await client.connect();
      const refreshToken = await client.get(verifyRefresh.email);
      await client.disconnect();
      if(!refreshToken){
        return ctx.badRequest(404, 'Not found');
      }
      if(refresh !== refreshToken){
        return ctx.badRequest(403, 'Este refresh token no es correcto');
      }
      const user = await strapi.services.usuarios.findOne({email:CryptoJS.AES.decrypt(verifyRefresh.email, key,{ iv: iv}).toString(CryptoJS.enc.Utf8)});
      const roleEncrypt = Encrypt(user.tipo_rol.id, keysRSA.publicKeyBackend);
      if(user){
        const token = jwt.sign({
          email: CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
          // role: user.tipo_rol.rol,
          role:roleEncrypt,
          last_login: user.last_login.toString()
        }, process.env.SECRET_KEY, {expiresIn: '8h'})
        ctx.send({
          token: token,
          // user: {
          //   // email:  CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
          //   // tipo_rol: user.tipo_rol.rol,
          //   last_login: user.last_login.toString()
          // }
        });
      }
    } catch (error) {
      ctx.badRequest(400,'Hubo algun error, ' + error)
    }
  },
  /* This function is responsible for logging in the user, it receives the email and password of the
  user, it validates that the email and password are not empty, it searches the user by email, it
  validates that the user exists, it validates that the password is correct, it validates that the
  user has not logged in before, if it has not logged in before, it updates the last login date, it
  creates the token, it sends the token, if the user has logged in before, it updates the last login
  date, it creates the token, it sends the token. */
  async loggin(ctx) {
    Object.assign(keysRSA, Keys())
    const date = new Date();
    const {
      email,
      password,
      recaptcha
    } = ctx.request.body; // Obtener los datos del usuario
    //  Iniciar la llave secreta
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${recapchaKey}&response=${recaptcha}`;
    let key = process.env.KEY;
    //Iniciar el VI (vector inicial)
    let iv = key.slice(0,16);
    //Create Key
    key = CryptoJS.enc.Utf8.parse(key);
    //Get Iv
    iv = CryptoJS.enc.Utf8.parse(iv);
    // if(!recaptcha){
    //   // return ctx.badRequest(null, 'Captcha token is undefined');
    //   return ctx.throw(400, 'Captcha token is undefined');
    // }
    // const verifyURL = await fetch(url,{method:'POST'}).then(_res => _res.json());
    // if(verifyURL.success == false){
    //   return ctx.badRequest(null, 'Error');
    // }
    if(!email || !password){
      return ctx.throw(400, 'Email and password are required');
    }
    const user = await strapi.services.usuarios.findOne({
      email
    }); // Buscar el usuario por email

    if(!user){
      return ctx.unauthorized('User not found');
    }
    // const role =  user.tipo_rol.rol;
    const roleEncrypt = Encrypt(user.tipo_rol.id, keysRSA.publicKeyBackend);
    // const roleDecrypt = Decrypt(roleEncrypt, keysRSA.privateKeyBackend);
    // console.log({roleEncrypt,roleDecrypt:Decrypt(roleEncrypt, keysRSA.privateKeyUsuario)});
    const hashed = await bcrypt.compare(password, user.password);
    if(!hashed){
      return ctx.badRequest(null, 'Invalid email or password');
    }
    // const emailTokens = CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString();
    const refresh = jwt.sign({
      email: CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
    }, process.env.REFRESH_KEY, {
      expiresIn: '1d'
    });
    await client.connect();
    // 1 * 24 * 60 * 60

    await client.set(CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),refresh, (err, reply)=>{
      if(err){
        console.log(err.message);
        reject(createError.InternalServerError());
        return
      }
      resolve(refresh);
    });
    // const timeout = 2 * 60
    const timeout = 1 * 24 * 60 * 60
    await client.expire(CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(), timeout);
    await client.disconnect();

    if (user.last_login == null) {
      // Obtener la fecha actual
      await strapi.services.usuarios.update({
        id: user.id
      }, {
        last_login: date
      }); // Actualizar la fecha de ultimo login

      // Crear el token
      const token = jwt.sign({
        email: CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
        role: roleEncrypt.encrypt,
        key: keysRSA.privateKeyUsuario,
        // role: user.tipo_rol.rol,
        last_login: date
      }, process.env.SECRET_KEY, {
        // expiresIn: '8h'
        expiresIn: '8h'
      });
      console.log('primera vez date:', date.toString);
      // Enviar el token
      ctx.send({
        token: token,
        refreshToken: refresh,
        // user: {
        //   // email:  CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
        //   // tipo_rol: roleEncrypt.encrypt,
        //   last_login: date.toString()
        // }
      });
    } else {
      await strapi.services.usuarios.update({
        id: user.id
      }, {
        last_login: date
      });
      const token = jwt.sign({
        email: CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
        // role: user.tipo_rol.rol,
        key: keysRSA.privateKeyUsuario,
        role: roleEncrypt.encrypt,
        last_login: date
      }, process.env.SECRET_KEY, {
        // expiresIn: '8h'
        expiresIn: '8h'
      });

      // Enviar el token
      ctx.send({
        token: token,
        refreshToken: refresh,
        // user: {
        //   // email:  CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
        //   tipo_rol: roleEncrypt.encrypt,
        //   last_login: user.last_login.toString()
        // }
      });
    }
  },
  /* This function is responsible for sending an email to the user to change the password, it receives
  the email of the user, it validates that the email is not empty, it searches the user by email, it
  validates that the user exists, it creates the token, it sends the email, it validates that the
  email was sent, it sends a message. */
  async password_recover(ctx) {
    const {email} = ctx.request.body;
    const {nombre} = await strapi.services.usuarios.findOne({
      email
    });
    const url = 'http://localhost:4200/auth/email-validator/';
    const token = jwt.sign({
      email
    },process.env.SECRET_KEY,{
      expiresIn:'20mins'
    });
    if(!nombre){
      ctx.throw(400, 'User not found');
    }
    let info = await transporter.sendMail({
      from: '"Forgot password" <lenin79it@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `Forgot password for ${email}`, // Subject line
      // text: "Hello world?", // plain text body
      html: `<b>Pleace clcick  on the following link, or paste this into your browser to complete the process: </b>
        <a href="${url}${token}">Forgot password</a>
        ` // html body
    });
    if (!info) {
      ctx.throw(400, 'No se envio el email');
    }
    ctx.send({msj: "Esta listo",})
  },
  /* This function is responsible for validating the email, it receives the token, it decodes the
  token, it searches the user by email, it validates that the user exists, it sends a message. */
  async email_validate(ctx) {
    const {
      token
    } = ctx.params
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    const {email} = await strapi.services.usuarios.findOne({email:decoded.email});
    if(!email){
      ctx.throw(400, 'User not found');
    }
    ctx.send({
      msj: "Esta listo",
      token
    })
  },
  /* This function is responsible for changing the password, it receives the new password and the
  confirmation password, it validates that the new password and the confirmation password are not
  empty, it validates that the new password and the confirmation password have more than 8
  characters, it validates that the new password and the confirmation password are the same, it
  validates that the new password meets the corresponding characters, it validates that the new
  password is not the same as the old password, it validates that the new password does not contain
  the name, it validates that the new password does not contain the last name, it validates that the
  new password does not contain the last name, it encrypts the new password, it updates the
  password, it validates that the password was updated, it sends a message. */
  async password_change(ctx) {
    const {new_password, confirm_password} = ctx.request.body;
    const {token} =  ctx.params;
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    const {id, password, nombre,ap_paterno,ap_materno } = await strapi.services.usuarios.findOne({email:decoded.email});

    // almenos 2 letras mayusculas, almenos un numero , almenos 3 caracteres espeaciales y 2 letras minusculas
    // const extpassword = /^(?=.*[A-Z].*[A-Z])(?=.*\d{1,3})(?=.*[\u0021-\u002b\u003c-\u0040].*[\u0021-\u002b\u003c-\u0040].*[\u0021-\u002b\u003c-\u0040])(?=.*[a-z].*[a-z])\S{8,10}$/g;

    // 2 letras minusculas, 2 letras mayusculas, al menos un numero, 3 caracteres espeaciales(/$@$!%*?&)
    // const extpassword = /^(?=.*[a-z].*[a-z])(?=.*[A-Z].*[A-Z])(?=.*\d)(?=.*[/$@$!%*?&].*[/$@$!%*?&].*[/$@$!%*?&])[A-Za-z\d/$@$!%*?&]{8,15}$/g;
    // Al menos una letra minuscula, almenos una letra mayuscula , al menos un digito al menos un caracter espeacial($@$!%*?&) y ningun digito duplicado y sin espacios
    const extpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])(?!.*(.)\1)[A-Za-z\d$@$!%*?&]{8,15}(?!\s)/g;
    if(!new_password && !confirm_password){
      ctx.throw(400, 'New password and confirm_password are required');
    }
    if(new_password.length < 8 && confirm_password.length < 8){
      ctx.throw(400,'The new_password and confirm_password must have more than 8 characters');
    }
    if(new_password !== confirm_password){
      ctx.throw(400, 'The new password and the password confirmation are different');
    }
    if(!extpassword.test(new_password)){
      ctx.throw(400, 'The password does not meet the corresponding characters');
    }
    const hashed = await bcrypt.compare(new_password, password);

    if(hashed){
      ctx.throw(400, 'This password cannot be');
    }
    // ctx.send({
    //   hashed
    // })
    let password_lower = new_password.toLowerCase();
    let nombre_split = nombre.split(' ');
    let ap_paterno_lower = ap_paterno.toLowerCase();
    let ap_materno_lower = ap_materno.toLowerCase();
    nombre_split.forEach(nombre => {
      if(password_lower.includes(nombre.toLowerCase())){
        ctx.throw(400, 'The password must not contain your name');
      }
    });
    if(password_lower.includes(ap_paterno_lower)){
      ctx.throw(400, 'The password should not contain your last name');
    }
    if(password_lower.includes(ap_materno_lower)){
      ctx.throw(400, 'The password should not contain your last name');
    }
    const hash = await bcrypt.hash(new_password, 10);
    const password_changed = await strapi.services.usuarios.update({
      id
    }, {
      password:hash
    });
    if(!password_changed){
       ctx.throw(400, 'Failed to change password');
    }
    ctx.send({
      msj:'Updated password'
    })
  },
  async prueba(ctx){
    ctx.send('prueba');
  },
  async refreshToken(ctx) {
    try {
      let key = process.env.KEY;
      //Iniciar el VI (vector inicial)
      let iv = key.slice(0,16);
      //Create Key
      key = CryptoJS.enc.Utf8.parse(key);
      //Get Iv
      iv = CryptoJS.enc.Utf8.parse(iv);
      const {refresh} = ctx.request.header;
      if(!refresh){
        ctx.throw(400, 'Somenthing goes wrong');
      }
      const verifyRefresh = jwt.verify(refresh , process.env.REFRESH_KEY);
      await client.connect();
      const refreshToken = await client.get(verifyRefresh.email);
      await client.disconnect();
      if(!refreshToken){
        // ctx.throw(404,'Not found');
        ctx.badRequest(404, 'Not found');
      }
      if(refresh !== refreshToken){
        // ctx.throw(403, 'Este refresh token no es correcto');
        ctx.badRequest(403, 'Este refresh token no es correcto');
      }
      const user = await strapi.services.usuarios.findOne({email:CryptoJS.AES.decrypt(verifyRefresh.email, key,{ iv: iv}).toString(CryptoJS.enc.Utf8)});
      console.log(refresh);
      console.log(ctx);
      console.log(user);
      if(user){
        const token = jwt.sign({
          email: CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
          role: user.tipo_rol.rol,
          last_login: user.last_login.toString()
        }, process.env.SECRET_KEY, {expiresIn: '8hrs'})
        ctx.send({
          token: token,
          user: {
            email:  CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
            tipo_rol: user.tipo_rol.rol,
            last_login: user.last_login.toString()
          }
        });
      }

    } catch (error) {
      ctx.badRequest(400,'Hubo algun error, ' + error)
    }
  }
}
