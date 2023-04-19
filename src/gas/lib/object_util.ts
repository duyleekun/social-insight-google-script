type FlattenedObject = { [key: string]: number | string | boolean };

export function flattenObject(obj: any, parentKey = ''): FlattenedObject {
  let result: FlattenedObject = {};

  for (let key in obj) {
    let propName = parentKey ? `${parentKey}.${key}` : key;

    if (Array.isArray(obj[key])) {
      obj[key].forEach((item: any, index: number) => {
        let arrayPropName = `${propName}[${index}]`;

        if (typeof item === 'object') {
          let flatObject = flattenObject(item, arrayPropName);
          result = { ...result, ...flatObject };
        } else {
          result[arrayPropName] = item;
        }
      });
    } else if (typeof obj[key] === 'object') {
      let flatObject = flattenObject(obj[key], propName);
      result = { ...result, ...flatObject };
    } else {
      result[propName] = obj[key];
    }
  }

  return result;
}