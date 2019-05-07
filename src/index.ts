import Metadata from './decorators/metadata';

export * from './decorators';
export * from './middleware';

export function addServices(parentExports, services: any[]) {
  // if (module.parent && module.parent.exports && Object.keys(module.parent.exports).length) {
  //   Object.assign(parentExports, module.parent.exports, { default: undefined });
  //   return;
  // }

  return services.reduce(
    (config, Service, i) => ({
      ...config,
      ...getServiceConfig(parentExports, Service, i),
    }),
    {},
  );
}

function getServiceConfig(parentExports, Service, i) {
  return Metadata.getFunctions(Service).reduce((serviceConfig, [functionName, config]) => {
    const localName = `service${i}_${functionName}`;

    parentExports[localName] = (...args: any[]) => {
      const service = new Service();
      return service[`__invoke_${functionName}`](...args);
    };

    return {
      ...serviceConfig,
      [functionName]: {
        ...config,
        handler: `functions.${localName}`,
      },
    };
  }, {});
}
