import { Lambda } from 'aws-sdk';
import * as deepmerge from 'deepmerge';

import { FunctionConfig, RequestParam } from './config';
import Metadata from './metadata';

export function Handler(...configs: FunctionConfig[]): MethodDecorator {
  let config: FunctionConfig = {};
  if (configs.length > 0) {
    config = configs.reduce((merged, next) => deepmerge(merged, next));
  }

  return (target: Object, methodName: string, descriptor: PropertyDescriptor) => {
    Metadata.setFunctions(target.constructor, methodName, config);

    const localInvoke: Function = transform(target, methodName, descriptor.value);
    descriptor.value = localInvoke;
    target[`__invoke_${methodName}`] = localInvoke;

    if (process.env.NODE_ENV !== 'test' && process.env.IS_LOCAL !== 'true') {
      descriptor.value = createLambdaInvokeFunction(methodName, config);
    }

    return descriptor;
  };
}

function transform(target: Object, key: string, fn: Function) {
  // eslint-disable-next-line func-names
  return function (event: any, context: any) {
    const originalArgs = [event, context];
    const transformTypes = Metadata.getParams(target.constructor, key) || [];
    // spread sparse array into full array with undefineds
    const args = [...transformTypes].map((transformType) => {
      if (transformType === RequestParam.JsonBody) {
        return transformJsonBody(event);
      }

      return originalArgs.shift();
    });

    return fn.apply(this, [...args, ...originalArgs]);
  };
}

function transformJsonBody(event: Record<string, any>) {
  if (event.body && event.body !== '') {
    return JSON.parse(event.body);
  }

  return {};
}

function createLambdaInvokeFunction(methodName, config) {
  return async function awsInvoke(...args: unknown[]) {
    const defaultName = `${process.env.SLS_DECORATORS_FUNC_PREFIX}-${methodName}`;
    const functionName: string = config.name || defaultName;

    // eslint-disable-next-line no-console
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
