

module.exports ={
    definition:`
        type CarroEdge{
            node: Carrito
            cursor: ID!
        }
        type CarroConnection{
            totalCount: Int!
            edges: [CarroEdge!]!
            pageInfo: PageInfo!
        }

    `,
    query:`
        paginationCarrito(
            start: Int,
            limit: Int,
            cantidad: Int,
            productos: String,
            usuario: String,
            venta: Float
        ):CarroConnection
    
    
    `,
    resolver: {
        Query: {
            paginationCarrito:
                async(obj,{start,limit,cantidad,productos,usuario,venta}) =>{
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query={}
                    if(cantidad && !isNaN(parseInt(cantidad))){
                        query.cantidad = parseInt(cantidad);
                    }
                    if(productos){
                        const regex = new RegExp(productos, 'i'); 
                        query["productos.nombre"] = { $regex: regex };
                    }
                    if(usuario){
                        const regex = new RegExp(usuario, 'i'); 
                        query["usuario.nombre"] = { $regex: regex };
                    }
                    if(venta && !isNaN(parseFloat(venta))){
                        query["venta.monto"] = parseFloat(venta);
                    }
                    const carrito = await strapi.query('carrito').find(query);
                    const edges = carrito
                    .slice(startIndex, startIndex + parseInt(limit))
                    .map((carro) => ({ node: carro, cursor: carro.id }));
                    const pageInfo = {
                     startCursor: edges.length > 0 ? edges[0].cursor : null,
                     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                     hasNextPage:  startIndex + parseInt(limit) < carrito.length,
                     hasPreviousPage: startIndex > 0,
                    };
                    return {
                        totalCount: carrito.length,
                        edges,
                        pageInfo,
                      };
                }

        }
    }


}