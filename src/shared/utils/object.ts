import { Nullable } from '@/shared/utils/nullable';

export const searchInObjectRecursive = (
  obj: any,
  term: string,
  exclusionKeys: string[] = [],
  prefix = '',
): Nullable<string> => {
  const allTerms = [
    term,
    term.toLowerCase(),
    term.toUpperCase(),
    `${term.charAt(0).toUpperCase()}${term.slice(1)}`,
  ];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const result = searchInObjectRecursive(
          obj[key],
          term,
          exclusionKeys,
          fullPath,
        );
        if (result) {
          return result;
        }
      } else if (
        allTerms.some((t) => String(obj[key]).includes(t)) &&
        !exclusionKeys.includes(fullPath)
      ) {
        return fullPath;
      }
    }
  }
};

export const getObjectRecursiveKeys = (obj: any, prefix = ''): string[] => {
  let keys: string[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
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
