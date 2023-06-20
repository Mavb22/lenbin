module.exports = {
  definition: `
    type SellerEdge {
      node: Vendedores
      cursor: ID!
    }
    type SellerConnection {
      totalCount: Int!
      edges: [SellerEdge!]!
      pageInfo: PageInfo!
    }
  `,
  query: `
    paginationSeller(
      start: Int!,
      limit: Int!,
      name: String,
      sales_amount: Float
    ): SellerConnection
  `,
  resolver: {
    Query: {
      paginationSeller: async (obj, {
        name,
        sales_amount
      }, {
        startIndex = 0,
        limit = 10
      }) => {
        const authorization = ['Administrator']
        const token = await utils.authorization(ctx.context.headers.authorization, authorization);
        if(!token){
          throw new Error('No tienes autorización para realizar esta acción.');
        }
        const query = {
          ...(name && {
            nombre: {
              $regex: RegExp(name, 'i')
            }
          }),
          ...(sales_amount && !isNaN(parseFloat(sales_amount))) && {
            'ventas.monto': parseFloat(sales_amount)
          },
        };

        const sellers = await strapi.query('vendedores').find(query);
        const edges = sellers
          .slice(startIndex, startIndex + parseInt(limit))
          .map((seller) => ({
            node: seller,
            cursor: seller.id
          }));
        const pageInfo = {
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage: startIndex + parseInt(limit) < sellers.length,
          hasPreviousPage: startIndex > 0,
        };
        return {
          totalCount: sellers.length,
          edges,
          pageInfo,
        };
      },
    },
  },
};
