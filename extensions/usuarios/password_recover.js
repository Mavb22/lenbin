const { sendEmail } = require("../controllers/send_email");
const password_recover = async (ctx) => {
  const {email} = ctx.request.body;
  const user = await strapi.services.usuarios.findOne({
    email
  });
  const url = 'http://localhost:4200/auth/email-validator';
  if(!user){
    ctx.throw(400, 'User not found');
  }
  const SendEmail = await sendEmail(email, url, 'Pleace clcick  on the following link, or paste this into your browser to complete the process:', 'Forgot password', ctx,`Forgot your password ${email}` )
  if(!SendEmail){
    ctx.throw(400, 'The email was not sent');
  }
  ctx.send({msj: "Check your email, a link is sent to change your password"})
}
module.exports = {
  password_recover
}
