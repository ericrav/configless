import * as path from 'path';
import * as ts from 'typescript';

const tsConfig: ts.CompilerOptions = {
  noEmitOnError: false,
  noImplicitAny: false,
  lib: ['es2015'],
  outDir: '.decorators',
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  experimentalDecorators: true,
  allowJs: true,
};

export default async (servicePath: string) => {
  ts.createProgram([path.join(servicePath, 'functions.ts')], tsConfig).emit();
  const slsConfig = require(path.join(servicePath, '.decorators/functions.js')).default;
  return slsConfig;
};
