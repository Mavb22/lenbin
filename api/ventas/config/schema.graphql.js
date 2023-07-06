module.exports = {
  definition: `
    type SaleEdge {
      node: Ventas
      cursor: ID!
    }
    type SaleConnection {
      totalCount: Int!
      edges: [SaleEdge!]!
      pageInfo: PageInfo!
    }
  `,
  // invoice: JS
  query: `
    paginationSale(
      start: Int!,
      limit: Int!,
      amount: Float,
      total_amount: Float,
      date: DateTime,
      clasification: String,
      delivery_date: DateTime,
      delivery_pending: Boolean,
      paid: Boolean,
      status: Boolean,
      status2: String,
      location_name: String,
      user_name: String,
      carts_quantity: Float,
      payment_methods_owner: String,
      destination_routes: String,
      sellers_name: String
      max_amount: Float,
      min_amount: Float,
      max_total_amount: Float,
      min_total_amount: Float,
      max_carts_quantity: Float,
      min_carts_quantity: Float
      max_date: DateTime,
      min_date: DateTime,
      max_delivery_date: DateTime,
      min_delivery_date: DateTime,
    ): SaleConnection
  `,
  resolver: {
    Query: {
      paginationSale: async (obj, {
        start,
        limit,
        amount,
        total_amount,
        date,
        clasification,
        delivery_date,
        delivery_pending,
        paid,
        status,
        status2,
        location_name,
        user_name,
        carts_quantity,
        payment_methods_owner,
        destination_routes,
        sellers_name,
        max_amount,
        min_amount,
        max_total_amount,
        min_total_amount, 
        max_carts_quantity,
        min_carts_quantity,
        max_date,
        min_date,
        max_delivery_date,
        min_delivery_date,
      },ctx) => {
        // const authorization = ['Administrator']
        // const token = await utils.authorization(ctx.context.headers.authorization, authorization);
        // if(!token){
        //   throw new Error('No tienes autorización para realizar esta acción.');
        // }
        const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
        const query = {
          ...(amount && !isNaN(parseFloat(amount))) && {
            monto: parseFloat(amount)
          },
          ...(total_amount && !isNaN(parseFloat(total_amount))) && {
            monto_total: parseFloat(total_amount)
          },
          ...(date && {
            fecha: date
          }),
          ...(clasification && {
            clasificacion: new RegExp(clasification, 'i')
          }),
          ...(delivery_date && {
            fecha_entrega: delivery_date
          }),
          ...(delivery_pending !== undefined) && {
            entrega_pendiente: delivery_pending
          },
          ...(paid !== undefined) && {
            pagada: paid
          },
          ...(status !== undefined) && {
            status: status
          },
          ...(status2 && {
            status2: status2
          }),
          ...(location_name && {
            "local.nombre": new RegExp(location_name, 'i')
          }),
          ...(user_name && {
            "usuario.nombre": new RegExp(user_name, 'i')
          }),
          ...(carts_quantity && !isNaN(parseFloat(carts_quantity))) && {
            "carritos.cantidad": parseFloat(carts_quantity)
          },
          ...(payment_methods_owner && {
            "metodo_pagos.titular": new RegExp(payment_methods_owner, 'i')
          }),
          ...(destination_routes && {
            "rutas.destino": new RegExp(destination_routes, 'i')
          }),
          ...(sellers_name && {
            "vendedores.nombre": new RegExp(sellers_name, 'i')
          })
        };
        let sales = await strapi.query('ventas').find(query);

        if (min_date && max_date) {
          sales=  sales.filter( Sale => {
           const  fecha = new Date(Sale.fecha);
           return  fecha >= new Date(min_date) &&  fecha <= new Date(max_date);
         });
       }

       if (min_delivery_date && max_delivery_date) {
        sales=  sales.filter( Sale => {
         const  fecha_entrega = new Date(Sale.fecha_entrega);
         return  fecha_entrega >= new Date(min_delivery_date) &&  fecha_entrega <= new Date(max_delivery_date);
       });
     }

        if(min_amount && max_amount) {
          sales = sales.filter( Sale => Sale.monto >= min_amount && Sale.monto <= max_amount);
        }
        else if(min_amount){
          sales = sales.filter( Sale => Sale.monto > min_amount)
        }
        else if(max_amount){
          sales = sales.filter(Sale => Sale.monto <= max_amount)
        }

        if(min_total_amount && max_total_amount) {
          sales = sales.filter( Sale => Sale.monto_total >= min_total_amount && Sale.monto_total <= max_total_amount);
        }
        else if(min_total_amount){
          sales = sales.filter( Sale => Sale.monto_total > min_total_amount)
        }
        else if(max_total_amount){
          sales = sales.filter(Sale => Sale.monto_total <= max_total_amount)
        }

        if(max_carts_quantity && min_carts_quantity){
          sales = sales.filter(Sale => {
            const cantidad = Sale.carritos.cantidad
            return cantidad > min_carts_quantity && cantidad < max_carts_quantity; 
          })
        }
        else if(min_carts_quantity){
          sales = sales.filter(Sale =>{
            const cantidad = Sale.carritos.cantidad
            return cantidad > min_carts_quantity;
          })
        }else if(max_carts_quantity){
          sales = sales.filter(Sale =>{
            const cantidad = Sale.carritos.cantidad
            return cantidad < max_carts_quantity;
          });
        }
        const edges = sales
          .slice(startIndex, startIndex + parseInt(limit))
          .map((sale) => ({ node: sale, cursor: sale.id }));
        const pageInfo = {
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage: startIndex + parseInt(limit) < sales.length,
          hasPreviousPage: startIndex > 0,
        };
        return {
          totalCount: sales.length,
          edges,
          pageInfo,
        };
      }
    }
  }
};
