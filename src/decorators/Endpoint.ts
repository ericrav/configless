import { IncomingHttpHeaders } from 'http';
import { FUNCTIONS_METADATA, FunctionConfig, MissingHandlerError } from './config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

interface RequestConfig {
  headers?: IncomingHttpHeaders;
  [key: string]: any;
}

export function Endpoint(
  method: HttpMethod,
  path: string,
  extraConfig: RequestConfig = {},
): MethodDecorator {
  return (target: Object, key: string, descriptor: PropertyDescriptor) => {
    const metadata = target.constructor[FUNCTIONS_METADATA];

    if (!metadata || !metadata[key]) {
      throw new MissingHandlerError(`Missing @Handler decorator for ${key}`);
    }

    const config: FunctionConfig = metadata[key];

    if (!config.events) {
      config.events = [];
    }

    config.events.push({
      http: { method, path, ...extraConfig },
    });

    return descriptor;
  };
}
