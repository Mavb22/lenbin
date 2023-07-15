const XLSX = require('xlsx');
const fs = require('fs');
const fileUpload = async (ctx,models, query )=>{
  const {campos, type, nombre_archivo} = ctx.request.body;
  if(campos.length == 0) {
    return ctx.throw(403, 'Es necesarico que digas que campos quieres mostrar');
  }
  // console.log(ctx.request.body);
  // Campos que se mostrarán en los pagos
  const fieldsToShow = campos;

  // Obtener el modelo de la tabla
  const model = strapi.models[models];
  const file = type;

  // Verificar si los campos existen en el modelo
  const fieldsExist = fieldsToShow.every(field => model.attributes.hasOwnProperty(field));
  if (fieldsExist) {
  // Realiza la consulta a la base de datos
  const payments = await strapi.query(query).model.find({}, fieldsToShow.join(' '));

  if (file === 'txt') {
    // Crear una cadena de texto con los datos de los pagos
    const textData = payments
      .map(payment => fieldsToShow.map(field => `${field}: ${payment[field]}`).join(' | '))
      .join('\n');

    // Guardar los datos en un archivo de texto
    const filePath = nombre_archivo + '.txt';
    fs.writeFileSync(filePath, textData, 'utf-8');

    // Establecer los encabezados de respuesta para la descarga
    ctx.set('Content-Disposition', 'attachment; filename='+nombre_archivo+'.txt');
    ctx.type = 'text/plain';

    // Enviar el archivo como respuesta HTTP
    ctx.send(fs.createReadStream(filePath));
    // Eliminar el archivo después de enviarlo
    fs.unlinkSync(filePath);
  } else if (file === 'xlsx') {
    // Crear una matriz de objetos planos con solo las propiedades necesarias
    const plainObjects = payments.map(payment => {
      const obj = {};
      fieldsToShow.forEach(field => {
        obj[field] = payment[field];
      });
      return obj;
    });

    // Crear archivo de Excel (xlsx)
    const worksheet = XLSX.utils.json_to_sheet(plainObjects, { header: fieldsToShow });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Establecer los encabezados de respuesta para la descarga
    ctx.set('Content-Disposition', 'attachment; filename='+nombre_archivo+'xlsx');
    ctx.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    // Enviar el archivo como respuesta HTTP
    ctx.send(excelBuffer);
  } else {
    // Formato no válido especificado por el usuario
    return ctx.throw(403, 'Formato no válido. Especifica "txt" o "xlsx" como formato');
    // console.log('Formato no válido. Especifica "txt" o "xlsx" como formato');
  }
} else {
  // Al menos uno de los campos no existe en la tabla
  return ctx.throw(403, 'Uno o más campos no existen en la tabla');
  // console.log('Uno o más campos no existen en la tabla');
}

}
module.exports ={
  fileUpload
}
