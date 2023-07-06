const utils = require('../../../extensions/controllers/utils');
const schema = require('../../../extensions/controllers/schemas');
module.exports ={
  definition:`
      type LotEdge{
          node: Lotes
          cursor: ID!
      }
      type LotConnection{
          totalCount: Int!
          edges: [LotEdge!]!
          pageInfo: PageInfo!
      }
  `,
  query:`
      paginationLot(
          start: Int,
          limit: Int,
          internal_code: Int,
          arrival_date: DateTime,
          expiration_date: DateTime,
          acquisition_date: DateTime,
          cost: Float,
          shopping_cost:Int,
          product_name:String
      ):LotConnection
  `,
  resolver:{
      Query:{
          paginationLot:
          async(obj,{start,limit,internal_code, arrival_date,expiration_date,acquisition_date, cost, shopping_cost,product_name},ctx) =>{
            const authorization = ['Administrator','User'];
            const authenticated = ctx.context.headers.authorization
            const token = await utils.authorization(authenticated.split(' ')[1], authorization);
            if(!token){
              throw new Error('No tienes autorización para realizar esta acción.');
            }
              const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
              const query = {
                ...(internal_code && !isNaN(parseInt(internal_code))) && {
                  codigo_interno: parseInt(internal_code)
                },
                ...(arrival_date&& {
                  fecha_arrivo: arrival_date
                }),
                ...(expiration_date && {
                  fecha_caducidad: expiration_date
                }),
                ...(acquisition_date && {
                  fecha_adquisicion:acquisition_date
                }),
                ...(cost && !isNaN(parseFloat(cost)))&& {
                  costo: parseFloat(cost)
                },
                ...(shopping_cost && !isNaN(parseInt(shopping_cost))) && {
                  "compras.costo": parseInt(shopping_cost)
                },
                ...(product_name && {
                  "products.nombre": new RegExp(product_name,'i')
                }),
              }
              const lotes = await strapi.query('lotes').find(query);
              const {edges, pageInfo} = schema.search(lotes,startIndex, limit)
          return {
            totalCount: lotes.length,
            edges,
            pageInfo,
          };
          }
      }
  }

}
