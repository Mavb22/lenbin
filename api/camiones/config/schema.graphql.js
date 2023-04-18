module.exports = {
  definition: `
  type truckEdge{
      node: Camiones
      cursor: ID!
  }
  type truckConnection{
      totalCount: Int!
      edges: [truckEdge!]!
      pageInfo: PageInfo!
  }
  
  `,
  query:`
   paginationtrucks(
      start: Int,
      limit: Int,
      plaque: String,
      state: String,
      plaque_active: Boolean,
      num_serial: String,
      niv: String,
      date_start: DateTime,
      date_end: DateTime,
      destination: String,
      driver: String,
      spent: String
   ): truckConnection
  `,
  resolver: {
      Query: {
          paginationtrucks:
            async (obj, {start,limit,plaque,state,plaque_active,num_serial,niv,date_start,date_end, destination,driver, spent}) => {
              const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
              const query = {
                ...( plaque && {
                  // "placas.placa": new RegExp( plaque,'i')
                  placas:{
                    $elemMatch:{
                      placa:{
                        $regex: new RegExp(plaque, 'i')
                      }
                    }
                  }
                }),
                ...( state && {
                  // "placas.estado": new RegExp( state,'i')
                  placas:{
                    $elemMatch:{
                      estado:{
                        $regex: new RegExp(state, 'i')
                      }
                    }
                  }
                }),
                ...( plaque_active && {
                  // "placas.activa": new RegExp( plaque_active,'i')
                  placas:{
                    $elemMatch:{
                      activa:{
                        $regex: new RegExp(plaque_active, 'i')
                      }
                    }
                  }
                }),
                ...( num_serial && {
                  num_serie: new RegExp( num_serial,'i')
                }),
                ...( niv && {
                  niv: new RegExp( niv,'i')
                }),
                ...( destination && {
                  "ruta.destino": new RegExp( destination,'i')
                }),
                ...( driver && {
                  "usuario.nombre": new RegExp( driver,'i')
                }),
                ...( spent && {
                  "gastos.categoria": new RegExp( spent,'i')
                }),
                
              }
              const trucks = await strapi.query('camiones').find(query);
              const edges = trucks
              .slice(startIndex, startIndex + parseInt(limit))
              .map((truck) => ({ node: truck, cursor: truck.id }));
            const pageInfo = {
              startCursor: edges.length > 0 ? edges[0].cursor : null,
              endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
              hasNextPage:  startIndex + parseInt(limit) < trucks.length,
              hasPreviousPage: startIndex > 0,
            };
            return {
              totalCount: trucks.length,
              edges,
              pageInfo,
            };

            }
      }
  }


}

