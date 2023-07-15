// const utils = require('../../../extensions/controllers/utils');
// const schema = require('../../../extensions/controllers/schemas');
// module.exports = {
//   definition: `
//     type ProviderEdge {
//       node: Proveedor
//       cursor: ID!
//     }
//     type ProviderConnection {
//       totalCount: Int!
//       edges: [ProviderEdge!]!
//       pageInfo: PageInfo!
//     }
//   `,
//   query: `
//     paginationProvider(
//       start: Int!,
//       limit: Int!,
//       name: String,
//       business_name: String,
//       rfc: String,
//       start_date: DateTime,
//       street: String,
//       number: String,
//       colony: String,
//       postal_code: Long,
//       municipality: String,
//       city: String,
//       country: String,
//       scheduled_visit: DateTime,
//       status: Boolean,
//       status2: String,
//       purchase_cost: Float,
//       product_name: String
//     ): ProviderConnection
//   `,
//   resolver: {
//     Query: {
//       paginationProvider: async (obj, {
//         start,
//         limit,
//         name,
//         business_name,
//         rfc,
//         start_date,
//         street,
//         number,
//         colony,
//         postal_code,
//         municipality,
//         city,
//         country,
//         scheduled_visit,
//         status,
//         status2,
//         purchase_cost,
//         product_name
//       },ctx) => {
//         const authorization = ['Administrator','User'];
//                   const authenticated = ctx.context.headers.authorization

//                   const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//                   if(!token){
//                     throw new Error('No tienes autorización para realizar esta acción.');
//                   }
//         const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
//         const query = {
//           ...(name && {
//             nombre: {
//               $regex: RegExp(name, 'i')
//             }
//           }),
//           ...(business_name && {
//             razon_social: {
//               $regex: RegExp(business_name, 'i')
//             }
//           }),
//           ...(rfc && {
//             rfc: {
//               $regex: RegExp(rfc, 'i')
//             }
//           }),
//           ...(start_date && {
//             fecha_alta: start_date
//           }),
//           ...(street && {
//             calle: {
//               $regex: RegExp(street, 'i')
//             }
//           }),
//           ...(number && {
//             numero: {
//               $regex: RegExp(number, 'i')
//             }
//           }),
//           ...(colony && {
//             colonia: {
//               $regex: RegExp(colony, 'i')
//             }
//           }),
//           ...(postal_code && !isNaN(parseInt(postal_code))) && {
//             cp: parseInt(postal_code)
//           },
//           ...(municipality && {
//             municipio: {
//               $regex: RegExp(municipality, 'i')
//             }
//           }),
//           ...(city && {
//             ciudad: {
//               $regex: RegExp(city, 'i')
//             }
//           }),
//           ...(country && {
//             pais: {
//               $regex: RegExp(country, 'i')
//             }
//           }),
//           ...(scheduled_visit && {
//             visita_programada: scheduled_visit
//           }),
//           ...(status !== undefined && {
//             status: status
//           }),
//           ...(status2 && {
//             status2: {
//               $regex: RegExp(status2, 'i')
//             }
//           }),
//           ...(purchase_cost && !isNaN(parseFloat(purchase_cost))) && {
//             "compras.costo": parseFloat(purchase_cost)
//           },
//           ...(product_name && {
//             "productos.nombre": {
//               $regex: RegExp(product_name, 'i')
//             }
//           })
//         };
//         const providers = await strapi.query('proveedor').find(query);
//         const {edges, pageInfo} = schema.search(providers,startIndex, limit)
//         return {
//           totalCount: providers.length,
//           edges,
//           pageInfo,
//         };
//       }
//     }
//   }
// };




