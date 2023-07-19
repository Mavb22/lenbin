// const utils = require('../../../extensions/controllers/utils');
// const schema = require('../../../extensions/controllers/schemas');
// module.exports ={
//     definition:`
//         type DimensionEdge{
//             node: Dimensiones
//             cursor: ID!
//         }
//         type DimensionConnection{
//             totalCount: Int!
//             edges: [DimensionEdge!]!
//             pageInfo: PageInfo!
//         }
//     `,
//     query:`
//         paginationDimensions(
//             start: Int,
//             limit: Int,
//             name : String,
//             width: Float,
//             high: Float,
//             long: Float,
//             products: String,
//             max_width: Float,
//             min_width: Float,
//             max_high: Float,
//             min_high: Float,
//             max_long: Float,
//             min_long: Float
//         ):DimensionConnection
//     `,
//     //nombre = name
//     //ancho = width
//     // alto = high
//     // largo = long
//     // productos = products
//     resolver: {
//         Query: {
//             paginationDimensions:
//             async(obj,{start,limit,name ,width,high,long,products,max_width,min_width,max_high,min_high,max_long,min_long},ctx) =>{
//                 // const authorization = ['Administrator']
//                 // const token = await utils.authorization(ctx.context.headers.authorization, authorization);
//                 // if(!token){
//                 //   throw new Error('No tienes autorización para realizar esta acción.');
//                 // }
//                 const authorization = ['Administrator','User'];
//                 const authenticated = ctx.context.headers.authorization
//                 const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//                 if(!token){
//                   throw new Error('No tienes autorización para realizar esta acción.');
//                 }
//                 const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
//                 const query = {
//                     ...(name  && {
//                         nombre: new RegExp(name ,'i')
//                     }),
//                     ...(width && !isNaN(parseFloat(width)))&& {
//                         ancho: parseFloat(width)
//                     },
//                     ...(high&& !isNaN(parseFloat(high)))&& {
//                         alto: parseFloat(high)
//                     },
//                     ...( long && !isNaN(parseFloat( long)))&& {
//                          largo: parseFloat(long)
//                     },
//                     ...( products && {
//                         "productos.nombre": new RegExp(products,'i')
//                     }),
//                 }
//                 let Dimensions= await strapi.query('dimensiones').find(query);

//                 if(min_width && max_width) {
//                     Dimensions = Dimensions.filter( Dimension => Dimension.ancho >= min_width && Dimension.ancho <= max_width);
//                   }
//                   else if(min_width){
//                     Dimensions = Dimensions.filter( Dimension => Dimension.ancho > min_width)
//                   }
//                   else if(max_width){
//                     Dimensions = Dimensions.filter(Dimension => Dimension.ancho < max_width)
//                 }

//                 if(max_high && min_high) {
//                     Dimensions = Dimensions.filter( Dimension => Dimension.alto >= max_high && Dimension.alto <= min_high);
//                   }
//                   else if(max_high){
//                     Dimensions = Dimensions.filter( Dimension => Dimension.alto > max_high)
//                   }
//                   else if(min_high){
//                     Dimensions = Dimensions.filter(Dimension => Dimension.alto < min_high)
//                 }

//                 if(max_long && min_long) {
//                     Dimensions = Dimensions.filter( Dimension => Dimension.largo >= max_long && Dimension.largo <= min_long);
//                   }
//                   else if(max_long){
//                     Dimensions = Dimensions.filter( Dimension => Dimension.largo > max_long)
//                   }
//                   else if(min_long){
//                     Dimensions = Dimensions.filter(Dimension => Dimension.largo < min_long)
//                 }

//                 const edges = Dimensions
//                 .slice(startIndex, startIndex + parseInt(limit))
//                 .map((Deimencion) => ({ node: Deimencion, cursor: Deimencion.id }));
//                 const pageInfo = {
//                 startCursor: edges.length > 0 ? edges[0].cursor : null,
//                 endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//                 hasNextPage:  startIndex + parseInt(limit) < Dimensions.length,
//                 hasPreviousPage: startIndex > 0,
//                 };
//                 return {
//                     totalCount: Dimensions.length,
//                     edges,
//                     pageInfo,
//                 };
//             }
//         }
//     }
// }
