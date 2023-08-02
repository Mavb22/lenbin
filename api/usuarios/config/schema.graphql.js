// module.exports = {
//   definition: `
//     type UserEdge {
//       node: Usuarios
//       cursor: ID!
//     }
//     type UserConnection {
//       totalCount: Int!
//       edges: [UserEdge!]!
//       pageInfo: PageInfo!
//     }
//   `,
//   query: `
//       paginationUser(
//           start: Int,
//           limit: Int,
//           name: String,
//           last_name: String,
//           mother_last_name: String,
//           birthdate: DateTime,
//           gender: String,
//           registration_date: DateTime,
//           enrollment_date: DateTime,
//           rfc: String,
//           curp: String,
//           nss: String,
//           phone: Long,
//           phone3: String,
//           email: String,
//           blood_type: String,
//           license: String,
//           allergies: String,
//           conditions: String,
//           nationality: String,
//           street: String,
//           number: Long,
//           neighborhood: String,
//           zip_code: Long,
//           municipality: String,
//           city: String,
//           country: String,
//           address_reference: String,
//           comment: String,
//           status: Boolean,
//           status2: String,
//           role_type: String,
//           payments_amount: Float,
//           carts_quantity: Float,
//           purchases_cost: Float,
//           credits_limit: Int,
//           expenses_description: String,
//           histories_date: DateTime,
//           locals_name: String,
//           payment_methods_holder: String,
//           sales_amount: Float,
//           trucks_serial_number: String,
//           max_birthdate: DateTime,
//           min_birthdate: DateTime,
//           max_registration_date: DateTime,
//           min_registration_date: DateTime,
//           max_enrollment_date: DateTime,
//           min_enrollment_date: DateTime,
//           max_histories_date: DateTime,
//           min_histories_date: DateTime,
//           max_payments_amount: Float,
//           min_payments_amount: Float,
//           max_carts_quantity: Float,
//           min_carts_quantity: Float,
//           max_purchases_cost: Float,
//           min_purchases_cost: Float,
//           max_credits_limit: Int,
//           min_credits_limit: Int,
//           max_sales_amount: Float,
//           min_sales_amount: Float,
//       ):UserConnection
//   `,
//   resolver: {
//     Query: {
//       paginationUser: async (obj, {
//         start,
//         limit,
//         name,
//         last_name,
//         mother_last_name,
//         birth_date,
//         gender,
//         registration_date,
//         enrollment_date,
//         rfc,
//         curp,
//         nss,
//         phone,
//         phone3,
//         email,
//         blood_type,
//         license,
//         allergies,
//         conditions,
//         nationality,
//         street,
//         number,
//         neighborhood,
//         zip_code,
//         municipality,
//         city,
//         country,
//         address_reference,
//         comment,
//         status,
//         status2,
//         role_type,
//         payments_amount,
//         carts_quantity,
//         purchases_cost,
//         credits_limit,
//         expenses_description,
//         histories_date,
//         locals_name,
//         payment_methods_holder,
//         sales_amount,
//         trucks_serial_number, 
//         max_birthdate,
//         min_birthdate,
//         max_registration_date,
//         min_registration_date,
//         max_enrollment_date,
//         min_enrollment_date,
//         max_histories_date,
//         min_histories_date,
//         max_payments_amount,
//         min_payments_amount,
//         max_carts_quantity,
//         min_carts_quantity,
//         max_purchases_cost,
//         min_purchases_cost,
//         max_credits_limit,
//         min_credits_limit,
//         max_sales_amount,
//         min_sales_amount
//       },ctx) => {
//         // const authorization = ['Administrator']
//         // const token = await utils.authorization(ctx.context.headers.authorization, authorization);
//         // if(!token){
//         //   throw new Error('No tienes autorización para realizar esta acción.');
//         // }
//         const authorization = ['Administrator','User'];
//         const authenticated = ctx.context.headers.authorization
//         const token = await utils.authorization(authenticated.split(' ')[1], authorization);
//         if(!token){
//           throw new Error('No tienes autorización para realizar esta acción.');
//         }
//         const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
//         const query = {
//           ...(name && {
//             nombre: {
//               $regex: RegExp(name, 'i')
//             }
//           }),
//           ...(last_name && {
//             ap_paterno: {
//               $regex: RegExp(last_name, 'i')
//             }
//           }),
//           ...(mother_last_name && {
//             ap_materno: {
//               $regex: RegExp(mother_last_name, 'i')
//             }
//           }),
//           ...(birth_date && {
//             fecha_nacimiento: birth_date
//           }),
//           ...(gender && {
//             genero: {
//               $regex: new RegExp(gender, 'i')
//             }
//           }),
//           ...(registration_date && {
//             fecha_inscripcion: registration_date
//           }),
//           ...(enrollment_date && {
//             fecha_alta: enrollment_date
//           }),
//           ...(rfc && {
//             rfc: {
//               $regex: RegExp(rfc, 'i')
//             }
//           }),
//           ...(curp && {
//             curp: {
//               $regex: RegExp(curp, 'i')
//             }
//           }),
//           ...(nss && {
//             nss: {
//               $regex: RegExp(nss, 'i')
//             }
//           }),
//           ...(phone && !isNaN(parseInt(phone)) && {
//             tel_cel: parseInt(phone)
//           }),
//           ...(phone3 && {
//             tel_cel3: {
//               $regex: RegExp(phone3, 'i')
//             }
//           }),
//           ...(email && {
//             email: {
//               $regex: RegExp(email, 'i')
//             }
//           }),
//           ...(blood_type &&{
//             tipo_sangre: {
//               $regex: RegExp(blood_type, 'i')
//             }
//           }),
//           ...(license && {
//             licencia: {
//               $regex: RegExp(license, 'i')
//             }
//           }),
//           ...(allergies && {
//             alergias: {
//               $regex: RegExp(allergies, 'i')
//             }
//           }),
//           ...(conditions && {
//             padecimientos: {
//               $regex: RegExp(conditions, 'i')
//             }
//           }),
//           ...(nationality && {
//             nacionalidad: {
//               $regex: RegExp(nationality, 'i')
//             }
//           }),
//           ...(street && {
//             calle: {
//               $regex: RegExp(street, 'i')
//             }
//           }),
//           ...(number && !isNaN(parseInt(number)) && {
//             numero: parseInt(number)
//           }),
//           ...(neighborhood && {
//             colonia: {
//               $regex: RegExp(neighborhood, 'i')
//             }
//           }),
//           ...(zip_code && !isNaN(parseInt(zip_code)) && {
//             cp: parseInt(zip_code)
//           }),
//           ...(municipality && {
//             municipio: {
//               $regex: RegExp(municipality, 'i')
//             }
//           }),
//           ...(city && {
//             ciudad: {
//               $regex: RegExp(city, 'i')
//             }
//           }),
//           ...(country && {
//             pais: {
//               $regex: RegExp(country, 'i')
//             }
//           }),
//           ...(address_reference && {
//             referencia_direccion: {
//               $regex: RegExp(address_reference, 'i')
//             }
//           }),
//           ...(comment && {
//             comment: {
//               $regex: RegExp(comment, 'i')
//             }
//           }),
//           ...(status !== undefined && {
//             status: status
//           }),
//           ...(status2 && {
//             status2: {
//               $regex: RegExp(status2, 'i')
//             }
//           }),
//           ...(role_type && {
//             tipo_rol: {
//               $regex: RegExp(role_type, 'i')
//             }
//           }),
//           ...(payments_amount && !isNaN(parseFloat(payments_amount))) && {
//             "abonos.cantidad_aboo": parseFloat(payments_amount)
//           },
//           ...(carts_quantity && !isNaN(parseFloat(carts_quantity))) && {
//             "carritos.cantidad": parseFloat(carts_quantity)
//           },
//           ...(purchases_cost && !isNaN(parseFloat(purchases_cost))) && {
//             "compras.costo": parseFloat(purchases_cost)
//           },
//           ...(credits_limit && !isNaN(parseInt(credits_limit))) && {
//             "creditos.limite": parseInt(credits_limit)
//           },
//           ...(expenses_description && {
//             gastos_descripcion: {
//               $regex: RegExp(expenses_description, 'i')
//             }
//           }),
//           ...(histories_date && {
//             historiales_fecha: histories_date
//           }),
//           ...(locals_name && {
//             locals_nombre: {
//               $regex: RegExp(locals_name, 'i')
//             }
//           }),
//           ...(payment_methods_holder && {
//             metodo_pagos_titular: {
//               $regex: RegExp(payment_methods_holder, 'i')
//             }
//           }),
//           ...(sales_amount !== undefined && {
//             ventas_monto: sales_amount
//           }),
//           ...(trucks_serial_number && {
//             camiones_num_serie: {
//               $regex: RegExp(trucks_serial_number, 'i')
//             }
//           }),
//         };
//         let Users = await strapi.query('usuarios').find(query);

//         if (min_birthdate && max_birthdate) {
//           Users=  Users.filter( Users => {
//            const  fecha_nacimiento = new Date(Users.fecha_nacimiento);
//            return  fecha_nacimiento >= new Date(min_birthdate) &&  fecha_nacimiento <= new Date(max_birthdate);
//          });
//        }

//        if (min_registration_date && max_registration_date) {
//            Users=  Users.filter( Users => {
//            const  fecha_inscripcion = new Date(Users.fecha_inscripcion);
//            return  fecha_inscripcion >= new Date(min_registration_date) &&  fecha_inscripcion <= new Date(max_registration_date);
//          });
//        }

//       if (min_enrollment_date && max_enrollment_date) {
//           Users=  Users.filter( Users => {
//           const  fecha_alta = new Date(Users.fecha_alta);
//           return  fecha_alta >= new Date(min_enrollment_date) &&  fecha_alta <= new Date(max_enrollment_date);
//         });
//       }
      
//       if (min_histories_date && max_histories_date) {
//         Users = Users.filter(user =>
//           user.historiales.some(historial => {
//             const fecha = new Date(historial.fecha);
//             return fecha >= new Date(min_histories_date) && fecha <= new Date(max_histories_date);
//           })
//         );
//       }
//     //   if (min_histories_date && max_histories_date) {
//     //     Users=  Users.filter( Users => {
//     //      const  fecha = new Date(Users.historiales.fecha);
//     //      return  fecha >= new Date(min_histories_date) &&  fecha <= new Date(max_histories_date);
//     //    });
//     //  }
//     // if (min_histories_date && max_histories_date) {
//     //   const minDate = new Date(min_histories_date);
//     //   const maxDate = new Date(max_histories_date);
    
//     //   Users = Users.filter(user => {
//     //     for (const historial of user.historiales) {
//     //       const fecha = new Date(historial.fecha);
//     //       if (fecha >= minDate && fecha <= maxDate) {
//     //         return true; // El usuario tiene al menos un historial dentro del rango de fechas
//     //       }
//     //     }
//     //     return false; // El usuario no tiene ningún historial dentro del rango de fechas
//     //   });
//     // }
     
//         if(max_payments_amount && min_payments_amount){
//           Users = Users.filter(Users => {
//             const cantidad_abono = Users.abonos.cantidad_abono
//             return cantidad_abono > min_payments_amount && cantidad_abono < max_payments_amount; 
//           })
//         }
//         else if(min_payments_amount){
//           Users = Users.filter(Users =>{
//             const cantidad_abono = Users.abonos.cantidad_abono
//             return cantidad_abono > min_payments_amount;
//           })
//         }else if(max_payments_amount){
//           Users = Users.filter(Users =>{
//             const cantidad_abono = Users.abonos.cantidad_abono
//             return cantidad_abono < max_payments_amount;
//           });
//         }

//         if(max_carts_quantity && min_carts_quantity){
//           Users = Users.filter(Users => {
//             const cantidad = Users.carritos.cantidad
//             return cantidad > min_carts_quantity && cantidad < max_carts_quantity; 
//           })
//         }
//         else if(min_carts_quantity){
//           Users = Users.filter(Users =>{
//             const cantidad = Users.carritos.cantidad
//             return cantidad > min_carts_quantity;
//           })
//         }else if(max_carts_quantity){
//           Users = Users.filter(Users =>{
//             const cantidad = Users.carritos.cantidad
//             return cantidad < max_carts_quantity;
//           });
//         }

//         if(max_purchases_cost && min_purchases_cost){
//           Users = Users.filter(Users => {
//             const costo = Users.compras.costo
//             return costo > min_purchases_cost && costo < max_purchases_cost; 
//           })
//         }
//         else if(min_purchases_cost){
//           Users = Users.filter(Users =>{
//             const costo = Users.compras.costo
//             return costo > min_purchases_cost;
//           })
//         }else if(max_purchases_cost){
//           Users = Users.filter(Users =>{
//             const costo = Users.compras.costo
//             return costo < max_purchases_cost;
//           });
//         }

//         if(max_credits_limit && min_credits_limit){
//           Users = Users.filter(Users => {
//             const limite = Users.creditos.limite
//             return limite > min_credits_limit && limite < max_credits_limit; 
//           })
//         }
//         else if(min_credits_limit){
//           Users = Users.filter(Users =>{
//             const limite = Users.creditos.limite
//             return limite > min_credits_limit;
//           })
//         }else if(max_credits_limit){
//           Users = Users.filter(Users =>{
//             const limite = Users.creditos.limite
//             return limite < max_credits_limit;
//           });
//         }

//         if(max_sales_amount && min_sales_amount){
//           Users = Users.filter(Users => {
//             const monto = Users.ventas.monto
//             return monto > min_sales_amount && monto < max_sales_amount; 
//           })
//         }
//         else if(min_sales_amount){
//           Users = Users.filter(Users =>{
//             const monto = Users.ventas.monto
//             return monto > min_sales_amount;
//           })
//         }else if(max_sales_amount){
//           Users = Users.filter(Users =>{
//             const monto = Users.ventas.monto
//             return monto < max_sales_amount;
//           });
//         }

//         const edges = Users
//           .slice(startIndex, startIndex + parseInt(limit))
//           .map((user) => ({
//             node: user,
//             cursor: user.id
//           }));
//         const pageInfo = {
//           startCursor: edges.length > 0 ? edges[0].cursor : null,
//           endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
//           hasNextPage: startIndex + parseInt(limit) < Users.length,
//           hasPreviousPage: startIndex > 0,
//         };
//         return {
//           totalCount: Users.length,
//           edges,
//           pageInfo,
//         };
//       }
//     }
//   }
// }
const utils = require('../../../extensions/controllers/utils');
const { petition } = require('../../../extensions/graphql/petition');
const { resolverFilters } = require('../../../extensions/graphql/resolverFilters');
const schema = require('../../../extensions/graphql/schema');
const {definition,query,resolver}  = schema('Usuarios','Users');
module.exports = {
  definition,
  query,
  resolver: {
    Query : {
      [resolver]: async (obj,{start,limit,filters},{context}) => {
        const authorization = ['Administrator','User'];
        const authenticated = context.headers.authorization;
        const token = await utils.authorization(authenticated.split(' ')[1], authorization);
          if(!token){
            throw new Error('No tienes autorización para realizar esta acción.');
          }
        console.log(filters);
        const startIndex = parseInt(start,10)>=0 ? parseInt(start,10) :0;
        const query = await resolverFilters(filters,'Usuarios',{mostrar:true});
        console.log(query);
        const {totalCount,edges,pageInfo} = await petition.usuarios(query,startIndex,limit);
        return {
          totalCount,
          edges,
          pageInfo,
        };
    }
    }
  }
};