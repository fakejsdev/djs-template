import {
  handleCommands,
  registerSlashCommand,
  setupCommandFiles,
} from "./command";

import { Console } from "@/lib/utils";

export class HandlersManager {
  private setupTasks: (() => Promise<void>)[] = [];
  private readonly commandsDir = "src/modules/**/commands/**/*.{js,ts}";
  private readonly eventsDir = "src/modules/**/events/**/*.{js,ts}";
  private readonly componentsDir = "src/modules/**/components/**/*.{js,ts}";

  public setupCommandHandler() {
    this.setupTasks.push(async () => {
      const commands = await setupCommandFiles(this.commandsDir);
      if (!commands.size) {
        Console.Warn("No commands found, skipping command registration.");
        return;
      }

      handleCommands(commands);
      await registerSlashCommand(commands);
    });
    return this;
  }

  public setupEventHandler() {
    this.setupTasks.push(async () => {
      Console.Log("Event handler setup is not implemented yet.");
    });
    return this;
  }

  public setupComponentHandler() {
    this.setupTasks.push(async () => {
      Console.Log("Component handler setup is not implemented yet.");
    });
    return this;
  }

  public async build() {
    for (const task of this.setupTasks) {
      await task();
    }
    Console.Log("All handlers have been set up successfully.");
    this.setupTasks = [];
  }
}
