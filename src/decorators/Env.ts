import { ENV_METADATA, EnvMetadata } from './config';

export function Env(name?: string): PropertyDecorator {
  return (target: Object, key: string) => {
    const envName = name || key;

    const envProperty: EnvMetadata = { key, envName };

    if (Array.isArray(target.constructor[ENV_METADATA])) {
      target.constructor[ENV_METADATA].push(envProperty);
    } else {
      target.constructor[ENV_METADATA] = [envProperty];
    }
  };
}
