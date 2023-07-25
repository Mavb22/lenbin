const routes = require('../../extensions/controllers/routes');
module.exports = async (ctx, next) => {
  const route = ctx.request.url.split('/')[1];
  const token = ctx.request.headers.authenticated.split(' ')[1];
  const rol = await routes[route](token, route);
  if(!rol){
   return ctx.throw(403, 'You are not authorized to access this resource');
  }
  await next();
}


