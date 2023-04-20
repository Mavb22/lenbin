module.exports = {
  definition: `
    type paymentEdge {
      node: Abonos
      cursor: ID!
    }

    type paymentConnection {
      totalCount: Int!
      edges: [paymentEdge!]!
      pageInfo: PageInfo!
    }

    type PageInfo {
      startCursor: ID
      endCursor: ID
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
    }
  `,
  query: `
    paginationpayments(
      start: Int,
      limit: Int,
      credit_quantity: Int, 
      credit_date: DateTime,
      quantity_payment: String,
      credit: Int,
      user: String
    ): paymentConnection
   
  `,
   //cantidad_abono = credit_quantity
   //fecha_abono = credit_date
   //estado_abono = quantity_payment
   //credit = credito
   //user = usuario

  resolver: {
    Query: {
      paginationpayments:
        async (obj, { start, limit, credit_quantity,credit_date,quantity_payment,credit,user}, ctx) => {
          const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
          const query = {
            mostrar:true,
            ...(credit_quantity &&!isNaN(parseFloat(credit_quantity)) && {
              cantidad_abono: parseFloat(credit_quantity)
            }),
            ...(credit_date && {
              fecha_abono: credit_date
            }),
            ...(quantity_payment && {
              estado_abono:{
                $regex: new RegExp(quantity_payment, 'i')
              }
            }),
            ...(credit && !isNaN(parseFloat(credit))) && {
              "credito.interes": parseFloat(credit)
            },
            ...(user && {
              "usuario.nombre": new RegExp(user, 'i')
            }),
          }
          const payments = await strapi.query('abonos').find(query);
          const edges = payments
            .slice(startIndex, startIndex + parseInt(limit))
            .map((payment) => ({ node: payment, cursor: payment.id }));
          const pageInfo = {
            startCursor: edges.length > 0 ? edges[0].cursor : null,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
            hasNextPage:  startIndex + parseInt(limit) < payments.length,
            hasPreviousPage: startIndex > 0,
          };
          return {
            totalCount: payments.length,
            edges,
            pageInfo,
          };
        },
    },
  },
};

