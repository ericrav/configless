import { OutgoingHttpHeaders } from 'http';

export function Respond(statusCode: number, headers?: OutgoingHttpHeaders) {
  return (target: Object, key: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    const params = headers ? { headers } : {};

    descriptor.value = async function lambda(...args: unknown[]) {
      const result = await fn.apply(this, args);

      return {
        statusCode,
        ...params,
        body: JSON.stringify(result),
      };
    };

    return descriptor;
  };
}
