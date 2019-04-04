import * as fs from 'fs-extra';
import * as path from 'path';

import compile from './compile';

import Serverless from 'serverless';
import Plugin from 'serverless/classes/Plugin';

module.exports = class ServerlessPlugin implements Plugin {
  public hooks = {
    'after:invoke:local:invoke': this.cleanup.bind(this),
    'after:invoke:invoke': this.cleanup.bind(this),
    'after:package:createDeploymentArtifacts': this.cleanup.bind(this),
    'after:deploy:function:packageFunction': this.cleanup.bind(this),
    'after:run:run': this.cleanup.bind(this),
  };

  private serverless: Serverless;
  private options: Serverless.Options;
  private servicePath: string;

  public constructor(serverless: Serverless, options: Serverless.Options) {
    this.serverless = serverless;
    this.options = options;
    this.servicePath = this.serverless.config.servicePath;

    this.compileFuntionsConfig();
  }

  private async compileFuntionsConfig() {
    this.serverless.cli.log('Adding functions to Serverless config');
    const config = await compile(this.servicePath);
    // Object.assign(this.serverless.service.functions, config);
    const slsService = this.serverless.service;
    const serviceName = slsService['service'];
    const stageName = this.options.stage || this.options['s'] || slsService.provider.stage;

    slsService.update({
      functions: config,
      provider: {
        environment: {
          SLS_DECORATORS_FUNC_PREFIX: `${serviceName}-${stageName}`,
        },
      },
    });
  }

  private cleanup() {
    // console.log(this.serverless.service.functions);
    fs.removeSync(path.join(this.servicePath, '/.decorators'));
  }
};
