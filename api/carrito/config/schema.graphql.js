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

    // `,
    // query:`
    //     paginationcarts(
    //         start: Int,
    //         limit: Int,
    //         amount: Int,
    //         products: String,
    //         user: String,
    //         sale: Float,
    //         max_amount: Int,
    //         min_amount: Int,
    //         max_sale: Float,
    //         min_sale: Float
    //     ):cartConnection


    // `,
    //cantidad  = amount
    //productos = products
    //usuario = user
    //venta = sale
    // resolver: {
    //     Query: {
    //         paginationcarts:
    //             async(obj,{start,limit,amount,products,user,sale,max_amount,min_amount,max_sale,min_sale}, ctx) =>{
    //                 // const authorization = ['Administrator']
    //                 // const token = await utils.authorization(ctx.context.headers.authorization, authorization);
    //                 // if(!token){
    //                 //   throw new Error('No tienes autorización para realizar esta acción.');
    //                 // }

    //                 const authorization = ['Administrator','User'];
    //                 const authenticated = ctx.context.headers.authorization
    //                 const token = await utils.authorization(authenticated.split(' ')[1], authorization);
    //                 if(!token){
    //                   throw new Error('No tienes autorización para realizar esta acción.');
    //                 }
    //                 const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
    //                 const query={
    //                     ...(amount && !isNaN(parseInt(amount))) && {
    //                         cantidad: parseInt(amount)
    //                       },
    //                       ...(products && {
    //                         "productos.nombre": new RegExp(product_name,'i')
    //                       }),
    //                       ...(user && {
    //                         "usuario.nombre": new RegExp(user, 'i')
    //                       }),
    //                       ...(sale && !isNaN(parseFloat(sale))) && {
    //                         "venta.monto": parseFloat(sale)
    //                       },
    //                 }
                    // if(max_amount && min_amount){
                    //   payments = payments.filter(payment => {
                    //     const intereses = payment.cantidad
                    //     return intereses > max_amount && intereses < min_amount;
                    //   })
                    // }
                    // else if(min_amount){
                    //   payments = payments.filter(payment =>{
                    //     const intereses = payment.cantidad
                    //     return intereses > min_amount;
                    //   })
                    // }else if(max_amount){
                    //   payments = payments.filter(payment =>{
                    //     const intereses = payment.cantidad
                    //     return intereses < max_amount;
                    //   });
                    // }

                   
                //     let carts = await strapi.query('carrito').find(query);

                //     if(min_amount && max_amount) {
                //       carts = carts.filter( cart => cart.cantidad >= min_amount && cart.cantidad <= max_amount);
                //     }
                //     else if(min_amount){
                //       carts = carts.filter( cart => cart.cantidad > min_amount)
                //     }
                //     else if(max_amount){
                //       carts = carts.filter(cart => cart.cantidad <= max_amount)
                //     }


                //     if(max_sale && min_sale){
                //       carts = carts.filter(cart => {
                //         const monto = cart.venta.monto
                //         return monto > min_sale && monto < max_sale;
                //       })
                //     }
                //     else if(min_sale){
                //       carts = carts.filter(cart =>{
                //         const monto = cart.venta.monto
                //         return monto > min_sale;
                //       })
                //     }else if(max_sale){
                //       carts = carts.filter(cart =>{
                //         const monto = cart.venta.monto
                //         return monto < max_sale;
                //       });
                //     }
                //     const edges = carts
                //     .slice(startIndex, startIndex + parseInt(limit))
                //     .map((cart) => ({ node: cart, cursor: cart.id }));
                //     const pageInfo = {
                //      startCursor: edges.length > 0 ? edges[0].cursor : null,
                //      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                //      hasNextPage:  startIndex + parseInt(limit) < carts.length,
                //      hasPreviousPage: startIndex > 0,
                //     };
                //     return {
                //         totalCount: carts.length,
                //         edges,
                //         pageInfo,
                //       };
                // }

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
//                             "productos.nombre": new RegExp(products,'i')
//                           }),
//                           ...(user && {
//                             "usuario.nombre": new RegExp(user, 'i')
//                           }),
//                           ...(sale && !isNaN(parseFloat(sale))) && {
//                             "venta.monto": parseFloat(sale)
//                           },


//                     }
//                     let carts = await strapi.query('carrito').find(query);

//                     if(min_amount && max_amount) {
//                       carts = carts.filter( cart => cart.cantidad >= min_amount && cart.cantidad <= max_amount);
//                     }
//                     else if(min_amount){
//                       carts = carts.filter( cart => cart.cantidad > min_amount)
//                     }
//                     else if(max_amount){
//                       carts = carts.filter(cart => cart.cantidad <= max_amount)
//                     }


//                     if(max_sale && min_sale){
//                       carts = carts.filter(cart => {
//                         const monto = cart.venta.monto
//                         return monto > min_sale && monto < max_sale;
//                       })
//                     }
//                     else if(min_sale){
//                       carts = carts.filter(cart =>{
//                         const monto = cart.venta.monto
//                         return monto > min_sale;
//                       })
//                     }else if(max_sale){
//                       carts = carts.filter(cart =>{
//                         const monto = cart.venta.monto
//                         return monto < max_sale;
//                       });
//                     }
//                     const edges = carts
//                     .slice(startIndex, startIndex + parseInt(limit))
//                     .map((cart) => ({ node: cart, cursor: cart.id }));
//                     const pageInfo = {
//                      startCursor: edges.length > 0 ? edges[0].cursor : null,
//                      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//                      hasNextPage:  startIndex + parseInt(limit) < carts.length,
//                      hasPreviousPage: startIndex > 0,
//                     };
//                     return {
//                         totalCount: carts.length,
//                         edges,
//                         pageInfo,
//                       };
//                 }

//         }
//     }

// }
const utils = require('../../../extensions/controllers/utils');
const { petition } = require('../../../extensions/graphql/petition');
const { resolverFilters } = require('../../../extensions/graphql/resolverFilters');
const schema = require('../../../extensions/graphql/schema');
const {definition,query,resolver}  = schema('Carrito','Carts');
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
        const query = await resolverFilters(filters,'Carrito');
        console.log(query);
        const {totalCount,edges,pageInfo} = await petition.carrito(query,startIndex,limit);
        return {
          totalCount,
          edges,
          pageInfo,
        };
    }
    }
  }
};