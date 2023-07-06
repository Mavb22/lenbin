module.exports = {
  definition: `
    type ProductEdge{
        node: Productos
        cursor: ID!
    }
    type ProductConnection{
        totalCount: Int!
        edges: [ProductEdge!]!
        pageInfo: PageInfo!
    }
  `,
  query: `
      paginationProduct(
          start: Int,
          limit: Int,
          name: String,
          net_weight: Float,
          presentation: String,
          brand: String,
          generic_description: String,
          price: Float,
          cost: Float,
          available_inventory: Long,
          value_min: Int,
          barcode: Long,
          internal_code: Long,
          sale_grams: Float,
          status: Boolean,
          status2: String,
          size_name: String,
          carts_quantity: Float,
          promotions_date_creation:DateTime,
          batches_internal_code:Long,
          provider_name:String,
          max_net_weight: Float,
          min_net_weight: Float,
          max_price: Float,
          min_price: Float,
          max_cost: Float,
          min_cost: Float,
          max_sale_grams: Float,
          min_sale_grams: Float,
          max_carts_quantity: Float,
          min_carts_quantity: Float,
          max_promotions_date_creation: DateTime,
          min_promotions_date_creation: DateTime
      ):ProductConnection
  `,
  resolver: {
    Query: {
      paginationProduct: async (obj, {
        start,limit,name,net_weight,presentation,brand,generic_description,price,cost,available_inventory,value_min,barcode,internal_code,sale_grams,status,status2,size_name,carts_quantity,promotions_date_creation,batches_internal_code,provider_name,max_net_weight,min_net_weight,max_price,min_price,max_cost,min_cost,max_sale_grams,min_sale_grams,max_carts_quantity,min_carts_quantity,max_promotions_date_creation,min_promotions_date_creation}, ctx) => {
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
              $regex: RegExp(name, "i"),
            },
          }),
          ...(net_weight &&
            !isNaN(parseInt(net_weight)) && {
              peso_neto: parseInt(net_weight),
            }),
          ...(presentation && {
            presentacion: {
              $regex: RegExp(presentation, "i"),
            },
          }),
          ...(brand && {
            marca: {
              $regex: RegExp(brand, "i"),
            },
          }),
          ...(generic_description && {
            descripcion_generica: {
              $regex: RegExp(generic_description, "i"),
            },
          }),
          ...(price && !isNaN(parseFloat(price)) && {
              precio: parseFloat(price),
            }),
          ...(cost && !isNaN(parseFloat(cost)) && {
              costo: cost,
            }),
          ...(available_inventory && !isNaN(parseInt(available_inventory)) && {
              inventario_disp: available_inventory,
            }),
          ...(value_min && !isNaN(parseInt(value_min)) && {
              value_min: parseInt(value_min),
            }),
          ...(barcode && !isNaN(parseInt(barcode)) && {
            codigo_barras: parseInt(barcode),
          }),
          ...(internal_code && !isNaN(parseInt(internal_code))) && {
            codigo_interno: parseInt(internal_code),
          },
          ...(sale_grams && !isNaN(parseFloat(sale_grams))) && {
            venta_gramos: parseFloat(sale_grams),
          },
          ...(status &&  {
            status: status,
          }),
          ...(status2 &&  {
            status2: {
              $regex: RegExp(status2, "i"),
            }
          }),
          ...(size_name && {
            dimension_nombre: {
              $regex: RegExp(size_name, "i"),
            }
          }),
          ...(carts_quantity && !isNaN(parseFloat(carts_quantity))) && {
            "carritos.cantidad": parseFloat(carts_quantity),
          },
          ...(promotions_date_creation && {
            "promociones.fecha_creacion": promotions_date_creation,
          }),
          ...(batches_internal_code && !isNaN(parseInt(batches_internal_code)) )&& {
            "lotes.internal_code": parseInt(batches_internal_code)
          },
        };
        let Product = await strapi.query('productos').find(query);

        if(min_net_weight && max_net_weight) {
          Product = Product.filter( Product => Product.peso_neto >= min_net_weight && Product.peso_neto <= max_net_weight);
        }
        else if(min_net_weight){
          Product = Product.filter( Product => Product.peso_neto > min_net_weight)
        }
        else if(max_net_weight){
          Product = Product.filter(Product => Product.peso_neto < max_net_weight)
        }

        if(min_price && max_price) {
          Product = Product.filter( Product => Product.precio > min_price && Product.precio < max_price);
        }
        else if(min_price){
          Product = Product.filter( Product => Product.precio > min_price)
        }
        else if(max_price){
          Product = Product.filter(Product => Product.precio <= max_price)
        }

        if(min_cost && max_cost) {
          Product = Product.filter( Product => Product.costo > min_cost && Product.costo < max_cost);
        }
        else if(min_cost){
          Product = Product.filter( Product => Product.costo > min_cost)
        }
        else if(max_cost){
          Product = Product.filter(Product => Product.costo <= max_cost)
        }

        if(min_sale_grams && max_sale_grams) {
          Product = Product.filter( Product => Product.venta_gramos > min_sale_grams && Product.venta_gramos < max_sale_grams);
        }
        else if(min_sale_grams){
          Product = Product.filter( Product => Product.venta_gramos > min_sale_grams)
        }
        else if(max_sale_grams){
          Product = Product.filter(Product => Product.venta_gramos <= max_sale_grams)
        }

        if(max_carts_quantity && min_carts_quantity){
          Product = Product.filter(Product => {
            const cantidad = Product.carritos.cantidad
            return cantidad > min_carts_quantity && cantidad < max_carts_quantity; 
          })
        }
        else if(min_carts_quantity){
          Product = Product.filter(Product =>{
            const cantidad = Product.carritos.cantidad
            return cantidad > min_carts_quantity;
          })
        }else if(max_carts_quantity){
          Product = Product.filter(Product =>{
            const cantidad = Product.carritos.cantidad
            return cantidad < max_carts_quantity;
          });
        }
        if (min_promotions_date_creation && max_promotions_date_creation) {
           Product =  Product.filter( Product =>
             Product.promociones.some(promociones => {
              const fecha_creacion = new Date(promociones.fecha_creacion);
              return fecha_creacion >= new Date(min_promotions_date_creation) && fecha_creacion <= new Date(max_promotions_date_creation);
            })
          );
        }
        // if (min_promotions_date_creation && max_promotions_date_creation) {
        //   Product= Product.filter(Product => {
        //     const fecha_creacion = new Date(Product.promociones.fecha_creacion);
        //     return fecha_creacion >= new Date(min_promotions_date_creation) && fecha_creacion <= new Date(max_promotions_date_creation);
        //   });
        // }
        // if (min_promotions_date_creation && max_promotions_date_creation) {
        //   const minDate = new Date(min_promotions_date_creation);
        //   const maxDate = new Date(max_promotions_date_creation);
        
        //   Product = Product.filter(Product => {
        //     for (const promociones of Product.promociones) {
        //       const fecha_creacion = new Date(promociones.fecha_creacion);
        //       if (fecha_creacion >= minDate && fecha_creacion <= maxDate) {
        //         return true; // El usuario tiene al menos un historial dentro del rango de fechas
        //       }
        //     }
        //     return false; // El usuario no tiene ningún historial dentro del rango de fechas
        //   });
        // }
        const edges = Product
          .slice(startIndex, startIndex + parseInt(limit))
          .map((Product) => ({
            node: Product,
            cursor: Product.id
          }));
        const pageInfo = {
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
          hasNextPage: startIndex + parseInt(limit) < Products.length,
          hasPreviousPage: startIndex > 0,
        };
        return {
          totalCount: Products.length,
          edges,
          pageInfo,
        };
      }
    }
  }
}
