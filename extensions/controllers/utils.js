const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js")
const utils = {
  authorization: async (authenticated, roles)=>{
    if(!authenticated){
      return false;
    }
    const decoded = jwt.verify(authenticated,process.env.SECRET_KEY);
    let key = process.env.KEY;
    //Iniciar el VI (vector inicial)
    let iv = key.slice(0,16);
    //Create Key
    key = CryptoJS.enc.Utf8.parse(key);
    //Get Iv
    iv = CryptoJS.enc.Utf8.parse(iv);
    const {tipo_rol} = await strapi.services.usuarios.findOne({email:CryptoJS.AES.decrypt(decoded.email, key,{ iv: iv}).toString(CryptoJS.enc.Utf8)});
    const {rol} = tipo_rol;
    return roles.includes(rol)
  }
}
module.exports = utils;
