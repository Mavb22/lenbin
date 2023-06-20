const { token:jwt } = require("./token");

const sendEmail = async (email, url, message, link, ctx, subject, from = "Forgot password") => {
  try {
    const emailService = strapi.plugins.email.services.email;
    const token = jwt({email},'20mins',process.env.SECRET_KEY );
    const info = await emailService.send({
      from: `${from}<lenin79it@gmail.com>` , // sender address
      to: email, // list of receivers
      subject: subject,
      html: `<b>${message}</b>
        <a href="${url}/${token}">${link}</a>
        ` // html body
    });
    if (!info) {
      return ctx.throw(400, 'No se envio el email');
    }
    return true
  } catch (error) {
    console.log(error);
    return ctx.throw(400, 'Hubo algun error ' + error.message);
  }
}
module.exports = {
  sendEmail
}
