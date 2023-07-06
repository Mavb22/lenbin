module.exports ={
  definition:`
      type PaymentMethodEdge{
          node: MetodoPago
          cursor: ID!
      }
      type PaymentMethodConnection{
          totalCount: Int!
          edges: [PaymentMethodEdge!]!
          pageInfo: PageInfo!
      }
  `,
  query:`
      paginationPaymentMethod(
          start: Int,
          limit: Int,
          card_number: Long,
          month: String,
          year:Long,
          cvc:Int,
          holder:String,
          invoice: Long,
          expedition_date:DateTime,
          admission_date:DateTime,
          description:String,
          reference:String,
          type:String,
          shopping_cost:Float,
          credits_limit:Long,
          username:String,
          sale_amount:Float,
          max_cvc: Int,
          min_cvc: Int,
          max_expedition_date:DateTime,
          min_expedition_date:DateTime,
          max_admission_date:DateTime,
          min_admission_date:DateTime,
          max_shopping_cost: Float,
          min_shopping_cost: Float,
          max_sale_amount: Float,
          min_sale_amount: Float
      ):PaymentMethodConnection
  `,
  resolver:{
      Query:{
          paginationPaymentMethod:
          async(obj,{start, limit, card_number, month, year, cvc, holder, invoice,expedition_date, admission_date, description, reference, type, shopping_cost, credits_limit, username, sale_amount,max_cvc,min_cvc,max_expedition_date,min_expedition_date,max_admission_date,min_admission_date,max_shopping_cost,min_shopping_cost,max_sale_amount,min_sale_amount},ctx) =>{
              // const authorization = ['Administrator']
              // const token = await utils.authorization(ctx.context.headers.authorization, authorization);
              // if(!token){
              //   throw new Error('No tienes autorización para realizar esta acción.');
              // }
              const authorization = ['Administrator','User'];
              const authenticated = ctx.context.headers.authorization
              const token = await utils.authorization(authenticated.split(' ')[1], authorization);
              if(!token){
                throw new Error('No tienes autorización para realizar esta acción.');
              }
              const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
              const query = {
                ...(card_number && !isNaN(parseInt(card_number))) && {
                  numero_tarjeta: parseInt(card_number)
                },
                ...(month && {
                  mes: {
                    $regex: RegExp(month, 'i')
                  }
                }),
                ...(year && !isNaN(parseInt(year))) && {
                  anio: parseInt(year)
                },
                ...(cvc && !isNaN(parseInt(cvc))) && {
                  cvc: parseInt(cvc)
                },
                ...(holder && {
                  titular: {
                    $regex: RegExp(holder, 'i')
                  }
                }),
                ...(invoice && !isNaN(parseInt(invoice))) && {
                  folio: parseInt(invoice)
                },
                ...(expedition_date && {
                  fecha_expedicion: expedition_date
                }),
                ...(admission_date && {
                  fecha_ingreso: admission_date
                }),
                ...(description && {
                  descripcion: {
                    $regex: RegExp(description, 'i')
                  }
                }),
                ...(reference && {
                  referencia: {
                    $regex: RegExp(reference, 'i')
                  }
                }),
                ...(type && {
                  tipo: {
                    $regex: RegExp(type, 'i')
                  }
                }),
                ...(shopping_cost && !isNaN(parseFloat(shopping_cost))) && {
                  'compras.costo': parseFloat(shopping_cost)
                },
                ...(credits_limit  && !isNaN(parseInt(credits_limit ))) && {
                  'creditos.limite': parseInt(credits_limit )
                },
                ...(username && {
                  'usuario.nombre': {
                    $regex: RegExp(username, 'i')
                  }
                }),
                ...(sale_amount && !isNaN(parseFloat(sale_amount))) && {
                  'venta.monto': parseFloat(sale_amount )
                },
              };
              let PaymentMethod = await strapi.query('metodo-pago').find(query);

              if(min_cvc && max_cvc) {
                PaymentMethod = PaymentMethod.filter( PaymentMethod => PaymentMethod.cvc >= min_cvc && PaymentMethod.cvc <= max_cvc);
              }
              else if(min_cvc){
                PaymentMethod = PaymentMethod.filter( PaymentMethod => PaymentMethod.cvc > min_cvc)
              }
              else if(max_cvc){
                PaymentMethod = PaymentMethod.filter(PaymentMethod => PaymentMethod.cvc <= max_cvc)
              }

              if (min_expedition_date && max_expedition_date) {
                PaymentMethod= PaymentMethod.filter(PaymentMethod => {
                  const fecha_expedicion = new Date(PaymentMethod.fecha_expedicion);
                  return fecha_expedicion >= new Date(min_expedition_date) && fecha_expedicion <= new Date(max_expedition_date);
                });
              }

              if (min_admission_date && max_admission_date) {
                PaymentMethod= PaymentMethod.filter(PaymentMethod => {
                  const fecha_ingreso = new Date(PaymentMethod.fecha_ingreso);
                  return fecha_ingreso >= new Date(min_admission_date) && fecha_ingreso <= new Date(max_admission_date);
                });
              }

              if(max_shopping_cost && min_shopping_cost){
                 PaymentMethod =  PaymentMethod.filter( PaymentMethod => {
                  const costo =  PaymentMethod.compras.costo
                  return costo > min_shopping_cost && costo < max_shopping_cost; 
                })
              }
              else if(min_shopping_cost){
                 PaymentMethod =  PaymentMethod.filter( PaymentMethod =>{
                  const costo =  PaymentMethod.compras.costo
                  return costo > min_shopping_cost;
                })
              }else if(max_shopping_cost){
                 PaymentMethod =  PaymentMethod.filter( PaymentMethod =>{
                  const costo  =  PaymentMethod.compras.costo
                  return costo < max_shopping_cost;
                });
              }

              if(max_sale_amount && min_sale_amount){
                PaymentMethod =  PaymentMethod.filter( PaymentMethod => {
                 const monto =  PaymentMethod.venta.monto
                 return monto > min_sale_amount && monto < max_sale_amount; 
               })
             }
             else if(min_sale_amount){
                PaymentMethod =  PaymentMethod.filter( PaymentMethod =>{
                 const monto =  PaymentMethod.venta.monto
                 return monto > min_sale_amount;
               })
             }else if(max_sale_amount){
                PaymentMethod =  PaymentMethod.filter( PaymentMethod =>{
                 const monto  =  PaymentMethod.venta.monto
                 return monto < max_sale_amount;
               });
             }

              const edges = PaymentMethod
                .slice(startIndex, startIndex + parseInt(limit))
                .map((PaymentMethod) => ({ node: PaymentMethod, cursor: PaymentMethod.id }));
              const pageInfo = {
                startCursor: edges.length > 0 ? edges[0].cursor : null,
                endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
                hasNextPage:  startIndex + parseInt(limit) < PaymentMethod.length,
                hasPreviousPage: startIndex > 0,
              };
              return {
                totalCount: PaymentMethod.length,
                edges,
                pageInfo,
              };
          }
      }
  }

}
