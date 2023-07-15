// const utils = require('../../../extensions/controllers/utils');
// const schema = require('../../../extensions/controllers/schemas');
// module.exports ={
//     definition:`
//         type spentEdge{
//             node: Gastos
//             cursor: ID!
//         }
//         type spentConnection{
//             totalCount: Int!
//             edges: [spentEdge!]!
//             pageInfo: PageInfo!
//         }


//     `,
//     query:`
//         paginationspents(
//             start: Int,
//             limit: Int,
//             description: String,
//             date: DateTime,
//             amount: Float,
//             categoria: String,
//             status: Boolean,
//             user: String,
//             trucks : String
//         ):spentConnection
//     `,
//     // descripcion = description
//     // fecha = date
//     // monto = amount
//     // categoria = category
//     // usuario = user
//     // camions =  trucks
//     resolver:{
//         Query:{
//             paginationspents:
//                 async(obj,{start,limit,description,date,amount,categoria,status,user,trucks }, ctx) => {
//                   const authorization = ['Administrator','User'];
//                   const authenticated = ctx.context.headers.authorization

//                   const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//                   if(!token){
//                     throw new Error('No tienes autorización para realizar esta acción.');
//                   }
//                     const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
//                     const query = {
//                         ...(description && {
//                             descripcion: new RegExp(description,'i')
//                         }),
//                         ...(date && {
//                             fecha: date
//                         }),
//                         ...(amount && !isNaN(parseFloat(amount)))&& {
//                             monto: parseFloat(amount)
//                         },
//                         ...(categoria && {
//                             categoria: new RegExp(categoria,'i')
//                         }),
//                         ...(status !== undefined && {
//                             status: status
//                         }),
//                         ...(user && {
//                             "usuario.nombre": new RegExp(user, 'i')
//                         }),
//                         ...(trucks && {
//                           "camions.num_serie": new RegExp(trucks, 'i')
//                         }),
//                     }
//                     const spents = await strapi.query('gastos').find(query);
//                     const {edges, pageInfo} = schema.search(spents,startIndex, limit)
//                     return {
//                       totalCount: spents.length,
//                       edges,
//                       pageInfo,
//                     };
//                 }
//         }
//     }

// }
