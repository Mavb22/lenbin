const { tablaFile } = require("./tableFile");
const table = (campos,renameMap,maxLengths,fields,model,filters) => {
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
  fields.forEach(field => {
    const row = Object.keys(fieldsRenameMap).map(key => {
      let value = tablaFile[model](field,key, filters);
      const spaces = maxLengths[key].max - value.length;
      return `${value}${' '.repeat(spaces)}`;
    });
    table.push(`| ${row.join(' | ')} |`);
    table.push(`--${titleDashesRow.join('---')}--`);
  });
  const tableString = table.join('\n');
  return tableString;
}
module.exports = {
  table
}
