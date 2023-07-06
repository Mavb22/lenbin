module.exports = {
  definition: `
    type ProviderEdge {
      node: Proveedor
      cursor: ID!
    }
    type ProviderConnection {
      totalCount: Int!
      edges: [ProviderEdge!]!
      pageInfo: PageInfo!
    }
  `,
  query: `
    paginationProvider(
      start: Int!,
      limit: Int!,
      name: String,
      business_name: String,
      rfc: String,
      start_date: DateTime,
      street: String,
      number: String,
      colony: String,
      postal_code: Long,
      municipality: String,
      city: String,
      country: String,
      scheduled_visit: DateTime,
      status: Boolean,
      status2: String,
      purchase_cost: Float,
      product_name: String
      max_purchase_cost: Float,
      min_purchase_cost: Float
      max_start_date: DateTime,
      min_start_date: DateTime,
      max_scheduled_visit: DateTime,
      min_scheduled_visit: DateTime,
    ): ProviderConnection
  `,
  resolver: {
    Query: {
      paginationProvider: async (obj, {
        start,
        limit,
        name,
        business_name,
        rfc,
        start_date,
        street,
        number,
        colony,
        postal_code,
        municipality,
        city,
        country,
        scheduled_visit,
        status,
        status2,
        purchase_cost,
        product_name,
        max_purchase_cost,
        min_purchase_cost,
        max_start_date,
        min_start_date,
        max_scheduled_visit,
        min_scheduled_visit
      },ctx) => {
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
        const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
        const query = {
          ...(name && {
            nombre: {
              $regex: RegExp(name, 'i')
            }
          }),
          ...(business_name && {
            razon_social: {
              $regex: RegExp(business_name, 'i')
            }
          }),
          ...(rfc && {
            rfc: {
              $regex: RegExp(rfc, 'i')
            }
          }),
          ...(start_date && {
            fecha_alta: start_date
          }),
          ...(street && {
            calle: {
              $regex: RegExp(street, 'i')
            }
          }),
          ...(number && {
            numero: {
              $regex: RegExp(number, 'i')
            }
          }),
          ...(colony && {
            colonia: {
              $regex: RegExp(colony, 'i')
            }
          }),
          ...(postal_code && !isNaN(parseInt(postal_code))) && {
            cp: parseInt(postal_code)
          },
          ...(municipality && {
            municipio: {
              $regex: RegExp(municipality, 'i')
            }
          }),
          ...(city && {
            ciudad: {
              $regex: RegExp(city, 'i')
            }
          }),
          ...(country && {
            pais: {
              $regex: RegExp(country, 'i')
            }
          }),
          ...(scheduled_visit && {
            visita_programada: scheduled_visit
          }),
          ...(status !== undefined && {
            status: status
          }),
          ...(status2 && {
            status2: {
              $regex: RegExp(status2, 'i')
            }
          }),
          ...(purchase_cost && !isNaN(parseFloat(purchase_cost))) && {
            "compras.costo": parseFloat(purchase_cost)
          },
          ...(product_name && {
            "productos.nombre": {
              $regex: RegExp(product_name, 'i')
            }
          })
        };
        let provider = await strapi.query('proveedor').find(query);

        if (min_start_date && max_start_date) {
          provider= provider.filter(provider => {
            const fecha_alta = new Date(provider.fecha_alta);
            return fecha_alta >= new Date(min_start_date) && fecha_alta <= new Date(max_start_date);
          });
        }

        if (min_scheduled_visit && max_scheduled_visit) {
          provider= provider.filter(provider => {
            const visita_programada = new Date(provider.visita_programada);
            return visita_programada >= new Date(min_scheduled_visit) && visita_programada <= new Date(max_scheduled_visit);
          });
        }

        if(max_purchase_cost && min_purchase_cost){
          provider = provider.filter(provider => {
            const costo = provider.compras.costo
            return costo > min_purchase_cost && costo < max_purchase_cost; 
          })
        }
        else if(min_purchase_cost){
          provider = provider.filter(provider =>{
            const costo = provider.compras.costo
            return costo > min_purchase_cost;
          })
        }else if(max_purchase_cost){
          provider = provider.filter(provider =>{
            const costo = provider.compras.costo
            return costo < max_purchase_cost;
          });
        }

        // if(min_purchase_cost && max_purchase_cost) {
        //   provider = provider.filter(  provider  =>  provider.compras.costo >= min_purchase_cost &&  provider.compras.costo <= max_purchase_cost);
        // }
        // else if(min_purchase_cost){
        //   provider = provider.filter(  provider =>  provider.compras.costo > min_purchase_cost)
        // }
        // else if(max_purchase_cost){
        //   provider = provider.filter( provider =>  provider.compras.costo < max_purchase_cost)
        // }

        const edges = provider
          .slice(startIndex, startIndex + parseInt(limit))
          .map((provider) => ({
            node: provider,
            cursor: provider.id
          }));
        const pageInfo = {
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage: startIndex + parseInt(limit) < provider.length,
          hasPreviousPage: startIndex > 0,
        };
        return {
          totalCount: provider.length,
          edges,
          pageInfo,
        };
      }
    }
  }
};




