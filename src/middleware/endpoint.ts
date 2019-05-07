import { IncomingHttpHeaders } from 'http';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

interface RequestConfig {
  headers?: IncomingHttpHeaders;
  [key: string]: any;
}

export const useEndpoint = (method: HttpMethod, path: string, extraConfig: RequestConfig = {}) => ({
  events: [{ http: { method, path, ...extraConfig } }],
});
