const { collections,relationsValues } = require("./table");

const resolverFilters = async (filters, table, query = {}) => {
  const {filtered,relation} = collections[table];
  const operators = ['==','!=','<','>','<=','>=','range','contain'];
  const operatorValue = {
    '==': async (field,value,operator) => {
      let query;
      if(!relation.includes(field)){
        query = value
      }else {
        query = await relationsValues[field][operator](value);
      }
      return query
    },
    '!=':async (field,value,operator) => {
      let query;
      if(!relation.includes(field)){
        query = { $ne: value }
      }else {
        query = await relationsValues[field][operator](value);
      }
      return query
    },
    'contain': async(field,value,operator) => {
      let query;
      if(!relation.includes(field)){
        query = {$regex: new RegExp(value, 'i')}
      }else {
        query = await relationsValues[field][operator](value);
      }
      return query;
    },
    '>':async (field,min,operator) => {
      let query;
      if(!relation.includes(field)){
        query = { $gt: min }
      }else {
        query = await relationsValues[field][operator](min);
      }
      return query;
    },
    '>=': async (field,min,operator) => {
      let query;
      if(!relation.includes(field)){
        query = { $gte: min }
      }else {
        query = await relationsValues[field][operator](min);
      }
      return query;
    },
    '<': async (field,max,operator) => {
      let query;
      if(!relation.includes(field)){
        query = { $lt: max }
      }else {
        query = await relationsValues[field][operator](max);
      }
      return query;
    },
    '<=': async (field,max,operator) =>{
      let query;
      if(!relation.includes(field)){
        query = { $lte: max }
      }else {
        query = await relationsValues[field][operator](max);
      }
      return query;
    },
    'range': async (field, min, max, operator) => {
      let query;
      if(!relation.includes(field)){
        query = {$gte:min, $lte: max }
      }else {
        query = await relationsValues[field][operator](min,max);
      }
      return query;
    }
  }
  for(const {field,operator,value,min,max} of filters) {
    if (!field || !operator) {
      throw new Error(`Faltan campos obligatorios en el objeto de datos: field y operator`);
    }
    if(!filtered.includes(field)){
      throw new Error(`Campo no permitido`);
    }
    if(!operators.includes(operator)){
      throw new Error(`The operator: ${operator} not supported`);
    }
    if(field && ['==','!='].includes(operator) && !min && !max && value){
      query[field] = await operatorValue[operator](field,value,operator);
    }else if ( field && ['contain'].includes(operator) && !min && !max && value){
      query[field] = await operatorValue[operator](field,value,operator);
    }else if(field && ['>','>='].includes(operator) && min && !value){
      query[field] = await operatorValue[operator](field,min,operator);
    }else if(field && ['<','<='].includes(operator) && max && !value){
      query[field] = await operatorValue[operator](field,min,operator);
    }else if(field && ['range'].includes(operator) && max && min && !value){
      query[field] = await operatorValue[operator](field,min,max,operator);
    }
  }
  return query;
}
module.exports = {
  resolverFilters
}
