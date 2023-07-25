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

//                     if (min_date && max_date) {
//                         spents = spents.filter(spent => {
//                           const fecha = new Date(spent.fecha);
//                           return fecha >= new Date(min_date) && fecha <= new Date(max_date);
//                         });
//                       }

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
//             max_date: DateTime,
//             min_date: DateTime,
//             max_amount: Float,
//             min_amount: Float
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
//                 async(obj,{start,limit,description,date,amount,categoria,status,user,trucks,max_date,min_date,max_amount,min_amount }, ctx) => {
//                     // const authorization = ['Administrator']
//                     // const token = await utils.authorization(ctx.context.headers.authorization, authorization);
//                     // if(!token){
//                     //   throw new Error('No tienes autorización para realizar esta acción.');
//                     // }
//                     const authorization = ['Administrator','User'];
//                     const authenticated = ctx.context.headers.authorization
//                     const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//                     if(!token){
//                       throw new Error('No tienes autorización para realizar esta acción.');
//                     }
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
//                         // ...(trucks  && !isNaN(parseInt(trucks))) && {
//                         //     "camions.num_serie": parseInt(trucks)
//                         // },
//                         ...(trucks && {
//                             "camions.num_serie": new RegExp(trucks, 'i')
//                         }),
//                     }
//                     let spents = await strapi.query('gastos').find(query);

//                     if (min_date && max_date) {
//                         spents = spents.filter(spent => {
//                           const fecha = new Date(spent.fecha);
//                           return fecha >= new Date(min_date) && fecha <= new Date(max_date);
//                         });
//                       }

//                     if(min_amount && max_amount) {
//                         spents = spents.filter( spent => spent.monto >= min_amount && spent.monto <= max_amount);
//                       }
//                       else if(min_amount){
//                         spents = spents.filter( spent => spent.monto > min_amount)
//                       }
//                       else if(max_amount){
//                         spents = spents.filter(spent => spent.monto <= max_amount)
//                     }

//                     const edges = spents
//                     .slice(startIndex, startIndex + parseInt(limit))
//                     .map((spent) => ({node: spent, cursor: spent.id }));
//                     const pageInfo = {
//                      startCursor: edges.length > 0 ? edges[0].cursor : null,
//                      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//                      hasNextPage:  startIndex + parseInt(limit) < spents.length,
//                      hasPreviousPage: startIndex > 0,
//                     };
//                     return {
//                         totalCount: spents.length,
//                         edges,
//                         pageInfo,
//                       };
//                 }
//         }
//     }

// }
