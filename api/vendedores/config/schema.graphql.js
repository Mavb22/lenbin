const utils = require('../../../extensions/controllers/utils');
const schema = require('../../../extensions/controllers/schemas');
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
      },ctx) => {
        const authorization = ['Administrator','User'];
        const authenticated = ctx.context.headers.authorization

        const token = await utils.authorization(authenticated.split(' ')[1], authorization);
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
        const {edges, pageInfo} = schema.search(sellers,startIndex, limit)
          return {
            totalCount: sellers.length,
            edges,
            pageInfo,
          };
      },
    },
  },
};
