const fs = require('fs');
const txt = async (ctx,renameMap,fields,campos,nombre_archivo)  => {
  const maxLengths = Object.keys(renameMap).reduce((acc, key) => {
    const fieldLength = renameMap[key].length;
    const currentValueLength = fields.reduce((maxLen, field) => {
      let value;
      if (key === 'usuario') {
        value = `${formatValue(field[key]?.nombre)} ${formatValue(field[key]?.ap_paterno)} ${formatValue(field[key]?.ap_materno)}`;
      } else if (key === 'credito') {
        value = `${formatValue(field[key]?.intereses)}`;
      } else  if(field[key]){
        value = field[key].toString();
      }
      if (typeof value === 'string') {
        return Math.max(maxLen, value.length);
      }
      return maxLen;
    }, 0);
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
  const table = [];
  const fieldsRenameMap = campos.reduce((resultado, clave) => {
    if (renameMap.hasOwnProperty(clave)) {
      resultado[clave] = renameMap[clave];
    }
    return resultado;
  }, {});
  let titleDashesRow = Object.keys(fieldsRenameMap).map(key => '-'.repeat(maxLengths[key].max));
  table.push(`--${titleDashesRow.join('---')}--`);
  const header = Object.keys(fieldsRenameMap).map(key => {
    const title = `${renameMap[key]}`;
    const spaces = maxLengths[key].max - maxLengths[key].fieldLength;
    return `${title}${' '.repeat(spaces)}`;
  });
  table.push(`| ${header.join(' | ')} |`);
  table.push(`--${titleDashesRow.join('---')}--`);
  fields.forEach(payment => {
    const row = Object.keys(fieldsRenameMap).map(key => {
      let value;
      if (key === 'usuario') {
        value = `${formatValue(payment[key]?.nombre)} ${formatValue(payment[key]?.ap_paterno)} ${formatValue(payment[key]?.ap_materno)}`;
      } else if(key === 'credito'){
        value = `${formatValue(payment[key]?.intereses)}`;
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
}
function formatValue(value) {
  return value !== undefined && value !== null ? value : '';
}
module.exports = txt;
