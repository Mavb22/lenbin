const pagination ={
  search:(search,startIndex, limit) => {
    const edges = search
      .slice(startIndex, startIndex + parseInt(limit))
      .map((payment) => ({ node: payment, cursor: payment.id }));
    const pageInfo = {
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNextPage:  startIndex + parseInt(limit) < search.length,
      hasPreviousPage: startIndex > 0,
    };
    return { edges, pageInfo };
  },
}

module.exports = pagination;
