// const utils = require('../../../extensions/controllers/utils');
// const schema = require('../../../extensions/controllers/schemas');
// module.exports = {
//   definition: `
//     type PromotionEdge {
//       node: Promociones
//       cursor: ID!
//     }
//     type PromotionConnection {
//       totalCount: Int!
//       edges: [PromotionEdge!]!
//       pageInfo: PageInfo!
//     }
//   `,
//   query: `
//     paginationPromotion(
//       start: Int!,
//       limit: Int!,
//       creation_date: DateTime,
//       validity_date: DateTime,
//       discount_value: Float,
//       ref_code: Long,
//       condition: String,
//       product_name: String
//     ): PromotionConnection
//   `,
//   resolver: {
//     Query: {
//       paginationPromotion: async (obj, {
//         start,
//         limit,
//         creation_date,
//         validity_date,
//         discount_value,
//         ref_code,
//         condition,
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
//           ...(creation_date && {
//             fecha_creacion: creation_date
//           }),
//           ...(validity_date && {
//             fecha_vigencia: validity_date
//           }),
//           ...(discount_value && !isNaN(parseFloat(discount_value))) && {
//             valor_descuento: parseFloat(discount_value)
//           },
//           ...(ref_code && !isNaN(parseInt(ref_code))) && {
//             codigo_ref: parseInt(ref_code)
//           },
//           ...(condition && {
//             condicion: {
//               $regex: RegExp(condition, 'i')
//             }
//           }),
//           ...(product_name && {
//             "productos.nombre": {
//               $regex: RegExp(product_name, 'i')
//             }
//           })
//         };
//         const promotions = await strapi.query('promociones').find(query);
//         const {edges, pageInfo} = schema.search(promotions,startIndex, limit)
//         return {
//           totalCount: promotions.length,
//           edges,
//           pageInfo,
//         };
//       }
//     }
//   }
// }
