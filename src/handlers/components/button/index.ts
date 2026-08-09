import path from 'node:path';
import { globSync } from 'glob';
import { Console } from '@/lib/utils';

type ButtonsMap = Map<string, ButtonConfigWithRun>;

const buttons: ButtonsMap = new Map();

export const setupButtonFiles = async () => {
  const buttonFiles = globSync('src/modules/**/*.button.{js,ts}', {
    cwd: process.cwd(),
    ignore: ['**/*.{test,spec}.{js,ts}', '**/_*'],
  });

  if (!buttonFiles.length) return buttons;

  for (const file of buttonFiles) {
    const module = await import(path.resolve(file));
    const buttonData: ButtonConfigWithRun = module;

    if (!buttonData?.config || !buttonData?.run)
      throw new Error(`Button file ${file} must export named \`config\` and \`run\``);

    if (buttons.has(buttonData.config.customId))
      throw new Error(`Duplicate button customId ${buttonData.config.customId}`);

    buttons.set(buttonData.config.customId, buttonData);
  }

  return buttons;
};

export const handleButtonInteraction = async (i: ButtonInteraction) => {
  const button = buttons.get(i.customId);
  if (!button) return;

  try {
    await button.run(i);
  } catch (error) {
    Console.Error(`Error running button ${i.customId}`, error);
  }
};
