export function ReturnBody(statusCode: number) {
  return (target: Object, key: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await fn.apply(this, args);

      return {
        statusCode,
        body: JSON.stringify(result),
      };
    };

    return descriptor;
  };
}
