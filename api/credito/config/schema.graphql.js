module.exports = {
    definition:`
        type CrediEdge{
            node: Credito
            cursor: ID!
        }
        type CrediConnection{
            totalCount: Int!
            edges: [CrediEdge!]!
            pageInfo: PageInfo!
        }

    `,
    query:`
        paginationCredito(
            start: Int,
            limit: Int,
            limite: Float,
            fecha_alta: DateTime,
            fecha_baja: DateTime,
            vigencia: DateTime,
            intereses: Float,
            status: Boolean,
            statud2: String,
            abonos: Float,
            metodo_pago: Float,
            usuario: String
        ):CrediConnection
    `,
    resolver:{
        Query: {
            paginationCredito:
                async(obj,{start, limit, limite,fecha_alta,fecha_baja,vigencia,intereses,status,status2,mostrar,abonos,metodo_pago,usuario}) =>{
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query = { 
                        mostrar:true,
                        ...(limite &&!isNaN(parseFloat(limite)) && {
                          limite: parseFloat(limite)
                        }),
                        ...(fecha_alta && {
                            fecha_alta: fecha_alta
                        }),
                        ...(fecha_baja && {
                            fecha_baja: fecha_baja
                        }),
                        ...(vigencia && {
                            vigencia: vigencia
                        }),
                        ...(intereses && !isNaN(parseFloat(intereses)))&& {
                            intereses: parseFloat(intereses)
                        },
                        ...(status !== undefined && {
                            status: status
                        }),
                        ...(status2 && {
                            status2: new RegExp(status2,'i')
                        }),
                        ...(abonos &&!isNaN(parseFloat(abonos)) && {
                            abonos: parseFloat(abonos)
                        }),
                        ...(metodo_pago &&!isNaN(parseFloat(metodo_pago)) && {
                            "metodo_pago.numero_tarjeta": parseFloat(metodo_pago)
                         }),
                         ...(usuario && !isNaN(parseInt(usuario))) && {
                            "usuario.nombre": parseInt(usuario)
                          },

                    };
                    const Credito = await strapi.query('Credito').find(query);
                    const edges = Credito
                      .slice(startIndex, startIndex + parseInt(limit))
                      .map((Credi) => ({ node: Credi, cursor: Credi.id }));
                    const pageInfo = {
                      startCursor: edges.length > 0 ? edges[0].cursor : null,
                      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                      hasNextPage:  startIndex + parseInt(limit) < Credito.length,
                      hasPreviousPage: startIndex > 0,
                    };
                    return {
                      totalCount: Credito.length,
                      edges,
                      pageInfo,
                    };

                }
        }
    }
}


