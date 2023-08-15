const fs = require('fs');
const path = require('path');
const { max } = require('./max');
const { table } = require('./table');
const txt = async (ctx,renameMap,fields,campos,nombre_archivo,model,filters)  => {
  const maxLengths = max(renameMap,filters,fields,model);
  const tableString = table(campos,renameMap,maxLengths,fields,model,filters);
  // // Ruta del archivo
  const filePath = path.join(__dirname, nombre_archivo + '.txt');
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
module.exports = txt;
