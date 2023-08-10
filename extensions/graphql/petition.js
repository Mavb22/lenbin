const pagination = require("../controllers/pagination");
const petition = {
  abonos: async (query,type,  fieldsToShow,startIndex = 0, limit = 20) => {
    if(type === "Filter"){
      let payments = await strapi.query('abonos').model.find(query)
        .populate({
          path: 'usuario',
          select: 'id nombre ap_paterno ap_materno'
        })
        .populate({
          path: 'credito',
          select: 'id intereses'
        });
      const paymentsRelations = await Promise.all(
        payments.map(async (payment) => {
          const usuario = await strapi.query('usuarios').model
            .findById(payment.usuario)
            .select('id nombre ap_paterno ap_materno');
          const credito = await strapi.query('credito').model
            .findById(payment.credito)
            .select('id intereses');
          return {
            id: payment.id,
            cantidad_abono: payment.cantidad_abono,
            fecha_abono: payment.fecha_abono,
            estado_abono: payment.estado_abono,
            usuario,
            credito,
          };
        })
      );
      const {
        edges,
        pageInfo
      } = pagination.search(paymentsRelations, startIndex, limit)
      return {
        totalCount: payments.length,
        edges,
        pageInfo,
        payments
      };
    } else if(type === "Export"){
      let populateOptions = [];
      if (fieldsToShow.includes('usuario')) {
        populateOptions.push({
          path: 'usuario',
          select: 'id nombre ap_paterno ap_materno'
        });
      }
      if (fieldsToShow.includes('credito')) {
        populateOptions.push({
          path: 'credito',
          select: 'id intereses'
        });
      }
      const payments = await strapi.query('abonos').model.find(query, fieldsToShow.join(' ')).populate(populateOptions);
      return payments
    }
  },
  truck: async (query, startIndex, limit) => {
    let trucks = await strapi.query('camiones').model.find(query)
      .populate({
        path: 'usuario',
        select: 'id nombre ap_paterno ap_materno'
      })
    // .populate({
    //   path: 'credito',
    //   select: 'id intereses'
    // });
    trucks = await Promise.all(
      trucks.map(async (truck) => {
        const user = await strapi.query('usuarios').model
          .findById(truck.usuario)
          .select('id nombre ap_paterno ap_materno');
        return {
          id: truck.id,
          cantidad_abono: truck.cantidad_abono,
          fecha_abono: truck.fecha_abono,
          estado_abono: truck.estado_abono,
          usuario: user,
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(carts, startIndex, limit)
    return {
      totalCount: payments.length,
      edges,
      pageInfo,
    };
  },
  carrito: async (query, startIndex = 0, limit = 20) => {
    let carts = await strapi.query('carrito').model.find(query)
      .populate({
        path: 'usuario',
        select: 'id nombre'
      })
      .populate({
        path: 'productos',
        select: 'id nombre'
      })
      .populate({
        path: 'venta',
        select: 'id monto'
      });
    const cartsRelations = await Promise.all(
      carts.map(async (cart) => {
        const usuario = await strapi.query('usuario').model
          .findById(cart.usuario)
          .select('id nombre ap_paterno ap_materno');
        const productos = await strapi.query('productos').model
          .findById(cart.productos)
          .select('id productos')
        const venta = await strapi.query('venta').model
          .findById(cart.venta)
          .select('id monto');
        return {
          id: cart.id,
          cantidad: cart.cantidad,
          productos: cart.productos,
          usuario,
          productos,
          venta

        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(cartsRelations, startIndex, limit)
    return {
      totalCount: carts.length,
      edges,
      pageInfo,
    };
  },

  compras: async (query, startIndex = 0, limit = 20) => {
    let shopping = await strapi.query('campras').model.find(query)
      .populate({
        path: 'usuarios',
        select: 'id nombre'
      })
      .populate({
        path: 'proveedor',
        select: 'id nombre'
      })
      .populate({
        path: 'metodo_pago',
        select: 'id numero_tarjeta'
      })
      .populate({
        path: 'lote',
        select: 'id codigo_interno'
      });
    const shoppingRelations = await Promise.all(
      shopping.map(async (shoppin) => {
        const usuarios = await strapi.query('usuarios').model
          .findById(shoppin.usuarios)
          .select('id nombre')
        const proveedor = await strapi.query('proveedor').model
          .findById(shoppin.proveedor)
          .select('id nombre')
        const metodo_pago = await strapi.query('metodo_pago').model
          .findById(shoppin.metodo_pago)
          .select('id numero_tarjeta')
        const lote = await strapi.query('lote').model
          .findById(shoppin.lote)
          .select('id codigo_interno');
        return {
          id: shoppin.id,
          costo: shoppin.costo,
          fecha_pedido: shoppin.fecha_pedido,
          referencia: shoppin.referencia,
          fecha_llegada: shoppin.fecha_llegada,
          status: shoppin.status,
          status2: shoppin.status2,
          usuarios,
          proveedor,
          metodo_pago,
          lote

        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(shoppingRelations, startIndex, limit)
    return {
      totalCount: shopping.length,
      edges,
      pageInfo,
    };
  },

  credito: async (query, startIndex = 0, limit = 20) => {
    let credit = await strapi.query('campras').model.find(query)
      .populate({
        path: 'usuario',
        select: 'id nombre'
      })
      .populate({
        path: 'abonos',
        select: 'id cantidad_abono'
      })
      .populate({
        path: 'metodo_pago',
        select: 'id numero_tarjeta'
      });
    const creditRelations = await Promise.all(
      credit.map(async (credi) => {
        const usuario = await strapi.query('usuarios').model
          .findById(credi.usuario)
          .select('id nombre')
        const metodo_pago = await strapi.query('metodo_pago').model
          .findById(credi.metodo_pago)
          .select('id numero_tarjeta')
        const abonos = await strapi.query('abonos').model
          .findById(credi.abonos)
          .select('id cantidad_abono');
        return {
          id: credi.id,
          limite: credi.limite,
          fecha_alta: credi.fecha_alta,
          fecha_baja: credi.fecha_baja,
          intereses: credi.intereses,
          status: credi.status,
          status2: credi.status2,
          usuario,
          metodo_pago,
          abonos

        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(creditRelations, startIndex, limit)
    return {
      totalCount: credit.length,
      edges,
      pageInfo,
    };
  },

  dimensiones: async (query, startIndex = 0, limit = 20) => {
    let dimensions = await strapi.query('dimensiones').model.find(query)
      .populate({
        path: 'productos',
        select: 'id nombre'
      });
    const dimensionsRelations = await Promise.all(
      dimensions.map(async (dimension) => {
        const productos = await strapi.query('productos').model
          .findById(dimension.productos)
          .select('id nombre')
        return {
          id: dimension.id,
          nombre: dimension.nombre,
          ancho: dimension.ancho,
          alto: dimension.alto,
          largo: dimension.largo,
          productos

        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(dimensionsRelations, startIndex, limit)
    return {
      totalCount: dimensions.length,
      edges,
      pageInfo,
    };
  },

  gastos: async (query, startIndex = 0, limit = 20) => {
    let spents = await strapi.query('gastos').model.find(query)
      .populate({
        path: 'usuario',
        select: 'id nombre'
      })
      .populate({
        path: 'camions',
        select: 'id num_serie'
      });
    const spentsRelations = await Promise.all(
      spents.map(async (spent) => {
        const usuario = await strapi.query('usuarios').model
          .findById(spent.usuario)
          .select('id nombre')
        const camions = await strapi.query('camions').model
          .findById(spent.camions)
          .select('id num_serie')
        return {
          id: spent.id,
          description: spent.description,
          fecha: spent.fecha,
          monto: spent.monto,
          categoria: spent.categoria,
          status: spent.status,
          usuario,
          camions,

        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(spentsRelations, startIndex, limit)
    return {
      totalCount: spents.length,
      edges,
      pageInfo,
    };
  },

  historial: async (query, startIndex = 0, limit = 20) => {
    let records = await strapi.query('historial').model.find(query)
      .populate({
        path: 'usuario',
        select: 'id nombre'
      })
      .populate({
        path: 'camiones',
        select: 'id num_serie'
      });
    const recordsRelations = await Promise.all(
      records.map(async (records) => {
        const usuario = await strapi.query('usuarios').model
          .findById(records.usuario)
          .select('id nombre')
        const camiones = await strapi.query('camiones').model
          .findById(records.camiones)
          .select('id num_serie')
        return {
          id: records.id,
          fecha: records.fecha,
          hora_inicio: records.hora_inicio,
          hora_fin: records.hora_fin,
          status: records.status,
          status2: records.status2,
          usuario,
          camiones,

        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(recordsRelations, startIndex, limit)
    return {
      totalCount: spents.length,
      edges,
      pageInfo,
    };
  },

  local: async (query, startIndex = 0, limit = 20) => {
    let store = await strapi.query('local').model.find(query)
      .populate({
        path: 'usuarios',
        select: 'id nombre'
      })
      .populate({
        path: 'ventas',
        select: 'id monto'
      });
    const storeRelations = await Promise.all(
      store.map(async (stor) => {
        const usuarios = await strapi.query('usuarios').model
          .findById(stor.usuarios)
          .select('id nombre')
        const ventas = await strapi.query('ventas').model
          .findById(stor.monto)
          .select('id num_serie')
        return {
          id: stor.id,
          nombre: stor.nombre,
          alias: stor.alias,
          razon_social: stor.razon_social,
          rfc: stor.rfc,
          fecha_alta: stor.fecha_alta,
          calle: stor.calle,
          colonia: stor.colonia,
          numero_ext: stor.numero_ext,
          municipio: stor.municipio,
          numero_int: stor.numero_int,
          ciudad: stor.ciudad,
          cp: stor.cp,
          longitud: stor.longitud,
          telefono: stor.telefono,
          telefono_cel: stor.telefono_cel,
          giro: stor.giro,
          status: stor.status,
          status2: stor.status2,
          usuarios,
          ventas,
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(storeRelations, startIndex, limit)
    return {
      totalCount: store.length,
      edges,
      pageInfo,
    };
  },

  lotes: async (query, startIndex = 0, limit = 20) => {
    let lots = await strapi.query('lotes').model.find(query)
      .populate({
        path: 'compras',
        select: 'id costo'
      })
      .populate({
        path: 'products',
        select: 'id nombre'
      });
    const lotsRelations = await Promise.all(
      lots.map(async (lot) => {
        const compras = await strapi.query('compras').model
          .findById(lot.compras)
          .select('id costo')
        const products = await strapi.query('products').model
          .findById(lot.products)
          .select('id nombre')
        return {
          id: lot.id,
          codigo_interno: lot.codigo_interno,
          fecha_arrivo: lot.fecha_arrivo,
          fecha_caducidad: lot.fecha_caducidad,
          fecha_adquisicion: lot.fecha_adquisicion,
          costo: lot.costo,
          compras,
          products
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(lotsRelations, startIndex, limit)
    return {
      totalCount: lots.length,
      edges,
      pageInfo,
    };
  },

  metodopago: async (query, startIndex = 0, limit = 20) => {
    let paymentMethod = await strapi.query('metodopago').model.find(query)
      .populate({
        path: 'usuario',
        select: 'id nombre'
      })
      .populate({
        path: 'compras',
        select: 'id costo'
      })
      .populate({
        path: 'creditos',
        select: 'id limite'
      })
      .populate({
        path: 'venta',
        select: 'id monto'
      });
    const paymentMethodRelations = await Promise.all(
      paymentMethod.map(async (method) => {
        const usuario = await strapi.query('usuarios').model
          .findById(method.usuario)
          .select('id nombre')
        const compras = await strapi.query('compras').model
          .findById(method.compras)
          .select('id costo')
        const creditos = await strapi.query('creditos').model
          .findById(method.creditos)
          .select('id limite')
        const venta = await strapi.query('venta').model
          .findById(method.venta)
          .select('id monto');
        return {
          id: method.id,
          codigo_interno: method.codigo_interno,
          fecha_arrivo: method.fecha_arrivo,
          fecha_caducidad: method.fecha_caducidad,
          fecha_adquisicion: method.fecha_adquisicion,
          costo: method.costo,
          usuario,
          compras,
          creditos,
          venta
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(paymentMethodRelations, startIndex, limit)
    return {
      totalCount: paymentMethod.length,
      edges,
      pageInfo,
    };
  },

  productos: async (query, startIndex = 0, limit = 20) => {
    let Product = await strapi.query('lotes').model.find(query)
      .populate({
        path: 'carritos',
        select: 'id cantidad'
      })
      .populate({
        path: 'proveedor',
        select: 'id nombre'
      })
      .populate({
        path: 'lotes',
        select: 'id internal_code'
      })
      .populate({
        path: 'promociones',
        select: 'id fecha_creacion'
      });
    const ProductRelations = await Promise.all(
      Product.map(async (Produc) => {
        const carritos = await strapi.query('carritos').model
          .findById(Produc.carritos)
          .select('id cantidad')
        const proveedor = await strapi.query('proveedor').model
          .findById(Produc.proveedor)
          .select('id nombre')
        const lotes = await strapi.query('lotes').model
          .findById(Produc.lotes)
          .select('id internal_code')
        const promociones = await strapi.query('promociones').model
          .findById(Produc.promociones)
          .select('id fecha_creacion');
        return {
          id: Produc.id,
          nombre: Produc.nombre,
          peso_neto: Produc.peso_neto,
          presentacion: Produc.presentacion,
          marca: Produc.marca,
          descripcion_generica: Produc.descripcion_generica,
          precio: Produc.precio,
          costo: Produc.costo,
          inventario_disp: Produc.inventario_disp,
          value_min: Produc.value_min,
          codigo_barras: Produc.codigo_barras,
          codigo_interno: Produc.codigo_interno,
          venta_gramos: Produc.venta_gramos,
          status: Produc.status,
          status2: Produc.status2,
          carritos: Produc.carritos,
          dimension: Produc.dimension,
          carritos,
          promociones,
          lotes,
          proveedor
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(ProductRelations, startIndex, limit)
    return {
      totalCount: Product.length,
      edges,
      pageInfo,
    };
  },

  promociones: async (query, startIndex = 0, limit = 20) => {
    let promotions = await strapi.query('promociones').model.find(query)
      .populate({
        path: 'productos',
        select: 'id nombre'
      });
    const promotionsRelations = await Promise.all(
      promotions.map(async (promotion) => {
        const productos = await strapi.query('productos').model
          .findById(promotion.productos)
          .select('id nombre')
        return {
          id: promotion.id,
          fecha_creacion: promotion.fecha_creacion,
          fecha_vigencia: promotion.fecha_vigencia,
          valor_descuento: promotion.valor_descuento,
          codigo_ref: promotion.codigo_ref,
          condicion: promotion.condicion,
          productos
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(promotionsRelations, startIndex, limit)
    return {
      totalCount: promotions.length,
      edges,
      pageInfo,
    };
  },

  proveedor: async (query, startIndex = 0, limit = 20) => {
    let provider = await strapi.query('proveedor').model.find(query)
      .populate({
        path: 'compras',
        select: 'id costo'
      })
      .populate({
        path: 'productos',
        select: 'id nombre'
      });
    const providerRelations = await Promise.all(
      provider.map(async (provide) => {
        const compras = await strapi.query('compras').model
          .findById(provide.compras)
          .select('id costo')
        const productos = await strapi.query('productos').model
          .findById(provide.productos)
          .select('id nombre')
        return {
          id: provide.id,
          nombre: provide.nombre,
          razon_social: provide.razon_social,
          rfc: provide.rfc,
          fecha_alta: provide.fecha_alta,
          calle: provide.calle,
          numero: provide.numero,
          colonia: provide.colonia,
          cp: provide.cp,
          municipio: provide.municipio,
          ciudad: provide.ciudad,
          pais: provide.pais,
          visita_programada: provide.visita_programada,
          status: provide.status,
          status2: provide.status2,
          compras,
          productos
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(providerRelations, startIndex, limit)
    return {
      totalCount: provider.length,
      edges,
      pageInfo,
    };
  },

  rutas: async (query, startIndex = 0, limit = 20) => {
    let route = await strapi.query('rutas').model.find(query)
      .populate({
        path: 'camiones',
        select: 'id num_serie'
      })
      .populate({
        path: 'ventas',
        select: 'id monto'
      });
    const routeRelations = await Promise.all(
      route.map(async (rout) => {
        const camiones = await strapi.query('camiones').model
          .findById(rout.camiones)
          .select('id num_serie')
        const ventas = await strapi.query('ventas').model
          .findById(rout.ventas)
          .select('id monto')
        return {
          id: rout.id,
          descripcion: rout.descripcion,
          lugar_origen: rout.lugar_origen,
          destino: rout.destino,
          fecha_salida: rout.fecha_salida,
          fecha_llegada: rout.fecha_llegada,
          referencia: rout.referencia,
          nombre_mercancia_recibida: rout.nombre_mercancia_recibida,
          comentarios: rout.comentarios,
          estado: rout.estado,
          ruta_ciclica: rout.ruta_ciclica,
          camiones,
          ventas
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(routeRelations, startIndex, limit)
    return {
      totalCount: route.length,
      edges,
      pageInfo,
    };
  },

  usuarios: async (query, startIndex = 0, limit = 20) => {
    let users = await strapi.query('usuarios').model.find(query)
      .populate({
        path: 'abonos',
        select: 'id cantidad_abono'
      })
      .populate({
        path: 'carritos',
        select: 'id cantidad'
      })
      .populate({
        path: 'compras',
        select: 'id costo'
      })
      .populate({
        path: 'creditos',
        select: 'id limite'
      })
      .populate({
        path: 'gastos',
        select: 'id descripcion'
      })
      .populate({
        path: 'historiales',
        select: 'id fecha'
      })
      .populate({
        path: 'locals',
        select: 'id nombre'
      })
      .populate({
        path: 'metodo_pagos',
        select: 'id titular'
      })
      .populate({
        path: 'ventas',
        select: 'id monto'
      })
      .populate({
        path: 'camiones',
        select: 'id num_serie'
      });
    const usersRelations = await Promise.all(
      users.map(async (user) => {
        const abonos = await strapi.query('abonos').model
          .findById(user.abonos)
          .select('id cantidad_abono')
        const carritos = await strapi.query('carritos').model
          .findById(user.carritos)
          .select('id cantidad')
        const compras = await strapi.query('compras').model
          .findById(user.compras)
          .select('id costo')
        const creditos = await strapi.query('creditos').model
          .findById(user.creditos)
          .select('id limite')
        const gastos = await strapi.query('gastos').model
          .findById(user.gastos)
          .select('id descripcion')
        const historiales = await strapi.query('historiales').model
          .findById(user.historiales)
          .select('id fecha')
        const locals = await strapi.query('locals').model
          .findById(user.locals)
          .select('id nombre')
        const metodo_pagos = await strapi.query('metodo_pagos').model
          .findById(user.metodo_pagos)
          .select('id titular')
        const ventas = await strapi.query('ventas').model
          .findById(user.ventas)
          .select('id monto')
        const camiones = await strapi.query('camiones').model
          .findById(user.camiones)
          .select('id num_serie')
        return {
          id: user.id,
          nombre: user.nombre,
          ap_paterno: user.ap_paterno,
          ap_materno: user.ap_materno,
          fecha_nacimiento: user.fecha_nacimiento,
          genero: user.genero,
          fecha_inscripcion: user.fecha_inscripcion,
          fecha_alta: user.fecha_alta,
          rfc: user.rfc,
          curp: user.curp,
          nss: user.nss,
          tel_cel: user.tel_cel,
          tel_cel3: user.tel_cel3,
          email: user.email,
          password: user.password,
          tipo_sangre: user.tipo_sangre,
          licencia: user.licencia,
          alergias: user.alergias,
          padecimientos: user.padecimientos,
          nacionalidad: user.nacionalidad,
          calle: user.calle,
          numero: user.numero,
          colonia: user.colonia,
          cp: user.cp,
          municipio: user.municipio,
          ciudad: user.ciudad,
          pais: user.pais,
          referencia_direccion: user.referencia_direccion,
          comment: user.comment,
          last_login: user.last_login,
          status: user.status,
          status2: user.status2,
          access: user.access,
          abonos,
          carritos,
          compras,
          creditos,
          gastos,
          historiales,
          locals,
          metodo_pagos,
          ventas
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(usersRelations, startIndex, limit)
    return {
      totalCount: users.length,
      edges,
      pageInfo,
    };
  },

  vendedores: async (query, startIndex = 0, limit = 20) => {
    let sellers = await strapi.query('vendedores').model.find(query)
      .populate({
        path: 'ventas',
        select: 'id monto'
      });
    const sellersRelations = await Promise.all(
      sellers.map(async (seller) => {
        const ventas = await strapi.query('ventas').model
          .findById(seller.ventas)
          .select('id monto')
        return {
          id: seller.id,
          nombre: seller.nombre,
          ventas
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(sellersRelations, startIndex, limit)
    return {
      totalCount: sellers.length,
      edges,
      pageInfo,
    };
  },

  Ventas: async (query, startIndex = 0, limit = 20) => {
    let sales = await strapi.query('Ventas').model.find(query)
      .populate({
        path: 'local',
        select: 'id nombre'
      })
      .populate({
        path: 'usuario',
        select: 'id nombre'
      })
      .populate({
        path: 'carritos',
        select: 'id cantidad'
      })
      .populate({
        path: 'metodo_pagos',
        select: 'id titular'
      })
      .populate({
        path: 'rutas',
        select: 'id destino'
      })
      .populate({
        path: 'vendedores',
        select: 'id nombre'
      })
    const salesRelations = await Promise.all(
      sales.map(async (sale) => {
        const local = await strapi.query('local').model
          .findById(sale.local)
          .select('id nombre')
        const usuario = await strapi.query('usuario').model
          .findById(sale.usuario)
          .select('id nombre')
        const carritos = await strapi.query('carritos').model
          .findById(sale.carritos)
          .select('id cantidad')
        const metodo_pagos = await strapi.query('metodo_pagos').model
          .findById(sale.metodo_pagos)
          .select('id titular')
        const rutas = await strapi.query('rutas').model
          .findById(sale.rutas)
          .select('id destino')
        const vendedores = await strapi.query('vendedores').model
          .findById(sale.vendedores)
          .select('id nombre')
        return {
          id: sale.id,
          monto: sale.monto,
          monto_total: sale.monto_total,
          fecha: sale.fecha,
          factura: sale.factura,
          clasificacion: sale.clasificacion,
          fecha_entrega: sale.fecha_entrega,
          pagada: sale.pagada,
          status: sale.status,
          status2: sale.status2,
          local,
          usuario,
          carritos,
          metodo_pagos,
          rutas,
          vendedores
        };
      })
    );
    const {
      edges,
      pageInfo
    } = pagination.search(salesRelations, startIndex, limit)
    return {
      totalCount: sales.length,
      edges,
      pageInfo,
    };
  },
}
module.exports = {
  petition
}
