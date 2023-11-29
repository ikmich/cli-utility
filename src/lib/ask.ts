// noinspection ES6RedundantAwait

import inquirer from 'inquirer';

export const ask = {
  async input(id: string, message: string) {
    return await inquirer.prompt({
      type: 'input',
      name: id,
      message
    });
  },

  async singleChoice(id: string, message: string, options: string[]) {
    return await inquirer.prompt({
      type: 'list',
      name: id,
      message,
      choices: options
    });
  },

  async multipleChoice(id: string, message: string, options: string[]) {
    return await inquirer.prompt({
      name: id,
      type: 'checkbox',
      message,
      choices: options
    });
  }
};
