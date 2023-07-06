
const { client } = require("../controllers/redis");
const { verify_token } = require("../controllers/token");
const sign_off = async(ctx) => {

    const token = ctx.request.headers.authenticated.split(' ')[1];

    const {email} = verify_token(token, process.env.REFRESH_KEY);
    await client.connect();
    const redisEmail = await client.get(email,(err, value)=>{
      if(err) console.log(err.message)
      return value;
    });
    // console.log(redisEmail);
    const result = await client.del(email);
    if (result === 1) {
      console.log('Clave eliminada con éxito');
      await client.disconnect();
      ctx.send({
        message: 'Se pudo cerrar la session correctamente'
      });
    } else {
      await client.disconnect();
      ctx.throw(400, 'No se pudo cerrar la session correctamente');
    }
};
module.exports = {
  sign_off
}
