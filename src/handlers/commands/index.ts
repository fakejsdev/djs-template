import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { SlashCommandBuilder } from 'discord.js';
import { globSync } from 'glob';
import { client } from '@/lib/discord';
import { Console } from '@/lib/utils';

type RunHandlersMap = Map<string, CommandRun>;

type ImportedSubcommand = {
  config: SubcommandConfig;
  run: CommandRun;
};

type CommandTree = {
  config?: CommandConfig;
  run?: CommandRun;
  subs: { name: string; file: ImportedSubcommand }[];
  groups: Record<string, { name: string; file: ImportedSubcommand }[]>;
};

const setupCommandFiles = async () => {
  const runHandlers: RunHandlersMap = new Map();
  const commandsTree = new Map<string, CommandTree>();

  const files = globSync('src/modules/*/commands/**/*.{js,ts}', {
    cwd: process.cwd(),
    ignore: ['**/*.{test,spec}.{js,ts}', '**/_*'],
  });

  if (!files.length) return { runHandlers, finalCommands: [] };

  for (const file of files) {
    const splitPath = file.split('/commands/')[1];
    if (!splitPath) continue;

    const relative = splitPath.replace(/\.(ts|js)$/, '');
    const parts = relative.split('/');
    const imported = await import(path.resolve(file));

    if (file.includes('.command.')) {
      const name = imported.config?.name;
      if (!name) continue;

      if (!commandsTree.has(name)) {
        commandsTree.set(name, { subs: [], groups: {} });
      }

      const node = commandsTree.get(name)!;
      node.config = imported.config;

      if (imported.run) {
        node.run = imported.run;
        runHandlers.set(name, imported.run);
      }
    } else if (file.includes('.sub.')) {
      const cmdName = parts[0];
      if (!cmdName) continue;

      if (!commandsTree.has(cmdName)) {
        commandsTree.set(cmdName, { subs: [], groups: {} });
      }
      const node = commandsTree.get(cmdName)!;

      if (parts.length === 2) {
        const subName = parts[1]?.replace('.sub', '');
        if (!subName) continue;

        node.subs.push({ name: subName, file: imported as ImportedSubcommand });
        runHandlers.set(`${cmdName} ${subName}`, imported.run);
      } else if (parts.length === 3) {
        const groupName = parts[1];
        const subName = parts[2]?.replace('.sub', '');
        if (!groupName || !subName) continue;

        if (!node.groups[groupName]) {
          node.groups[groupName] = [];
        }

        node.groups[groupName]!.push({ name: subName, file: imported as ImportedSubcommand });
        runHandlers.set(`${cmdName} ${groupName} ${subName}`, imported.run);
      }
    }
  }

  const finalCommands: CommandConfig[] = [];

  for (const [cmdName, node] of commandsTree) {
    if (!node.config) {
      throw new Error(
        `Brak pliku .command.ts dla folderu komendy: ${cmdName}. Dodaj np. index.command.ts!`,
      );
    }

    const builder = node.config as SlashCommandBuilder;

    for (const sub of node.subs) {
      builder.addSubcommand((s) => sub.file.config(s.setName(sub.name)));
    }

    for (const [groupName, subs] of Object.entries(node.groups)) {
      builder.addSubcommandGroup((g) => {
        g.setName(groupName).setDescription(`Opcje dla ${groupName}`);
        for (const sub of subs) {
          g.addSubcommand((s) => sub.file.config(s.setName(sub.name)));
        }
        return g;
      });
    }

    finalCommands.push(builder);
  }

  Console.Log(`🔧 Loaded ${runHandlers.size} executable command endpoint(s)`);
  return { runHandlers, finalCommands };
};

const CACHE_FILE = path.join(process.cwd(), '.djs', 'commands.cache');

const registerSlashCommand = async (finalCommands: CommandConfig[]) => {
  const guildId = process.env.GUILD_ID;
  if (!guildId) throw new Error('GUILD_ID is not set in environment variables');

  const guild = client.guilds.cache.get(guildId);
  if (!guild) throw new Error(`Guild with ID ${guildId} not found`);

  const commandsJson = JSON.stringify(finalCommands.map((c) => c.toJSON()));
  const currentHash = crypto.createHash('md5').update(commandsJson).digest('hex');

  const cacheDir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  if (fs.existsSync(CACHE_FILE)) {
    const previousHash = fs.readFileSync(CACHE_FILE, 'utf-8');
    if (previousHash === currentHash) {
      Console.Log(`⏩ Commands unchanged. Skipping API registration (Fast Boot).`);
      return;
    }
  }

  await guild.commands.set(finalCommands).catch((err: unknown) => {
    Console.Error(`Error registering commands:`, err);
  });

  fs.writeFileSync(CACHE_FILE, currentHash);
  Console.Log(`🎯 Registered ${finalCommands.length} base command(s) in ${guild.name}`);
};

const startCommandHandling = async (runHandlers: RunHandlersMap) => {
  client.on('interactionCreate', async (i) => {
    if (!i.isChatInputCommand() || !i.inCachedGuild()) return;

    const commandName = i.commandName;
    const groupName = i.options.getSubcommandGroup(false);
    const subName = i.options.getSubcommand(false);

    const executionKey = [commandName, groupName, subName].filter(Boolean).join(' ');

    const run = runHandlers.get(executionKey);
    if (!run) {
      return Console.Error(`Handler for executed command path '${executionKey}' not found`);
    }

    try {
      await run(i);
      Console.Log(`(✓) Command ${executionKey} executed`);
    } catch (err: unknown) {
      Console.Error(`Error running command path '${executionKey}'`, err);
    }
  });
};

export const initCommandHandler = async () => {
  const { runHandlers, finalCommands } = await setupCommandFiles();

  if (!finalCommands.length) {
    return Console.Warn('No commands found, skipping command registration.');
  }

  await registerSlashCommand(finalCommands);
  await startCommandHandling(runHandlers);
};
