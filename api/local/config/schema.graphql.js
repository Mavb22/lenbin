// module.exports ={
//     definition:`
//         type LocEdge{
//             node: Local
//             cursor: ID!
//         }
//         type LocConnection{
//             totalCount: Int!
//             edges: [LocEdge!]!
//             pageInfo: PageInfo!
//         }
//     `,
//     query:`
//         paginationLocal(
//             start: Int,
//             limit: Int,
//             name: String,
//             alias: String,
//             social_reason: String,
//             rfc: String,
//             high_date: DateTime,
//             street: String,
//             cologne: String,
//             street_number: Long,
//             municipality: String,
//             internal_number: Long,
//             city: String,
//             cp: Long,
//             latitude: Float,
//             length: Float,
//             phone: Long,
//             cell_phone: Long,
//             turn: String,
//             status: Boolean,
//             status2: String,
//             user: String,
//             sales: Int,
//             max_high_date: DateTime,
//             min_high_date: DateTime,
//             max_latitude: Float,
//             min_latitude: Float,
//             max_length: Float,
//             min_length: Float,
//             max_sales: Int,
//             min_sales: Int
//         ):LocConnection
//     `,
//     // nombre = name
//     // razon_social = social_reason
//     // fecha_alta =high_date
//     // calle = street
//     // colonia = cologne
//     // numero_ext = street_number
//     // municipio = municipality
//     // numero_int = internal_number
//     // ciudad = city
//     // latitud = latilatitude
//     // longitud = length
//     // telefono = phone
//     // telefono_cel =cell_phone
//     // giro = turn
//     // usuarios = user
//     // ventas = sales
//     resolver:{
//         Query:{
//             paginationLocal:
//             async(obj,{start,limit,name,alias,social_reason,rfc,high_date,street,cologne,street_number,municipality,internal_number,city,cp,latitude,length,phone,cell_phone,turn,status,status2,user,sales,max_high_date,min_high_date,max_latitude,min_latitude,max_length,min_length,max_sales,min_sales},ctx) =>{
//                 // const authorization = ['Administrator']
//                 // const token = await utils.authorization(ctx.context.headers.authorization, authorization);
//                 // if(!token){
//                 //   throw new Error('No tienes autorización para realizar esta acción.');
//                 // }
//                 const authorization = ['Administrator','User'];
//                 const authenticated = ctx.context.headers.authorization
//                 const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//                 if(!token){
//                   throw new Error('No tienes autorización para realizar esta acción.');
//                 }
//                 const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
//                 const query={
//                     ...( name && {
//                          nombre: new RegExp( name,'i')
//                     }),
//                     ...(alias && {
//                         alias: new RegExp( alias,'i')
//                     }),
//                     ...(social_reason && {
//                         razon_social: new RegExp( social_reason,'i')
//                     }),
//                     ...(rfc && {
//                         rfc: new RegExp( rfc,'i')
//                     }),
//                     ...(high_date && {
//                         fecha_alta: high_date
//                     }),
//                     ...(street && {
//                         calle: new RegExp(street,'i')
//                     }),
//                     ...(cologne && {
//                         colonia: new RegExp(cologne,'i')
//                     }),
//                     ...(street_number && !isNaN(parseInt(street_number))) && {
//                         numero_ext: parseInt(street_number)
//                     },
//                     ...(municipality && {
//                         municipio: new RegExp(municipality,'i')
//                     }),
//                     ...(internal_number && !isNaN(parseInt(internal_number))) && {
//                         numero_int: parseInt(internal_number)
//                     },
//                     ...(city && {
//                         ciudad: new RegExp(city,'i')
//                     }),
//                     ...(cp && !isNaN(parseInt(cp))) && {
//                         cp: parseInt(cp)
//                     },
//                     ...(latitude && !isNaN(parseFloat(latitude))) && {
//                         latitud: parseFloat(latitude)
//                     },
//                     ...( length && !isNaN(parseFloat( length))) && {
//                          longitud: parseFloat(length)
//                     },
//                     ...(phone && !isNaN(parseInt(phone))) && {
//                         telefono: parseInt(phone)
//                     },
//                     ...(cell_phone && !isNaN(parseInt(cell_phone))) && {
//                         telefono_cel: parseInt(cell_phone)
//                     },
//                     ...( turn && {
//                          giro: new RegExp(turn,'i')
//                     }),
//                     ...(status !== undefined && {
//                         status: status
//                     }),
//                     ...(status2 && {
//                         status2: new RegExp(status2,'i')
//                     }),
//                     ...(user && {
//                         "usuarios.nombre": new RegExp(user, 'i')
//                       }),
//                     ...(sales && !isNaN(parseInt(sales))) && {
//                         "ventas.monto": parseInt(sales)
//                     },
//                 }
//                 let Local = await strapi.query('local').find(query);

//                 if (min_high_date && max_high_date) {
//                     Local= Local.filter(Loc => {
//                       const fecha_alta = new Date(Loc.fecha_alta);
//                       return fecha_alta >= new Date(min_high_date) && fecha_alta <= new Date(max_high_date);
//                     });
//                   }

//                 if(min_latitude && max_latitude) {
//                     Local = Local.filter( Loc => Loc.latitud >= min_latitude && Loc.latitud <= max_latitude);
//                   }
//                   else if(min_latitude){
//                     Local = Local.filter( Loc => Loc.latitud > min_latitude)
//                   }
//                   else if(max_latitude){
//                     Local = Local.filter(Loc => Loc.latitud <= max_latitude)
//                 }

//                 if(min_length && max_length) {
//                     Local = Local.filter( Loc => Loc.longitud > min_length && Loc.longitud < max_length);
//                   }
//                   else if(min_length){
//                     Local = Local.filter( Loc => Loc.longitud > min_length)
//                   }
//                   else if(max_length){
//                     Local = Local.filter(Loc => Loc.longitud <= max_length)
//                 }

//                 if(max_sales && min_sales){
//                     Local = Local.filter(Loc => {
//                       const monto = Loc.ventas.monto
//                       return monto > min_sales && monto < max_sales; 
//                     })
//                   }
//                   else if(min_sales){
//                     Local = Local.filter(Loc =>{
//                       const monto = Loc.ventas.monto
//                       return monto >min_sales;
//                     })
//                   }else if(max_sales){
//                     Local = Local.filter(Loc =>{
//                       const monto = Loc.ventas.monto
//                       return monto < max_sales;
//                     });
//                   }

//                 const edges = Local
//                   .slice(startIndex, startIndex + parseInt(limit))
//                   .map((Loc) => ({ node: Loc, cursor: Loc.id }));
//                 const pageInfo = {
//                   startCursor: edges.length > 0 ? edges[0].cursor : null,
//                   endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//                   hasNextPage:  startIndex + parseInt(limit) < Local.length,
//                   hasPreviousPage: startIndex > 0,
//                 };
//                 return {
//                   totalCount: Local.length,
//                   edges,
//                   pageInfo,
//                 };
//             }
//         }
//     }

// }