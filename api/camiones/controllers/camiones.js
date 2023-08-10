'use strict';

const { fileUpload } = require("../../../extensions/export/file");

// const { fileUpload } = require("../../../extensions/controllers/file");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
module.exports = {
  async  busqueda(ctx){
    const { num_serie, niv, placas } = ctx.query;
    const collectionName = 'camiones';
    // const regex = new RegExp(placas, 'i');
    const busqueda = await strapi.query(collectionName).find();
    const regex_numserie = new RegExp(num_serie);
    const regex_niv = new RegExp(niv);
    const regex_placas = new RegExp(placas)
    if(num_serie || niv){
      const camiones = busqueda.filter((camion) => {
         return camion.placas.filter((placa) => {
            return regex_placas.test(placa.placas);
         })
      });
      console.log(camiones)
    }
  },
  async file(ctx){
    await fileUpload(ctx, 'camiones', 'Camiones');
  },
};
