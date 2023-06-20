
const { key, iv, CryptoJS } = require("../controllers/cyptoJS");
const { keys, Encrypt } = require("../controllers/encrypt");
const { client } = require("../controllers/redis");
const { verify_token, token:jwt } = require("../controllers/token");
const token_refrehs = async(ctx)=>{
  try {
    const keysRSA = keys();
    const refresh = ctx.request.header.refresh.split(' ')[1];
    if(!refresh){
      return ctx.throw(400, 'Somenthing goes wrong');
    }
    const verifyRefresh = verify_token(refresh, process.env.REFRESH_KEY);
    await client.connect();
    const refreshToken = await client.get(verifyRefresh.email);
    await client.disconnect();
    if(!refreshToken){
      return ctx.badRequest(404, 'Not found');
    }
    if(refresh !== refreshToken){
      return ctx.badRequest(403, 'This refresh token is not correct')
    }
    const user = await strapi.services.usuarios.findOne({email:CryptoJS.AES.decrypt(verifyRefresh.email, key,{ iv: iv}).toString(CryptoJS.enc.Utf8)});
    const roleEncrypt = Encrypt(user.tipo_rol.id, keysRSA.publicKeyBackend);
    if(!user){
      return ctx.badRequest(400,'Not found user')
    }
    const token = jwt({
      email: CryptoJS.AES.encrypt(user.email, key,{ iv: iv}).toString(),
      role:roleEncrypt,
      key: keysRSA.privateKeyUsuario,
      last_login: user.last_login.toString()
    },'8h', process.env.SECRET_KEY);
    ctx.send({
      token,
      refreshToken,
    })
  } catch (error) {
    ctx.badRequest(400,'There was some mistake, ' + error)
  }
}
module.exports = {
  token_refrehs
}

