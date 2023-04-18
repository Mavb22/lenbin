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
        paginationDeimenciones(
            start: Int,
            limit: Int,
            nombre: String,
            ancho: Float,
            alto: Float,
            largo: Float,
            productos: String 
        ):DimensionConnection
    `,


    resolver: {
        Query: {
            paginationDeimenciones:
            async(obj,{start,limit,nombre,ancho,alto,largo,productos},ctx) =>{
                const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                const query = {
                    ...(nombre && {
                        nombre: new RegExp(nombre,'i')
                    }),
                    ...(ancho && !isNaN(parseFloat(ancho)))&& {
                        ancho: parseFloat(ancho)
                    },
                    ...(alto && !isNaN(parseFloat(alto)))&& {
                        alto: parseFloat(alto)
                    },
                    ...( largo && !isNaN(parseFloat( largo)))&& {
                         largo: parseFloat( largo)
                    },
                    ...( productos && {
                        "productos.nombre": new RegExp( productos,'i')
                    }),
                }
                const Deimenciones= await strapi.query('Deimenciones').find(query);
                const edges = Deimenciones
                .slice(startIndex, startIndex + parseInt(limit))
                .map((Deimencion) => ({ node: Deimencion, cursor: Deimencion.id }));
                const pageInfo = {
                startCursor: edges.length > 0 ? edges[0].cursor : null,
                endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                hasNextPage:  startIndex + parseInt(limit) < Deimenciones.length,
                hasPreviousPage: startIndex > 0,
                };
                return {
                    totalCount: Deimenciones.length,
                    edges,
                    pageInfo,
                };

            }
        }
    }
 
}