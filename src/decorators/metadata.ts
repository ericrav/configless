import { RequestParam } from './config';

const FUNCTIONS_KEY = '__SLSTS_FUNCTIONS';
const ENV_KEY = '__SLSTS_ENV_PROPERTIES';
const PARAMS_KEY = '__SLSTS_PARAMS';

export default class Metadata {
  public static getParams(target: Object, key: string): RequestParam {
    return safeGet(target.constructor, PARAMS_KEY, key) as RequestParam;
  }

  public static setParams(target: Object, key: string, index: number, value: RequestParam) {
    safeSet(
      target.constructor,
      [PARAMS_KEY, {}],
      [key, []],
      [index, value],
    );
  }
}

function safeGet(target: any, ...keys: string[]) {
  let result = target;
  for (const key of keys) {
    if (result[key]) {
      result = result[key];
    } else {
      return;
    }
  }

  return result;
}

function safeSet(target: any, ...keys: [string | number, any][]): void {
  let result = target;
  for (let i = 0; i < keys.length; i++) {
    const [key, value] = keys[i];
    const lastKey = i === keys.length - 1;
    if (lastKey || !result[key]) {
      result[key] = value;
    }

    result = result[key];
  }
}
