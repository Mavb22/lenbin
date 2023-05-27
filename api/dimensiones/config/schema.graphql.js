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
                const Dimensions= await strapi.query('dimensiones').find(query);
                const edges = Dimensions
                .slice(startIndex, startIndex + parseInt(limit))
                .map((Deimencion) => ({ node: Deimencion, cursor: Deimencion.id }));
                const pageInfo = {
                startCursor: edges.length > 0 ? edges[0].cursor : null,
                endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                hasNextPage:  startIndex + parseInt(limit) < Dimensions.length,
                hasPreviousPage: startIndex > 0,
                };
                return {
                    totalCount: Dimensions.length,
                    edges,
                    pageInfo,
                };

            }
        }
    }
 
}