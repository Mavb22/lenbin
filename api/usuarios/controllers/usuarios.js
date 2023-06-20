const { Decrypt } = require("../../../extensions/controllers/encrypt");
const { client } = require("../../../extensions/controllers/redis");
const { sign_off } = require("../../../extensions/usuarios/Sign_off");
const { confirm } = require("../../../extensions/usuarios/confirm");
const { createUser } = require("../../../extensions/usuarios/create_user");
const { email_validate } = require("../../../extensions/usuarios/email_validate");
const { loggin } = require("../../../extensions/usuarios/loggin");
const { password_recover } = require("../../../extensions/usuarios/password_recover");
const { token_refrehs } = require("../../../extensions/usuarios/token_refresh");
module.exports ={
  async session_out(ctx){
    await sign_off(ctx);
  },
  async confirm(ctx){
    await confirm(ctx);
  },
  async loggin(ctx) {
    await loggin(ctx);
  },
  async create(ctx) {
    await createUser(ctx);
  },
  async decrypt(ctx){
    const {role, key} =  ctx.request.body;
    ctx.send({
      role:Decrypt(role,key)
    });
  },
  async token_refresh(ctx){
    await token_refrehs(ctx);
  },
  async password_recover(ctx) {
    await password_recover(ctx);
  },
  /* This function is responsible for validating the email, it receives the token, it decodes the
  token, it searches the user by email, it validates that the user exists, it sends a message. */
  async email_validate(ctx) {
    await email_validate(ctx);
  },
  async password_change(ctx) {
    const {new_password, confirm_password} = ctx.request.body;
    const {token} =  ctx.params;
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    const {id, password, nombre,ap_paterno,ap_materno } = await strapi.services.usuarios.findOne({email:decoded.email});

    // almenos 2 letras mayusculas, almenos un numero , almenos 3 caracteres espeaciales y 2 letras minusculas
    // const extpassword = /^(?=.*[A-Z].*[A-Z])(?=.*\d{1,3})(?=.*[\u0021-\u002b\u003c-\u0040].*[\u0021-\u002b\u003c-\u0040].*[\u0021-\u002b\u003c-\u0040])(?=.*[a-z].*[a-z])\S{8,10}$/g;

    // 2 letras minusculas, 2 letras mayusculas, al menos un numero, 3 caracteres espeaciales(/$@$!%*?&)
    // const extpassword = /^(?=.*[a-z].*[a-z])(?=.*[A-Z].*[A-Z])(?=.*\d)(?=.*[/$@$!%*?&].*[/$@$!%*?&].*[/$@$!%*?&])[A-Za-z\d/$@$!%*?&]{8,15}$/g;
    // Al menos una letra minuscula, almenos una letra mayuscula , al menos un digito al menos un caracter espeacial($@$!%*?&) y ningun digito duplicado y sin espacios
    const extpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])(?!.*(.)\1)[A-Za-z\d$@$!%*?&]{8,15}(?!\s)/g;
    if(!new_password && !confirm_password){
      ctx.throw(400, 'New password and confirm_password are required');
    }
    if(new_password.length < 8 && confirm_password.length < 8){
      ctx.throw(400,'The new_password and confirm_password must have more than 8 characters');
    }
    if(new_password !== confirm_password){
      ctx.throw(400, 'The new password and the password confirmation are different');
    }
    if(!extpassword.test(new_password)){
      ctx.throw(400, 'The password does not meet the corresponding characters');
    }
    const hashed = await bcrypt.compare(new_password, password);

    if(hashed){
      ctx.throw(400, 'This password cannot be');
    }
    // ctx.send({
    //   hashed
    // })
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
  async prueba(ctx){
    ctx.send('prueba');
  },
  async refreshToken(ctx) {
    try {
      let key = process.env.KEY;
      //Iniciar el VI (vector inicial)
      let iv = key.slice(0,16);
      //Create Key
      key = CryptoJS.enc.Utf8.parse(key);
      //Get Iv
      iv = CryptoJS.enc.Utf8.parse(iv);
      const {refresh} = ctx.request.header;
      if(!refresh){
        ctx.throw(400, 'Somenthing goes wrong');
      }
      const verifyRefresh = jwt.verify(refresh , process.env.REFRESH_KEY);
      await client.connect();
      const refreshToken = await client.get(verifyRefresh.email);
      await client.disconnect();
      if(!refreshToken){
        // ctx.throw(404,'Not found');
        ctx.badRequest(404, 'Not found');
      }
      if(refresh !== refreshToken){
        // ctx.throw(403, 'Este refresh token no es correcto');
        ctx.badRequest(403, 'Este refresh token no es correcto');
      }
      const user = await strapi.services.usuarios.findOne({email:CryptoJS.AES.decrypt(verifyRefresh.email, key,{ iv: iv}).toString(CryptoJS.enc.Utf8)});
      console.log(refresh);
      console.log(ctx);
      console.log(user);
      if(user){
        const token = jwt.sign({
          email: CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
          role: user.tipo_rol.rol,
          last_login: user.last_login.toString()
        }, process.env.SECRET_KEY, {expiresIn: '8hrs'})
        ctx.send({
          token: token,
          user: {
            email:  CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
            tipo_rol: user.tipo_rol.rol,
            last_login: user.last_login.toString()
          }
        });
      }

    } catch (error) {
      ctx.badRequest(400,'Hubo algun error, ' + error)
    }
  }
}
