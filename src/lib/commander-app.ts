import { Command } from 'commander';

type FlagType = 'boolean' | 'string' | 'array' | 'number';

type FlagName = {
  name: string;
  short?: string;
};

function parseDef(def: string): FlagName {
  const parts = def.split(/\s*[,|]+\s*/);
  const left = parts[0];
  const right = parts[1];

  const parsed: Partial<FlagName> = {};

  if (left && right) {
    if (left.length >= right.length) {
      parsed.name = left;
      parsed.short = right;
    } else if (right.length > left.length) {
      parsed.name = right;
      parsed.short = left;
    }
  } else if (left && !right) {
    parsed.name = left;
  } else if (right && !left) {
    parsed.name = right;
  }

  return parsed as FlagName;
}

export class CommanderApp {
  readonly program: Command;

  constructor(
    readonly name: string,
    readonly description: string,
    setup?: (app: Command) => void
  ) {
    this.program = new Command(name).description(description ?? '');
    setup?.(this.program);
  }

  optBooleanFlag(def: string, description: string): CommanderApp {
    const { name, short } = parseDef(def);
    const commanderFlagDef = buildCommanderFlagString(name, short, 'boolean');
    this.program.option(commanderFlagDef, description);
    return this;
  }

  optStringFlag(def: string, description: string): CommanderApp {
    const { name, short } = parseDef(def);
    const commanderFlagDef = buildCommanderFlagString(name, short, 'string');
    this.program.option(commanderFlagDef, description);
    return this;
  }

  optNumberFlag(def: string, description: string) {
    const { name, short } = parseDef(def);
    const commanderFlagDef = buildCommanderFlagString(name, short, 'number');
    this.program.option(commanderFlagDef, description);
    return this;
  }

  optArrayFlag(def: string, description: string) {
    const { name, short } = parseDef(def);
    const commanderFlagDef = buildCommanderFlagString(name, short, 'array');
    this.program.option(commanderFlagDef, description);
    return this;
  }

  command(name: string, desc: string, action: () => void): CommanderApp {
    this.program.command(name).description(desc).action(action);
    return this;
  }

  start() {
    this.program.parse();
  }
}

function buildCommanderFlagString(name: string, short?: string, type: FlagType = 'boolean') {
  name = name.replace(/^-+/, '');
  short = short?.replace(/^-+/, '');

  let s = '';
  if (short) {
    if (short.length === 1) {
      s += `-${short}, `;
    } else if (short.length > 1) {
      s += `--${short}, `;
    }
  }

  s += `--${name}`;

  switch (type) {
    case 'string':
      s += ' <char>';
      break;
    case 'number':
      s += ' <number>';
      break;
    case 'array':
      s += ` [${name}...]`;
      break;
  }

  return s;
}
