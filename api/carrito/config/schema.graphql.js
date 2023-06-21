module.exports ={
    definition:`
        type cartEdge{
            node: Carrito
            cursor: ID!
        }
        type cartConnection{
            totalCount: Int!
            edges: [cartEdge!]!
            pageInfo: PageInfo!
        }

    `,
    query:`
        paginationcarts(
            start: Int,
            limit: Int,
            amount: Int,
            products: String,
            user: String,
            sale: Float
        ):cartConnection
    
    
    `,
    //cantidad  = amount
    //productos = products
    //usuario = user
    //venta = sale
    resolver: {
        Query: {
            paginationcarts:
                async(obj,{start,limit,amount,products,user,sale}) =>{
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query={
                        ...(amount && !isNaN(parseInt(amount))) && {
                            cantidad: parseInt(amount)
                          },
                          ...(products && {
                            "productos.nombre": new RegExp(products,'i')
                          }),
                          ...(user && {
                            "usuario.nombre": new RegExp(user, 'i')
                          }),
                          ...(sale && !isNaN(parseFloat(sale))) && {
                            "venta.monto": parseFloat(sale)
                          },
                          

                    }
                    const carts = await strapi.query('carrito').find(query);
                    const edges = carts
                    .slice(startIndex, startIndex + parseInt(limit))
                    .map((cart) => ({ node: cart, cursor: cart.id }));
                    const pageInfo = {
                     startCursor: edges.length > 0 ? edges[0].cursor : null,
                     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                     hasNextPage:  startIndex + parseInt(limit) < carts.length,
                     hasPreviousPage: startIndex > 0,
                    };
                    return {
                        totalCount: carts.length,
                        edges,
                        pageInfo,
                      };
                }

        }
    }

}
