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
            max_date: DateTime,
            min_date: DateTime
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
                async(obj,{start,limit,date,start_time,end_time,status,status2,user,trucks,min_date,max_date},ctx ) =>{
                    // const authorization = ['Administrator']
                    // const token = await utils.authorization(ctx.context.headers.authorization, authorization);
                    // if(!token){
                    //   throw new Error('No tienes autorización para realizar esta acción.');
                    // }
                    const authorization = ['Administrator','User'];
                    const authenticated = ctx.context.headers.authorization
                    const token = await utils.authorization(authenticated.split(' ')[1], authorization);
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
                        ...(trucks && {
                            "camiones.num_serie": new RegExp(trucks, 'i')
                        }),
                        
                    }
                    let records = await strapi.query('historial').find(query);

                    if (min_date && max_date) {
                        records = records.filter(record => {
                          const fecha = new Date(record.fecha);
                          return fecha >= new Date(min_date) && fecha <= new Date(max_date);
                        });
                      }

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