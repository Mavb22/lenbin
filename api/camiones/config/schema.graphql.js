const utils = require('../../../extensions/controllers/utils');
const schema = require('../../../extensions/controllers/schemas');
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
      record:DateTime,
      start_record:DateTime,
      end_record:DateTime,
      destination: String,
      driver: String,
      spent: String
   ): truckConnection
  `,
  resolver: {
      Query: {
          paginationtrucks:
            async (obj, {start,limit,plaque,state,plaque_active,num_serial,niv,record,start_record, end_record,  destination,driver, spent}) => {
              const authorization = ['Administrator']
              const token = await utils.authorization(ctx.context.headers.authorization, authorization);
              if(!token){
                throw new Error('No tienes autorización para realizar esta acción.');
              }
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
                ...( record && {
                  "historial.fecha": record
                }),
                ...( start_record && end_record && {
                  "historial.fecha": {
                    $gte: start_record,
                    $lte: end_record
                  }
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
              const {edges, pageInfo} = schema.search(trucks,startIndex, limit)
            return {
              totalCount: trucks.length,
              edges,
              pageInfo,
            };

      }
    }
  }


}

