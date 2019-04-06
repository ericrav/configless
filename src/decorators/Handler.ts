import { Lambda } from 'aws-sdk';

import { FunctionConfig } from './config';
import Metadata from './metadata';

export function Handler(config: FunctionConfig = {}): MethodDecorator {
  return (target: Object, methodName: string, descriptor: PropertyDescriptor) => {
    Metadata.setFunctions(target.constructor, methodName, config);

    const localInvoke: Function = descriptor.value;
    target[`__invoke_${methodName}`] = localInvoke;

    if (process.env.NODE_ENV === 'production' && process.env.IS_LOCAL !== 'true') {
      descriptor.value = createLambdaInvokeFunction(methodName, config);
    }

    return descriptor;
  };
}

function createLambdaInvokeFunction(methodName, config) {
  return async function awsInvoke(...args: unknown[]) {
    const defaultName = `${process.env.SLS_DECORATORS_FUNC_PREFIX}-${methodName}`;
    const functionName: string = config.name || defaultName;

    console.info(`Invoking Lambda function: ${functionName}`);

    const lambda = new Lambda();
    return new Promise((resolve, reject) => {
      lambda.invoke({
        FunctionName: functionName,
        InvocationType: 'Event',
        Payload: JSON.stringify(args[0]),
      }, (err, data) => (err ? reject(err) : resolve(data)));
    });
  };
}
