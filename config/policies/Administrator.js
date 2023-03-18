const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js")
module.exports = async (ctx, next) => {
  /* This is a middleware that is used to verify the token and decrypt the email. */
  if(ctx.request.headers.authenticated){
    const token = ctx.request.header.authenticated.split(' ')[1];
    const decoded = jwt.verify(token,process.env.SECRET_KEY, (err, decode)=>{
      if(err){
        if(err.expiredAt)
        return ctx.throw(401, 'Token expired');
      }
      return decode
    });
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
    await strapi.services.usuarios.update({
      id
    }, {
      access:false
    });
    if(role == 'Administrator'){
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
