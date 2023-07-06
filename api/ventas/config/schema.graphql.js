const utils = require('../../../extensions/controllers/utils');
const schema = require('../../../extensions/controllers/schemas');
module.exports = {
  definition: `
    type SaleEdge {
      node: Ventas
      cursor: ID!
    }
    type SaleConnection {
      totalCount: Int!
      edges: [SaleEdge!]!
      pageInfo: PageInfo!
    }
  `,
  // invoice: JS
  query: `
    paginationSale(
      start: Int!,
      limit: Int!,
      amount: Float,
      total_amount: Float,
      date: DateTime,
      clasification: String,
      delivery_date: DateTime,
      delivery_pending: Boolean,
      paid: Boolean,
      status: Boolean,
      status2: String,
      location_name: String,
      user_name: String,
      carts_quantity: Float,
      payment_methods_owner: String,
      destination_routes: String,
      sellers_name: String
    ): SaleConnection
  `,
  resolver: {
    Query: {
      paginationSale: async (obj, {
        start,
        limit,
        amount,
        total_amount,
        date,
        clasification,
        delivery_date,
        delivery_pending,
        paid,
        status,
        status2,
        location_name,
        user_name,
        carts_quantity,
        payment_methods_owner,
        destination_routes,
        sellers_name
      },ctx) => {
        const authorization = ['Administrator','User'];
        const authenticated = ctx.context.headers.authorization
        const token = await utils.authorization(authenticated.split(' ')[1], authorization);
        if(!token){
          throw new Error('No tienes autorización para realizar esta acción.');
        }
        const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
        const query = {
          ...(amount && !isNaN(parseFloat(amount))) && {
            monto: parseFloat(amount)
          },
          ...(total_amount && !isNaN(parseFloat(total_amount))) && {
            monto_total: parseFloat(total_amount)
          },
          ...(date && {
            fecha: date
          }),
          ...(clasification && {
            clasificacion: new RegExp(clasification, 'i')
          }),
          ...(delivery_date && {
            fecha_entrega: delivery_date
          }),
          ...(delivery_pending !== undefined) && {
            entrega_pendiente: delivery_pending
          },
          ...(paid !== undefined) && {
            pagada: paid
          },
          ...(status !== undefined) && {
            status: status
          },
          ...(status2 && {
            status2: status2
          }),
          ...(location_name && {
            "local.nombre": new RegExp(location_name, 'i')
          }),
          ...(user_name && {
            "usuario.nombre": new RegExp(user_name, 'i')
          }),
          ...(carts_quantity && !isNaN(parseFloat(carts_quantity))) && {
            "carritos.cantidad": parseFloat(carts_quantity)
          },
          ...(payment_methods_owner && {
            "metodo_pagos.titular": new RegExp(payment_methods_owner, 'i')
          }),
          ...(destination_routes && {
            "rutas.destino": new RegExp(destination_routes, 'i')
          }),
          ...(sellers_name && {
            "vendedores.nombre": new RegExp(sellers_name, 'i')
          })
        };
        const sales = await strapi.query('ventas').find(query);
        const {edges, pageInfo} = schema.search(sales,startIndex, limit)
        return {
          totalCount: sales.length,
          edges,
          pageInfo,
        };
      }
    }
  }
};
