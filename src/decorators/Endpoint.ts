import { IncomingHttpHeaders } from 'http';

import { MissingHandlerError } from './config';
import Metadata from './metadata';

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
    const config = Metadata.getFunction(target.constructor, key);

    if (!config) {
      throw new MissingHandlerError(`Missing @Handler decorator for ${key}`);
    }

    if (!config.events) {
      config.events = [];
    }

    config.events.push({
      http: { method, path, ...extraConfig },
    });

    return descriptor;
  };
}
