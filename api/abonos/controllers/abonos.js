'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */


// En api/abonos/controllers/abonos.js
module.exports = {
  async buscarAbonos(ctx){
    const { cantidad_abono, fecha_abono, estado_abono } = ctx.query;

    let query = {};
    if (cantidad_abono) {
      if (isNaN(parseFloat(cantidad_abono))) {
        throw new Error('La cantidad de abono debe ser un número');
      } else {
        query.cantidad_abono = parseFloat(cantidad_abono);
      }
    }

    if (fecha_abono) {
      query.fecha_abono_contains = fecha_abono;
    }

    if (estado_abono) {
      query.estado_abono_contains = estado_abono;
    }

    let abonos = await strapi.query('abonos').find(query);

    return abonos;
  }

};

