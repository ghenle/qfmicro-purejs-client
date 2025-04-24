/**
 * https://www.digitalocean.com/community/tools/minify
 * https://javascript.info/indexeddb
 **/

let NUM = {
  ABS: (value, precision) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  },
  AVG: (value, precision) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(value);
  },
  DOL: (value, precision) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(value);
  },
  MIN: (value, precision) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(value);
  },
  PCT: (value, precision) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(value/100);
  },
  RTE: (value, precision) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(value);
  },
  SQM: (value, precision) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    }).format(value);
  }
}

export { NUM };