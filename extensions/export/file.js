const XLSX = require('xlsx');
const { resolverFilters } = require('../graphql/resolverFilters');
const { rename } = require('./renameFields');
const txt = require('./txt');
const { petition } = require('../graphql/petition');
const fileUpload = async (ctx, models, table, Query={}) => {
  const {
    campos,
    type,
    nombre_archivo,
    filters
  } = ctx.request.body;
  if (campos.length == 0) {
    return ctx.throw(403, 'Es necesarico que digas que campos quieres mostrar');
  }
  const fieldsToShow = campos;
  const model = strapi.models[models];
  const file = type;
  let fieldsExist;

  if(models == "camiones"){
    let field = fieldsToShow;
    if(fieldsToShow.includes('placa') && fieldsToShow.includes('activa') && fieldsToShow.includes('estado')){
      field = fieldsToShow.filter(field => field !== 'placa' && field !== 'activa' && field !== 'estado');
      fieldsExist = field.every(field => model.attributes.hasOwnProperty(field));
    }else{
      fieldsExist = field.every(field => model.attributes.hasOwnProperty(field));
    }
  }else{
    fieldsExist = fieldsToShow.every(field => model.attributes.hasOwnProperty(field));
  }
  // Verificar si los campos existen en el modelo
  if(!fieldsExist){
    return ctx.throw(403, 'Uno o más campos no existen en la tabla');
  }
  const query = await resolverFilters(filters,table,Query);
  const fields = await petition[models](query,"Export",fieldsToShow);
  const renameMap = rename[models];
    if (file === 'txt') {
      txt(ctx,renameMap,fields,campos,nombre_archivo,models,filters);
    } else if (file === 'xlsx') {
      // Crear una matriz de objetos planos con solo las propiedades necesarias
      const plainObjects = fields.map(payment => {
        const obj = {};
        fieldsToShow.forEach(field => {
          if (field == 'usuario') {
            obj[renameMap[field]] = `${formatValue(payment[field]?.nombre)} ${formatValue(payment[field]?.ap_paterno)} ${formatValue(payment[field]?.ap_materno)}`;
          } else {
            obj[renameMap[field]] = payment[field];
          }
        });
        return obj;
      });

      // Crear archivo de Excel (xlsx)
      const worksheet = XLSX.utils.json_to_sheet(plainObjects, {});
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'buffer'
      });

      // Establecer los encabezados de respuesta para la descarga
      ctx.set('Content-Disposition', 'attachment; filename=' + nombre_archivo + '.xlsx');
      ctx.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      // Enviar el archivo como respuesta HTTP
      ctx.send(excelBuffer);
    } else {
      return ctx.throw(403, 'Formato no válido. Especifica "txt" o "xlsx" como formato');
    }

}

function formatValue(value) {
  return value !== undefined && value !== null ? value : '';
}
module.exports = {
  fileUpload
}
