const utils = require('../../../extensions/controllers/utils');
const schema = require('../../../extensions/controllers/schemas');
module.exports ={
    definition:`
        type LocEdge{
            node: Local
            cursor: ID!
        }
        type LocConnection{
            totalCount: Int!
            edges: [LocEdge!]!
            pageInfo: PageInfo!
        }
    `,
    query:`
        paginationLocal(
            start: Int,
            limit: Int,
            name: String,
            alias: String,
            social_reason: String,
            rfc: String,
            high_date: DateTime,
            street: String,
            cologne: String,
            street_number: Long,
            municipality: String,
            internal_number: Long,
            city: String,
            cp: Long,
            latitude: Float,
            length: Float,
            phone: Long,
            cell_phone: Long,
            turn: String,
            status: Boolean,
            status2: String,
            user: String,
            sales: Int
        ):LocConnection
    `,
    // nombre = name
    // razon_social = social_reason
    // fecha_alta =high_date
    // calle = street
    // colonia = cologne
    // numero_ext = street_number
    // municipio = municipality
    // numero_int = internal_number
    // ciudad = city
    // latitud = latilatitude
    // longitud = length
    // telefono = phone
    // telefono_cel =cell_phone
    // giro = turn
    // usuarios = user
    // ventas = sales
    resolver:{
        Query:{
            paginationLocal:
            async(obj,{start,limit,name,alias,social_reason,rfc,high_date,street,cologne,street_number,municipality,internal_number,city,cp,latitude,length,phone,cell_phone,turn,status,status2,user,sales}, ctx) =>{
                const authorization = ['Administrator','User']
                const token = await utils.authorization(ctx.context.headers.authorization, authorization);
                if(!token){
                  throw new Error('No tienes autorización para realizar esta acción.');
                }
                const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                const query={
                    ...( name && {
                         nombre: new RegExp( name,'i')
                    }),
                    ...(alias && {
                        alias: new RegExp( alias,'i')
                    }),
                    ...(social_reason && {
                        razon_social: new RegExp( social_reason,'i')
                    }),
                    ...(rfc && {
                        rfc: new RegExp( rfc,'i')
                    }),
                    ...(high_date && {
                        fecha_alta: high_date
                    }),
                    ...(street && {
                        calle: new RegExp(street,'i')
                    }),
                    ...(cologne && {
                        colonia: new RegExp(cologne,'i')
                    }),
                    ...(street_number && !isNaN(parseInt(street_number))) && {
                        numero_ext: parseInt(street_number)
                    },
                    ...(municipality && {
                        municipio: new RegExp(municipality,'i')
                    }),
                    ...(internal_number && !isNaN(parseInt(internal_number))) && {
                        numero_int: parseInt(internal_number)
                    },
                    ...(city && {
                        ciudad: new RegExp(city,'i')
                    }),
                    ...(cp && !isNaN(parseInt(cp))) && {
                        cp: parseInt(cp)
                    },
                    ...(latitude && !isNaN(parseFloat(latitude))) && {
                        latitud: parseFloat(latitude)
                    },
                    ...( length && !isNaN(parseFloat( length))) && {
                         longitud: parseFloat(length)
                    },
                    ...(phone && !isNaN(parseInt(phone))) && {
                        telefono: parseInt(phone)
                    },
                    ...(cell_phone && !isNaN(parseInt(cell_phone))) && {
                        telefono_cel: parseInt(cell_phone)
                    },
                    ...( turn && {
                         giro: new RegExp(turn,'i')
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
                    ...(sales && !isNaN(parseInt(sales))) && {
                        "ventas.monto": parseInt(sales)
                    },
                }
                const local = await strapi.query('local').find(query);
                const {edges, pageInfo} = schema.search(local,startIndex, limit)
                return {
                  totalCount: local.length,
                  edges,
                  pageInfo,
                };
            }
        }
    }

}
