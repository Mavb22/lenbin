module.exports = {
  definition: `
    type ProductEdge{
        node: Productos
        cursor: ID!
    }
    type ProductConnection{
        totalCount: Int!
        edges: [ProductEdge!]!
        pageInfo: PageInfo!
    }
  `,
  query: `
     paginationProduct(
        start: Int!,
        limit: Int!,
        nombre: String,
        peso_neto: Float,
        presentacion: String,
        marca: String,
        descripcion_generica: String,
        precio: Float,
        costo: Float,
        inventario_disp: Long,
        value_min: Int,
        codigo_barras: Long,
        codigoInterno: Long,
        venta_gramos: Float,
        status: Boolean,
        status2: String,
        dimension_nombre: String,
        carritos_cantidad: Float,
        promociones_fecha_creacion:DateTime,
        lotes_codigo_interno:Long,
     ): ProductConnection
  `,
  resolver: {
    Query: {
      paginationProduct: async (
        obj, {
          start,
          limit,
          nombre,
          peso_neto,
          presentacion,
          marca,
          descripcion_generica,
          precio,
          costo,
          inventario_disp,
          value_min,
          codigo_barras,
          codigo_interno,
          venta_gramos,
          status,
          status2,
          dimension_nombre,
          carritos_cantidad,
          promociones_fecha_creacion,
          lotes_codigo_interno,
        }
      ) => {
        const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
        const query = {
          ...(nombre && {
            nombre2: {
              $regex: RegExp(nombre, "i"),
            },
          }),
          ...(peso_neto &&
            !isNaN(parseInt(peso_neto)) && {
              peso_neto2: parseInt(peso_neto),
            }),
          ...(presentacion && {
            presentacion2: {
              $regex: RegExp(presentacion, "i"),
            },
          }),
          ...(marca && {
            marca2: {
              $regex: RegExp(marca, "i"),
            },
          }),
          ...(descripcion_generica && {
            descripcion_generica2: {
              $regex: RegExp(descripcion_generica, "i"),
            },
          }),
          ...(precio && !isNaN(parseFloat(precio)) && {
              precio2: parseFloat(precio),
            }),
          ...(costo && !isNaN(parseFloat(costo)) && {
              costo2: costo,
            }),
          ...(inventario_disp && !isNaN(parseInt(inventario_disp)) && {
              inventario_disp2: inventario_disp,
            }),
          ...(value_min && !isNaN(parseInt(value_min)) && {
              value_min2: parseInt(value_min),
            }),
          ...(codigo_barras && !isNaN(parseInt(codigo_barras)) && {
            codigo_barras2: parseInt(codigo_barras),
          }),
          ...(codigo_interno && !isNaN(parseInt(codigo_interno))) && {
            codigo_interno2: parseInt(codigo_interno),
          },
          ...(venta_gramos && !isNaN(parseFloat(venta_gramos))) && {
            venta_gramos: parseFloat(venta_gramos),
          },
          ...(status &&  {
            status: status,
          }),
          ...(status2 &&  {
            status2: {
              $regex: RegExp(status2, "i"),
            }
          }),
          ...(dimension_nombre && {
            dimension_nombre: {
              $regex: RegExp(dimension_nombre, "i"),
            }
          }),
          ...(carritos_cantidad && !isNaN(parseFloat(carritos_cantidad))) && {
            "carritos.cantidad": parseFloat(carritos_cantidad),
          },
          ...(promociones_fecha_creacion && {
            "promociones.fecha_creacion": promociones_fecha_creacion,
          }),
          ...(lotes_codigo_interno && !isNaN(parseInt(lotes_codigo_interno)) )&& {
            "lotes.codigo_interno": parseInt(lotes_codigo_interno)
          },
        };
        const Products = await strapi.query("productos").find(query);
        const edges = Products.slice(
          startIndex,
          startIndex + parseInt(limit)
        ).map((Product) => ({
          node: Product,
          cursor: Product.id,
        }));
        const pageInfo = {
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage: startIndex + parseInt(limit) < Products.length,
          hasPreviousPage: startIndex > 0,
        };
        return {
          totalCount: Products.length,
          edges,
          pageInfo,
        };
      },
    },
  },
};
