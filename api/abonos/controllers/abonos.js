'use strict';
const { sanitizeEntity } = require('strapi-utils');
const { convertRestQueryParams, buildQuery } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */


// En api/abonos/controllers/abonos.js
module.exports = {
  async buscarAbonos(ctx){
    const { cantidad_abono, fechaInicio, fechaFin, estado_abono } = ctx.query;
    let query = {};
    if(cantidad_abono && !isNaN(parseFloat(cantidad_abono))){
      query.cantidad_abono = parseFloat(cantidad_abono)
    }
    let dateInicio = new Date(`"${fechaInicio}"`);
    let yearInicio = dateInicio.getFullYear();
    let monthInicio = dateInicio.getMonth()+1;
    let dtInicio = dateInicio.getDate();
    if (dtInicio < 10) {
      dtInicio = '0' + dtInicio;
    }
    if (monthInicio < 10) {
      monthInicio = '0' + monthInicio;
    }

    let dateFin = new Date(`"${fechaFin}"`);
    let yearFin = dateFin.getFullYear();
    let monthFin = dateFin.getMonth()+1;
    let dtFin = dateFin.getDate();
    if (dtFin < 10) {
      dtFin = '0' + dtFin;
    }
    if (monthFin < 10) {
      monthFin = '0' + monthFin;
    }
    if(fechaInicio){
      query.fecha_abono = {
        // /*  */
        // $gte:
        // $lte: new Date(fecha_fin),
      }
      // yearFin+'-' + monthFin + '-'+dtFin
      // {
      //   $gte: yearInicio+'-' + monthInicio + '-'+dtInicio,
      //   $lte: yearFin+'-' + monthFin + '-'+dtFin,

      // };
    }
    if(estado_abono){
      const regex = new RegExp(estado_abono, 'i');
      query.estado_abono = { $regex: regex };
    }
    // const query = {
    //   cantidad_abono: cantidad_abono && parseFloat(cantidad_abono),
    //   estado_abono: estado_abono && { $regex: `${estado_abono}`, $options: "i" },
    //   fecha_abono: fechaInicio && fechaFin && {
    //     $gte: new Date(fechaInicio).toISOString(),
    //     $lte: new Date(fechaFin).toISOString()
    //   }
    // };
    console.log(yearInicio+'-' + monthInicio + '-'+dtInicio);
    console.log(yearFin+'-' + monthFin + '-'+dtFin);
    const abonos = await strapi.query('abonos').find({
      fecha_abono: yearInicio+'-' + monthInicio + '-'+dtInicio
      // fecha_abono:{
      //   $gte: yearInicio+'-' + monthInicio + '-'+dtInicio,
      //   $lte: yearFin+'-' + monthFin + '-'+dtFin,
      // }
    });
    return abonos;
    // let query = {};
    // if (cantidad_abono) {
    //   if (isNaN(parseFloat(cantidad_abono))) {
    //     throw new Error('La cantidad de abono debe ser un número');
    //   } else {
    //     cantidad = pa
    //     query.cantidad_abono = parseFloat(cantidad_abono);
    //   }
    // }

    // if (fecha_abono) {
    //   query.fecha_abono = fecha_abono;
    // }

    // if (estado_abono) {
    //   query.estado_abono = estado_abono;
    // }

    // let abonos = await strapi.query('abonos').find(query);

    // return abonos;
  },
  async abonosConnection(ctx) {
    // Extraer los argumentos de la consulta GraphQL
    const { start = 0, limit = 10 } = ctx.request.query;

    // Obtener la colección "abonos" paginados
    const abonos = await strapi.services.abonos.find({
      _start: start,
      _limit: limit,
    });

    // Obtener el número total de "abonos" en la colección
    const totalAbonos = await strapi.services.abonos.count();

    // Crear una lista de "abonoEdges" con su cursor y node
    const abonoEdges = abonos.map((abono) => ({
      cursor: abono.id,
      node: sanitizeEntity(abono, { model: strapi.models.abonos }),
    }));

    // Crear el objeto "pageInfo" con la información de paginación
    const hasNextPage = start + limit < totalAbonos;
    const hasPreviousPage = start > 0;
    const startCursor = abonoEdges.length > 0 ? abonoEdges[0].cursor : null;
    const endCursor = abonoEdges.length > 0 ? abonoEdges[abonoEdges.length - 1].cursor : null;
    const pageInfo = {
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    };

    // Devolver la conexión paginada de "abonos"
    return { edges: abonoEdges, pageInfo };
  },
  async findWithPagination(ctx) {
    const { start, limit } = ctx.request.query;
    const data = await strapi.query('abonos').find({
      _start: start,
      _limit: limit,
    });

    const edges = data.map(item => ({
      node: item,
      cursor: item.id // utilizando el ID de la base de datos como cursor
    }));

    const totalCount = await strapi.query('abonos').count();

    const hasNextPage = start + limit < totalCount;
    const hasPreviousPage = start > 0;

    const pageInfo = {
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNextPage,
      hasPreviousPage,
    };

    return {
      totalCount,
      edges,
      pageInfo,
    };
  },
  // async findAbonos(ctx){

  // },
  async findAbonos(ctx) {
    // const { start = 1, limit = 10 } = ctx.query;
    // console.log(typeof start, typeof limit);
    // const startIndex = (start - 1) * limit;
    // const endIndex = start * limit;

    // const entities = await strapi.services.abonos.find();

    // const results = {};

    // if (endIndex < entities.length) {
    //   results.next = {
    //     page: start + 1,
    //     pageSize: limit
    //   };
    // }

    // if (startIndex > 0) {
    //   results.previous = {
    //     page: start - 1,
    //     pageSize: limit
    //   };
    // }

    // results.results = entities.slice(startIndex, endIndex);

    // return results;
    const { start = 1, limit = 10 } = ctx.query;
    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
    // const startIndex = (start - 1) * limit;
    console.log(startIndex, typeof limit);
    const abonos = await strapi.services.abonos.find(
    );
    console.log(startIndex, startIndex + parseInt(limit));
    const edges = abonos
        .slice(startIndex, startIndex + parseInt(limit))
        .map((abono) => ({ node: abono, cursor: abono.id }));
    // return {edges}
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
    // return {edges};
  }

  // async findAbonos(ctx) {
  //   const { start = 0, limit = 10 } = ctx.query;
  //   // const query = convertRestQueryParams(ctx.query);

  //   // Convertir el valor de `start` en un número entero positivo
  //   const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
  //   const abonos = await strapi.services.abonos.find({
  //     _start:start,
  //     _limit:limit
  //   }
  //   //   , [
  //   //   'cliente',
  //   //   'orden',
  //   //   'tipoPago',
  //   // ]
  //   );

  //   const edges = abonos
  //     .slice(startIndex, startIndex + limit)
  //     .map((abono) => ({ node: abono, cursor: abono.id }));

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

};



// module.exports = {
//   async buscarAbonos(ctx) {

//   },
// };
