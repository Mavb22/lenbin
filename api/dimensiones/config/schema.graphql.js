const utils = require('../../../extensions/controllers/utils');
const schema = require('../../../extensions/controllers/schemas');
module.exports ={
    definition:`
        type DimensionEdge{
            node: Dimensiones
            cursor: ID!
        }
        type DimensionConnection{
            totalCount: Int!
            edges: [DimensionEdge!]!
            pageInfo: PageInfo!
        }
    `,
    query:`
        paginationDimensions(
            start: Int,
            limit: Int,
            name : String,
            width: Float,
            high: Float,
            long: Float,
            products: String
        ):DimensionConnection
    `,
    //nombre = name
    //ancho = width
    // alto = high
    // largo = long
    // productos = products
    resolver: {
        Query: {
            paginationDimensions:
            async(obj,{start,limit,name ,width,high,long,products},ctx) =>{
              const authorization = ['Administrator'];
              const authenticated = ctx.context.headers.authorization

              const token = await utils.authorization(authenticated.split(' ')[1], authorization);
              if(!token){
                throw new Error('No tienes autorización para realizar esta acción.');
              }
                const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                const query = {
                    ...(name  && {
                        nombre: new RegExp(name ,'i')
                    }),
                    ...(width && !isNaN(parseFloat(width)))&& {
                        ancho: parseFloat(width)
                    },
                    ...(high&& !isNaN(parseFloat(high)))&& {
                        alto: parseFloat(high)
                    },
                    ...( long && !isNaN(parseFloat( long)))&& {
                         largo: parseFloat(long)
                    },
                    ...( products && {
                        "productos.nombre": new RegExp(products,'i')
                    }),
                }
                const dimensions= await strapi.query('dimensiones').find(query);
                const {edges, pageInfo} = schema.search(dimensions,startIndex, limit)
                return {
                  totalCount: dimensions.length,
                  edges,
                  pageInfo,
                };

            }
        }
    }

}
