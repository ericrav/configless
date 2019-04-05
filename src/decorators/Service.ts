import * as deepmerge from 'deepmerge';

import {
  ENV_METADATA, EnvMetadata, FunctionConfig, FUNCTIONS_METADATA,
} from './config';

interface Constructable<T> {
  new (...args: any[]): T;
}

export function Service(config?: FunctionConfig) {
  return function Decorator<T extends Constructable<any>>(constructor: T): T | void {
    const functionConfigs: Record<string, FunctionConfig> = constructor[FUNCTIONS_METADATA];
    if (config && functionConfigs) {
      for (const key in functionConfigs) {
        if (Object.prototype.hasOwnProperty.call(functionConfigs, key)) {
          functionConfigs[key] = deepmerge(config, functionConfigs[key]);
        }
      }
    }

    const envProperties = constructor[ENV_METADATA];
    if (envProperties) {
      return classWithEnvProperties<T>(constructor, envProperties);
    }
  };
}

function classWithEnvProperties<T extends Constructable<any>>(
  constructorFn: T,
  envProperties: EnvMetadata[],
) {
  return class extends constructorFn {
    public constructor(...args: any[]) {
      super(...args);

      if (Array.isArray(envProperties)) {
        for (const prop of envProperties) {
          if (process.env[prop.envName] !== undefined) {
            this[prop.key] = process.env[prop.envName];
          }
        }
      }
    }
  };
}
