// 'use strict';

// const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

// module.exports = {
//   Query: {
//     abonosConnection: async (parent, args, { context }) => {
//       // Extraer los argumentos de la consulta GraphQL
//       const { start = 0, limit = 10 } = args;

//       // Obtener la colección "abonos" paginados
//       const abonos = await strapi.services.abonos.find({
//         _start: start,
//         _limit: limit,
//       });

//       // Obtener el número total de "abonos" en la colección
//       const totalAbonos = await strapi.services.abonos.count();

//       // Crear una lista de "abonoEdges" con su cursor y node
//       const abonoEdges = abonos.map(abono => ({
//         cursor: abono.id,
//         node: sanitizeEntity(abono, { model: strapi.models.abonos }),
//       }));

//       // Crear el objeto "pageInfo" con la información de paginación
//       const hasNextPage = start + limit < totalAbonos;
//       const hasPreviousPage = start > 0;
//       const startCursor = abonoEdges.length > 0 ? abonoEdges[0].cursor : null;
//       const endCursor = abonoEdges.length > 0 ? abonoEdges[abonoEdges.length - 1].cursor : null;
//       const pageInfo = {
//         hasNextPage,
//         hasPreviousPage,
//         startCursor,
//         endCursor,
//       };

//       // Devolver la conexión paginada de "abonos"
//       return { edges: abonoEdges, pageInfo };
//     },
//   },
// };
