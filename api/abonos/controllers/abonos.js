'use strict';

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
  }

};

