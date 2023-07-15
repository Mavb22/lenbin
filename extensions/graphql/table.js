const collections = {
  Abonos:{
    filtered: ['cantidad_abono','fecha_abono','estado_abono','credito','usuario'],
    relation: ['credito','usuario']
  },
}
const relationsValues = {
  usuario:{
    '==': async(value) => {
      const users= await strapi.query('usuarios').model.find({nombre: value});
      if(users.length > 0){
        const user = users.map(object => object.id)
        return {$in: user}
      }
    },
    '!=': async(value) => {
      const users= await strapi.query('usuarios').model.find({nombre: { $ne: value }});
      if(users.length > 0){
        const user = users.map(object => object.id)
        return {$in: user}
      }
    },
    'contain': async (value) => {
      const users = await strapi.query('usuarios').model.find({nombre:{$regex: new RegExp(value, 'i')}});
      if(users.length > 0){
        const user = users.map(object => object.id)
        return {$in: user}
      }
    }
  },
  credito: {
    '>': async (min) => {
      const creditos = await strapi.query('credito').model.find({intereses:{ $gt: min }});
      if (creditos.length > 0) {
        const credito = creditos.map(object => object.id)
        return {$in: credito};
      }
    },
    '>=': async (min) => {
      const creditos = await strapi.query('credito').model.find({intereses:{ $gte: min }});
      if (creditos.length > 0) {
        const credito = creditos.map(object => object.id)
        return {$in: credito};
      }
    },
    '<': async (max) => {
      const creditos = await strapi.query('credito').model.find({intereses:{ $lt: max }});
      if (creditos.length > 0) {
        const credito = creditos.map(object => object.id)
        return {$in: credito};
      }
    },
    '<=': async (max) => {
      const creditos = await strapi.query('credito').model.find({intereses:{ $lte: max }});
      if (creditos.length > 0) {
        const credito = creditos.map(object => object.id)
        return {$in: credito};
      }
    },
    'range': async (min,max) => {
      const creditos = await strapi.query('credito').model.find({intereses:{$gte:min, $lte: max }});
      if (creditos.length > 0) {
        const credito = creditos.map(object => object.id)
        return {$in: credito};
      }
    }
  }
}
module.exports = {
  collections,
  relationsValues
}
