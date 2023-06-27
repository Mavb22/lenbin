'use strict';

const { fileUpload } = require("../../../extensions/controllers/file");

module.exports = {
  async file(ctx){
    await fileUpload(ctx, 'abonos', 'abonos');
  },
  async find(ctx){
    const payments = await strapi.query('abonos').find({mostrar: true});
    ctx.send(payments);
  },
  async delete(ctx){
    try {
      const payments = await strapi.query('abonos').update({id:ctx.params.id}, {mostrar: false});
      ctx.send(payments);
    } catch (error) {
      console.log(error);
      return ctx.throw(403, 'Failed to delete record');
    }
  },
  async findOne(ctx){
    try {
      const payments = await strapi.query('abonos').findOne({id:ctx.params.id, mostrar: true});
      if(!payments){
        return ctx.throw(202, 'Not found');
      }
      ctx.send(payments);
    } catch (error) {
      console.log(error);
      return ctx.throw(403, error.message);
    }
  }
}
