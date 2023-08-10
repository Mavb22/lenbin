const XLSX = require('xlsx');
const fs = require('fs');
const { resolverFilters } = require('../graphql/resolverFilters');
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
  // Verificar si los campos existen en el modelo
  const fieldsExist = fieldsToShow.every(field => model.attributes.hasOwnProperty(field));
  if (fieldsExist) {
    const query = await resolverFilters(filters,table,Query);
    const fields = await petition.abonos(query,'Export');
    const renameMap = {
      // placas: 'Placas',
      num_serie: 'Numero de serie',
      niv: 'Numero de identificacion vehicular',
      // historial: 'Historial',
      rutas: 'Rutas'
    };
    if (file === 'txt') {

      const maxLengths = Object.keys(renameMap).reduce((acc, key) => {
        const fieldLength = renameMap[key].length;
        const currentValueLength = fields.reduce((maxLen, field) => {
          let value;
          if (key === 'usuario') {
            value = `${formatValue(field[key]?.nombre)} ${formatValue(field[key]?.ap_paterno)} ${formatValue(field[key]?.ap_materno)}`;
          } else if (key === 'credito') {
            value = `${formatValue(field[key]?.intereses)}`;
          } else if (key == 'Rutas'){
            const formattedUsers = field[key]?.map(rute => {
              return `${formatValue(rute.destino)}`;
            });
            const rutesValue = formattedUsers.join(', ');
            value = `[${rutesValue}]`;
          }else {
            value = field[key].toString();
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
            max: fieldLength,
          };
        }
        return acc;
      }, {});
      console.log('Fecha de abono                                            '.length);
      console.log(maxLengths)
      const table = [];
      let titleDashesRow = Object.keys(renameMap).map(key => '-'.repeat(maxLengths[key].max));
      table.push(`--${titleDashesRow.join('---')}--`);
      const header = Object.keys(renameMap).map(key => {
        const title = `${renameMap[key]}`;
        const spaces = maxLengths[key].max - maxLengths[key].fieldLength;
        console.log(maxLengths[key].max - maxLengths[key].fieldLength);
        return `${title}${' '.repeat(spaces)}`;
      });
      table.push(`| ${header.join(' | ')} |`);
      table.push(`--${titleDashesRow.join('---')}--`);
      fields.forEach(field => {
        const row = Object.keys(renameMap).map(key => {
          let value;
          if (key === 'usuario') {
            value = `${formatValue(field[key]?.nombre)} ${formatValue(field[key]?.ap_paterno)} ${formatValue(field[key]?.ap_materno)}`;
          } else if(key === 'credito'){
            value = `${formatValue(field[key]?.intereses)}`;
          }else {
            value = String(field[key]);
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
      const plainObjects = fields.map(field => {
        const obj = {};
        fieldsToShow.forEach(field => {
          if (field == 'usuario') {
            obj[renameMap[field]] = `${formatValue(field[field]?.nombre)} ${formatValue(field[field]?.ap_paterno)} ${formatValue(field[field]?.ap_materno)}`;
          } else {
            obj[renameMap[field]] = field[field];
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
module.exports = {
  fileUpload
}
