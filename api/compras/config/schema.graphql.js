// module.exports ={
//     definition:`
//         type purchaseEdge{
//             node: Compras
//             cursor: ID!
//         }
//         type purchaseConnection{
//             totalCount: Int!
//             edges: [purchaseEdge!]!
//             pageInfo: PageInfo!
//         }

//     `,
//     // costo = cost
//     // fecha_pedido = order_date
//     // referencia = reference
//     // fecha_llegada = arrival_date
//     // lote = lot
//     // metodo_pago = payment_method
//     // proveedor = provider
//     // usuarios = user
//     resolver:{
//         Query:{
//             paginationshopping:
//                 async(obj,{start,limit,cost,order_date, reference, arrival_date, status, status2,lot, payment_method, provider, user,max_cost,max_order_date,min_order_date,max_arrival_date,min_arrival_date,min_cost,max_lot,min_lot,max_payment_method,min_payment_method}, ctx) => {
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
//                     const query={
//                         ...(cost && !isNaN(parseFloat(cost)))&& {
//                             costo: parseFloat(cost)
//                         },
//                         ...(order_date && {
//                             fecha_pedido: order_date
//                           }),
//                         ...(reference && {
//                             referencia: new RegExp(reference,'i')
//                         }),
//                         ...(arrival_date && {
//                             fecha_llegada: arrival_date
//                         }),
//                         ...(status !== undefined && {
//                             status: status
//                         }),
//                         ...(status2 && {
//                             status2: new RegExp(status2,'i')
//                         }),
//                         ...(lot && !isNaN(parseInt(lot))) && {
//                             "lote.codigo_interno": parseInt(lot)
//                         },
//                         ...(payment_method && !isNaN(parseInt(payment_method))) && {
//                             "metodo_pago.numero_tarjeta":parseInt(payment_method)
//                         },
//                        ...( provider && {
//                             'proveedor.nombre': new RegExp( provider,'i')
//                         }),
//                         ...(user && {
//                             "usuarios.nombre": new RegExp(user, 'i')
//                         }),

//     `,
//     query:`
//         paginationshopping(
//             start: Int,
//             limit: Int,
//             cost: Float,
//             order_date: DateTime,
//             reference: String,
//             arrival_date: DateTime,
//             status: Boolean,
//             status2: String,
//             lot: Int,
//             payment_method:Int,
//             provider: String,
//             user: String,
//             max_cost: Float,
//             min_cost: Float,
//             max_order_date: DateTime,
//             min_order_date: DateTime,
//             max_arrival_date: DateTime,
//             min_arrival_date: DateTime,
//             max_lot: Int,
//             min_lot: Int,
//             max_payment_method: Int,
//             min_payment_method: Int
//         ):purchaseConnection

//     `,
//     // costo = cost
//     // fecha_pedido = order_date
//     // referencia = reference
//     // fecha_llegada = arrival_date
//     // lote = lot
//     // metodo_pago = payment_method
//     // proveedor = provider
//     // usuarios = user
//     resolver:{
//         Query:{
//             paginationshopping:
//                 async(obj,{start,limit,cost,order_date, reference, arrival_date, status, status2,lot, payment_method, provider, user,max_cost,max_order_date,min_order_date,max_arrival_date,min_arrival_date,min_cost,max_lot,min_lot,max_payment_method,min_payment_method}, ctx) => {
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
//                     const query={
//                         ...(cost && !isNaN(parseFloat(cost)))&& {
//                             costo: parseFloat(cost)
//                         },
//                         ...(order_date && {
//                             fecha_pedido: order_date
//                           }),
//                         ...(reference && {
//                             referencia: new RegExp(reference,'i')
//                         }),
//                         ...(arrival_date && {
//                             fecha_llegada: arrival_date
//                         }),
//                         ...(status !== undefined && {
//                             status: status
//                         }),
//                         ...(status2 && {
//                             status2: new RegExp(status2,'i')
//                         }),
//                         ...(lot && !isNaN(parseInt(lot))) && {
//                             "lote.codigo_interno": parseInt(lot)
//                         },
//                         ...(payment_method && !isNaN(parseInt(payment_method))) && {
//                             "metodo_pago.numero_tarjeta":parseInt(payment_method)
//                         },
//                        ...( provider && {
//                             'proveedor.nombre': new RegExp( provider,'i')
//                         }),
//                         ...(user && {
//                             "usuarios.nombre": new RegExp(user, 'i')
//                         }),

//                     }
//                     let shopping = await strapi.query('compras').find(query);

//                     if( min_cost && max_cost) {
//                         shopping = shopping.filter( purchase => purchase.costo >=  min_cost && purchase.costo <= max_cost);
//                       }
//                       else if( min_cost){
//                         shopping = shopping.filter( purchase => purchase.costo > min_cost)
//                       }
//                       else if(max_cost){
//                         shopping = shopping.filter(purchase => purchase.costo < max_cost)
//                       }

//                       if (min_order_date && max_order_date) {
//                         shopping = shopping.filter(purchase => {
//                           const fecha_pedido = new Date(purchase.fecha_pedido);
//                           return fecha_pedido >= new Date(min_order_date) && fecha_pedido <= new Date(max_order_date);
//                         });
//                       }

//                       if (min_arrival_date && max_arrival_date) {
//                         shopping = shopping.filter(purchase => {
//                           const fecha_llegada = new Date(purchase.fecha_llegada);
//                           return fecha_llegada >= new Date(min_arrival_date) && fecha_llegada <= new Date(max_arrival_date);
//                         });
//                       }

//                       if(max_lot && min_lot){
//                         shopping = shopping.filter(purchase => {
//                           const codigo_interno = purchase.lote.codigo_interno
//                           return codigo_interno > min_lot && codigo_interno < max_lot;
//                         })
//                       }
//                       else if(min_lot){
//                         shopping = shopping.filter(purchase =>{
//                           const codigo_interno = purchase.lote.codigo_interno
//                           return codigo_interno > min_lot;
//                         })
//                       }else if(max_lot){
//                         shopping = shopping.filter(purchase =>{
//                           const codigo_interno = purchase.lote.codigo_interno
//                           return codigo_interno < max_lot;
//                         });
//                       }

//                       if(max_payment_method && min_payment_method){
//                         shopping = shopping.filter(purchase => {
//                           const numero_tarjeta = purchase.metodo_pago.numero_tarjeta
//                           return numero_tarjeta > min_payment_method && codigo_interno < max_payment_method;
//                         })
//                       }
//                       else if(min_payment_method){
//                         shopping = shopping.filter(purchase =>{
//                           const numero_tarjeta = purchase.metodo_pago.numero_tarjeta
//                           return numero_tarjeta > min_payment_method;
//                         })
//                       }else if(max_payment_method){
//                         shopping = shopping.filter(purchase =>{
//                           const numero_tarjeta = purchase.metodo_pago.numero_tarjeta
//                           return numero_tarjeta < max_payment_method;
//                         });
//                       }
//                     const edges = shopping
//                     .slice(startIndex, startIndex + parseInt(limit))
//                     .map((purchase) => ({ node: purchase, cursor: purchase.id }));
//                     const pageInfo = {
//                      startCursor: edges.length > 0 ? edges[0].cursor : null,
//                      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//                      hasNextPage:  startIndex + parseInt(limit) < shopping.length,
//                      hasPreviousPage: startIndex > 0,
//                     };
//                     return {
//                         totalCount: shopping.length,
//                         edges,
//                         pageInfo,
//                       };
//                 }
//         }
//     }
// }
