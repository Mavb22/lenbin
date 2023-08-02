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
//       max_creation_date: DateTime,
//       min_creation_date: DateTime,
//       max_validity_date: DateTime,
//       min_validity_date: DateTime,
//       max_discount_value: Float,
//       min_discount_value: Float
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
//         product_name,
//         max_discount_value,
//         min_discount_value,
//         max_creation_date,
//         min_creation_date,
//         max_validity_date,
//         min_validity_date
//       },ctx) => {
//         // const authorization = ['Administrator']
//         // const token = await utils.authorization(ctx.context.headers.authorization, authorization);
//         // if(!token){
//         //   throw new Error('No tienes autorización para realizar esta acción.');
//         // }
//         const authorization = ['Administrator','User'];
//         const authenticated = ctx.context.headers.authorization
//         const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//         if(!token){
//           throw new Error('No tienes autorización para realizar esta acción.');
//         }
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
//         let promotions = await strapi.query('promociones').find(query);

//         if (min_creation_date && max_creation_date) {
//           promotions= promotions.filter(promotions => {
//             const fecha_creacion = new Date(promotions.fecha_creacion);
//             return fecha_creacion >= new Date(min_creation_date) && fecha_creacion <= new Date(max_creation_date);
//           });
//         }

//         if (min_validity_date && max_validity_date) {
//           promotions= promotions.filter(promotions => {
//             const fecha_vigencia = new Date(promotions.fecha_vigencia);
//             return fecha_vigencia >= new Date(min_validity_date) && fecha_vigencia <= new Date(max_validity_date);
//           });
//         }

//         if(min_discount_value && max_discount_value) {
//           promotions = promotions.filter( promotions => promotions.valor_descuento >= min_discount_value && promotions.valor_descuento <= max_discount_value);
//         }
//         else if(min_discount_value){
//           promotions = promotions.filter( promotions => promotions.valor_descuento > min_discount_value)
//         }
//         else if(max_discount_value){
//           promotions = promotions.filter(promotions => promotions.valor_descuento <= max_discount_value)
//         }

//         const edges = promotions
//           .slice(startIndex, startIndex + parseInt(limit))
//           .map((promotion) => ({
//             node: promotion,
//             cursor: promotion.id
//           }));
//         const pageInfo = {
//           startCursor: edges.length > 0 ? edges[0].cursor : null,
//           endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//           hasNextPage: startIndex + parseInt(limit) < promotions.length,
//           hasPreviousPage: startIndex > 0,
//         };
//         return {
//           totalCount: promotions.length,
//           edges,
//           pageInfo,
//         };
//       }
//     }
//   }
// }
const utils = require('../../../extensions/controllers/utils');
const { petition } = require('../../../extensions/graphql/petition');
const { resolverFilters } = require('../../../extensions/graphql/resolverFilters');
const schema = require('../../../extensions/graphql/schema');
const {definition,query,resolver}  = schema('Promociones','Promotions');
module.exports = {
  definition,
  query,
  resolver: {
    Query : {
      [resolver]: async (obj,{start,limit,filters},{context}) => {
        const authorization = ['Administrator','User'];
        const authenticated = context.headers.authorization;
        const token = await utils.authorization(authenticated.split(' ')[1], authorization);
          if(!token){
            throw new Error('No tienes autorización para realizar esta acción.');
          }
        console.log(filters);
        const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
        const query = await resolverFilters(filters,'Promociones');
        console.log(query);
        const {totalCount,edges,pageInfo} = await petition.promociones(query,startIndex,limit);
        return {
          totalCount,
          edges,
          pageInfo,
        };
    }
    }
  }
};