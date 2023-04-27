module.exports = {
  definition: `
    type PromotionEdge {
      node: Promociones
      cursor: ID!
    }
    type PromotionConnection {
      totalCount: Int!
      edges: [PromotionEdge!]!
      pageInfo: PageInfo!
    }
  `,
  query: `
    paginationPromotion(
      start: Int!,
      limit: Int!,
      creation_date: DateTime,
      validity_date: DateTime,
      discount_value: Float,
      ref_code: Long,
      condition: String,
      product_name: String
    ): PromotionConnection
  `,
  resolver: {
    Query: {
      paginationPromotion: async (obj, {
        start,
        limit,
        creation_date,
        validity_date,
        discount_value,
        ref_code,
        condition,
        product_name
      }) => {
        const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
        const query = {
          ...(creation_date && {
            fecha_creacion: creation_date
          }),
          ...(validity_date && {
            fecha_vigencia: validity_date
          }),
          ...(discount_value && !isNaN(parseFloat(discount_value))) && {
            valor_descuento: parseFloat(discount_value)
          },
          ...(ref_code && !isNaN(parseInt(ref_code))) && {
            codigo_ref: parseInt(ref_code)
          },
          ...(condition && {
            condicion: {
              $regex: RegExp(condition, 'i')
            }
          }),
          ...(product_name && {
            "productos.nombre": {
              $regex: RegExp(product_name, 'i')
            }
          })
        };
        const promotions = await strapi.query('promociones').find(query);
        const edges = promotions
          .slice(startIndex, startIndex + parseInt(limit))
          .map((promotion) => ({
            node: promotion,
            cursor: promotion.id
          }));
        const pageInfo = {
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage: startIndex + parseInt(limit) < promotions.length,
          hasPreviousPage: startIndex > 0,
        };
        return {
          totalCount: promotions.length,
          edges,
          pageInfo,
        };
      }
    }
  }
}
