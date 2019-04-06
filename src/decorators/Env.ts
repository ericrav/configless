import { EnvMetadata } from './config';
import Metadata from './metadata';

export function Env(name?: string): PropertyDecorator {
  return (target: Object, key: string) => {
    const envName = name || key;

    const envProperty: EnvMetadata = { key, envName };

    Metadata.setEnv(target.constructor, envProperty);
  };
}
