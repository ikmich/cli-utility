#!/usr/bin/env node
import { CommanderApp } from './lib/commander-app.js';
import { GenerateProjectCommand } from './command/generate-project.command.js';
import { APP_DESCRIPTION, APP_NAME } from './common.js';

export interface CliOpts {
  path?: string;
}

const app = new CommanderApp(APP_NAME, APP_DESCRIPTION);

app
  .optStringFlag('path, p', 'Destination folder path for the project')
  .command('project <projectName>', 'Generate a cli project', async () => {
    await new GenerateProjectCommand(app.program).execute();
  })
  .start();
