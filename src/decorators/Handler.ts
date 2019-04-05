import { Lambda } from 'aws-sdk';
import { FUNCTIONS_METADATA, FunctionConfig } from './config';

export function Handler(config: FunctionConfig = {}): MethodDecorator {
  return (target: Object, methodName: string, descriptor: PropertyDescriptor) => {
    if (!target.constructor[FUNCTIONS_METADATA]) {
      target.constructor[FUNCTIONS_METADATA] = {};
    }

    target.constructor[FUNCTIONS_METADATA][methodName] = config;

    const localInvoke: Function = descriptor.value;
    async function awsInvoke(...args: unknown[]) {
      if (process.env.NODE_ENV === 'test' || process.env.IS_LOCAL === 'true') {
        const ServiceClass = target.constructor as FunctionConstructor;
        return localInvoke.apply(new ServiceClass(), args);
      }

      const defaultName = `${process.env.SLS_DECORATORS_FUNC_PREFIX}-${methodName}`;
      const functionName: string = config.name || defaultName;
      console.log(`Invoking Lambda function: ${functionName}`);
      const lambda = new Lambda();
      return new Promise((resolve, reject) => {
        lambda.invoke({
          FunctionName: functionName,
          InvocationType: 'Event',
          Payload: JSON.stringify(args[0]),
        }, (err, data) => (err ? reject(err) : resolve(data)));
      });
    }
    target[`__invoke_${methodName}`] = localInvoke;
    descriptor.value = awsInvoke;

    return descriptor;
  };
}
