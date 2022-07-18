const sanitizeRegex = (str) => {
  return new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
}

module.exports = sanitizeRegex;