module.exports = {
  definition: `
    type RouteEdge {
      node: Rutas
      cursor: ID!
    }
    type RouteConnection {
      totalCount: Int!
      edges: [RouteEdge!]!
      pageInfo: PageInfo!
    }
  `,
  query: `
    paginateRoutes(
      start: Int!,
      limit: Int!,
      description: String,
      origin: String,
      destination: String,
      departure_date: DateTime,
      arrival_date: DateTime,
      reference: String,
      received_goods_name: String,
      comments: String,
      state: String,
      cyclic_route: Boolean,
      trucks_serial_number: String,
      sales_amount: Float,
    ): RouteConnection
  `,
  resolver: {
    Query: {
      paginateRoutes:
      async (obj, {
        start,
        limit,
        description,
        origin,
        destination,
        departure_date,
        arrival_date,
        reference,
        received_goods_name,
        comments,
        state,
        cyclic_route,
        trucks_serial_number,
        sales_amount
      }) => {
        const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
        const query = {
          ...(description && {
            descripcion: {
              $regex: RegExp(description, 'i')
            }
          }),
          ...(origin && {
            lugar_origen: {
              $regex: RegExp(origin, 'i')
            }
          }),
          ...(destination && {
            destino: {
              $regex: RegExp(destination, 'i')
            }
          }),
          ...(departure_date && {
            fecha_salida: departure_date
          }),
          ...(arrival_date && {
            fecha_llegada: arrival_date
          }),
          ...(reference && {
            referencia: {
              $regex: RegExp(reference, 'i')
            }
          }),
          ...(received_goods_name && {
            nombre_mercancia_recibida: {
              $regex: RegExp(received_goods_name, 'i')
            }
          }),
          ...(comments && {
            comentarios: {
              $regex: RegExp(comments, 'i')
            }
          }),
          ...(state && {
            estado: state
          }),
          ...(cyclic_route !== null && {
            ruta_ciclica: cyclic_route
          }),
          ...(trucks_serial_number && {
            "camiones.numero_serie": {
              $regex: RegExp(trucks_serial_number, 'i')
            }
          }),
          ...(sales_amount && !isNaN(parseFloat(sales_amount))) && {
            "ventas.monto": parseFloat(sales_amount)
          }
        };
        const routes = await strapi.query('rutas').find(query);
        const edges = routes
          .slice(startIndex, startIndex + parseInt(limit))
          .map((route) => ({
            node: route,
            cursor: route.id
          }));
        const pageInfo = {
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage: startIndex + parseInt(limit) < routes.length,
          hasPreviousPage: startIndex > 0,
        };
        return {
          totalCount: routes.length,
          edges,
          pageInfo,
        };
      }
    }
  }
}
