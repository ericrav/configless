import Serverless from 'serverless';

export const FUNCTIONS_METADATA = '__SLSTS_FUNCTIONS';
export const ENV_METADATA = '__SLSTS_ENV_PROPERTIES';
export const PARAMS_METADATA = '__SLSTS_PARAMS';

export interface EnvMetadata {
  key: string;
  envName: string;
}

export interface FunctionConfig extends Partial<Serverless.FunctionDefinition> {
  [key: string]: any;
  events?: Record<string, object>[];
}

export enum RequestParam {
  JsonBody,
}

export class MissingHandlerError extends Error {}
