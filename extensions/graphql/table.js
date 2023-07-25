//Nombre de la tabla = abonos = se cambia al nombre de la tabla
//filtered = Son los campos de la tabla
//relation = son las relaciones que tiene la tabla
//en camiones en el campo placas va hacer por placas.placa,placa.activa,placa.estado
const collections = {
  Abonos:{
    filtered: ['cantidad_abono','fecha_abono','estado_abono','credito','usuario'],
    relation: ['credito','usuario']
  },
  Camiones:{
    filtered: ['placas','num_serie','niv','historial','rutas','usuario','gastos'],
    relation: ['usuario','rutas','historial','gastos']
  },
  Carrito:{
    filtered: ['cantidad','productos','usuario','venta'],
    relation: ['usuario','productos','venta']
  },
  Compras:{
    filtered: ['costo','fecha_pedido','referencia','fecha_llegada','status','status2','lote','metodo_pago','proveedor','usuarios'],
    relation: ['lote','metodo_pago','proveedor','usuarios']
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
  },
  rutas:{
    '==': async(value) => {
      const destination= await strapi.query('rutas').model.find({destino: value});
      if(destination.length > 0){
        const destin = destination.map(object => object.id)
        return {$in: destin}
      }
    },
    '!=': async(value) => {
      const destination= await strapi.query('rutas').model.find({destino: { $ne: value }});
      if(destination.length > 0){
        const destin = destination.map(object => object.id)
        return {$in: destin}
      }
    },
    'contain': async (value) => {
      const destination = await strapi.query('rutas').model.find({destino:{$regex: new RegExp(value, 'i')}});
      if(destination.length > 0){
        const destin = destination.map(object => object.id)
        return {$in: destin}
      }
    }
  },
  gastos:{
    '==': async(value) => {
      const categories= await strapi.query('gastos').model.find({categoria: value});
      if(categories.length > 0){
        const category = categories.map(object => object.id)
        return {$in: category}
      }
    },
    '!=': async(value) => {
      const categories= await strapi.query('gastos').model.find({categoria: { $ne: value }});
      if(categories.length > 0){
        const category = categories.map(object => object.id)
        return {$in: category}
      }
    },
    'contain': async (value) => {
      const categories = await strapi.query('gastos').model.find({categoria:{$regex: new RegExp(value, 'i')}});
      if(categories.length > 0){
        const category = categories.map(object => object.id)
        return {$in: category}
      }
    }
  },
  productos:{
    '==': async(value) => {
      const products= await strapi.query('producto').model.find({nombre: value});
      if(products.length > 0){
        const product = products.map(object => object.id)
        return {$in: product}
      }
    },
    '!=': async(value) => {
      const products= await strapi.query('producto').model.find({nombre: { $ne: value }});
      if(products.length > 0){
        const product = products.map(object => object.id)
        return {$in: product}
      }
    },
    'contain': async (value) => {
      const products = await strapi.query('producto').model.find({nombre:{$regex: new RegExp(value, 'i')}});
      if(products.length > 0){
        const product = products.map(object => object.id)
        return {$in: product}
      }
    }
  },
  venta: {
    '>': async (min) => {
      const sale = await strapi.query('venta').model.find({monto:{ $gt: min }});
      if (sale.length > 0) {
        const sales = sale.map(object => object.id)
        return {$in: sales};
      }
    },
    '>=': async (min) => {
      const sale = await strapi.query('venta').model.find({monto:{ $gte: min }});
      if (sale.length > 0) {
        const sales = sale.map(object => object.id)
        return {$in: sales};
      }
    },
    '<': async (max) => {
      const sale = await strapi.query('venta').model.find({monto:{ $lt: max }});
      if (sale.length > 0) {
        const sales = sale.map(object => object.id)
        return {$in: sales};
      }
    },
    '<=': async (max) => {
      const sale = await strapi.query('venta').model.find({monto:{ $lte: max }});
      if (sale.length > 0) {
        const sales = sale.map(object => object.id)
        return {$in: sales};
      }
    },
    'range': async (min,max) => {
      const sale = await strapi.query('venta').model.find({monto:{$gte:min, $lte: max }});
      if (sale.length > 0) {
        const sales = sale.map(object => object.id)
        return {$in: sales};
      }
    }
  },
  lote: {
    '>': async (min) => {
      const lot = await strapi.query('lote').model.find({codigo_interno:{ $gt: min }});
      if (lot.length > 0) {
        const lots = lot.map(object => object.id)
        return {$in: lots};
      }
    },
    '>=': async (min) => {
      const lot = await strapi.query('lote').model.find({codigo_interno:{ $gte: min }});
      if (lot.length > 0) {
        const lots = lot.map(object => object.id)
        return {$in: lots};
      }
    },
    '<': async (max) => {
      const lot = await strapi.query('lote').model.find({codigo_interno:{ $lt: max }});
      if (lot.length > 0) {
        const lots = lot.map(object => object.id)
        return {$in: lots};
      }
    },
    '<=': async (max) => {
      const lot = await strapi.query('lote').model.find({codigo_interno:{ $lte: max }});
      if (lot.length > 0) {
        const lots = lot.map(object => object.id)
        return {$in: lots};
      }
    },
    'range': async (min,max) => {
      const lot = await strapi.query('lote').model.find({codigo_interno:{$gte:min, $lte: max }});
      if (lot.length > 0) {
        const lots = lot.map(object => object.id)
        return {$in: lots};
      }
    }
  },
  metodo_pago: {
    '>': async (min) => {
      const payment_method = await strapi.query('metodo_pago').model.find({numero_tarjeta:{ $gt: min }});
      if (payment_method.length > 0) {
        const method = payment_method.map(object => object.id)
        return {$in: method};
      }
    },
    '>=': async (min) => {
      const payment_method = await strapi.query('metodo_pago').model.find({numero_tarjeta:{ $gte: min }});
      if (payment_method.length > 0) {
        const method = payment_method.map(object => object.id)
        return {$in: method};
      }
    },
    '<': async (max) => {
      const payment_method = await strapi.query('metodo_pago').model.find({numero_tarjeta:{ $lt: max }});
      if (payment_method.length > 0) {
        const method = payment_method.map(object => object.id)
        return {$in: method};
      }
    },
    '<=': async (max) => {
      const payment_method = await strapi.query('metodo_pago').model.find({numero_tarjeta:{ $lte: max }});
      if (payment_method.length > 0) {
        const method = payment_method.map(object => object.id)
        return {$in: method};
      }
    },
    'range': async (min,max) => {
      const payment_method = await strapi.query('metodo_pago').model.find({numero_tarjeta:{$gte:min, $lte: max }});
      if (payment_method.length > 0) {
        const method = payment_method.map(object => object.id)
        return {$in: method};
      }
    }
  },
  proveedor:{
    '==': async(value) => {
      const provider= await strapi.query('proveedor').model.find({nombre: value});
      if(provider.length > 0){
        const providers = provider.map(object => object.id)
        return {$in: providers}
      }
    },
    '!=': async(value) => {
      const provider= await strapi.query('proveedor').model.find({nombre: { $ne: value }});
      if(provider.length > 0){
        const providers = provider.map(object => object.id)
        return {$in: providers}
      }
    },
    'contain': async (value) => {
      const provider = await strapi.query('proveedor').model.find({nombre:{$regex: new RegExp(value, 'i')}});
      if(provider.length > 0){
        const providers = provider.map(object => object.id)
        return {$in: providers}
      }
    }
  },
  usuarios:{
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
}
module.exports = {
  collections,
  relationsValues
}
