function text(value, { min = 0, max, field, optional = false } = {}) {
  if (value === undefined && optional) return undefined;
  if (typeof value !== 'string') throw new Error(`${field} deve ser um texto.`);
  const clean = value.trim();
  if (clean.length < min || clean.length > max) {
    throw new Error(`${field} deve ter entre ${min} e ${max} caracteres.`);
  }
  return clean;
}

function integer(value, { min, max, field, optional = false } = {}) {
  if ((value === undefined || value === null || value === '') && optional) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${field} deve ser um número inteiro entre ${min} e ${max}.`);
  }
  return parsed;
}

module.exports = { text, integer };
