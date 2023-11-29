import { Command, OptionValues } from 'commander';

export abstract class BaseCommandHandler<T extends OptionValues> {
  opts: T;
  args: string[];

  constructor(command: Command) {
    this.opts = command.opts<T>();
    this.args = command.args;
    this.args.shift();
  }

  async execute() {}
}
