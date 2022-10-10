'use strict';
const bcrypt = require('bcryptjs'); // Importar bcryptjs
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USEREMAIL, // generated ethereal user
    pass: process.env.PASSWORDEMAIL // generated ethereal password
  },
});
transporter.verify().then(() => {
  console.log("Ready for send emails")
})
module.exports = {
  async loggin(ctx) {
    const date = new Date();
    const {
      email,
      password
    } = ctx.request.body; // Obtener los datos del usuario
    if (email && password) {
      const user = await strapi.services.usuarios.findOne({
        email
      }); // Buscar el usuario por email
      // Validar si el usuario existe
      if (user) {
        const hashed = await bcrypt.compare(password, user.password); // Comparar la contraseña

        // Validar si la contraseña es correcta
        if (hashed) {
          //Validar si el usuario tiene algun loggin antiguo
          if (user.last_login == null) {
            // Obtener la fecha actual
            await strapi.services.usuarios.update({
              id: user.id
            }, {
              last_login: date
            }); // Actualizar la fecha de ultimo login
            // Crear el token
            const token = jwt.sign({
              nombre: user.nombre,
              role: user.tipo_rol.rol,
              last_login: date.toString()
            }, process.env.SECRET_KEY, {
              expiresIn: '7d'
            });

            console.log('primera vez date:', date);
            // Enviar el token
            ctx.send({
              // jwt: newjwt,
              token: token,
              user: {
                email: user.email,
                tipo_rol: user.tipo_rol.rol,
                last_login: date.toString()
              }
            });
          } else {
            // actualizar la fecha de ultimo login
            await strapi.services.usuarios.update({
              id: user.id
            }, {
              last_login: new Date()
            });
            const token = jwt.sign({
              nombre: user.nombre,
              email: user.email,
              role: user.tipo_rol.rol,
              last_login: date.toString()
            }, process.env.SECRET_KEY, {
              expiresIn: '7d'
            });
            // Enviar el token
            ctx.send({
              token: token,
              user: {
                email: user.email,
                tipo_rol: user.tipo_rol.rol,
                last_login: user.last_login.toString()
              }
            });
          }
        } else {
          // Enviar un error
          ctx.badRequest(null, 'Invalid email or password');
        }
      } else {
        // Enviar un error
        return ctx.unauthorized('User not found');
      }
    } else {
      // Enviar un error
      ctx.throw(400, 'Email and password are required');
    }
  },

  async password_recover(ctx) {
    const {email} = ctx.request.body;
    const {nombre} = await strapi.services.usuarios.findOne({
      email
    })
    const token = jwt.sign({
      email
    },process.env.SECRET_KEY,{
      expiresIn:'7d'
    });
    if(!nombre){
      ctx.throw(400, 'User not found');
    }
    let info = await transporter.sendMail({
      from: '"Forgot password" <lenin79it@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `Forgot password for ${email}`, // Subject line
      // text: "Hello world?", // plain text body
      html: `<b>Pleace clcick  on the following link, or paste this into your browser to complete the process: </b>
        <a href="http://localhost:1337/usuarios/email_validator/${token}">Forgot password</a>
        ` // html body
    });
    if (info) {
      ctx.send({msj: "Esta listo",})
    }
  },

  async email_validate(ctx) {
    const {
      token
    } = ctx.params
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    const {email} = await strapi.services.usuarios.findOne({email:decoded.email});
    if(!email){
      ctx.throw(400, 'User not found');
    }
    ctx.send({
      msj: "Esta listo",
      token
    })
  },
  async password_change(ctx) {
    const {new_password, confirm_password} = ctx.request.body;
    const {token} =  ctx.params;
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    const {id, password, nombre,ap_paterno,ap_materno } = await strapi.services.usuarios.findOne({email:decoded.email});
    if(!new_password && !confirm_password){
      ctx.throw(400, 'new_password and confirm_password are required');
    }
    if(new_password.length < 8 && confirm_password.length < 8){
      ctx.throw(400,'The new_password and confirm_password must have more than 8 characters');
    }
    if(new_password !== confirm_password){
      ctx.throw(400, 'The new password and the password confirmation are different');
    }
    const hashed = await bcrypt.compare(new_password, password);

    if(hashed){
      ctx.throw(400, 'This password cannot be');
    }
    let password_lower = new_password.toLowerCase();
    let nombre_split = nombre.split(' ');
    let ap_paterno_lower = ap_paterno.toLowerCase();
    let ap_materno_lower = ap_materno.toLowerCase();
    nombre_split.forEach(nombre => {
      if(password_lower.includes(nombre.toLowerCase())){
        ctx.throw(400, 'The password must not contain your name');
      }
    });
    if(password_lower.includes(ap_paterno_lower)){
      ctx.throw(400, 'The password should not contain your last name');
    }
    if(password_lower.includes(ap_materno_lower)){
      ctx.throw(400, 'The password should not contain your last name');
    }
    const hash = await bcrypt.hash(new_password, 10);
    const password_changed = await strapi.services.usuarios.update({
      id
    }, {
      password:hash
    });
    if(!password_changed){
       ctx.throw(400, 'Failed to change password');
    }
    ctx.send({ 
      msj:'Updated password'
    })
  },
};
