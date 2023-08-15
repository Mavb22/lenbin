const { operatorValueMap } = require("./operatorValueMap");
const { collections } = require("./table");
const validateOperator = require("./validateOperator");

const resolverFilters = async (filters, table, query = {}) => {
  const {filtered,relation} = collections[table];
  const operators = ['==','!=','<','>','<=','>=','range','contain'];
  if(filters){
    for (const { field, operator, value, min, max } of filters) {
      if (!field || !operator) {
        throw new Error(`Faltan campos obligatorios en el objeto de datos: field y operator`);
      }
      if (!filtered.includes(field)) {
        throw new Error(`Campo no permitido`);
      }
      
      if (!operators.includes(operator)) {
        throw new Error(`The operator: ${operator} not supported`);
      }
      validateOperator(operator, value, min, max);

      if (operator in operatorValueMap) {
        if ((['==', '!=', 'contain'].includes(operator) && value) || (['>', '>='].includes(operator) && min) ||(['<', '<='].includes(operator) && max)) {
          query[field] = await operatorValueMap[operator](field,relation, value || min || max);
        }else if((operator === 'range' && min && max)){
          query[field] = await operatorValueMap[operator](field,relation, min, max);
        }
      }
    }
  }
  return query;
}
module.exports = {
  resolverFilters
}
