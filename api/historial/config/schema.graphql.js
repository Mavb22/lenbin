const utils = require('../../../extensions/controllers/utils');
const schema = require('../../../extensions/controllers/schemas');
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
                async(obj,{start,limit,date,start_time,end_time,status,status2,user,trucks}, ctx ) =>{
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
                        ...(trucks && !isNaN(parseInt(trucks))) && {
                            "camiones.num_serie": parseInt(trucks)
                        },

                    }
                    const records = await strapi.query('historial').find(query);
                    const {edges, pageInfo} = schema.search(records,startIndex, limit)
                    return {
                      totalCount: records.length,
                      edges,
                      pageInfo,
                    };
                }
        }
    }
}
