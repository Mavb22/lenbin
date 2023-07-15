// const utils = require('../../../extensions/controllers/utils');
// const schema = require('../../../extensions/controllers/schemas');
// module.exports = {
//   definition: `
//       type RouteEdge{
//           node: Rutas
//           cursor: ID!
//       }
//       type RouteConnection{
//           totalCount: Int!
//           edges: [RouteEdge!]!
//           pageInfo: PageInfo!
//       }
//   `,
//   query: `
//       paginationRoute(
//           start: Int,
//           limit: Int,
//           description: String,
//           origin: String,
//           destination: String,
//           departure_date: DateTime,
//           arrival_date: DateTime,
//           reference: String,
//           received_goods_name: String,
//           comments: String,
//           state: String,
//           cyclic_route: Boolean,
//           trucks_serial_number: String,
//           sales_amount: Float,
//       ):RouteConnection
//   `,
//   resolver: {
//     Query: {
//       paginationRoute: async (obj, {
//         start,
//         limit,
//         description,
//         origin,
//         destination,
//         departure_date,
//         arrival_date,
//         reference,
//         received_goods_name,
//         comments,
//         state,
//         cyclic_route,
//         trucks_serial_number,
//         sales_amount
//       },ctx) => {
//         const authorization = ['Administrator','User'];
//                   const authenticated = ctx.context.headers.authorization

//                   const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//                   if(!token){
//                     throw new Error('No tienes autorización para realizar esta acción.');
//                   }
//         const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
//         const query = {
//           ...(description && {
//             descripcion: {
//               $regex: RegExp(description, 'i')
//             }
//           }),
//           ...(origin && {
//             lugar_origen: {
//               $regex: RegExp(origin, 'i')
//             }
//           }),
//           ...(destination && {
//             destino: {
//               $regex: RegExp(destination, 'i')
//             }
//           }),
//           ...(departure_date && {
//             fecha_salida: departure_date
//           }),
//           ...(arrival_date && {
//             fecha_llegada: arrival_date
//           }),
//           ...(reference && {
//             referencia: {
//               $regex: RegExp(reference, 'i')
//             }
//           }),
//           ...(received_goods_name && {
//             nombre_mercancia_recibida: {
//               $regex: RegExp(received_goods_name, 'i')
//             }
//           }),
//           ...(comments && {
//             comentarios: {
//               $regex: RegExp(comments, 'i')
//             }
//           }),
//           ...(state && {
//             estado: state
//           }),
//           ...(cyclic_route !== null && {
//             ruta_ciclica: cyclic_route
//           }),
//           ...(trucks_serial_number && {
//             "camiones.num_serie": {
//               $regex: RegExp(trucks_serial_number, 'i')
//             }
//           }),
//           ...(sales_amount && !isNaN(parseFloat(sales_amount))) && {
//             "ventas.monto": parseFloat(sales_amount)
//           }
//         };
//         const route = await strapi.query('rutas').find(query);
//         const {edges, pageInfo} = schema.search(route,startIndex, limit)
//         return {
//           totalCount: route.length,
//           edges,
//           pageInfo,
//         };
//       }
//     }
//   }

// }
