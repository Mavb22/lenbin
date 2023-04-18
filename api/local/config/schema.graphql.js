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
            nombre: String,
            alias: String,
            razon_social: String,
            rfc: String,
            fecha_alta: DateTime,
            calle: String,
            colonia: String,
            numero_ext: Long,
            municipio: String,
            numero_int: Long,
            ciudad: String,
            cp: Long,
            latitud: Float,
            longitud: Float,
            telefono: Long,
            telefono_cel: Long,
            giro: String,
            status: Boolean,
            status2: String,
            usuarios: String,
            ventas: Int
        ):LocConnection
    `,
    resolver:{
        Query:{
            paginationLocal:
            async(obj,{start,limit,nombre,alias,razon_social,rfc,fecha_alta,calle,colonia,numero_ext,municipio,numero_int,ciudad,cp,latitud,longitud,telefono,telefono_cel,giro,status,status2,usuarios,ventas}) =>{
                const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                const query={
                    ...( nombre && {
                         nombre: new RegExp( nombre,'i')
                    }),
                    ...(alias && {
                        alias: new RegExp( alias,'i')
                    }),
                    ...(razon_social && {
                        razon_social: new RegExp( razon_social,'i')
                    }),
                    ...(rfc && {
                        rfc: new RegExp( rfc,'i')
                    }),
                    ...(fecha_alta && {
                        fecha_alta: fecha_alta
                    }),
                    ...(calle && {
                        calle: new RegExp(calle,'i')
                    }),
                    ...(colonia && {
                        colonia: new RegExp(colonia,'i')
                    }),
                    ...(numero_ext && !isNaN(parseInt(numero_ext))) && {
                        numero_ext: parseInt(numero_ext)
                    },
                    ...(municipio && {
                        municipio: new RegExp(municipio,'i')
                    }),
                    ...(numero_int && !isNaN(parseInt(numero_int))) && {
                        numero_int: parseInt(numero_int)
                    },
                    ...(ciudad && {
                        ciudad: new RegExp(ciudad,'i')
                    }),
                    ...(cp && !isNaN(parseInt(cp))) && {
                        cp: parseInt(cp)
                    },
                    ...(latitud && !isNaN(parseFloat(latitud))) && {
                        latitud: parseFloat(latitud)
                    },
                    ...( longitud && !isNaN(parseFloat( longitud))) && {
                         longitud: parseFloat( longitud)
                    },
                    ...(telefono && !isNaN(parseInt(telefono))) && {
                        telefono: parseInt(telefono)
                    },
                    ...(telefono_cel && !isNaN(parseInt(telefono_cel))) && {
                        telefono_cel: parseInt(telefono_cel)
                    },
                    ...( giro && {
                         giro: new RegExp(  giro,'i')
                    }),
                    ...(status !== undefined && {
                        status: status
                    }),
                    ...(status2 && {
                        status2: new RegExp(status2,'i')
                    }),
                    ...(usuario && !isNaN(parseInt(usuario))) && {
                        "usuario.nombre": parseInt(usuario)
                    },
                    ...(ventas && !isNaN(parseInt(ventas))) && {
                        "ventas.monto": parseInt(ventas)
                    },
                }
                const Local = await strapi.query('Local').find(query);
                const edges = Local
                  .slice(startIndex, startIndex + parseInt(limit))
                  .map((Loc) => ({ node: Loc, cursor: Loc.id }));
                const pageInfo = {
                  startCursor: edges.length > 0 ? edges[0].cursor : null,
                  endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                  hasNextPage:  startIndex + parseInt(limit) < Local.length,
                  hasPreviousPage: startIndex > 0,
                };
                return {
                  totalCount: Local.length,
                  edges,
                  pageInfo,
                };
            }
        }
    }

}