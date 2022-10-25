const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
module.exports = async (ctx, next) => {
  if(ctx.request.headers.authenticated){
    const token = ctx.request.header.authenticated.split(' ')[1];
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    let key = process.env.KEY;
    //Iniciar el VI (vector inicial)
    let iv = key.slice(0,16);
    //Create Key
    key = CryptoJS.enc.Utf8.parse(key);
    //Get Iv
    iv = CryptoJS.enc.Utf8.parse(iv);
    // Encriptar los datos del body
    // Enviar los datos al siguiente middleware
    const {tipo_rol,id} = await strapi.services.usuarios.findOne({email:CryptoJS.AES.decrypt(decoded.email, key,{ iv: iv}).toString(CryptoJS.enc.Utf8)});
    const {rol:role} = tipo_rol;
    if(role == 'Manager'){
      const  usuarios =await strapi.services.usuarios.update({
        id
      }, {
        access:true
      });
      if(usuarios){
        return await next()
      }
    }else{
      return await next()
    }
  } else {
    return ctx.throw(403, 'You are not authorized to access this resource');
  }
}
