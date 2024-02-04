import { ClassConstructor, plainToInstance } from 'class-transformer';

export const parseCSV = <T>(
  csvString: string,
  classConstructor: ClassConstructor<T>,
  delimiter = ',',
): Array<T> => {
  const lines = csvString.split('\n').flatMap((d) => d.split('\r'));
  const keys = lines[0].split(delimiter).map((k) => k.replaceAll('"', ''));
  const data = lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((k) => k.replaceAll('"', ''));
    return values.reduce((acc, value, index) => {
      acc[keys[index]] = value;
      return acc;
    }, {});
  });

  return data.map((d) => plainToInstance(classConstructor, d));
};
