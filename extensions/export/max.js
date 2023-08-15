const { tablaFile } = require("./tableFile");
const max = (renameMap,filters,fields,model) => {
  const maxLengths = Object.keys(renameMap).reduce((acc, key) => {
    const fieldLength = renameMap[key].length;
    const currentValueLength = fields.reduce((maxLen, field) => {
      let value = tablaFile[model](field,key, filters);
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
  return maxLengths
}
module.exports = {max};
