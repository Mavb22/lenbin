const utils = require('../../../extensions/controllers/utils');
const schema = require('../../../extensions/controllers/schemas');
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
          start: Int,
          limit: Int,
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
          provider_name:String
      ):ProductConnection
  `,
  resolver: {
    Query: {
      paginationProduct: async (obj, {
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
        provider_name
      },ctx) => {
        const authorization = ['Administrator','User']
        const token = await utils.authorization(ctx.context.headers.authorization, authorization);
        if(!token){
          throw new Error('No tienes autorización para realizar esta acción.');
        }
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
          ...(status && {
            status: status,
          }),
          ...(status2 && {
            status2: {
              $regex: RegExp(status2, "i"),
            }
          }),
          ...(size_name && {
            "dimension.nombre": {
              $regex: RegExp(size_name, "i"),
            }
          }),
          ...(carts_quantity && !isNaN(parseFloat(carts_quantity))) && {
            "carritos.cantidad": parseFloat(carts_quantity),
          },
          ...(promotions_date_creation && {
            "promociones.fecha_creacion": promotions_date_creation,
          }),
          ...(batches_internal_code && !isNaN(parseInt(batches_internal_code))) && {
            "lotes.codigo_interno": parseInt(batches_internal_code)
          },
          ...(provider_name &&  {
            "proveedor.nombre": RegExp(provider_name, "i"),
          }),
        };
        const product = await strapi.query('productos').find(query);
        const {edges, pageInfo} = schema.search(product,startIndex, limit)
        return {
          totalCount: product.length,
          edges,
          pageInfo,
        };
      }
    }
  }
}
