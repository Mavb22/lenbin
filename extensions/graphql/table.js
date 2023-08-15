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
    filtered: ['num_serie','niv','placa.placa','placa.estado','placa.activa','historial','rutas','usuario','gastos'],
    relation: ['usuario','rutas','historial','gastos',]
  },
  Carrito:{
    filtered: ['cantidad','productos','usuario','venta'],
    relation: ['usuario','productos','venta']
  },
  Compras:{
    filtered: ['costo','fecha_pedido','referencia','fecha_llegada','status','status2','lote','metodo_pago','proveedor','usuarios'],
    relation: ['lote','metodo_pago','proveedor','usuarios']
  },
  Credito:{
    filtered: ['usuario','limite','fecha_alta','fecha_baja','vigencia','intereses','status','status2','mostrar','abonos','metodo_pago'],
    relation: ['usuario','abonos','metodo_pago']
  },
  Dimensiones:{
    filtered: ['nombre','ancho','alto','largo','productos'],
    relation: ['productos']
  },
  Gastos:{
    filtered: ['description','fecha','monto','categoria','status','usuario','camions'],
    relation: ['usuario','camions']
  },
  Historial:{
    filtered: ['fecha','hora_inicio','hora_fin','status','status2','usuario','camiones'],
    relation: ['usuario','camiones']
  },
  Local:{
    filtered: ['nombre','alias','razon_social','rfc','fecha_alta','calle','colonia','numero_ext','municipio','numero_int','ciudad','cp','longitud','telefono','telefono_cel','giro','status','status2','usuarios','venta'],
    relation: ['usuarios','ventas']
  },
  Lotes:{
    filtered: ['codigo_interno','fecha_arrivo','fecha_caducidad','fecha_adquisicion','costo','compras','products'],
    relation: ['compras','products']
  },
  Metodopago:{
    filtered: ['numero_tarjeta','mes','anio','cvc','titular','folio','fecha_expedicion','fecha_ingreso','descripcion','referencia','tipo','compras','creditos','usuario','venta'],
    relation: ['usuario','compras','creditos','venta']
  },
  Productos:{
    filtered: ['nombre','peso_neto','presentacion','marca','descripcion_generica','precio','costo','inventario_disp','value_min','codigo_barras','codigo_interno','venta_gramos','status','status2','carritos','dimension','promociones','proveedor','lotes'],
    relation: ['carritos','promociones','proveedor','lotes']
  },
  Promociones:{
    filtered: ['fecha_creacion','fecha_vigencia','valor_descuento','codigo_ref','condicion','productos'],
    relation: ['productos']
  },
  Proveedor:{
    filtered: ['nombre','razon_social','rfc','fecha_alta','calle','numero','colonia','cp','municipio','ciudad','pais','visita_programada','status','status2','compras','productos'],
    relation: ['compras','productos']
  },
  Rutas:{
    filtered: ['descripcion','lugar_origen','destino','fecha_salida','fecha_llegada','referencia','nombre_mercancia_recibida','comentarios','estado','ruta_ciclica','camiones','ventas'],
    relation: ['camiones','ventas']
  },
  Usuarios:{
    filtered: ['nombre','ap_paterno','ap_materno','fecha_nacimiento','genero','fecha_inscripcion','fecha_alta','rfc','curp','nss','tel_cel','tel_cel3','email','password','tipo_sangre','licencia','alergias','padecimientos','nacionalidad','calle','numero','colonia','cp','municipio','ciudad','pais','referencia_direccion','comment','last_login','status','status2','abonos','carritos','compras','creditos','gastos','historiales','locals','metodo_pagos','tipo_rol','ventas','access','camiones'],
    relation: ['abonos','carritos','compras','creditos','gastos','locals','metodo_pagos','ventas','camiones']
  },
  Vendedores:{
    filtered: ['nombre','ventas'],
    relation: ['ventas']
  },
  Ventas:{
    filtered: ['monto','monto_total','fecha','factura','clasificacion','fecha_entrega','entrega_pendiente','pagada','status','status2','carritos','local','metodo_pagos','rutas','usuario','vendedores'],
    relation: ['local','usuario','carritos','metodo_pagos','rutas','vendedores']
  }
}

const relationsValues = {
  "placa.placa": {
    '==': async () => {},
  },
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
      const credit = await strapi.query('credito').model.find({intereses:{ $gt: min }});
      if (credit.length > 0) {
        const credits = credit.map(object => object.id)
        return {$in: credits};
      }
    },
    '>=': async (min) => {
      const credit = await strapi.query('credito').model.find({intereses:{ $gte: min }});
      if (credit.length > 0) {
        const credits = credit.map(object => object.id)
        return {$in: credits};
      }
    },
    '<': async (max) => {
      const credit = await strapi.query('credito').model.find({intereses:{ $lt: max }});
      if (credit.length > 0) {
        const credits = credit.map(object => object.id)
        return {$in: credits};
      }
    },
    '<=': async (max) => {
      const credit = await strapi.query('credito').model.find({intereses:{ $lte: max }});
      if (credit.length > 0) {
        const credits = credit.map(object => object.id)
        return {$in: credits};
      }
    },
    '==': async(value) => {
      const credit= await strapi.query('credito').model.find({intereses: value});
      if(credit.length > 0){
        const credits = credit.map(object => object.id)
        return {$in: credits}
      }
    },
    '!=': async(value) => {
      const credit= await strapi.query('credito').model.find({intereses: { $ne: value }});
      if(credit.length > 0){
        const credits = credit.map(object => object.id)
        return {$in: credits}
      }
    },
    'range': async (min,max) => {
      const credit = await strapi.query('credito').model.find({intereses:{$gte:min, $lte: max }});
      if (credit.length > 0) {
        const credits = credit.map(object => object.id)
        return {$in: credits};
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
    '==': async(value) => {
      const sale= await strapi.query('venta').model.find({monto: value});
      if(sale.length > 0){
        const sales = sale.map(object => object.id)
        return {$in: sales}
      }
    },
    '!=': async(value) => {
      const sale= await strapi.query('venta').model.find({monto: { $ne: value }});
      if(sale.length > 0){
        const sales = sale.map(object => object.id)
        return {$in: sales}
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
    '==': async(value) => {
      const lot= await strapi.query('lote').model.find({codigo_interno: value});
      if(lot.length > 0){
        const lots = lot.map(object => object.id)
        return {$in: lots}
      }
    },
    '!=': async(value) => {
      const lot= await strapi.query('lote').model.find({codigo_interno: { $ne: value }});
      if(lot.length > 0){
        const lots = lot.map(object => object.id)
        return {$in: lots}
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
    '==': async(value) => {
      const payment_method= await strapi.query('metodo_pago').model.find({numero_tarjeta: value});
      if(payment_method.length > 0){
        const method = payment_method.map(object => object.id)
        return {$in: method}
      }
    },
    '!=': async(value) => {
      const payment_method= await strapi.query('metodo_pago').model.find({numero_tarjeta: { $ne: value }});
      if(payment_method.length > 0){
        const method = payment_method.map(object => object.id)
        return {$in: method}
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
  abonos: {
    '>': async (min) => {
      const payments = await strapi.query('abonos').model.find({cantidad_abono:{ $gt: min }});
      if (payments.length > 0) {
        const payment = payments.map(object => object.id)
        return {$in: payment};
      }
    },
    '>=': async (min) => {
      const payments = await strapi.query('abonos').model.find({cantidad_abono:{ $gte: min }});
      if (payments.length > 0) {
        const payment = payments.map(object => object.id)
        return {$in: payment};
      }
    },
    '<': async (max) => {
      const payments = await strapi.query('abonos').model.find({cantidad_abono:{ $lt: max }});
      if (payments.length > 0) {
        const payment = payments.map(object => object.id)
        return {$in: payment};
      }
    },
    '<=': async (max) => {
      const payments = await strapi.query('abonos').model.find({cantidad_abono:{ $lte: max }});
      if (payments.length > 0) {
        const payment = payments.map(object => object.id)
        return {$in: payment};
      }
    },
    '==': async(value) => {
      const payments= await strapi.query('abonos').model.find({cantidad_abono: value});
      if(payments.length > 0){
        const payment = payments.map(object => object.id)
        return {$in: payment}
      }
    },
    '!=': async(value) => {
      const payments= await strapi.query('abonos').model.find({cantidad_abono: { $ne: value }});
      if(payments.length > 0){
        const payment = payments.map(object => object.id)
        return {$in: payment}
      }
    },
    'range': async (min,max) => {
      const payments = await strapi.query('abonos').model.find({cantidad_abono:{$gte:min, $lte: max }});
      if (payments.length > 0) {
        const payment = payments.map(object => object.id)
        return {$in: payment};
      }
    }
  },
  camions:{
    '==': async(value) => {
      const trucks= await strapi.query('camions').model.find({num_serie: value});
      if(trucks.length > 0){
        const truck = trucks.map(object => object.id)
        return {$in: truck}
      }
    },
    '!=': async(value) => {
      const trucks= await strapi.query('camions').model.find({num_serie: { $ne: value }});
      if(trucks.length > 0){
        const truck = trucks.map(object => object.id)
        return {$in: truck}
      }
    },
    'contain': async (value) => {
      const trucks = await strapi.query('camions').model.find({num_serie:{$regex: new RegExp(value, 'i')}});
      if(trucks.length > 0){
        const truck = trucks.map(object => object.id)
        return {$in: truck}
      }
    }
  },
  camiones:{
    '==': async(value) => {
      const trucks= await strapi.query('camiones').model.find({num_serie: value});
      if(trucks.length > 0){
        const truck = trucks.map(object => object.id)
        return {$in: truck}
      }
    },
    '!=': async(value) => {
      const trucks= await strapi.query('camiones').model.find({num_serie: { $ne: value }});
      if(trucks.length > 0){
        const truck = trucks.map(object => object.id)
        return {$in: truck}
      }
    },
    'contain': async (value) => {
      const trucks = await strapi.query('camiones').model.find({num_serie:{$regex: new RegExp(value, 'i')}});
      if(trucks.length > 0){
        const truck = trucks.map(object => object.id)
        return {$in: truck}
      }
    }
  },
  ventas: {
    '>': async (min) => {
      const sales = await strapi.query('ventas').model.find({monto:{ $gt: min }});
      if (sales.length > 0) {
        const sale = sales.map(object => object.id)
        return {$in: sale};
      }
    },
    '>=': async (min) => {
      const sales = await strapi.query('ventas').model.find({monto:{ $gte: min }});
      if (sales.length > 0) {
        const sale = sales.map(object => object.id)
        return {$in: sale};
      }
    },
    '<': async (max) => {
      const sales = await strapi.query('ventas').model.find({monto:{ $lt: max }});
      if (sales.length > 0) {
        const sale = sales.map(object => object.id)
        return {$in: sale};
      }
    },
    '<=': async (max) => {
      const sales = await strapi.query('ventas').model.find({monto:{ $lte: max }});
      if (sales.length > 0) {
        const sale = sales.map(object => object.id)
        return {$in: sale};
      }
    },
    '==': async(value) => {
      const sales= await strapi.query('ventas').model.find({monto: value});
      if(sales.length > 0){
        const sale = sales.map(object => object.id)
        return {$in: sale}
      }
    },
    '!=': async(value) => {
      const sales= await strapi.query('ventas').model.find({monto: { $ne: value }});
      if(sales.length > 0){
        const sale = sales.map(object => object.id)
        return {$in: sale}
      }
    },
    'range': async (min,max) => {
      const sales = await strapi.query('ventas').model.find({monto:{$gte:min, $lte: max }});
      if (sales.length > 0) {
        const sale = sales.map(object => object.id)
        return {$in: sale};
      }
    }
  },
  compras: {
    '>': async (min) => {
      const shopping_cost = await strapi.query('compras').model.find({costo:{ $gt: min }});
      if (shopping_cost.length > 0) {
        const shopping = shopping_cost.map(object => object.id)
        return {$in: shopping};
      }
    },
    '>=': async (min) => {
      const shopping_cost = await strapi.query('compras').model.find({costo:{ $gte: min }});
      if (shopping_cost.length > 0) {
        const shopping = shopping_cost.map(object => object.id)
        return {$in: shopping};
      }
    },
    '<': async (max) => {
      const shopping_cost = await strapi.query('compras').model.find({costo:{ $lt: max }});
      if (shopping_cost.length > 0) {
        const shopping = shopping_cost.map(object => object.id)
        return {$in: shopping};
      }
    },
    '<=': async (max) => {
      const shopping_cost = await strapi.query('compras').model.find({costo:{ $lte: max }});
      if (shopping_cost.length > 0) {
        const shopping = shopping_cost.map(object => object.id)
        return {$in: shopping};
      }
    },
    '==': async(value) => {
      const shopping_cost= await strapi.query('compras').model.find({costo: value});
      if(shopping_cost.length > 0){
        const shopping = shopping_cost.map(object => object.id)
        return {$in: shopping}
      }
    },
    '!=': async(value) => {
      const shopping_cost= await strapi.query('compras').model.find({costo: { $ne: value }});
      if(shopping_cost.length > 0){
        const shopping = shopping_cost.map(object => object.id)
        return {$in: shopping}
      }
    },
    'range': async (min,max) => {
      const shopping_cost = await strapi.query('compras').model.find({costo:{$gte:min, $lte: max }});
      if (shopping_cost.length > 0) {
        const shopping = shopping_cost.map(object => object.id)
        return {$in: shopping};
      }
    }
  },
  products:{
    '==': async(value) => {
      const product= await strapi.query('producto').model.find({nombre: value});
      if(product.length > 0){
        const produc = product.map(object => object.id)
        return {$in: produc}
      }
    },
    '!=': async(value) => {
      const product= await strapi.query('producto').model.find({nombre: { $ne: value }});
      if(product.length > 0){
        const produc = product.map(object => object.id)
        return {$in: produc}
      }
    },
    'contain': async (value) => {
      const product = await strapi.query('producto').model.find({nombre:{$regex: new RegExp(value, 'i')}});
      if(product.length > 0){
        const produc = product.map(object => object.id)
        return {$in: produc}
      }
    }
  },
  creditos: {
    '>': async (min) => {
      const credits_limit = await strapi.query('credito').model.find({limite:{ $gt: min }});
      if (credits_limit.length > 0) {
        const credits = credits_limit.map(object => object.id)
        return {$in: credits};
      }
    },
    '>=': async (min) => {
      const credits_limit = await strapi.query('credito').model.find({limite:{ $gte: min }});
      if (credits_limit.length > 0) {
        const credits = credits_limit.map(object => object.id)
        return {$in: credits};
      }
    },
    '<': async (max) => {
      const credits_limit = await strapi.query('credito').model.find({limite:{ $lt: max }});
      if (credits_limit.length > 0) {
        const credits = credits_limit.map(object => object.id)
        return {$in: credits};
      }
    },
    '<=': async (max) => {
      const credits_limit = await strapi.query('credito').model.find({limite:{ $lte: max }});
      if (credits_limit.length > 0) {
        const credits = credits_limit.map(object => object.id)
        return {$in: credits};
      }
    },
    '==': async(value) => {
      const credits_limit= await strapi.query('credito').model.find({limite: value});
      if(credits_limit.length > 0){
        const credits = credits_limit.map(object => object.id)
        return {$in: credits}
      }
    },
    '!=': async(value) => {
      const credits_limit= await strapi.query('credito').model.find({limite: { $ne: value }});
      if(credits_limit.length > 0){
        const credits = credits_limit.map(object => object.id)
        return {$in: credits}
      }
    },
    'range': async (min,max) => {
      const credits_limit = await strapi.query('credito').model.find({limite:{$gte:min, $lte: max }});
      if (credits_limit.length > 0) {
        const credits = credits_limit.map(object => object.id)
        return {$in: credits};
      }
    }
  },
  carritos: {
    '>': async (min) => {
      const carts_quantity = await strapi.query('carritos').model.find({cantidad:{ $gt: min }});
      if (carts_quantity.length > 0) {
        const quantity = carts_quantity.map(object => object.id)
        return {$in: quantity};
      }
    },
    '>=': async (min) => {
      const carts_quantity = await strapi.query('carritos').model.find({cantidad:{ $gte: min }});
      if (carts_quantity.length > 0) {
        const quantity = carts_quantity.map(object => object.id)
        return {$in: quantity};
      }
    },
    '<': async (max) => {
      const carts_quantity = await strapi.query('carritos').model.find({cantidad:{ $lt: max }});
      if (carts_quantity.length > 0) {
        const quantity = carts_quantity.map(object => object.id)
        return {$in: quantity};
      }
    },
    '<=': async (max) => {
      const carts_quantity = await strapi.query('carritos').model.find({cantidad:{ $lte: max }});
      if (carts_quantity.length > 0) {
        const quantity = carts_quantity.map(object => object.id)
        return {$in: quantity};
      }
    },
    '==': async(value) => {
      const carts_quantity= await strapi.query('carritos').model.find({cantidad: value});
      if(carts_quantity.length > 0){
        const quantity = carts_quantity.map(object => object.id)
        return {$in: quantity}
      }
    },
    '!=': async(value) => {
      const carts_quantity= await strapi.query('carritos').model.find({cantidad: { $ne: value }});
      if(carts_quantity.length > 0){
        const quantity = carts_quantity.map(object => object.id)
        return {$in: quantity}
      }
    },
    'range': async (min,max) => {
      const carts_quantity = await strapi.query('carritos').model.find({cantidad:{$gte:min, $lte: max }});
      if (carts_quantity.length > 0) {
        const quantity = carts_quantity.map(object => object.id)
        return {$in: quantity};
      }
    }
  },
  lotes: {
    '>': async (min) => {
      const batches_internal_code = await strapi.query('lotes').model.find({internal_code:{ $gt: min }});
      if (batches_internal_code.length > 0) {
        const batches_internal = batches_internal_code.map(object => object.id)
        return {$in: batches_internal};
      }
    },
    '>=': async (min) => {
      const batches_internal_code = await strapi.query('lotes').model.find({internal_code:{ $gte: min }});
      if (batches_internal_code.length > 0) {
        const batches_internal = batches_internal_code.map(object => object.id)
        return {$in: batches_internal};
      }
    },
    '<': async (max) => {
      const batches_internal_code = await strapi.query('lotes').model.find({internal_code:{ $lt: max }});
      if (batches_internal_code.length > 0) {
        const batches_internal = batches_internal_code.map(object => object.id)
        return {$in: batches_internal};
      }
    },
    '<=': async (max) => {
      const batches_internal_code = await strapi.query('lotes').model.find({internal_code:{ $lte: max }});
      if (batches_internal_code.length > 0) {
        const batches_internal = batches_internal_code.map(object => object.id)
        return {$in: batches_internal};
      }
    },
    '==': async(value) => {
      const batches_internal_code= await strapi.query('lotes').model.find({internal_code: value});
      if(batches_internal_code.length > 0){
        const batches_internal = batches_internal_code.map(object => object.id)
        return {$in: batches_internal}
      }
    },
    '!=': async(value) => {
      const batches_internal_code= await strapi.query('lotes').model.find({internal_code: { $ne: value }});
      if(batches_internal_code.length > 0){
        const batches_internal = batches_internal_code.map(object => object.id)
        return {$in: batches_internal}
      }
    },
    'range': async (min,max) => {
      const batches_internal_code = await strapi.query('lotes').model.find({internal_code:{$gte:min, $lte: max }});
      if (batches_internal_code.length > 0) {
        const batches_internal = batches_internal_code.map(object => object.id)
        return {$in: batches_internal};
      }
    }
  },
  locals:{
    '==': async(value) => {
      const locals= await strapi.query('locals').model.find({nombre: value});
      if(locals.length > 0){
        const loc = locals.map(object => object.id)
        return {$in: loc}
      }
    },
    '!=': async(value) => {
      const locals= await strapi.query('locals').model.find({nombre: { $ne: value }});
      if(locals.length > 0){
        const loc = locals.map(object => object.id)
        return {$in: loc}
      }
    },
    'contain': async (value) => {
      const locals = await strapi.query('locals').model.find({nombre:{$regex: new RegExp(value, 'i')}});
      if(locals.length > 0){
        const loc = locals.map(object => object.id)
        return {$in: loc}
      }
    }
  },
  metodo_pagos: {
    '>': async (min) => {
      const payment_methods_holder = await strapi.query('metodo_pagos').model.find({numero_tarjeta:{ $gt: min }});
      if (payment_methods_holder.length > 0) {
        const method = payment_methods_holder.map(object => object.id)
        return {$in: method};
      }
    },
    '>=': async (min) => {
      const payment_methods_holder = await strapi.query('metodo_pagos').model.find({numero_tarjeta:{ $gte: min }});
      if (payment_methods_holder.length > 0) {
        const method = payment_methods_holder.map(object => object.id)
        return {$in: method};
      }
    },
    '<': async (max) => {
      const payment_methods_holder = await strapi.query('metodo_pagos').model.find({numero_tarjeta:{ $lt: max }});
      if (payment_methods_holder.length > 0) {
        const method = payment_methods_holder.map(object => object.id)
        return {$in: method};
      }
    },
    '<=': async (max) => {
      const payment_methods_holder = await strapi.query('metodo_pagos').model.find({numero_tarjeta:{ $lte: max }});
      if (payment_methods_holder.length > 0) {
        const method = payment_methods_holder.map(object => object.id)
        return {$in: method};
      }
    },
    '==': async(value) => {
      const payment_methods_holder= await strapi.query('metodo_pagos').model.find({numero_tarjeta: value});
      if(payment_methods_holder.length > 0){
        const method = payment_methods_holder.map(object => object.id)
        return {$in: method}
      }
    },
    '!=': async(value) => {
      const payment_methods_holder= await strapi.query('metodo_pagos').model.find({numero_tarjeta: { $ne: value }});
      if(payment_methods_holder.length > 0){
        const method = payment_methods_holder.map(object => object.id)
        return {$in: method}
      }
    },
    'range': async (min,max) => {
      const payment_methods_holder = await strapi.query('metodo_pagos').model.find({numero_tarjeta:{$gte:min, $lte: max }});
      if (payment_methods_holder.length > 0) {
        const method = payment_methods_holder.map(object => object.id)
        return {$in: method};
      }
    }
  },
  vendedores:{
    '==': async(value) => {
      const sellers_name= await strapi.query('vendedores').model.find({nombre: value});
      if(sellers_name.length > 0){
        const sellers = sellers_name.map(object => object.id)
        return {$in: sellers}
      }
    },
    '!=': async(value) => {
      const sellers_name= await strapi.query('vendedores').model.find({nombre: { $ne: value }});
      if(sellers_name.length > 0){
        const sellers = sellers_name.map(object => object.id)
        return {$in: sellers}
      }
    },
    'contain': async (value) => {
      const sellers_name = await strapi.query('vendedores').model.find({nombre:{$regex: new RegExp(value, 'i')}});
      if(sellers_name.length > 0){
        const sellers = sellers_name.map(object => object.id)
        return {$in: sellers}
      }
    }
  },
}
module.exports = {
  collections,
  relationsValues
}
