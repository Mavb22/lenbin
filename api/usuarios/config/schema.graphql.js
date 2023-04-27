module.exports = {
  definition: `
    type UserEdge {
      node: Usuarios
      cursor: ID!
    }
    type UserConnection {
      totalCount: Int!
      edges: [UserEdge!]!
      pageInfo: PageInfo!
    }
  `,
  query: `
    paginateUsers(
      start: Int!,
      limit: Int!,
      name: String,
      last_name: String,
      mother_last_name: String,
      birthdate: DateTime,
      gender: String,
      registration_date: DateTime,
      enrollment_date: DateTime,
      rfc: String,
      curp: String,
      nss: String,
      phone: Long,
      phone3: String,
      email: String,
      blood_type: String,
      license: String,
      allergies: String,
      conditions: String,
      nationality: String,
      street: String,
      number: Long,
      neighborhood: String,
      zip_code: Long,
      municipality: String,
      city: String,
      country: String,
      address_reference: String,
      comment: String,
      status: Boolean,
      status2: String,
      role_type: String,
      payments_amount: Float,
      carts_quantity: Float,
      purchases_cost: Float,
      credits_limit: Int,
      expenses_description: String,
      histories_date: DateTime,
      locals_name: String,
      payment_methods_holder: String,
      sales_amount: Float,
      trucks_serial_number: String,
    ): UserConnection
  `,
  resolver: {
    Query: {
      paginateUsers: async (obj, {
        start,
        limit,
        name,
        last_name,
        mother_last_name,
        birth_date,
        gender,
        registration_date,
        enrollment_date,
        rfc,
        curp,
        nss,
        phone,
        phone3,
        email,
        blood_type,
        license,
        allergies,
        conditions,
        nationality,
        street,
        number,
        neighborhood,
        zip_code,
        municipality,
        city,
        country,
        address_reference,
        comment,
        status,
        status2,
        role_type,
        payments_amount,
        carts_quantity,
        purchases_cost,
        credits_limit,
        expenses_description,
        histories_date,
        locals_name,
        payment_methods_holder,
        sales_amount,
        trucks_serial_number
      },) => {
        const startIndex = parseInt(start, 10) >= 0 ? parseInt(start, 10) : 0;
        const query = {
          ...(name && {
            nombre: {
              $regex: RegExp(name, 'i')
            }
          }),
          ...(last_name && {
            ap_paterno: {
              $regex: RegExp(last_name, 'i')
            }
          }),
          ...(mother_last_name && {
            ap_materno: {
              $regex: RegExp(mother_last_name, 'i')
            }
          }),
          ...(birth_date && {
            fecha_nacimiento: birth_date
          }),
          ...(gender && {
            genero: {
              $regex: new RegExp(gender, 'i')
            }
          }),
          ...(registration_date && {
            fecha_inscripcion: registration_date
          }),
          ...(enrollment_date && {
            fecha_alta: enrollment_date
          }),
          ...(rfc && {
            rfc: {
              $regex: RegExp(rfc, 'i')
            }
          }),
          ...(curp && {
            curp: {
              $regex: RegExp(curp, 'i')
            }
          }),
          ...(nss && {
            nss: {
              $regex: RegExp(nss, 'i')
            }
          }),
          ...(phone && !isNaN(parseInt(phone)) && {
            tel_cel: parseInt(phone)
          }),
          ...(phone3 && {
            tel_cel3: {
              $regex: RegExp(phone3, 'i')
            }
          }),
          ...(email && {
            email: {
              $regex: RegExp(email, 'i')
            }
          }),
          ...(blood_type &&{
            tipo_sangre: {
              $regex: RegExp(blood_type, 'i')
            }
          }),
          ...(license && {
            licencia: {
              $regex: RegExp(license, 'i')
            }
          }),
          ...(allergies && {
            alergias: {
              $regex: RegExp(allergies, 'i')
            }
          }),
          ...(conditions && {
            padecimientos: {
              $regex: RegExp(conditions, 'i')
            }
          }),
          ...(nationality && {
            nacionalidad: {
              $regex: RegExp(nationality, 'i')
            }
          }),
          ...(street && {
            calle: {
              $regex: RegExp(street, 'i')
            }
          }),
          ...(number && !isNaN(parseInt(number)) && {
            numero: parseInt(number)
          }),
          ...(neighborhood && {
            colonia: {
              $regex: RegExp(neighborhood, 'i')
            }
          }),
          ...(zip_code && !isNaN(parseInt(zip_code)) && {
            cp: parseInt(zip_code)
          }),
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
          ...(address_reference && {
            referencia_direccion: {
              $regex: RegExp(address_reference, 'i')
            }
          }),
          ...(comment && {
            comment: {
              $regex: RegExp(comment, 'i')
            }
          }),
          ...(status !== undefined && {
            status: status
          }),
          ...(status2 && {
            status2: {
              $regex: RegExp(status2, 'i')
            }
          }),
          ...(role_type && {
            tipo_rol: {
              $regex: RegExp(role_type, 'i')
            }
          }),
          ...(payments_amount && !isNaN(parseFloat(payments_amount))) && {
            "abonos.cantidad_aboo": parseFloat(payments_amount)
          },
          ...(carts_quantity && !isNaN(parseFloat(carts_quantity))) && {
            "carritos.cantidad": parseFloat(carts_quantity)
          },
          ...(purchases_cost && !isNaN(parseFloat(purchases_cost))) && {
            "compras.costo": parseFloat(purchases_cost)
          },
          ...(credits_limit && !isNaN(parseInt(credits_limit))) && {
            "creditos.limite": parseInt(credits_limit)
          },
          ...(expenses_description && {
            gastos_descripcion: {
              $regex: RegExp(expenses_description, 'i')
            }
          }),
          ...(histories_date && {
            historiales_fecha: histories_date
          }),
          ...(locals_name && {
            locals_nombre: {
              $regex: RegExp(locals_name, 'i')
            }
          }),
          ...(payment_methods_holder && {
            metodo_pagos_titular: {
              $regex: RegExp(payment_methods_holder, 'i')
            }
          }),
          ...(sales_amount !== undefined && {
            ventas_monto: sales_amount
          }),
          ...(trucks_serial_number && {
            camiones_num_serie: {
              $regex: RegExp(trucks_serial_number, 'i')
            }
          }),
        };

        const users = await strapi.query('usuarios').find(query);
        const edges = users
          .slice(startIndex, startIndex + parseInt(limit))
          .map((user) => ({
            node: user,
            cursor: user.id
          }));
        const pageInfo = {
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage: startIndex + parseInt(limit) < users.length,
          hasPreviousPage: startIndex > 0,
        };
        return {
          totalCount: users.length,
          edges,
          pageInfo,
        };
      }
    }
  }
}