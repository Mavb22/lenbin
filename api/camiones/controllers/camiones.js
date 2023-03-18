'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async  busqueda(ctx){
    const { placas } = ctx.query;
    console.log(placas);
  }
};
