// module.exports = {
//   definition: `
//     type LotEdge{
//         node: Lotes
//         cursor: ID!
//     }
//     type LotConnection{
//         totalCount: Int!
//         edges: [LotEdge!]!
//         pageInfo: PageInfo!
//     }
//   `,
//   query:`
//       paginationLot(
//           start: Int,
//           limit: Int,
//           internal_code: Int,
//           arrival_date: DateTime,
//           expiration_date: DateTime,
//           acquisition_date: DateTime,
//           cost: Float,
//           shopping_cost:Int,
//           product_name:String,
//           max_internal_code: Int,
//           min_internal_code: Int,
//           max_arrival_date: DateTime,
//           min_arrival_date: DateTime,
//           max_expiration_date: DateTime,
//           min_expiration_date: DateTime,
//           max_acquisition_date: DateTime,
//           min_acquisition_date: DateTime,
//           max_cost: Float,
//           min_cost: Float,
//           max_shopping_cost: Int,
//           min_shopping_cost: Int
//       ):LotConnection
//   `,
//   resolver:{
//       Query:{
//           paginationLot:
//           async(obj,{start,limit,internal_code, arrival_date,expiration_date,acquisition_date,cost, shopping_cost,product_name,max_internal_code,min_internal_code,max_arrival_date,max_expiration_date,min_expiration_date,max_acquisition_date,min_acquisition_date,min_arrival_date,max_cost,min_cost,max_shopping_cost,min_shopping_cost}, ctx) =>{
//               // const authorization = ['Administrator']
//               // const token = await utils.authorization(ctx.context.headers.authorization, authorization);
//               // if(!token){
//               //   throw new Error('No tienes autorización para realizar esta acción.');
//               // }
//               // const authorization = ['Administrator','User'];
//               // const authenticated = ctx.context.headers.authorization
//               // const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//               // if(!token){
//               //   throw new Error('No tienes autorización para realizar esta acción.');
//               // }

//               const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
//               const query = {
//                 ...(internal_code && !isNaN(parseInt(internal_code))) && {
//                   codigo_interno: parseInt(internal_code)
//                 },
//                 ...(arrival_date&& {
//                   fecha_arrivo: arrival_date
//                 }),
//                 ...(expiration_date && {
//                   fecha_caducidad: expiration_date
//                 }),
//                 ...(acquisition_date && {
//                   fecha_adquisicion:acquisition_date
//                 }),
//                 ...(cost && !isNaN(parseFloat(cost)))&& {
//                   costo: parseFloat(cost)
//                 },
//                 ...(shopping_cost && !isNaN(parseInt(shopping_cost))) && {
//                   "compras.costo": parseInt(shopping_cost)
//                 },
//                 ...(product_name && {
//                   "products.nombre": new RegExp(product_name,'i')
//                 }),
//               }
//               let Lotes = await strapi.query('lotes').find(query);

//               if(min_internal_code && max_internal_code) {
//                 Lotes = Lotes.filter( lot => lot.codigo_interno >= min_internal_code && lot.codigo_interno <= max_internal_code);
//               }
//               else if(min_internal_code){
//                 Lotes = Lotes.filter( lot => lot.codigo_interno > min_internal_code)
//               }
//               else if(max_internal_code){
//                 Lotes = Lotes.filter(lot => lot.codigo_interno < max_internal_code)
//               }

//               if (min_arrival_date && max_arrival_date) {
//                 Lotes= Lotes.filter(Lot => {
//                   const fecha_arrivo = new Date(Lot.fecha_arrivo);
//                   return fecha_arrivo >= new Date(min_arrival_date) && fecha_arrivo <= new Date(max_arrival_date);
//                 });
//               }

//               if (min_expiration_date && max_expiration_date) {
//                 Lotes= Lotes.filter(Lot => {
//                   const fecha_caducidad = new Date(Lot.fecha_caducidad);
//                   return fecha_caducidad >= new Date(min_expiration_date) && fecha_caducidad <= new Date(max_expiration_date);
//                 });
//               }

//               if (min_acquisition_date && max_acquisition_date) {
//                 Lotes= Lotes.filter(Lot => {
//                   const fecha_arrivo = new Date(Lot.fecha_arrivo);
//                   return fecha_arrivo >= new Date(min_acquisition_date) && fecha_arrivo <= new Date(max_acquisition_date);
//                 });
//               }

//               if(min_cost && max_cost) {
//                 Lotes = Lotes.filter( lot => lot.costo >= min_cost && lot.costo <= max_cost);
//               }
//               else if(min_cost){
//                 Lotes = Lotes.filter( lot => lot.costo > min_cost)
//               }
//               else if(max_cost){
//                 Lotes = Lotes.filter(lot => lot.costo < max_cost)
//               }

//               if(max_shopping_cost && min_shopping_cost){
//                 Lotes = Lotes.filter(lot => {
//                   const costo = lot.compras.costo
//                   return costo > min_shopping_cost && costo < max_shopping_cost;
//                 })
//               }
//               else if(min_shopping_cost){
//                 Lotes = Lotes.filter(lot =>{
//                   const costo = lot.compras.costo
//                   return costo > min_shopping_cost;
//                 })
//               }else if(max_shopping_cost){
//                 Lotes = Lotes.filter(lot =>{
//                   const costo = lot.compras.costo
//                   return costo < max_shopping_cost;
//                 });
//               }

//               const edges = Lotes
//                 .slice(startIndex, startIndex + parseInt(limit))
//                 .map((lot) => ({ node: lot, cursor: lot.id }));
//               const pageInfo = {
//                 startCursor: edges.length > 0 ? edges[0].cursor : null,
//                 endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//                 hasNextPage:  startIndex + parseInt(limit) < Lotes.length,
//                 hasPreviousPage: startIndex > 0,
//               };
//               return {
//                 totalCount: Lotes.length,
//                 edges,
//                 pageInfo,
//               };
//           }
//       }
//     }
//   }

