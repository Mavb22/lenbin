// const utils = require('../../../extensions/controllers/utils');
// const schema = require('../../../extensions/controllers/schemas');
// module.exports = {
//     definition:`
//         type credenceEdge{
//             node: Credito
//             cursor: ID!
//         }
//         type credenceConnection{
//             totalCount: Int!
//             edges: [credenceEdge!]!
//             pageInfo: PageInfo!
//         }
//     `,
//     query:`
//         paginationcredit(
//             start: Int,
//             limit: Int,
//             end: Float,
//             high_date: DateTime,
//             low_date: DateTime,
//             validity: DateTime,
//             interests: Float,
//             status: Boolean,
//             status2: String,
//             payments: Float,
//             payment_method : Float,
//             user: String
//             max_end: Float,
//             min_end: Float,
//             max_high_date: DateTime,
//             min_high_date: DateTime,
//             max_low_date: DateTime,
//             min_low_date: DateTime,
//             max_validity: DateTime,
//             min_validity: DateTime,
//             max_interests:Float,
//             min_interests:Float,
//             max_payments:Float,
//             min_payments:Float,
//             max_payment_method: Float,
//             min_payment_method: Float
//         ):credenceConnection
//     `,
//     // limite = end
//     // fecha_alta =high_date
//     // fecha_baja =low_date
//     // vigencia = validity
//     // intereses = interests
//     // abonos = payments
//     // metodo_pago = payment_method
//     // usuario = user
//     resolver:{
//         Query: {
//             paginationcredit:
//                 async(obj,{start,limit,end,high_date,low_date,validity,interests,status,status2,payments,payment_method ,user,max_end,max_high_date,min_high_date,max_low_date,min_low_date,max_validity,min_validity,min_end,max_interests,min_interests,max_payments,min_payments,max_payment_method,min_payment_method}, ctx) =>{
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
//                         mostrar:true,
//                         ...(end &&!isNaN(parseFloat(end)) && {
//                           limite: parseFloat(end)
//                         }),
//                         ...(high_date && {
//                             fecha_alta: high_date
//                         }),
//                         ...(low_date && {
//                             fecha_baja: low_date
//                         }),
//                         ...(validity && {
//                             vigencia: validity
//                         }),
//                         ...(interests && !isNaN(parseFloat(interests)))&& {
//                             intereses: parseFloat(interests)
//                         },
//                         ...(status !== undefined && {
//                             status: status
//                         }),
//                         ...(status2 && {
//                             status2: new RegExp(status2,'i')
//                         }),
//                         ...(payments &&!isNaN(parseFloat(payments)) && {
//                             "abonos.cantidad_abono": parseFloat(payments)
//                         }),
//                         ...(payment_method  &&!isNaN(parseFloat(payment_method )) && {
//                             "metodo_pago.numero_tarjeta": parseFloat(payment_method )
//                          }),
//                         ...(user && {
//                             "usuario.nombre": new RegExp(user, 'i')
//                         }),

//                     };
//                     let credit = await strapi.query('credito').find(query);

//                     if(min_end &&  max_end) {
//                         credit = credit.filter( credence => credence.limite >= min_end && credence.limite <= max_end);
//                       }
//                       else if(min_end){
//                         credit = credit.filter( credence => credence.limite > min_end)
//                       }
//                       else if(max_end){
//                         credit = credit.filter(credence => credence.limite < max_end)
//                       }

//                       if (min_high_date && max_high_date) {
//                         credit = credit.filter(credence => {
//                           const fecha_alta = new Date(credence.fecha_alta);
//                           return fecha_alta >= new Date(min_high_date) && fecha_alta <= new Date(max_high_date);
//                         });
//                       }

//                       if (min_low_date && max_low_date) {
//                         credit = credit.filter(credence => {
//                           const fecha_baja = new Date(credence.fecha_baja);
//                           return fecha_baja >= new Date(min_low_date) && fecha_baja <= new Date(max_low_date);
//                         });
//                       }

//                       if (min_validity && max_validity) {
//                         credit = credit.filter(credence => {
//                           const vigencia = new Date(credence.vigencia);
//                           return vigencia >= new Date(min_validity) && vigencia <= new Date(max_validity);
//                         });
//                       }

//                       if(min_interests &&  max_interests) {
//                         credit = credit.filter( credence => credence.intereses > min_interests && credence.intereses< max_interests);
//                       }
//                       else if(min_interests){
//                         credit = credit.filter( credence => credence.intereses > min_interests)
//                       }
//                       else if(max_interests){
//                         credit = credit.filter(credence => credence.intereses <= max_interests)
//                       }

//                       if(max_payments && min_payments){
//                         credit = credit.filter(credence => {
//                           const cantidad_abono = credence.abonos.cantidad_abono
//                           return cantidad_abono > min_payments && cantidad_abono < max_payments;
//                         })
//                       }
//                       else if(min_payments){
//                         credit = credit.filter(credence =>{
//                           const cantidad_abono = credence.abonos.cantidad_abono
//                           return cantidad_abono > min_payments;
//                         })
//                       }else if(max_payments){
//                         credit = credit.filter(credence =>{
//                           const cantidad_abono = credence.abonos.cantidad_abono
//                           return cantidad_abono < max_payments;
//                         });
//                       }

//                       if(max_payment_method && min_payment_method){
//                         credit = credit.filter(credence => {
//                           const numero_tarjeta = credence.metodo_pago.numero_tarjeta
//                           return numero_tarjeta > min_payment_method && numero_tarjeta < max_payment_method;
//                         })
//                       }
//                       else if(min_payment_method){
//                         credit = credit.filter(credence =>{
//                           const numero_tarjeta = credence.metodo_pago.numero_tarjeta
//                           return numero_tarjeta > min_payment_method;
//                         })
//                       }else if(max_payment_method){
//                         credit = credit.filter(credence =>{
//                           const numero_tarjeta = credence.metodo_pago.numero_tarjeta
//                           return numero_tarjeta < max_payment_method;
//                         });
//                       }

//                     const edges = credit
//                       .slice(startIndex, startIndex + parseInt(limit))
//                       .map((credence) => ({ node: credence, cursor: credence.id }));
//                     const pageInfo = {
//                       startCursor: edges.length > 0 ? edges[0].cursor : null,
//                       endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//                       hasNextPage:  startIndex + parseInt(limit) < credit.length,
//                       hasPreviousPage: startIndex > 0,
//                     };
//                     return {
//                       totalCount: credit.length,
//                       edges,
//                       pageInfo,
//                     };
//                 }
//         }
//     }
// }


