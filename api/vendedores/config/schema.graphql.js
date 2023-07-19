// module.exports = {
//   definition: `
//     type SellerEdge {
//       node: Vendedores
//       cursor: ID!
//     }
//     type SellerConnection {
//       totalCount: Int!
//       edges: [SellerEdge!]!
//       pageInfo: PageInfo!
//     }
//   `,
//   query: `
//     paginateSellers(
//       start: Int!,
//       limit: Int!,
//       name: String,
//       sales_amount: Float
//       max_sales_amount: Float,
//       min_sales_amount: Float,
//     ): SellerConnection
//   `,
//   resolver: {
//     Query: {
//       paginateSellers: async (obj, {
//         name,
//         sales_amount,
//         max_sales_amount,
//         min_sales_amount
//       }, {
//         startIndex = 0,
//         limit = 10
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
//         const query = {
//           ...(name && {
//             nombre: {
//               $regex: RegExp(name, 'i')
//             }
//           }),
//           ...(sales_amount && !isNaN(parseFloat(sales_amount))) && {
//             ventas_monto: parseFloat(sales_amount)
//           },
//         };

//         let sellers = await strapi.query('vendedores').find(query);

//         if(max_sales_amount && min_sales_amount){
//           sellers = sellers.filter(seller  => {
//             const monto = seller.ventas.monto
//             return monto > min_sales_amount && monto < max_sales_amount;
//           })
//         }
//         else if(min_sales_amount){
//           sellers = sellers.filter(seller  =>{
//             const monto = seller.ventas.monto
//             return monto > min_sales_amount;
//           })
//         }else if(max_sales_amount){
//           sellers = sellers.filter(seller  =>{
//             const monto = seller.ventas.monto
//             return monto < max_sales_amount;
//           });
//         }

//         const edges = sellers
//           .slice(startIndex, startIndex + parseInt(limit))
//           .map((seller) => ({
//             node: seller,
//             cursor: seller.id
//           }));
//         const pageInfo = {
//           startCursor: edges.length > 0 ? edges[0].cursor : null,
//           endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//           hasNextPage: startIndex + parseInt(limit) < sellers.length,
//           hasPreviousPage: startIndex > 0,
//         };
//         return {
//           totalCount: sellers.length,
//           edges,
//           pageInfo,
//         };
//       },
//     },
//   },
// };
