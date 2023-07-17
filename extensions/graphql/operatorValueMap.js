const { relationsValues} = require("./table");
const operatorValue = {
  '==': async (field,relation,value,operator) => {
    let query;
    if(!relation.includes(field)){
      query = value
    }else {
      query = await relationsValues[field][operator](value);
    }
    return query
  },
  '!=':async (field,relation,value,operator) => {
    let query;
    if(!relation.includes(field)){
      query = { $ne: value }
    }else {
      query = await relationsValues[field][operator](value);
    }
    return query
  },
  'contain': async(field,relation,value,operator) => {
    let query;
    if(!relation.includes(field)){
      query = {$regex: new RegExp(value, 'i')}
    }else {
      query = await relationsValues[field][operator](value);
    }
    return query;
  },
  '>':async (field,relation,min,operator) => {
    let query;
    if(!relation.includes(field)){
      query = { $gt: min }
    }else {
      query = await relationsValues[field][operator](min);
    }
    return query;
  },
  '>=': async (field,relation,min,operator) => {
    let query;
    if(!relation.includes(field)){
      query = { $gte: min }
    }else {
      query = await relationsValues[field][operator](min);
    }
    return query;
  },
  '<': async (field,relation,max,operator) => {
    let query;
    if(!relation.includes(field)){
      query = { $lt: max }
    }else {
      query = await relationsValues[field][operator](max);
    }
    return query;
  },
  '<=': async (field,relation,max,operator) =>{
    let query;
    if(!relation.includes(field)){
      query = { $lte: max }
    }else {
      query = await relationsValues[field][operator](max);
    }
    return query;
  },
  'range': async (field,relation, min, max, operator) => {
    let query;
    if(!relation.includes(field)){
      query = {$gte:min, $lte: max }
    }else {
      query = await relationsValues[field][operator](min,max);
    }
    return query;
  }
}
const operatorValueMap = {
  '==': async (field,relation, value) => operatorValue['=='](field,relation, value, '=='),
  '!=': async (field,relation, value) => operatorValue['!='](field,relation, value, '!='),
  'contain': async (field,relation, value) => operatorValue['contain'](field,relation, value, 'contain'),
  '>': async (field,relation, min) => operatorValue['>'](field,relation, min, '>'),
  '>=': async (field,relation, min) => operatorValue['>='](field,relation, min, '>='),
  '<': async (field,relation, max) => operatorValue['<'](field,relation, max, '<'),
  '<=': async (field,relation, max) => operatorValue['<='](field,relation, max, '<='),
  'range': async (field,relation, min, max) => operatorValue['range'](field,relation, min, max, 'range'),
};
module.exports = {
  operatorValueMap
}
