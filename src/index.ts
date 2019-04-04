import { FUNCTIONS_METADATA } from './decorators/config';

export * from './decorators';

export function addServices(parentExports, services: any[]) {
  console.log(module.parent && module.parent.exports === parentExports);
  if (module.parent && module.parent.exports && Object.keys(module.parent.exports).length) {
    Object.assign(parentExports, module.parent.exports, { default: null });
    return;
  }

  return services.reduce(
    (config, Service, i) => ({
      ...config,
      ...getServiceConfig(parentExports, Service, i),
    }),
    {},
  );
}

function getServiceConfig(parentExports, Service, i) {
  const serviceFunctions = Service[FUNCTIONS_METADATA];
  return Object.keys(serviceFunctions).reduce((serviceConfig, functionName) => {
    const localName = `service${i}_${functionName}`;

    parentExports[localName] = (...args: any[]) => {
      const service = new Service();
      return service[`__invoke_${functionName}`](...args);
    };

    return {
      ...serviceConfig,
      [functionName]: {
        ...serviceFunctions[functionName],
        handler: `functions.${localName}`,
      },
    };
  }, {});
}
