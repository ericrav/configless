import Serverless from 'serverless';

export const FUNCTIONS_METADATA = '__SLSTS_FUNCTIONS';
export const ENV_METADATA = '__SLSTS_ENV_PROPERTIES';

export interface EnvMetadata {
  key: string;
  envName: string;
}

export interface FunctionConfig extends Partial<Serverless.FunctionDefinition> {
  [key: string]: any;
  events?: Record<string, object>[];
}

export class MissingHandlerError extends Error {}
