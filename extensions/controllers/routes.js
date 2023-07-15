const utils = require('../../extensions/controllers/utils');
const autorizathion = async (token, url)=>{
  const authenticated = await utils.authorization(token,role[url]);
  return authenticated;
}
const routes = {
  "abonos": autorizathion,
  "camiones": autorizathion,
  "carritos": autorizathion,
  "compras": autorizathion,
  "creditos": autorizathion,
  "dimensiones": autorizathion,
  "gastos": autorizathion,
  "historials": autorizathion,
  "locals": autorizathion,
  "lotes": autorizathion,
  "metodo-pagos": autorizathion,
  "productos": autorizathion,
  "promociones": autorizathion,
  "proveedors": autorizathion,
  "rutas": autorizathion,
  "tipo-rols": autorizathion,
  "usuarios": autorizathion,
  "vendedores": autorizathion,
  "ventas": autorizathion,
}
const role = {
  "abonos": ["Administrator"],
  "camiones": ["Administrator"],
  "carritos": ["Administrator"],
  "compras": ["Administrator"],
  "creditos": ["Administrator"],
  "dimensiones": ["Administrator"],
  "gastos": ["Administrator"],
  "historials": ["Administrator"],
  "locals": ["Administrator"],
  "lotes": ["Administrator"],
  "metodo-pagos": ["Administrator"],
  "productos": ["Administrator"],
  "promociones": ["Administrator"],
  "proveedors": ["Administrator"],
  "rutas": ["Administrator"],
  "tipo-rols": ["Administrator"],
  "usuarios": ["Administrator","User"],
  "vendedores": ["Administrator"],
  "ventas": ["Administrator"],
}
module.exports = routes;
