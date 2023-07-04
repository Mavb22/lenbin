const { sendEmail } = require("../controllers/send_email");
const bcrypt = require("bcryptjs")
const createUser = async (ctx) => {
  try {
    await strapi.entityValidator.validateEntityCreation(
      strapi.models.usuarios,
      ctx.request.body
    );
    const {password, email} = ctx.request.body;
    const url = process.env.SERVER + '/usuarios/confirm'
    const extpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])(?!.*(.)\1)[A-Za-z\d$@$!%*?&]{8,15}(?!\s)/g;
    if(!extpassword.test(password)){
      return ctx.send({msj:'The password does not meet the criteria. At least one lowercase letter, at least one uppercase letter, at least one digit, at least one special character ($@$!%*?&) and no duplicate digits and no spaces'})
    }
    const hash = await bcrypt.hash(password, 10);
    ctx.request.body.password = hash;
    await strapi.services.usuarios.create(ctx.request.body);
    const SendEmail = await sendEmail(email, url, 'Pleace clcick  on the following link, or paste this into your browser to complete the process:', 'Confirm user', ctx, `Confirm user with email:${email}`, 'Confirm password');
    if(!SendEmail){
      ctx.throw(400, 'The email was not sent');
    }
    ctx.send({
      msj:"User created successfully. Revisa tu correo electronico"
    })
  } catch (error) {
    if(error.message.includes('Duplicate entry')){
      return ctx.throw(400, 'El correo ya esta registrado');
    }
    return ctx.throw(400, 'Hubo algun error ' + error.message);
  }
  // const url = 'http://localhost:4200/auth/email-validator/';
  // const SendEmail = await sendEmail(email, url, 'Pleace clcick  on the following link, or paste this into your browser to complete the process:', 'Forgot password', ctx,`Forgot your password ${email}` )
  // if(!SendEmail){
  //   ctx.throw(400, 'The email was not sent');
  // }
  // ctx.send({msj: "Check your email, a link is sent to change your password"})
}

module.exports = {
  createUser
}
