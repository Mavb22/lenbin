module.exports ={
    definition:`
        type purchaseEdge{
            node: Compras
            cursor: ID!
        }
        type purchaseConnection{
            totalCount: Int!
            edges: [purchaseEdge!]!
            pageInfo: PageInfo!
        }


    `,
    query:`
        paginationshopping(
            start: Int,
            limit: Int,
            cost: Float,
            order_date: DateTime,
            reference: String,
            arrival_date: DateTime,
            status: Boolean,
            status2: String,
            lot: Int,
            payment_method: String,
            provider: String,
            usuer: String
        ):purchaseConnection 
        
    `,
    // costo = cost
    // fecha_pedido = order_date 
    // referencia = reference
    // fecha_llegada = arrival_date
    // lote = lot 
    // metodo_pago = payment_method 
    // proveedor = provider
    // usuarios = user
    resolver:{
        Query:{
            paginationshopping:
                async(obj,{start,limit,cost,order_date, reference, arrival_date, status, status2,lot, payment_method, provider, user}) => {
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query={
                        ...(cost && !isNaN(parseFloat(cost)))&& {
                            costo: parseFloat(cost)
                        },
                        ...(order_date && {
                            fecha_pedido: order_date
                          }),
                        ...(reference && {
                            referencia: new RegExp(reference,'i')
                        }),
                        ...(arrival_date && {
                            fecha_llegada: arrival_date
                        }),
                        ...(status !== undefined && {
                            status: status
                        }),
                        ...(status2 && {
                            status2: new RegExp(status2,'i')
                        }),
                        ...(lot && !isNaN(parseInt(lot))) && {
                            "lote.codigo_interno": parseInt(lot)
                        },
                        ...(payment_method && !isNaN(parseInt(payment_method))) && {
                            "metodo_pago.numero_tarjeta": parseInt(payment_method)
                        },
                        
                        ...(provider && !isNaN(parseInt(provider))) && {
                            "proveedor.usuario": parseInt(provider )
                        },
                        ...(user && {
                            "usuario.nombre": new RegExp(user, 'i')
                        }),
                        
                    }
                    const shopping = await strapi.query('compras').find(query);
                    const edges = shopping
                    .slice(startIndex, startIndex + parseInt(limit))
                    .map((purchase) => ({ node: purchase, cursor: purchase.id }));
                    const pageInfo = {
                     startCursor: edges.length > 0 ? edges[0].cursor : null,
                     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                     hasNextPage:  startIndex + parseInt(limit) < shopping.length,
                     hasPreviousPage: startIndex > 0,
                    };
                    return {
                        totalCount: shopping.length,
                        edges,
                        pageInfo,
                      };
                
                }

        }
    }
}