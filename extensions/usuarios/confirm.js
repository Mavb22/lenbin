const { verify_token:jwt } = require("../controllers/token");
const confirm = async(ctx) => {
  try {
    const {token} = ctx.params;
    const decoded = jwt(token, process.env.SECRET_KEY);
    const {email} = decoded
    await strapi.services.usuarios.update({
      email
    }, {
      confirm:true,
    });
    ctx.redirect(process.env.URL+'/auth/login');
  } catch (error) {
    return ctx.throw(400, 'There was some mistake ' + error.message);
  }
}
 module.exports = {
  confirm
 }
