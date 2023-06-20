module.exports ={
    definition:`
        type spentEdge{
            node: Gastos
            cursor: ID!
        }
        type spentConnection{
            totalCount: Int!
            edges: [spentEdge!]!
            pageInfo: PageInfo!
        }


    `,
    query:`
        paginationspents(
            start: Int,
            limit: Int,
            description: String,
            date: DateTime,
            amount: Float,
            categoria: String,
            status: Boolean,
            user: String,
            trucks : String
        ):spentConnection
    `,
    // descripcion = description
    // fecha = date
    // monto = amount
    // categoria = category
    // usuario = user
    // camions =  trucks
    resolver:{
        Query:{
            paginationspents:
                async(obj,{start,limit,description,date,amount,categoria,status,user,trucks }) => {
                    const authorization = ['Administrator']
                    const token = await utils.authorization(ctx.context.headers.authorization, authorization);
                    if(!token){
                      throw new Error('No tienes autorización para realizar esta acción.');
                    }
                    const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
                    const query = {
                        ...(description && {
                            descripcion: new RegExp(description,'i')
                        }),
                        ...(date && {
                            fecha: date
                        }),
                        ...(amount && !isNaN(parseFloat(amount)))&& {
                            monto: parseFloat(amount)
                        },
                        ...(categoria && {
                            categoria: new RegExp(categoria,'i')
                        }),
                        ...(status !== undefined && {
                            status: status
                        }),
                        ...(user && {
                            "usuario.nombre": new RegExp(user, 'i')
                        }),
                        ...(trucks  && !isNaN(parseInt(trucks))) && {
                            "camions.num_serie": parseInt(trucks)
                        },
                    }
                    const spents = await strapi.query('gastos').find(query);
                    const edges = spents
                    .slice(startIndex, startIndex + parseInt(limit))
                    .map((spent) => ({node: spent, cursor: spent.id }));
                    const pageInfo = {
                     startCursor: edges.length > 0 ? edges[0].cursor : null,
                     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                     hasNextPage:  startIndex + parseInt(limit) < spents.length,
                     hasPreviousPage: startIndex > 0,
                    };
                    return {
                        totalCount: spents.length,
                        edges,
                        pageInfo,
                      };
                }
        }
    }

}
