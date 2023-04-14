module.exports = {
  definition: `
    type AbonoEdge {
      node: Abonos
      cursor: ID!
    }

    type AbonoConnection {
      totalCount: Int!
      edges: [AbonoEdge!]!
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
    paginationAbonos(
      start: Int,
      limit: Int,
      estado_abono: String,
      cantidad_abono: Int,
      fecha_abono: DateTime,
    ): AbonoConnection
  `,
  resolver: {
    Query: {
      paginationAbonos:
        async (obj, { start, limit, estado_abono,  cantidad_abono, fecha_abono  }, ctx) => {
          const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
          const query = {
            mostrar:true,
            ...(estado_abono && {
              estado_abono:{
                $regex: new RegExp(estado_abono, 'i')
              }
            }),
            ...(cantidad_abono &&!isNaN(parseFloat(cantidad_abono)) && {
              cantidad_abono: parseFloat(cantidad_abono)
            }),
            ...(fecha_abono && {
              fecha_abono
            })
          }
          const abonos = await strapi.query('abonos').find(query);
          const edges = abonos
            .slice(startIndex, startIndex + parseInt(limit))
            .map((abono) => ({ node: abono, cursor: abono.id }));
          const pageInfo = {
            startCursor: edges.length > 0 ? edges[0].cursor : null,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
            hasNextPage:  startIndex + parseInt(limit) < abonos.length,
            hasPreviousPage: startIndex > 0,
          };
          return {
            totalCount: abonos.length,
            edges,
            pageInfo,
          };
        },
    },
  },
};
