const fs = require('fs');

const fgvLight = JSON.parse(fs.readFileSync('MAPEAR Tokens/FGV Light.tokens.json', 'utf-8'));

function getSubCategories(obj, depth = 0, prefix = '') {
  const result = {};
  for (const k of Object.keys(obj)) {
    if (k.startsWith('$')) continue;
    const p = prefix ? `${prefix} -> ${k}` : k;
    if (obj[k] && typeof obj[k] === 'object' && !('$value' in obj[k])) {
      result[p] = getSubCategories(obj[k], depth + 1, p);
    } else if (obj[k] && typeof obj[k] === 'object' && ('$value' in obj[k])) {
      result[prefix] = result[prefix] || [];
      result[prefix].push(k);
    }
  }
  return result;
}

console.log('FGV Light categories tree:');
console.log(JSON.stringify(getSubCategories(fgvLight), null, 2));
