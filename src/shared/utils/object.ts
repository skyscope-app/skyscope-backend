export const getObjectRecursiveKeys = (obj: any, prefix = ''): string[] => {
  let keys: string[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullPath = prefix ? `${prefix}:${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys.push(fullPath);
        keys = keys.concat(getObjectRecursiveKeys(obj[key], fullPath));
      } else {
        keys.push(fullPath);
      }
    }
  }

  return keys;
};
