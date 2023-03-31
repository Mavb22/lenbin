// module.exports = {
//   definition: ``,
//   query: `
//     buscarAbonos(
//       cantidadAbono: Float,
//       fechaAbono: String,
//       estadoAbono: String,
//     ): [Abonos]!
//   `,
//   type: {},
//   resolver: {
//     Query: {
//       buscarAbonos: {
//         description: 'Retorna una lista filtrada de abonos',
//         resolver: 'application::abonos.abonos.buscarAbonos',
//       },
//     },
//   },
// };


// {
//   definition:``,
//   query: `
//       filterCantidadAbono(cantidad_abono: Float): [Abonos]!`,
//   type: {},
//   resolver: {
//     Query: {
//       filterCantidadAbono : {
//         description: 'Return list cantidad abono',
//         resolver: 'application::abonos.abonos.find',
//           // resolver: async (obj, options, {context}) => {
//           //   console.log(context)
//           //   return context;
//           // }
//       }
//     },
//   },
// };
// module.exports =

// type AbonosConnection {
//   edges: [AbonosEdge!]!
//   pageInfo: PageInfo!
// }

// type AbonosEdge {
//   cursor: ID!
//   node: Abonos!
// }

// type Abonos {
//   # fields for the Abonos object
// }

// type PageInfo {
//   hasNextPage: Boolean!
//   hasPreviousPage: Boolean!
//   startCursor: ID
//   endCursor: ID
// }

// type Query {
//   abonosConection(start: Int, limit: Int): AbonosConection!
// }
// module.exports = {
//   definition: `
//     type AbonoEdge {
//       node: Abonos
//       cursor: ID!
//     }

//     type AbonoConnection {
//       totalCount: Int!
//       edges: [AbonoEdge!]!
//       pageInfo: PageInfo!
//     }

//     type PageInfo {
//       startCursor: ID
//       endCursor: ID
//       hasNextPage: Boolean!
//       hasPreviousPage: Boolean!
//     }
//   `,
//   query: `
//     paginationAbonos(
//       start: Int,
//       limit: Int
//     ): AbonoConnection!
//   `,
//   resolver: {
//     Query: {
//       paginationAbonos: {
//         description: 'Retorna una lista filtrada y paginada de abonos',
//         resolver: 'application::abonos.abonos.findAbonos',
//       },
//     },
//   },
// };
// module.exports = {
//   definition: `
//     type AbonoEdge {
//       node: Abonos
//       cursor: ID!
//     }

//     type AbonoConnection {
//       totalCount: Int!
//       edges: [AbonoEdge!]!
//       pageInfo: PageInfo!
//     }

//     type PageInfo {
//       startCursor: ID
//       endCursor: ID
//       hasNextPage: Boolean!
//       hasPreviousPage: Boolean!
//     }
//   `,
//   query: `
//     buscarAbonos(
//       start: Int,
//       limit: Int,
//       cantidadAbono: Float,
//       fechaAbono: String,
//       estadoAbono: String
//     ): AbonoConnection!
//   `,
//   resolver: {
//     Query: {
//       buscarAbonos: {
//         description: 'Retorna una lista paginada de abonos',
//         resolver: async (obj, options, { context }) => {
//           const { start = 0, limit = 10, cantidadAbono, fechaAbono, estadoAbono } = options;
//           const { models } = context;

//           // Construir la consulta dinámicamente basada en los parámetros de filtrado
//           const query = models.abonos
//             .find({})
//             .skip(start)
//             .limit(limit);

//           if (cantidadAbono) {
//             query.where({ cantidadAbono });
//           }

//           if (fechaAbono) {
//             query.where({ fechaAbono });
//           }

//           if (estadoAbono) {
//             query.where({ estadoAbono });
//           }

//           // Ejecutar la consulta y construir la respuesta de la paginación
//           const totalCount = await models.abonos.countDocuments(query._conditions);
//           const edges = await query.exec();
//           const hasNextPage = start + limit < totalCount;
//           const hasPreviousPage = start > 0;
//           const startCursor = edges.length > 0 ? edges[0]._id : null;
//           const endCursor = edges.length > 0 ? edges[edges.length - 1]._id : null;

//           return {
//             totalCount,
//             edges: edges.map(node => ({ node, cursor: node._id })),
//             pageInfo: {
//               startCursor,
//               endCursor,
//               hasNextPage,
//               hasPreviousPage,
//             },
//           };
//         },
//       },
//     },
//   },
// };

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
      fechaInicio: DateTime,
      fechaFin: DateTime
    ): AbonoConnection
  `,
  resolver: {
    Query: {
      paginationAbonos:
         async (obj, { start, limit, estado_abono,  cantidad_abono, fechaInicio, fechaFin  }, ctx) => {
          const usuario = new RegExp('g', 'i');
          let abonos_usuario = await strapi.query('abonos').find({"usuario.nombre": {$regex: usuario}});
          console.log(abonos_usuario);
          const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
          const query = { mostrar:true }
          if(estado_abono){
            const regex = new RegExp(estado_abono, 'i');
            query.estado_abono = { $regex: regex };
          }
          if(cantidad_abono && !isNaN(parseFloat(cantidad_abono))){
            query.cantidad_abono = parseFloat(cantidad_abono)
          }
          if(fechaInicio){
            query.fecha_abono = {fechaInicio}
          }
          const abonos = await strapi.query('abonos').find(query);
          let placas = 'g';
          let estado = 'E';
          let niv;
          const query_camiones = {};
          const regex_camiones_placas = new RegExp(placas, 'i')
          const regex_camiones_estado = new RegExp(estado, 'i')
          if(placas){
            query_camiones['placas'] = {
              $elemMatch:{
                placa:{
                  $regex: regex_camiones_placas
                }
              }
            }

          }
          if(estado){
            query_camiones['placas'] ={
              $elemMatch:{
                estado:{
                  $regex: regex_camiones_estado
                }
              }
            }
          }
          if(niv){
            query_camiones['niv'] = {
              $regex : new RegExp(niv, 'i')
            }
          }
          // if(placas){
          //   const query_camiones = {
          //     placas:{
          //       $elemMatch:{
          //         placa:regex_camiones
          //       },
          //     }
          //   }
          // }
          // console.log(query_camiones);
          const camiones = await strapi.query('camiones').find(query_camiones);
          // console.log(camiones);
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

          // if(start && limit && !estado_abono && !cantidad_abono){
          //   const abonos = await strapi.services.abonos.find(
          //     {mostrar:true }
          //   );
          //   const edges = abonos
          //   .slice(startIndex, startIndex + parseInt(limit))
          //   .map((abono) => ({ node: abono, cursor: abono.id }));
          //   const pageInfo = {
          //     startCursor: edges.length > 0 ? edges[0].cursor : null,
          //     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          //     hasNextPage:  startIndex + parseInt(limit) < abonos.length,
          //     hasPreviousPage: startIndex > 0,
          //   };
          //   return {
          //     totalCount: abonos.length,
          //     edges,
          //     pageInfo,
          //   };
          // }
          // if(estado_abono){
          //   const regex = new RegExp(estado_abono, 'i');
          //   query.estado_abono = { $regex: regex };
          // }
          // if(cantidad_abono && !isNaN(parseFloat(cantidad_abono))){
          //   query.cantidad_abono = parseFloat(cantidad_abono)
          // }
          // if(fechaInicio && fechaFin){
          //   const fechaInicioDatetime = new Date(fechaInicio).toISOString();
          //   const fechaFinDatetime = new Date(fechaFin).toISOString();
          //   console.log(fechaInicioDatetime)
          //   console.log(fechaFinDatetime)
          //   query.fecha_abono = {
          //     $gte: new Date(fechaInicio).toISOString(),
          //     $lte: new Date(fechaFin).toISOString(),
          //   }
          // }
          // let abonos = await strapi.query('abonos').find(query);

          // const edges = abonos
          //   .slice(startIndex, startIndex + parseInt(limit))
          //   .map((abono) => ({ node: abono, cursor: abono.id }));
          // const pageInfo = {
          //   startCursor: edges.length > 0 ? edges[0].cursor : null,
          //   endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          //   hasNextPage:  startIndex + parseInt(limit) < abonos.length,
          //   hasPreviousPage: startIndex > 0,
          // };
          // return {
          //   totalCount: abonos.length,
          //   edges,
          //   pageInfo,
          // };
          // let camiones = await strapi.query('camiones').find();
          // const camionesedges = camiones.map((camion) => {
          //   const obj = []
          //   const juego =  camion.placas.map(camion=>{
          //     const regex = new RegExp('h','i')
          //     if(regex.test(camion.placa)){
          //       return regex.test(camion.placa)
          //     }
          //   });
          //   if(juego.includes(true)){
          //     return camion
          //   }
          // });
          // const filterCamiones = camionesedges.filter( (x)=>{return x!== undefined});

          // console.log(filterCamiones);





          // const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
          // const query = {}
          // if(start && limit && !estado_abono  && ! cantidad_abono ){
          //   const abonos = await strapi.services.abonos.find({
          //     _start: start,
          //     _limit: limit,
          //   });
          //   const edges = abonos
          //   .slice(startIndex, startIndex + limit)
          //   .map((abono) => ({ node: abono, cursor: abono.id }));

          //   const pageInfo = {
          //     startCursor: edges.length > 0 ? edges[0].cursor : null,
          //     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          //     hasNextPage: abonos.length > startIndex + limit,
          //     hasPreviousPage: startIndex > 0,
          //   };
          //   return {
          //     totalCount: abonos.length,
          //     edges,
          //     pageInfo,
          //   };
          // }else{
          //   if(estado_abono){
          //     const regex = new RegExp(estado_abono, 'i');
          //     query.estado_abono = { $regex: regex };
          //   }
          //   if(cantidad_abono && !isNaN(parseFloat(cantidad_abono))){
          //     query.cantidad_abono = parseFloat(cantidad_abono)
          //   }
          //   let abonos = await strapi.query('abonos').find(query);
          //   // return abonos;
          //   const edges = abonos
          //   .slice(startIndex, startIndex + limit)
          //   .map((abono) => ({ node: abono, cursor: abono.id }));

          //   const pageInfo = {
          //     startCursor: edges.length > 0 ? edges[0].cursor : null,
          //     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          //     hasNextPage: abonos.length > startIndex + limit,
          //     hasPreviousPage: startIndex > 0,
          //   };
          //   return {
          //     totalCount: abonos.length,
          //     edges,
          //     pageInfo,
          //   };
          // }


          // const pageInfo = {
          //   startCursor: edges.length > 0 ? edges[0].cursor : null,
          //   endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          //   hasNextPage: abonos.pagination.currentPage < abonos.pagination.pageCount,
          //   hasPreviousPage: abonos.pagination.currentPage > 1,
          // };

          // return {
          //   totalCount: abonos.pagination.total,
          //   edges,
          //   pageInfo,
          // };
        },
      // },
    },
  },
};
