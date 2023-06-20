const fetch = require("node-fetch");
const bcrypt = require('bcryptjs');
const {key, iv} = require('../controllers/cyptoJS');
const CryptoJS = require("crypto-js");
const { keys, Encrypt} = require("../controllers/encrypt");
const { client } = require("../controllers/redis");
const {token:jwt} = require('../../extensions/controllers/token');
const loggin = async(ctx)=>{
  try {
    const {email, password, recaptcha} = ctx.request.body;
    const date = new Date();
    if(!email && !password){
      return ctx.throw(400, 'Email or password are required');
    }
    // if(!recaptcha){
    //   return ctx.throw(400, 'Captcha token is undefined');
    // }
    // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPCHAKEY}&response=${recaptcha}`;
    // const verifyURL = await fetch(url,{method:'POST'}).then(_res => _res.json());
    // if(!verifyURL.success){
    //   return ctx.throw(400, verifyURL.error_message);
    // }
    const user = await strapi.services.usuarios.findOne({email: email})
    if(!user){
      ctx.throw(400, 'Invalid email or password');
    }
    if(!user.confirm){
      ctx.throw(400, 'Debe confirmar su usuario');
    }
    const keysRSA= keys();
    const roleEncrypt = Encrypt(user.tipo_rol.id, keysRSA.publicKeyBackend);
    const hashed = await bcrypt.compare(password, user.password);
    const refreshToken = jwt({email: CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString()},'1d', process.env.REFRESH_KEY);
    const keyEmail = CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString();
    if(!hashed){
      return ctx.throw(400, 'Invalid email or password');
    }
    await client.connect();
    const redisEmail = await client.get(keyEmail,(err, value)=>{
      if(err) console.log(err.message)
      return value;
    });
    if(redisEmail){
      await client.disconnect();
      return ctx.throw(400, 'You cannot start a session without closing the one that is started');
    }
    await client.set(keyEmail,refreshToken, (err, reply)=>{
      if(err){
        console.log(err.message);
        reject(createError.InternalServerError());
        return
      }
      resolve(refreshToken);
    });
    await client.expire(CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(), 1 * 24 * 60 * 60);
    await client.disconnect();
    await strapi.services.usuarios.update({
      id: user.id
    },{
      last_login: date
    });
    const token = jwt({
      email: CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
      role: roleEncrypt.encrypt,
      key: keysRSA.privateKeyUsuario,
      last_login: date}, '8h', process.env.SECRET_KEY
    );
    ctx.send({
      token,
      refreshToken,
    })
  } catch (error) {
    console.log(error)
    return ctx.throw(400, error.message);
  }
}


module.exports = {
  loggin
}
// const sendEmail = await emailService.send({
//   from: 'mavb.app@gmail.com',
//   to: user.email,
//   subject: 'Confirmación de cuenta',
//   html: `<p>Haz clic en el siguiente enlace para confirmar tu cuenta: http://localhost:1337/usuarios/confirm/${token}</p>`,
// });
// if(!sendEmail.response.includes('250 2.0.0 OK')){
//   return ctx.throw(400, sendEmail.response);
// }
