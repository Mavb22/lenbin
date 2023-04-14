module.exports = {
    definition:`
        type CrediEdge{
            node: Credito
            cursor: ID!
        }
        type CrediConnection{
            totalCount: Int!
            edges: [CrediEdge!]!
            pageInfo: PageInfo!
        }

    `,
    query:`
        paginationCredito(
            start: Int,
            limit: Int,
            limite: Float,
            fecha_alta: Date,
            fecha_baja: Date,
            vigencia: String,
            intereses: Float,
            status: Boolean,
            statud2: String,
            mostrar: Boolean,
            abonos: String,
            metodo_pago: String,
            usuario: String
        ):CrediConnection
    `,
    resolver:{
        Query: {
            paginationCredito:
                async(obj,{start, limit, limite,fecha_alta,fecha_baja,vigencia,intereses,status,status2,mostrar,abonos,metodo_pago,usuario}) =>{
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query = { mostrar:true };
                    if(limite && !isNaN(parseFloat(limite))){
                        query["limite"] = parseFloat(limite);
                    }
                }
        }
    }
}


