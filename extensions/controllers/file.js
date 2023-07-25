const XLSX = require('xlsx');
const fs = require('fs');
const fileUpload = async (ctx,models, query )=>{
  // const {campos, type, nombre_archivo} = ctx.request.body;
  const campos = ["cantidad_abono","fecha_abono","estado_abono","usuario"];
  const type = "xlsx";
  // const type = "txt";
  const nombre_archivo = "Camiones2"
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
  let payments = await strapi.query(query).model.find({}, fieldsToShow.join(' '))
  .populate({
    path: 'usuario',
    select: 'id nombre ap_paterno ap_materno'
  })
  .populate({
    path: 'credito',
    select: 'id intereses'
  });
  const renameMap = {
    cantidad_abono: 'Cantidad de abono',
    fecha_abono: 'Fecha de abono',
    estado_abono: 'Estado de abono',
    usuario: 'Nombre de usuario',
  };
  if (file === 'txt') {

  // Encontrar la longitud más grande de cada clave y valor
  const maxLengths = Object.keys(renameMap).reduce((acc, key) => {
    const fieldLength = renameMap[key].length;
    // const valueLength = renameMap[key].length;

    // Determinar el valor más largo entre la clave y el valor
    // Encontrar el valor actual del campo en la petición
    const currentValueLength = payments.reduce((maxLen, payment) => {
      let value;
      if(key === 'usuario'){
        value = `${formatValue(payment[key]?.nombre)} ${formatValue(payment[key]?.ap_paterno)} ${formatValue(payment[key]?.ap_materno)}`;
      }else {
        value = payment[key].toString();
      }
      if (typeof value === 'string') {
        return Math.max(maxLen, value.length);
      }
      return maxLen;
    }, 0);

  // Determinar si el nuevo nombre o el valor actual es más grande
  if (currentValueLength > fieldLength) {
    acc[key] = {
      fieldLength,
      valueLength: currentValueLength,
      max: currentValueLength,
    };
  } else {
    acc[key] = {
      fieldLength,
      currentValueLength,
      max:fieldLength,
    };
  }
  return acc;
}, {});
    console.log('Fecha de abono                                            '.length);
    console.log(maxLengths)
    const table = [];
    let titleDashesRow = Object.keys(renameMap).map(key => '-'.repeat(maxLengths[key].max));
    table.push(`--${titleDashesRow.join('---')}--`);
    const header = Object.keys(renameMap).map(key =>{
      const title = `${renameMap[key]}`;
      const spaces = maxLengths[key].max - maxLengths[key].fieldLength;
      console.log(maxLengths[key].max - maxLengths[key].fieldLength);
      return `${title}${' '.repeat(spaces)}`;
    });
    table.push(`| ${header.join(' | ')} |`);
    table.push(`--${titleDashesRow.join('---')}--`);
    payments.forEach(payment => {
      const row = Object.keys(renameMap).map(key => {
        let value;
        if(key === 'usuario'){
          value = `${formatValue(payment[key]?.nombre)} ${formatValue(payment[key]?.ap_paterno)} ${formatValue(payment[key]?.ap_materno)}`;
        }else {
          value = String(payment[key]);
        }
        const spaces = maxLengths[key].max - value.length;
        return `${value}${' '.repeat(spaces)}`;
      });
      table.push(`| ${row.join(' | ')} |`);
      table.push(`--${titleDashesRow.join('---')}--`);
    });
    const tableString = table.join('\n');
    // // Ruta del archivo
    const filePath = nombre_archivo + '.txt';

    // Escribir el contenido en un archivo TXT
    fs.writeFileSync(filePath, tableString);

    // Configurar la respuesta HTTP para la descarga
    ctx.set('Content-Disposition', 'attachment; filename=' + nombre_archivo + '.txt');
    ctx.type = 'text/plain';

    // Enviar el archivo como respuesta HTTP
    ctx.body = fs.createReadStream(filePath);

    // Eliminar el archivo después de enviarlo
    fs.unlinkSync(filePath);
  } else if (file === 'xlsx') {
    // Crear una matriz de objetos planos con solo las propiedades necesarias
    const plainObjects = payments.map(payment => {
      const obj = {};
      fieldsToShow.forEach(field => {
        if(field == 'usuario') {
          obj[renameMap[field]] = `${formatValue(payment[field]?.nombre)} ${formatValue(payment[field]?.ap_paterno)} ${formatValue(payment[field]?.ap_materno)}`;
        }else {
          obj[renameMap[field]] = payment[field];
        }
      });
      return obj;
    });

    // Crear archivo de Excel (xlsx)
    const worksheet = XLSX.utils.json_to_sheet(plainObjects, {});
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Establecer los encabezados de respuesta para la descarga
    ctx.set('Content-Disposition', 'attachment; filename='+nombre_archivo+'.xlsx');
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
function formatValue(value) {
  return value !== undefined && value !== null ? value : '';
}
module.exports ={
  fileUpload
}
