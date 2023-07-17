const validateOperator =  (operator, value, min, max)  => {
  switch (operator) {
    case '==':
    case '!=':
    case 'contain':
      if (!value || min || max) {
        throw new Error(`El operador ${operator} solo puede tener "value" y no "min" ni "max"`);
      }
      break;
    case '>':
    case '>=':
      if (!min || value || max) {
        throw new Error(`El operador ${operator} solo puede tener "min" y no "value" ni "max"`);
      }
      break;
    case '<':
    case '<=':
      if (!max || value || min) {
        throw new Error(`El operador ${operator} solo puede tener "max" y no "value" ni "min"`);
      }
      break;
    case 'range':
      if (!max || !min || value) {
        throw new Error(`El operador "range" solo puede tener "max" y "min" y no "value"`);
      }
      break;
    default:
      throw new Error(`Operador desconocido: ${operator}`);
  }
}

module.exports = validateOperator;
