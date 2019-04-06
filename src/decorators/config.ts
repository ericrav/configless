import Serverless from 'serverless';

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
