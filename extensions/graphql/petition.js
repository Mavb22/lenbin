const pagination = require("../controllers/pagination");
const petition = {
  abonos: async (query,startIndex,limit) => {
    let payments = await strapi.query('abonos').model.find(query)
    .populate({
      path: 'usuario',
      select: 'id nombre ap_paterno ap_materno'
    })
    .populate({
      path: 'credito',
      select: 'id intereses'
    });
    payments = await Promise.all(
      payments.map(async (payment) => {
        const usuario = await strapi.query('usuarios').model
          .findById(payment.usuario)
          .select('id nombre ap_paterno ap_materno');
        const credito = await strapi.query('credito').model
          .findById(payment.credito)
          .select('id intereses');
        return {
          id:payment.id,
          cantidad_abono:payment.cantidad_abono,
          fecha_abono:payment.fecha_abono,
          estado_abono:payment.estado_abono,
          usuario,
          credito,
        };
      })
    );
    const {edges, pageInfo} = pagination.search(payments,startIndex, limit)
    return {
      totalCount: payments.length,
      edges,
      pageInfo,
    };
  },
  truck: async (query,startIndex,limit) => {
    let trucks = await strapi.query('camiones').model.find(query)
    .populate({
      path: 'usuario',
      select: 'id nombre ap_paterno ap_materno'
    })
    // .populate({
    //   path: 'credito',
    //   select: 'id intereses'
    // });
    trucks = await Promise.all(
      trucks.map(async (truck) => {
        const user = await strapi.query('usuarios').model
          .findById(truck.usuario)
          .select('id nombre ap_paterno ap_materno');
        return {
          id:truck.id,
          cantidad_abono:truck.cantidad_abono,
          fecha_abono:truck.fecha_abono,
          estado_abono:truck.estado_abono,
          usuario:user,
        };
      })
    );
    const {edges, pageInfo} = pagination.search(payments,startIndex, limit)
    return {
      totalCount: payments.length,
      edges,
      pageInfo,
    };
  },
}
module.exports = {
  petition
}
