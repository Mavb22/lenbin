module.exports ={
    definition:`
        type GastoEdge{
            node: Gastos
            cursor: ID!
        }
        type GastoConnection{
            totalCount: Int!
            edges: [GastoEdge!]!
            pageInfo: PageInfo!
        }


    `,
    query:`
        paginationGastos(
            start: Int,
            limit: Int,
            descripcion: String,
            fecha: DateTime,
            monto: Float,
            categoria: String,
            status: Boolean,
            usuario: String,
            camions: String
        ):GastoConnection
    `,
    resolver:{
        Query:{
            paginationGastos:
                async(obj,{start,limit,descripcion,fecha,monto,categoria,status,usuario,camions}) => {
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query = {
                        ...(descripcion && {
                            descripcion: new RegExp(descripcion,'i')
                        }),
                        ...(fecha && {
                            fecha: fecha
                        }),
                        ...(monto && !isNaN(parseFloat(monto)))&& {
                            monto: parseFloat(monto)
                        },
                        ...(categoria && {
                            categoria: new RegExp(categoria,'i')
                        }),
                        ...(status !== undefined && {
                            status: status
                        }),
                        ...(usuario && !isNaN(parseInt(usuario))) && {
                            "usuario.nombre": parseInt(usuario)
                        },
                        ...(camions && !isNaN(parseInt(camions))) && {
                            "camions.num_serie": parseInt(camions)
                        },
                    } 
                    const Gastos = await strapi.query('Gastos').find(query);
                    const edges = Gastos
                    .slice(startIndex, startIndex + parseInt(limit))
                    .map((Gasto) => ({node: Gasto, Gasto: Gasto.id }));
                    const pageInfo = {
                     startCursor: edges.length > 0 ? edges[0].cursor : null,
                     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                     hasNextPage:  startIndex + parseInt(limit) < Gastos.length,
                     hasPreviousPage: startIndex > 0,
                    };
                    return {
                        totalCount: Gastos.length,
                        edges,
                        pageInfo,
                      };
                }
        }
    }

}