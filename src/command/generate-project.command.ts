import { BaseCommandHandler } from './base-command-handler.js';
import { CliOpts } from '../bin.js';
import { logError, logInfo } from '../lib/log.js';
import { projectGenerator } from '../core/gen-project/project.generator.js';
import Path from 'path';
import { fs } from '../common.js';

export class GenerateProjectCommand extends BaseCommandHandler<CliOpts> {
  async execute() {
    await super.execute();
    logInfo('== { Generate Project } ==');

    console.log({
      args: this.args,
      opts: this.opts
    });

    const projectName = this.args[0];
    if (!projectName) {
      logError('No projectName provided');
      return;
    }

    let newProjectRoot;
    const path = this.opts.path;
    if (path && fs.existsSync(path)) {
      newProjectRoot = Path.join(path, projectName);
    } else {
      newProjectRoot = Path.join(process.cwd(), projectName);
    }

    projectGenerator.generate({
      projectName,
      projectRoot: newProjectRoot
    });
  }
}
