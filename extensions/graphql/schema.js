const pagination = require("../controllers/pagination");
const { resolverFilters } = require("./resolverFilters");
module.exports = (tableName,name,table) => {
  const definition = `
    type ${name}Edge{
      node: ${tableName}!
      cursor: ID!
    }

    input Filter${name}Field {
      field: String
      operator: String
      value: String
      min: String
      max: String
    }

    type Filter${name}Connection {
      totalCount: Int!
      edges: [${name}Edge!]!
      pageInfo: PageInfo${name}!
    }

    type PageInfo${name} {
      startCursor: ID
      endCursor: ID
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
    }
  `;
  const query = `
    paginationData${name}(
      start: Int!,
      limit: Int!,
      filters: [Filter${name}Field]
    ): Filter${name}Connection
 `;
  const resolver = {
    Query:{}
  }
  resolver.Query[`paginationData${name}`] = async (obj,{start,limit,filters},{context}) => {
    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
    const query = await resolverFilters(filters,{mostrar:true});
    let payments = await strapi.query('abonos').model.find(query)
    .populate({
      path: 'usuario',
      select: 'id nombre ap_paterno ap_materno'
    })
    .populate({
      path: 'credito',
      select: 'id intereses'
    });
    payments = await Promise.all(
      payments.map(async (payment) => {
        const usuario = await strapi.query('usuarios').model
          .findById(payment.usuario)
          .select('id nombre ap_paterno ap_materno');
        const credito = await strapi.query('credito').model
          .findById(payment.credito)
          .select('id intereses');
        return {
          id:payment.id,
          cantidad_abono:payment.cantidad_abono,
          fecha_abono:payment.fecha_abono,
          estado_abono:payment.estado_abono,
          usuario,
          credito,
        };
      })
    );
    console.log(payments);

    const {edges, pageInfo} = pagination.search(payments,startIndex, limit)
    return {
      totalCount: payments.length,
      edges,
      pageInfo,
    };
}
  return {
    definition,
    query,
    resolver
  }
}
