module.exports = {
  definition: `
    type LoteEdge{
        node: Lotes
        cursor: ID!
    }
    type LoteConnection{
        totalCount: Int!
        edges: [LoteEdge!]!
        pageInfo: PageInfo!
    }
  `,
  query:`
     paginationLotes(
        start: Int!,
        limit: Int!,
        codigo_interno: Int,
        fecha_arrivo: Date,
        fecha_caducidad: Date,
        fecha_adquisicion: Date,
        costo: Float,
        compras_costo:Int,
        producto_nombre:String
     ): LoteConnection
  `,
  resolver: {
    Query: {
      paginationLotes: async (obj, {start,limit,codigo_interno, fecha_arrivo,fecha_caducidad,fecha_adquisicion, costo, compras_costo,producto_nombre}) => {
        const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
        const query = {}
        if(codigo_interno && !isNaN(parseInt(codigo_interno))){
          query.codigo_interno = parseInt(codigo_interno);
        }
        if(costo && !isNaN(parseFloat(costo))){
          query.costo = parseFloat(costo);
        }
        if(compras_costo){
            query["compras.costo"] = parseFloat(compras_costo);
        }
        if(producto_nombre){
          const regex = new RegExp(producto_nombre, 'i');
          query["products.nombre"] = {$regex: regex}
        }
        const lotes = await strapi.query('lotes').find(query);
        const edges = lotes
        .slice(startIndex, startIndex + parseInt(limit))
        .map((lote) => ({ node: lote, cursor:lote.id }));
        const pageInfo = {
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage:  startIndex + parseInt(limit) < lotes.length,
          hasPreviousPage: startIndex > 0,
        };
        return {
          totalCount: lotes.length,
          edges,
          pageInfo,
        };
      }
    }
  }
}
