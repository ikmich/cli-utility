export type BinFileTemplateOpts = {
  appName: string;
  description: string;
};

export const binFileContents = {
  build(opts: BinFileTemplateOpts): string {
    const sampleCommandNameDef = 'list <target>';

    return `#!/usr/bin/env node

import { CommanderApp } from 'cli-utility';

export interface CliOpts {
  path?: string;
}

const app = new CommanderApp('${opts.appName}', '${opts.description}');

app
  // sample option flag
  .optStringFlag('path, p', 'Destination folder path')
  
  // sample command
  .command('${sampleCommandNameDef}', 'List details for specified target', async () => {
    // Process command logic here. Feel free to extend BaseCommandHandler class.
  })

  .start();
`;
  }
};
