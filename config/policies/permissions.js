const jwt = require('jsonwebtoken');
module.exports = async (ctx, next) => {
  if(ctx.request.headers.authenticated){
    const token = ctx.request.header.authenticated.split(' ')[1];
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    const {tipo_rol} = await strapi.services.usuarios.findOne({email:decoded.email});
    const {rol:role} = tipo_rol;
    if(role == 'Administrator' || role == 'Delivery man' || 'Manager'){
      return await next()
    }else{
      ctx.throw(403, 'You are not authorized to access this resource');
    }
  } else {
    return ctx.throw(403, 'You are not authorized to access this resource');
  }
}


