// const utils = require('../../../extensions/controllers/utils');
// const schema = require('../../../extensions/controllers/schemas');
// module.exports ={
//     definition:`
//         type cartEdge{
//             node: Carrito
//             cursor: ID!
//         }
//         type cartConnection{
//             totalCount: Int!
//             edges: [cartEdge!]!
//             pageInfo: PageInfo!
//         }

//     `,
//     query:`
//         paginationcarts(
//             start: Int,
//             limit: Int,
//             amount: Int,
//             products: String,
//             user: String,
//             sale: Float
//         ):cartConnection


//     `,
//     //cantidad  = amount
//     //productos = products
//     //usuario = user
//     //venta = sale
//     resolver: {
//         Query: {
//             paginationcarts:
//                 async(obj,{start,limit,amount,products,user,sale},ctx) =>{
//                   const authorization = ['Administrator','User'];
//                   const authenticated = ctx.context.headers.authorization

//                   const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//                   if(!token){
//                     throw new Error('No tienes autorización para realizar esta acción.');
//                   }
//                     const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
//                     const query={
//                         ...(amount && !isNaN(parseInt(amount))) && {
//                             cantidad: parseInt(amount)
//                           },
//                           ...(products && {
//                             "productos.nombre": new RegExp(product_name,'i')
//                           }),
//                           ...(user && {
//                             "usuario.nombre": new RegExp(user, 'i')
//                           }),
//                           ...(sale && !isNaN(parseFloat(sale))) && {
//                             "venta.monto": parseFloat(sale)
//                           },
//                     }
//                     const cars = await strapi.query('carrito').find(query);
//                     const {edges, pageInfo} = schema.search(cars,startIndex, limit)
//                     return {
//                       totalCount: cars.length,
//                       edges,
//                       pageInfo,
//                     };
//                     // const {edges, pageInfo} = schema.search(cars,startIndex, limit)
//                     // return {
//                     //   totalCount: payments.length,
//                     //   edges,
//                     //   pageInfo,
//                     // };
//                 }
//         }
//     }

// }
