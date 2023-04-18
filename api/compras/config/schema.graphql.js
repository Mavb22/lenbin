module.exports ={
    definition:`
        type CompraEdge{
            node: Compras
            cursor: ID!
        }
        type CompraConnection{
            totalCount: Int!
            edges: [CompraEdge!]!
            pageInfo: PageInfo!
        }


    `,
    query:`
        paginationCompras(
            start: Int,
            limit: Int,
            costo: Float,
            fecha_pedido: DateTime,
            referencia: String,
            fecha_llegada: DateTime,
            status: Boolean,
            status2: String,
            lote: Int,
            metodo_pago: String,
            proveedor: String,
            usuarios: String
        ):CompraConnection 

    `,
    resolver:{
        Query:{
            paginationCompras:
                async(obj,{start,limit,costo,fecha_pedido, referencia, fecha_llegada, status, status2,lote, metodo_pago, proveedor, usuario}) => {
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query={
                        ...(costo && !isNaN(parseFloat(costo)))&& {
                            costo: parseFloat(costo)
                        },
                        ...(fecha_pedido && {
                            fecha_pedido: fecha_pedido
                          }),
                        ...(referencia && {
                            referencia: new RegExp( referencia,'i')
                        }),
                        ...(fecha_llegada && {
                            fecha_llegada: fecha_llegada
                        }),
                        ...(status2 && {
                            status2: new RegExp(status2,'i')
                        }),
                        ...(lote && !isNaN(parseInt(lote))) && {
                            "lote.codigo_interno": parseInt(lote)
                        },
                        ...(user && !isNaN(parseInt(user))) && {
                            "usuario.nombre": parseInt(user)
                          },
                        ...(proveedor && !isNaN(parseInt(proveedor))) && {
                            "proveedor.usuario": parseInt(proveedor)
                        },
                        ...(usuario && !isNaN(parseInt(usuario))) && {
                            "usuario.nombre": parseInt(usuario)
                        },

                        
                    }
                    // if(costo && !isNaN(parseInt(costo))){
                    //     query.costo = parseInt(costo);
                    // }
                    // if(referencia){
                    //     const regex = new RegExp(referencia, 'i');
                    //     query.referencia = { $regex: regex };
                    // }
                    // if(status){
                    //     const regex = new RegExp(status, 'i')
                    //     query['costo'] = {
                    //       $elemMatch:{
                    //         activa:{
                    //           $regex: regex
                    //         }
                    //       }
                    //     }
                    // }
                    // if(status2 && !isNaN(parseInt(status2))){
                    //     query.status2 = parseInt(status2);
                    // }
                    // if(lote){
                    //     const regex = new RegExp(lote, 'i');
                    //     query["lote.codigo_interno"] = { $regex: regex };
                    // }
                    // if(metodo_pago){
                    //     const regex = new RegExp(metodo_pago, 'i'); 
                    //     query["metodo_pago.titular"] = { $regex: regex };
                    // }

                    // if(proveedor){
                    //     const regex = new RegExp(proveedor, 'i'); 
                    //     query["proveedor.nombre"] = { $regex: regex };
                    // }


                    // if(usuario){
                    //     const regex = new RegExp(usuario, 'i'); 
                    //     query["usuario.nombre"] = { $regex: regex };
                    // }
                    const compras = await strapi.query('compras').find(query);
                    const edges = compras
                    .slice(startIndex, startIndex + parseInt(limit))
                    .map((compra) => ({ node: compra, cursor: compra.id }));
                    const pageInfo = {
                     startCursor: edges.length > 0 ? edges[0].cursor : null,
                     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                     hasNextPage:  startIndex + parseInt(limit) < compras.length,
                     hasPreviousPage: startIndex > 0,
                    };
                    return {
                        totalCount: compras.length,
                        edges,
                        pageInfo,
                      };
                
                }

        }
    }
}