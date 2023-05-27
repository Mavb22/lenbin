// module.exports = {
//   definition: `
//     type LotEdge{
//         node: Lotes
//         cursor: ID!
//     }
//     type LotConnection{
//         totalCount: Int!
//         edges: [LotEdge!]!
//         pageInfo: PageInfo!
//     }
//   `,
//   query:`
//      paginationLot(
//         start: Int!,
//         limit: Int!,
//         internal_code: Int,
//         arrival_date: DateTime,
//         expiration_date: DateTime,
//         acquisition_date: DateTime,
//         cost: Float,
//         shopping_cost:Int,
//         product_name:String
//      ): LotConnection
//   `,
//   resolver: {
//     Query: {
//       paginationLot: async (obj, {start,limit,internal_code, arrival_date,expiration_date,acquisition_date, cost, shopping_cost,product_name}) => {
//         const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
//         const query = {
//           ...(internal_code && !isNaN(parseInt(internal_code))) && {
//             codigo_interno: parseInt(internal_code)
//           },
//           ...(arrival_date&& {
//             fecha_arrivo: arrival_date
//           }),
//           ...(expiration_date && {
//             fecha_caducidad: expiration_date
//           }),
//           ...(acquisition_date && {
//             fecha_adquisicion:acquisition_date
//           }),
//           ...(cost && !isNaN(parseFloat(cost)))&& {
//             costo: parseFloat(cost)
//           },
//           ...(shopping_cost && !isNaN(parseInt(shopping_cost))) && {
//             "compras.costo": parseInt(shopping_cost)
//           },
//           ...(product_name && {
//             "products.nombre": new RegExp(product_name,'i')
//           }),
//         }
//         const lots = await strapi.query('lotes').find(query);
//         const edges = lots
//         .slice(startIndex, startIndex + parseInt(limit))
//         .map((lot) => ({ node: lot, cursor:lot.id }));
//         const pageInfo = {
//           startCursor: edges.length > 0 ? edges[0].cursor : null,
//           endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//           hasNextPage:  startIndex + parseInt(limit) < lots.length,
//           hasPreviousPage: startIndex > 0,
//         };
//         return {
//           totalCount: lots.length,
//           edges,
//           pageInfo,
//         };
//       }
//     }
//   }
// }
module.exports ={
  definition:`
      type LotEdge{
          node: Lotes
          cursor: ID!
      }
      type LotConnection{
          totalCount: Int!
          edges: [LotEdge!]!
          pageInfo: PageInfo!
      }
  `,
  query:`
      paginationLot(
          start: Int,
          limit: Int,
          internal_code: Int,
          arrival_date: DateTime,
          expiration_date: DateTime,
          acquisition_date: DateTime,
          cost: Float,
          shopping_cost:Int,
          product_name:String
      ):LotConnection
  `,
  resolver:{
      Query:{
          paginationLot:
          async(obj,{start,limit,internal_code, arrival_date,expiration_date,acquisition_date, cost, shopping_cost,product_name}) =>{
              const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
              const query = {
                ...(internal_code && !isNaN(parseInt(internal_code))) && {
                  codigo_interno: parseInt(internal_code)
                },
                ...(arrival_date&& {
                  fecha_arrivo: arrival_date
                }),
                ...(expiration_date && {
                  fecha_caducidad: expiration_date
                }),
                ...(acquisition_date && {
                  fecha_adquisicion:acquisition_date
                }),
                ...(cost && !isNaN(parseFloat(cost)))&& {
                  costo: parseFloat(cost)
                },
                ...(shopping_cost && !isNaN(parseInt(shopping_cost))) && {
                  "compras.costo": parseInt(shopping_cost)
                },
                ...(product_name && {
                  "products.nombre": new RegExp(product_name,'i')
                }),
              }
              const Lotes = await strapi.query('lotes').find(query);
              const edges = Lotes
                .slice(startIndex, startIndex + parseInt(limit))
                .map((lot) => ({ node: lot, cursor: lot.id }));
              const pageInfo = {
                startCursor: edges.length > 0 ? edges[0].cursor : null,
                endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                hasNextPage:  startIndex + parseInt(limit) < Lotes.length,
                hasPreviousPage: startIndex > 0,
              };
              return {
                totalCount: Lotes.length,
                edges,
                pageInfo,
              };
          }
      }
  }

}
