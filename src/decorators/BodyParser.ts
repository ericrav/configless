export function BodyParser(target: Object, key: string, descriptor: PropertyDescriptor) {
  const fn = descriptor.value;

  descriptor.value = async (event: any, context: any) => {
    let body = {};

    if (event.body && event.body !== '') {
      body = JSON.parse(event.body);
    }

    return fn.apply(this, [body, context]);
  };

  return descriptor;
}
