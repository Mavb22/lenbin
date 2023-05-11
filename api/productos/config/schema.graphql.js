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
        name: String,
        net_weight: Float,
        presentation: String,
        brand: String,
        generic_description: String,
        price: Float,
        cost: Float,
        available_inventory: Long,
        value_min: Int,
        barcode: Long,
        internal_code: Long,
        sale_grams: Float,
        status: Boolean,
        status2: String,
        size_name: String,
        carts_quantity: Float,
        promotions_date_creation:DateTime,
        batches_internal_code:Long,
     ): ProductConnection
  `,
  resolver: {
    Query: {
      paginationProduct: async (
        obj, {
          start,
          limit,
          name,
          net_weight,
          presentation,
          brand,
          generic_description,
          price,
          cost,
          available_inventory,
          value_min,
          barcode,
          internal_code,
          sale_grams,
          status,
          status2,
          size_name,
          carts_quantity,
          promotions_date_creation,
          batches_internal_code,
        }
      ) => {
        const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
        const query = {
          ...(name && {
            nombre: {
              $regex: RegExp(name, "i"),
            },
          }),
          ...(net_weight &&
            !isNaN(parseInt(net_weight)) && {
              peso_neto: parseInt(net_weight),
            }),
          ...(presentation && {
            presentacion: {
              $regex: RegExp(presentation, "i"),
            },
          }),
          ...(brand && {
            marca: {
              $regex: RegExp(brand, "i"),
            },
          }),
          ...(generic_description && {
            descripcion_generica: {
              $regex: RegExp(generic_description, "i"),
            },
          }),
          ...(price && !isNaN(parseFloat(price)) && {
              precio: parseFloat(price),
            }),
          ...(cost && !isNaN(parseFloat(cost)) && {
              costo: cost,
            }),
          ...(available_inventory && !isNaN(parseInt(available_inventory)) && {
              inventario_disp: available_inventory,
            }),
          ...(value_min && !isNaN(parseInt(value_min)) && {
              value_min: parseInt(value_min),
            }),
          ...(barcode && !isNaN(parseInt(barcode)) && {
            codigo_barras: parseInt(barcode),
          }),
          ...(internal_code && !isNaN(parseInt(internal_code))) && {
            codigo_interno: parseInt(internal_code),
          },
          ...(sale_grams && !isNaN(parseFloat(sale_grams))) && {
            venta_gramos: parseFloat(sale_grams),
          },
          ...(status &&  {
            status: status,
          }),
          ...(status2 &&  {
            status2: {
              $regex: RegExp(status2, "i"),
            }
          }),
          ...(size_name && {
            dimension_nombre: {
              $regex: RegExp(size_name, "i"),
            }
          }),
          ...(carts_quantity && !isNaN(parseFloat(carts_quantity))) && {
            "carritos.cantidad": parseFloat(carts_quantity),
          },
          ...(promotions_date_creation && {
            "promociones.fecha_creacion": promotions_date_creation,
          }),
          ...(batches_internal_code && !isNaN(parseInt(batches_internal_code)) )&& {
            "lotes.internal_code": parseInt(batches_internal_code)
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
