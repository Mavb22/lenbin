const tablaFile = {
  abonos: (field, key, filters) => {
    if (key in fields) {
      return fields[key](field, filters);
    } else if (field[key]){
      return field[key].toString();
    }
  },
  camiones: (field, key, filters) => {
    if (key in fields) {
      return fields[key](field, key, filters);
    } else if (field[key]) {
      return field[key].toString();
    }
  }
}
const fields = {
  usuario: (field, key, filters) => `${formatValue(field[key]?.nombre)} ${formatValue(field[key]?.ap_paterno)} ${formatValue(field[key]?.ap_materno)}`,
  credito: (field, key, filters) => `${formatValue(field[key]?.intereses)}`,
  placa: (field, key, filters) =>{
    const filterPlaca = filters["placa.placa"] ? filters["placa.placa"] : ''
    const filterActiva = filters["placa.activa"] ? filters["placa.activa"] : false;
    const filterEstado = filters["placa.estado"] ? filters["placa.estado"] : '';
    if(field.placas){
      const placaValues = field.placas
        .filter(placa => (!filterPlaca || placa.placa === filterPlaca) && (!filterActiva || placa.activa === filterActiva) && (!filterEstado || placa.estado === filterEstado))
        .map(placa => formatValue(placa[key].toUpperCase()))
        .filter(value => value !== null && value !== undefined && value !== '');
      // const uniquePlacaValues = [...new Set(placaValues)];
      return placaValues.join(', ');
    }
    return '';
  },
  estado: (field, key, filters) =>{
    const filterPlaca = filters["placa.placa"] ? filters["placa.placa"] : ''
    const filterActiva = filters["placa.activa"] ? filters["placa.activa"] : false;
    const filterEstado = filters["placa.estado"] ? filters["placa.estado"] : '';
    if(field.placas){
      const placaValues = field.placas
        .filter(placa => (!filterPlaca || placa.placa === filterPlaca) && (!filterActiva || placa.activa === filterActiva) && (!filterEstado || placa.estado === filterEstado))
        .map(placa => formatValue(placa[key].toUpperCase()))
        .filter(value => value !== null && value !== undefined && value !== '');
      // const uniquePlacaValues = [...new Set(placaValues)];
      return placaValues.join(', ');
    }
    return '';
  },
  activa: (field, key, filters) =>{
    const filterPlaca = filters["placa.placa"] ? filters["placa.placa"] : ''
    const filterActiva = filters["placa.activa"] ? filters["placa.activa"] : true;
    const filterEstado = filters["placa.estado"] ? filters["placa.estado"] : '';
    if(field.placas){
      const placaValues = field.placas
        .filter(placa => {
          console.log((!filterPlaca || placa.placa === filterPlaca) && (!filterActiva || placa.activa === filterActiva) && (!filterEstado || placa.estado === filterEstado))
          return (!filterPlaca || placa.placa === filterPlaca) && (!filterActiva || placa.activa === filterActiva) && (!filterEstado || placa.estado === filterEstado)
        })
        .map(placa => formatValue(placa[key]))
        .filter(value => value !== null && value !== undefined && value !== '');
      // const uniquePlacaValues = [...new Set(placaValues)];
      return placaValues.join(', ');
    }
    return '';
  },
  historial: (field, key, filters) => `${formatValue(field[key]?.fecha)} `,
}

function formatValue(value) {
  return value !== undefined && value !== null ? value : '';
}
module.exports = {
  tablaFile
}
