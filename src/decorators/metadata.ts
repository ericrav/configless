import { RequestParam, FunctionConfig, EnvMetadata } from './config';

const FUNCTIONS_KEY = '__SLSTS_FUNCTIONS';
const ENV_KEY = '__SLSTS_ENV_PROPERTIES';
const PARAMS_KEY = '__SLSTS_PARAMS';

export default class Metadata {
  public static getFunction(constructor: Function, key: string): FunctionConfig {
    return safeGet(constructor, FUNCTIONS_KEY, key);
  }

  public static getFunctions(constructor: Function) {
    const functions: Record<string, FunctionConfig> = safeGet(constructor, FUNCTIONS_KEY);
    return functions && Object.entries(functions);
  }

  public static setFunctions(constructor: Function, key: string, config: FunctionConfig) {
    safeSet(
      constructor,
      [FUNCTIONS_KEY, {}],
      [key, config],
    );
  }

  public static getEnv(constructor: Function): EnvMetadata[] {
    return safeGet(constructor, ENV_KEY);
  }

  public static setEnv(constructor: Function, property: EnvMetadata) {
    const length = safeGet(constructor, ENV_KEY, 'length') || 0;
    safeSet(constructor, [ENV_KEY, []], [length, property]);
  }

  public static getParams(constructor: Function, key: string): RequestParam[] {
    return safeGet(constructor, PARAMS_KEY, key) as RequestParam[];
  }

  public static setParams(constructor: Function, key: string, index: number, value: RequestParam) {
    safeSet(
      constructor,
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
