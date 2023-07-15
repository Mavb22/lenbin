const { collections } = require("./table");
function validateFieldValues(data,collection,query = {}) {
  const validOperators = ['==', '!=', '>=', '<=', '>', '<', 'range','contain'];
  if (!collections[collection]) {
    throw new Error(`La colección "${collection}" no está definida en el archivo de tablas.`);
  }
  for (const { field,operator, value,min,max = undefined } of data) {
    if (!field || !operator) {
      throw new Error(`Faltan campos obligatorios en el objeto de datos: field, operator, value`);
    }
    const expectedType = collections[collection][field];
    if(!expectedType){
      throw new Error(`El campo "${field}" no tiene un tipo de dato esperado definido.`);
    }
    if (!validOperators.includes(operator)) {
      throw new Error(`El operador "${operator}" no es válido`);
    }
    if (['==', '!=','contain'].includes(operator)) {
      if (min !== undefined || max !== undefined) {
        throw new Error(`El operador "${operator}" no debe incluir los campos "min" y "max".`);
      }
      if (value == undefined) {
        throw new Error(`El operador "${operator}" debe incluir el campo "value".`);
      }
    } else if (['>', '<', '>=', '<='].includes(operator)) {
      if (value != undefined) {
        throw new Error(`El operador "${operator}" no debe incluir el campo "value".`);
      }
      if (max == undefined && min == undefined) {
        throw new Error(`El operador "${operator}" debe incluir los campos "min" o "max".`);
      }
    } else if (['range'].includes(operator)) {
      if (value != undefined) {
        throw new Error(`El operador "${operator}" no debe incluir el campo "value".`);
      }
      if (min == undefined && max == undefined) {
        throw new Error(`El operador "${operator}" debe incluir los campos "min" y "max".`);
      }
    }
    const dataType = {
      number: {
        '==': (value) => {
          if (isNaN(Number(value)) && value && value == ''  ){
            throw new Error(`El valor "${value}" no es un valor válido para el campo ${field} o debe de tener algun valor`);
          }
          query[field] = Number(value);
        },
        '!=': (value) => {
          if (isNaN(Number(value)) && value && value == '') {
            throw new Error(`El valor "${value}" no es un valor válido para el campo ${field} o debe de tener algun valor`);
          }
          query[field] = { $ne: Number(value) };
        },
        '>=': (min) => {
          if (isNaN(Number(min)) && min ) {
            throw new Error(`El valor "${min}" no es un número válido para el tipo de dato "number"`);
          }
          query[field] = { $gte: Number(min) };
        },
        '<=': (max) => {
          if (isNaN(Number(max)) && max && max=='') {
            throw new Error(`El valor "${max}" no es un número válido para el tipo de dato "number"`);
          }
          query[field] = { $lte: Number(max) };
        },
        '>': (min) => {
          if (isNaN(Number(min)) && min && min == '') {
            throw new Error(`El valor "${min}" no es un número válido para el tipo de dato "number"`);
          }
          query[field] = { $gt: Number(min) };
        },
        '<': (max) => {
          if (isNaN(Number(max)) && max && max == '') {
            throw new Error(`El valor "${max}" no es un número válido para el tipo de dato "number"`);
          }
          query[field] = { $lt: Number(max) };
          // Realizar acciones específicas para el operador "<"
        },
        range: (min, max) => {
          if (isNaN(Number(min)) && isNaN(Number(max))) {
            throw new Error(`El valor "${min}" y "${max }" no es un numero valido para el tipo de dato number`);
          }
          query[field] = { $gte: Number(min), $lte: Number(max) };
          // Realizar acciones específicas para el operador "range"
        }
      },
      datetime: {
        '==': (value) => {
          if (isNaN(new Date(value))) {
            throw new Error(`El valor "${value}" no es un valor válido para el campo ${field} o debe tener algún valor de tipo "datetime".`);
          }
          query[field] = new Date(value);
        },
        '!=': (value) => {
          if (isNaN(new Date(value))) {
            throw new Error(`El valor "${value}" no es un valor válido para el campo ${field} o debe tener algún valor de tipo "datetime".`);
          }
          query[field] = { $ne: new Date(value) };
        },
        '>=': (min) => {
          if (isNaN(new Date(min)) && max ) {
            throw new Error(`El valor "${min}" no es un valor válido para el campo ${field} o debe tener algún valor de tipo "datetime" o  el campo max tiene algun valor.`);
          }
          query[field] = { $gte: new Date(min) };
        },
        '<=': (max) => {
          if (isNaN(new Date(max)) && min) {
            throw new Error(`El valor "${max}" no es un valor válido para el campo ${field} o debe tener algún valor de tipo "datetime"`);
          }
          query[field] = { $lte: new Date(max) };
        },
        '>': (min) => {
          if (isNaN(new Date(min)) && max ) {
            throw new Error(`El valor "${min}" no es un valor válido para el campo ${field} o debe tener algún valor de tipo "datetime".`);
          }
          query[field] = { $gt: min };
        },
        '<': (max) => {
          if (isNaN(new Date(max)) && min) {
            throw new Error(`El valor "${max}" no es un valor válido para el campo ${field} o debe tener algún valor de tipo "datetime".`);
          }
          query[field] = { $lt: max };
          // Realizar acciones específicas para el operador "<"
        },
        range: (min, max) => {
          if (isNaN(new Date(min)) || isNaN(new Date(max))) {
            throw new Error(`El valor "${min}" y "${max}" deben ser de tipo "datetime" para el operador "range" del campo "${field}".`);
          }
          query[field] = { $gte: min, $lte: max };
          // Realizar acciones específicas para el operador "range"
        }
      },
      string: {
        '==': (value) => {
          if (typeof value !== 'string' && value !== undefined) {
            throw new Error(`El valor "${value}" no es un valor válido para el campo ${field} o debe tener algún valor.`);
          }
          query[field] = value;
        },
        '!=': (value) => {
          if (typeof value !== 'string') {
            throw new Error(`El valor "${value}" no es un valor válido para el campo ${field} o debe tener algún valor.`);
          }
          query[field] = { $ne: value };
        },
        'contain': (value) => {
          if (typeof value !== 'string' && value !== undefined) {
            throw new Error(`El valor "${value}" no es un valor válido para el campo ${field} o debe tener algún valor.`);
          }
          console.log(value,'150 validate schema')
          query[field] = {$regex: new RegExp(value, 'i')};
        },
      },
      boolean: {
        '==': (value) => {
          if (typeof Boolean(value) !== 'boolean' && value !== undefined) {
            throw new Error(`El valor "${value}" no es un valor válido para el campo ${field} o debe tener algún valor.`);
          }
          query[field] = value;
        },
        '!=': (value) => {
          if (typeof value !== 'boolean') {
            throw new Error(`El valor "${value}" no es un valor válido para el campo ${field} o debe tener algún valor.`);
          }
          query[field] = { $ne: value };
        }
      }
    }
    const action = dataType[expectedType][operator];
    if (action) {
      if (operator === 'range') {
        action(min, max);
      } else if(['==', '!=','contain'].includes(operator)) {
        action(value);
      } else if(['<','<='].includes(operator)) {
        action(max)
      } else if(['>','>='].includes(operator)) {
        action(min);
      }
    }
    console.log(query)
    return query;
  }
}
module.exports = {
  validateFieldValues
}
// let payments = await strapi.query(table).model.find(
    // //   { cantidad_abono: { $ne: "2000"}, mostra:true}); diferentes
    // // let payments = await strapi.query(table).model.find({ cantidad_abono: { $gt: "2000" },mostrar:true});mayores
    // // let payments = await strapi.query(table).model.find({ cantidad_abono: { $gte: "2000" },mostrar:true}); mayor o igual
    // // let payments = await strapi.query(table).model.find({ cantidad_abono: { $lt: "2000" }});
    // // console.log(payments);
    // // console.log(payments.length);

    // let query = {mostrar: true};
    // // if(filters) {
    // //   query = validateFieldValues(filters, 'Abonos',query);
    // // }
    // const operatorMap = {
    //   equals: '_eq',
    //   notEquals: '_neq',
    //   greaterThan: '_gt',
    //   greaterThanOrEqual: '_gte',
    //   lessThan: '_lt',
    //   lessThanOrEqual: '_lte',
    //   contains: '_contains'
    // };
    // const field = 'cantidad_abono'; // Reemplaza 'nombre_campo' con el nombre real del campo
    // const operator = 'lessThan'; // Reemplaza 'equals' con el operador real
    // const value = 500; // Reemplaza 'valor' con el valor real
    // query = {[field]: {$ne: value}};
    // query = {
    //   'usuario': '6352d51cb5cb7b6db86193db'
    // }
    // console.log(query);
    // const payments = await strapi.query('abonos').model
    // .find(query)
    // .populate({
    //   path: 'usuario',
    //   select: 'id nombre ap_paterno ap_materno'
    // })
    // .populate({
    //   path: 'credito',
    //   select: 'id intereses'
    // });
    // // const payments = await strapi.query('abonos').find(query);
    // // const payments = await strapi.query('abonos').model.find({
    // //   usuario:{
    // //     nombre:'Adrian'
    // //   }
    // // });
    // console.log(payments.length ,'58');
    // console.log(payments,'58');
    // // console.log(payments);





 // if(fieldsToShow.includes('usuario')){
    //   console.log('usuario','108');
    //   payments = await strapi.query('abonos').model.populate(payments, {
    //     path: 'usuario',
    //     select: 'id nombre ap_paterno ap_materno'
    //   });
    // }
    // console.log(payments,114);
    // // if(fieldsToShow.includes('credito')){
    //   payments = await strapi.query('abonos').model.populate(payments, {
    //     path: 'credito',
    //     select: 'id intereses'
    //   });
    // }
    // const todo = payments;
    // console.log( populatedPayments);

// const fieldsToShow = ['cantidad_abono', 'estado_abono', 'fecha_abono','usuario'];
    // const fieldsString = fieldsToShow.join(' ');

    // const payments = await strapi.query('abonos').model.find(query)
    //     .populate({
    //       path: 'usuario',
    //       select: 'id nombre ap_paterno ap_materno'
    //     })
    //     .populate({
    //       path: 'credito',
    //       select: 'id intereses'
    //     });

    //   const populatedPayments = payments.map(payment => {
    //     const selectedFields = fieldsToShow.reduce((obj, field) => {
    //       obj[field] = payment[field];
    //       return obj;
    //     }, {});

    //     return {
    //       id: payment.id,
    //       usuario: payment.usuario,
    //       credito: payment.credito,
    //       ...selectedFields
    //     };
    //   });
    // console.log(query,'90');
    // const campos = ['cantidad_abono','fecha_abono','usuario'];
    // const fieldsToShow = campos;
    // const model = strapi.models['abonos'];
    // fieldsToShow.join(' ')





    // Correcto
    // const fieldsToShow = ['usuario', 'credito','cantidad_abono','fecha_abono'];
    // payments = payments.map(payment => {
    //   const selectedFields = {};

    //   fieldsToShow.forEach(field => {
    //     if (payment[field]) {
    //       selectedFields[field] = payment[field];
    //     }
    //   });

    //   return {
    //     id: payment.id,
    //     ...selectedFields
    //   };
    // });
