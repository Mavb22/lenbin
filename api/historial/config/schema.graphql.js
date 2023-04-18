module.exports = {
    definition:`
    type HistoriEdge{
        node: Historial
        cursor: ID!
    }
    type HistoriConnection{
        totalCount: Int!
        edges: [HistoriEdge!]!
        pageInfo: PageInfo!
    }
    `,
    query:`
        paginationHistorial(
            start: Int,
            limit: Int,
            fecha: DateTime,
            hora_inicio: Time,
            hora_fin: Time,
            status: Boolean,
            status2: String,
            camiones: String,
            usuario: String
        ):HistoriConnection
    `,
    resolver:{
        Query:{
            paginationHistorial:
                async(obj,{start,limit,fecha,hora_inicio,hora_fin,status,status2,usuario,camiones} ) =>{
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query={
                        ...(fecha && {
                            fecha: fecha
                        }),
                        ...(hora_inicio && {
                            hora_inicio: hora_inicio
                        }),
                        ...(hora_fin && {
                            hora_fin: hora_fin
                        }),
                        ...(status !== undefined && {
                            status: status
                        }),
                        ...(status2 && {
                            status2: new RegExp(status2,'i')
                        }),
                        ...(camiones && !isNaN(parseInt(camiones))) && {
                            "camiones.num_serie": parseInt(camiones)
                        },
                        ...(usuario && !isNaN(parseInt(usuario))) && {
                            "usuario.nombre": parseInt(usuario)
                        },
                    }
                    const historial = await strapi.query('historial').find(query);
                    const edges = historial
                    .slice(startIndex, startIndex + parseInt(limit))
                    .map((histori) => ({ node: histori, cursor: histori.id }));
                    const pageInfo = {
                     startCursor: edges.length > 0 ? edges[0].cursor : null,
                     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                     hasNextPage:  startIndex + parseInt(limit) < historial.length,
                     hasPreviousPage: startIndex > 0,
                    };
                    return {
                        totalCount: historial.length,
                        edges,
                        pageInfo,
                      };
                }
        }
    }
}