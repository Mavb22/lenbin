// const utils = require('../../../extensions/controllers/utils');
// module.exports = {
//   definition: `
//     type paymentEdge {
//       node: Abonos
//       cursor: ID!
//     }

//     type paymentConnection {
//       totalCount: Int!
//       edges: [paymentEdge!]!
//       pageInfo: PageInfo!
//     }

//     type PageInfo {
//       startCursor: ID
//       endCursor: ID
//       hasNextPage: Boolean!
//       hasPreviousPage: Boolean!
//     }
//   `,
//   query: `
//     paginationpayments(
//       start: Int,
//       limit: Int,
//       credit_quantity: Int,
//       max_credit_quantity: Int,
//       min_credit_quantity: Int,
//       credit_date: DateTime,
//       quantity_payment: String,
//       credit: Int,
//       max_credit: Int,
//       min_credit: Int,
//       user: String
//     ): paymentConnection

//   `,
//    //cantidad_abono = credit_quantity
//    //fecha_abono = credit_date
//    //estado_abono = quantity_payment
//    //credit = credito
//    //user = usuario

//   resolver: {
//     Query: {
//       paginationpayments:
//         async (obj, { start, limit, credit_quantity,max_credit_quantity,min_credit_quantity,credit_date,quantity_payment,credit,max_credit, min_credit,user},ctx) => {
//           const authorization = ['Administrator','User'];
//           const authenticated = ctx.context.headers.authorization

//           const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//           if(!token){
//             throw new Error('No tienes autorización para realizar esta acción.');
//           }
//           const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
//           const query = {
//             mostrar:true,
//             ...(credit_quantity &&!isNaN(parseFloat(credit_quantity)) && {
//               cantidad_abono: parseFloat(credit_quantity)
//             }),
//             ...(credit_date && {
//               fecha_abono: credit_date
//             }),
//             // ...(min_credit_quantity && !isNaN(parseFloat(min_credit_quantity)) && {
//             //   cantidad_abono: { $gte: parseFloat(min_credit_quantity) }
//             // }),
//             // ...(max_credit_quantity && !isNaN(parseFloat(max_credit_quantity)) && {
//             //   cantidad_abono: { $lte: parseFloat(max_credit_quantity) }
//             // }),
//             ...(quantity_payment && {
//               estado_abono:{
//                 $regex: new RegExp(quantity_payment, 'i')
//               }
//             }),
//             ...(credit && !isNaN(parseFloat(credit))) && {
//               "credito.interes": parseFloat(credit)
//             },
//             ...(user && {
//               "usuario.nombre": new RegExp(user, 'i')
//             }),
//           }
//           let payments = await strapi.query('abonos').find(query);
//           if(min_credit_quantity && max_credit_quantity) {
//             payments = payments.filter( payment => payment.cantidad_abono > min_credit_quantity && payment.cantidad_abono < max_credit_quantity);
//           }
//           else if(min_credit_quantity){
//             payments = payments.filter( payment => payment.cantidad_abono > min_credit_quantity)
//           }
//           else if(max_credit_quantity){
//             payments = payments.filter(payment => payment.cantidad_abono < max_credit_quantity)
//           }
//           if(max_credit && min_credit){
//             payments = payments.filter(payment => {
//               const intereses = payment.credito.intereses
//               return intereses > max_credit && intereses < min_credit;
//             })
//           }
//           else if(min_credit){
//             payments = payments.filter(payment =>{
//               const intereses = payment.credito.intereses
//               return intereses > min_credit;
//             })
//           }else if(max_credit){
//             payments = payments.filter(payment =>{
//               const intereses = payment.credito.intereses
//               return intereses < max_credit;
//             });
//           }
//           const {edges, pageInfo} = schema.search(payments,startIndex, limit)
//           return {
//             totalCount: payments.length,
//             edges,
//             pageInfo,
//           };
//         },
//     },
//   },
// };
const utils = require('../../../extensions/controllers/utils');
const { petition } = require('../../../extensions/graphql/petition');
const { resolverFilters } = require('../../../extensions/graphql/resolverFilters');
const schema = require('../../../extensions/graphql/schema');
const {definition,query,resolver}  = schema('Abonos','Payment');
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
        const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
        const query = await resolverFilters(filters,'Abonos',{mostrar:true});
        const {totalCount,edges,pageInfo} = await petition.abonos(query,startIndex,limit);
        return {
          totalCount,
          edges,
          pageInfo,
        };
    }
    }
  }
};
