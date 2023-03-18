module.exports = {
  definition: ``,
  query: `
    buscarAbonos(
      cantidadAbono: Float,
      fechaAbono: String,
      estadoAbono: String,
    ): [Abonos]!
  `,
  type: {},
  resolver: {
    Query: {
      buscarAbonos: {
        description: 'Retorna una lista filtrada de abonos',
        resolver: 'application::abonos.abonos.buscarAbonos',
      },
    },
  },
};


// {
//   definition:``,
//   query: `
//       filterCantidadAbono(cantidad_abono: Float): [Abonos]!`,
//   type: {},
//   resolver: {
//     Query: {
//       filterCantidadAbono : {
//         description: 'Return list cantidad abono',
//         resolver: 'application::abonos.abonos.find',
//           // resolver: async (obj, options, {context}) => {
//           //   console.log(context)
//           //   return context;
//           // }
//       }
//     },
//   },
// };
// module.exports =

