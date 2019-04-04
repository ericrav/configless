import { FUNCTIONS_METADATA, FunctionConfig } from './config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export function Endpoint(
  method: HttpMethod,
  path: string,
  extraConfig: object = {},
): MethodDecorator {
  return (target: Object, key: string, descriptor: PropertyDescriptor) => {
    if (!target.constructor[FUNCTIONS_METADATA]) {
      target.constructor[FUNCTIONS_METADATA] = {};
    }

    const config: FunctionConfig = target.constructor[FUNCTIONS_METADATA][key];

    if (!config.events) {
      config.events = [];
    }

    config.events.push({
      http: { method, path, ...extraConfig },
    });

    return descriptor;
  };
}
