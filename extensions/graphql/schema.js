module.exports = (tableName,name) => {
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
      start: Int,
      limit: Int,
      filters: [Filter${name}Field]
    ): Filter${name}Connection
 `;
  return {
    definition,
    query,
    resolver:[`paginationData${name}`]
  }
}
