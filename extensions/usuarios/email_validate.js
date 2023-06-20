const { verify_token:jwt } = require("../controllers/token")
const email_validate = async (ctx) => {
  try {
    const {token} = ctx.params;
    const decoded = jwt(token, process.env.SECRET_KEY);
    const {email} = await strapi.services.usuarios.findOne({email:decoded.email});
    if(!email){
      return ctx.throw(400, 'User not found');
    }
    ctx.send({
      msj: "Esta listo",
      token
    });
  } catch (error) {
    return ctx.throw(400, 'There was some mistake ' + error.message);
  }

}
module.exports = {
  email_validate
}
