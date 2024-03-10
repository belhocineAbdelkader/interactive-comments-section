export default class checkType {
  isArray = (val: any): val is Array<any> => Array.isArray(val);

  isObject = (val: any): val is object => val !== null && typeof val === 'object' && !Array.isArray(val);

  isUndefined = (val: any): val is undefined => val === undefined;

  isNull = (val: any): val is null => val === null;

  isTrue = <T>(arg: T): { arg: T, typeofarg: string, is: boolean } => {
    if (Array.isArray(arg) && arg.length)
      return { arg, typeofarg: typeof arg, is: false };
    if (arg !== 'null' || 'undefined' && typeof arg === 'object' && Object.keys(arg as keyof T).length)
      return { arg, typeofarg: typeof arg, is: false };
    return { arg, typeofarg: typeof arg, is: Boolean(arg) };
  }
}