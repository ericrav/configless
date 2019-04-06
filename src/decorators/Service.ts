import * as deepmerge from 'deepmerge';

import {
  ENV_METADATA, EnvMetadata, FunctionConfig,
} from './config';
import Metadata from './metadata';

interface Constructable<T> {
  new (...args: any[]): T;
}

export function Service(config?: FunctionConfig) {
  return function Decorator<T extends Constructable<any>>(constructor: T): T | void {
    const functionConfigs = Metadata.getFunctions(constructor);
    if (config && functionConfigs) {
      for (const [key, functionConfig] of functionConfigs) {
        Metadata.setFunctions(constructor, key, deepmerge(config, functionConfig));
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
