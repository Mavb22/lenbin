module.exports = {
    definition:`
    type recordEdge{
        node: Historial
        cursor: ID!
    }
    type recordConnection{
        totalCount: Int!
        edges: [recordEdge!]!
        pageInfo: PageInfo!
    }
    `,
    query:`
        paginationrecords(
            start: Int,
            limit: Int,
            date: DateTime,
            start_time: Time,
            end_time: Time,
            status: Boolean,
            status2: String,
            trucks: String,
            user: String
        ):recordConnection
    `,
    //records
    // fecha = date
    // hora_inicio = start_time
    // hora_fin = end_time
    // camiones = trucks
    // usuario = user
    resolver:{
        Query:{
            paginationrecords:
                async(obj,{start,limit,date,start_time,end_time,status,status2,user,trucks} ) =>{
                    const authorization = ['Administrator']
                    const token = await utils.authorization(ctx.context.headers.authorization, authorization);
                    if(!token){
                      throw new Error('No tienes autorización para realizar esta acción.');
                    }
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query={
                        ...(date && {
                            fecha: date
                        }),
                        ...(start_time && {
                            hora_inicio: start_time
                        }),
                        ...(end_time && {
                            hora_fin: end_time
                        }),
                        ...(status !== undefined && {
                            status: status
                        }),
                        ...(status2 && {
                            status2: new RegExp(status2,'i')
                        }),
                        ...(user && {
                            "usuario.nombre": new RegExp(user, 'i')
                        }),
                        ...(trucks && !isNaN(parseInt(trucks))) && {
                            "camiones.num_serie": parseInt(trucks)
                        },

                    }
                    const records = await strapi.query('historial').find(query);
                    const edges = records
                    .slice(startIndex, startIndex + parseInt(limit))
                    .map((record) => ({ node: record, cursor: record.id }));
                    const pageInfo = {
                     startCursor: edges.length > 0 ? edges[0].cursor : null,
                     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                     hasNextPage:  startIndex + parseInt(limit) < records.length,
                     hasPreviousPage: startIndex > 0,
                    };
                    return {
                        totalCount: records.length,
                        edges,
                        pageInfo,
                      };
                }
        }
    }
}
